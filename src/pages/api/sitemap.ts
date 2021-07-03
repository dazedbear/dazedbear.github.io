import { NextApiRequest, NextApiResponse } from 'next'
import {
  getCategory,
  messageWithHeaders,
  validateRequest,
} from '../../libs/server/api-util'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'
import pMap from 'p-map'
import * as dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getSinglePagePath } from '../../libs/client/blog-helpers'
import log from '../../libs/server/log'
import { getNotionPostsFromTable } from '../../libs/server/notion'
import { navigation, notion, cache as cacheConfig } from '../../../site.config'
import cacheClient from '../../libs/server/cache'

const route = '/sitemap'
const methods = ['GET']

dayjs.extend(utc)
const category = getCategory(route)

const generateSiteMapXml = async req => {
  // get all enabled static page paths
  const pageUrls = navigation
    .map(item => item.enabled && item.page)
    .filter(path => path)

  // get all enabled notion list page paths
  let notionUrls = await pMap(
    Object.keys(notion.pages),
    async pageName => {
      const { pageId, collectionViewId, paginationEnabled } = notion.pages[
        pageName
      ]

      const postsData = await getNotionPostsFromTable({
        pageId,
        collectionViewId,
        paginationEnabled,
        fetchAllPosts: true,
      })

      if (
        isEmpty(postsData.recordMap) ||
        !get(postsData, ['result', 'total'])
      ) {
        const message = `empty page data: is recordMap empty = ${isEmpty(
          postsData.recordMap
        )}, collection result total = ${get(postsData, ['result', 'total'])}`
        log({
          category,
          message: messageWithHeaders(req, message),
          level: 'warn',
        })
        return []
      }

      const currentNotionListUrls = get(postsData, [
        'allPosts',
        'result',
        'blockIds',
      ]).map(postId => {
        const recordMap = get(postsData, ['allPosts', 'recordMap'])
        const pagePath = getSinglePagePath({
          pageName,
          pageId: postId,
          recordMap,
        })
        return `/${pageName}/${pagePath}`
      })

      return currentNotionListUrls
    },
    {
      concurrency: 10,
    }
  )
  notionUrls = notionUrls.reduce(
    (urls, currnetNotionPageUrls) => urls.concat(currnetNotionPageUrls),
    []
  )

  // all collected urls
  const urls = ['/'].concat(pageUrls, notionUrls).map(url => ({ url }))

  // generate sitemap xml
  const stream = new SitemapStream({ hostname: `https://${req.headers.host}` })
  const sitemapXml = await streamToPromise(
    Readable.from(urls).pipe(stream)
  ).then(data => data.toString())
  return sitemapXml
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    validateRequest(req, { route, methods })

    // sitemap cache daily
    const sitemapXmlKey = `sitemap_${dayjs.utc().format('YYYY-MM-DD')}`
    const sitemapXml = await cacheClient.proxy(
      sitemapXmlKey,
      '/api/sitemap',
      generateSiteMapXml.bind(this, req),
      { ttl: cacheConfig.ttls.sitemap }
    )
    res.writeHead(200, { 'Content-Type': 'application/xml' })
    res.end(sitemapXml)
  } catch (err) {
    const statusCode = err.status || 500
    res.status(statusCode).send(err.message)
  }
}

export default handler
