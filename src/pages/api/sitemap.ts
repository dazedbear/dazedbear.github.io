import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCategory,
  validateRequest,
  setAPICacheHeaders,
} from '../../libs/server/api'
import get from 'lodash/get'
import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'
import pMap from 'p-map'
import * as dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import log from '../../libs/server/log'
import { fetchArticleStream } from '../../libs/server/page'
import {
  transformArticleStream,
  transformPageUrls,
} from '../../libs/server/transformer'
import {
  currentEnv,
  pages,
  notion,
  cache as cacheConfig,
  website,
} from '../../../site.config'
import cacheClient from '../../libs/server/cache'

const route = '/sitemap'
const methods = ['GET']

dayjs.extend(utc)
const category = getCategory(route)

const generateSiteMapXml = async req => {
  // get all enabled static page paths
  const pageUrls = Object.values(pages)
    .map(item => item.enabled && item.page)
    .filter(path => path)

  // get all enabled notion list page paths
  const currentNotionListUrls: string[][] = await pMap(
    Object.keys(notion.pages),
    async pageName => {
      const pageEnabled = get(notion, ['pages', pageName, 'enabled'])
      const pageType = get(notion, ['pages', pageName, 'type'])
      if (!pageEnabled) {
        log({
          category,
          message: `skip generate urls since this pageName is disabled | pageName: ${pageName}`,
          req,
        })
        return []
      }
      switch (pageType) {
        case 'stream': {
          const response = await fetchArticleStream({
            req,
            pageName,
            category,
          })
          const articleStream = await transformArticleStream(pageName, response)
          return transformPageUrls(pageName, articleStream)
        }
        case 'page': {
          return [`/${pageName}`]
        }
        default: {
          throw Error(`page type is invalid: ${pageType}`)
        }
      }
    },
    {
      concurrency: 10,
    }
  )
  let notionUrls: string[] = currentNotionListUrls.reduce(
    (urls, currnetNotionPageUrls) => urls.concat(currnetNotionPageUrls),
    []
  )

  // all collected urls
  const urls = [].concat(pageUrls, notionUrls).map(url => ({ url }))

  // generate sitemap xml
  const stream = new SitemapStream({
    hostname: `${get(website, [currentEnv, 'protocol'])}://${get(website, [
      currentEnv,
      'host',
    ])}`,
  })
  const sitemapXml = await streamToPromise(
    Readable.from(urls).pipe(stream)
  ).then(data => data.toString())
  return sitemapXml
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    validateRequest(req, { route, methods })

    log({
      category,
      message: 'dumpaccess',
      req,
    })

    // sitemap cache daily
    const sitemapXmlKey = `sitemap_${dayjs.utc().format('YYYY-MM-DD')}`
    const sitemapXml = await cacheClient.proxy(
      sitemapXmlKey,
      '/api/sitemap',
      generateSiteMapXml.bind(this, req),
      { ttl: cacheConfig.ttls.sitemap }
    )
    setAPICacheHeaders(res)
    res.setHeader('Content-Type', 'application/xml')
    res.status(200).end(sitemapXml)
  } catch (err) {
    const statusCode = err.status || 500
    res.status(statusCode).send(err.message)
  }
}

export default handler
