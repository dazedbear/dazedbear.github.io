import type { NextRequest } from 'next/server'
import get from 'lodash/get'
import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'
import pMap from 'p-map'
import * as dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import log from '../../../libs/server/log'
import { fetchArticleStream } from '../../../libs/server/page'
import {
  transformArticleStream,
  transformPageUrls,
} from '../../../libs/server/transformer'
import {
  currentEnv,
  pages,
  notion,
  cache as cacheConfig,
  website,
} from '../../../../site.config'
import cacheClient from '../../../libs/server/cache'
import { FORCE_CACHE_REFRESH_QUERY } from '../../../libs/constant'

dayjs.extend(utc)

const category = 'API route: /api/sitemap'

const generateSiteMapXml = async () => {
  // get all enabled static page paths
  const pageUrls = Object.values(pages)
    .filter((item) => item.enabled)
    .map((item) => item.page)

  // get all enabled notion list page paths
  const currentNotionListUrls: string[][] = await pMap(
    Object.keys(notion.pages),
    async (pageName) => {
      const pageEnabled = get(notion, ['pages', pageName, 'enabled'])
      const pageType = get(notion, ['pages', pageName, 'type'])
      if (!pageEnabled) {
        log({
          category,
          message: `skip generate urls since this pageName is disabled | pageName: ${pageName}`,
        })
        return []
      }
      switch (pageType) {
        case 'stream': {
          const response = await fetchArticleStream({
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
  const urls = [...pageUrls, ...notionUrls].map((url) => ({ url }))

  // generate sitemap xml
  const stream = new SitemapStream({
    hostname: `${get(website, [currentEnv, 'protocol'])}://${get(website, [
      currentEnv,
      'host',
    ])}`,
  })
  const sitemapXml = await streamToPromise(
    Readable.from(urls).pipe(stream)
  ).then((data) => data.toString())
  return sitemapXml
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const headers = req.headers

  try {
    log({
      category,
      message: 'dumpaccess',
    })

    // sitemap cache
    cacheConfig.forceRefresh =
      searchParams.get(FORCE_CACHE_REFRESH_QUERY) === '1'

    const sitemapXmlKey = `sitemap_${dayjs.utc().format('YYYY-MM-DD')}`
    const sitemapXml = await cacheClient.proxy(
      sitemapXmlKey,
      '/api/sitemap',
      generateSiteMapXml.bind(this),
      { ttl: cacheConfig.ttls.sitemap }
    )

    const newHeaders = {
      ...headers,
      'Content-Type': 'application/xml',
      /**
       * < s-maxage: data is fresh, serve cache. X-Vercel-Cache HIT
       * s-maxage - stale-while-revalidate: data is stale, still serve cache and start background new cache generation. X-Vercel-Cache STALE
       * > stale-while-revalidate: data is stale and cache won't be used any more. X-Vercel-Cache MISS
       *
       * @see https://vercel.com/docs/concepts/edge-network/caching#serverless-functions---lambdas
       * @see https://vercel.com/docs/concepts/edge-network/x-vercel-cache
       * @see https://web.dev/stale-while-revalidate/
       */
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=86400',
    }

    return new Response(sitemapXml, {
      status: 200,
      headers: newHeaders,
    })
  } catch (err) {
    const statusCode = err.status || 500

    log({
      category,
      message: err.message,
    })

    return new Response('Oops, something went wrong.', {
      status: statusCode,
    })
  }
}
