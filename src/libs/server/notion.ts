import { NotionAPI } from 'notion-client'
import {
  notion as notionConfig,
  cache as cacheConfig,
} from '../../../site.config'
import { mapNotionImageUrl } from '../notion'
import cacheClient from './cache'
import get from 'lodash/get'
import set from 'lodash/set'
import pMap from 'p-map'
import fetch from 'node-fetch'
import lqip from 'lqip-modern'
import log from './log'

const notionAPI = new NotionAPI({
  activeUser: notionConfig.user,
  authToken: notionConfig.token,
})

export const getNotionPage = async (pageId: string, dataFormatter?: any) => {
  if (!pageId) {
    log({
      category: 'getNotionPage',
      message: 'pageId or collectionViewName not specify.',
      level: 'error',
    })
    return
  }

  let result = await cacheClient.proxy(
    pageId,
    'getNotionPage',
    async () => {
      const data = await notionAPI.getPage(pageId)
      return data
    },
    {
      ttl: cacheConfig.ttls.notionPage,
    }
  )

  // provide callback function to format data
  if (typeof dataFormatter === 'function') {
    result = dataFormatter(result)
  }

  return result
}

export const getNotionPostsFromTable = async (
  {
    pageId,
    collectionViewId,
    options,
    paginationEnabled = false,
    fetchAllPosts = false,
  }: {
    pageId: string
    collectionViewId: string
    options?: object
    paginationEnabled?: boolean
    fetchAllPosts?: boolean
  },
  dataFormatter?: any
) => {
  if (!pageId || !collectionViewId) {
    log({
      category: 'getNotionPostsFromTable',
      message: 'pageId or collectionViewId not specify.',
      level: 'error',
    })
    return
  }

  const tablePageCacheKey = cacheClient.createCacheKeyFromContent({
    pageId,
    name: 'getPage',
  })
  const tablePageData = await cacheClient.proxy(
    tablePageCacheKey,
    'getNotionPostsFromTable - getPage',
    async () => {
      const response = await notionAPI.getPage(pageId, {
        fetchCollections: true,
      })
      return response
    }
  )

  // Since we put the table page id here, there will be only 1 collection id exist.
  const collectionId = Object.keys(tablePageData?.collection)[0]
  const collectionQueries = tablePageData?.collection_query || {}
  const collectionViewQuery = get(tablePageData, [
    'collection_view',
    collectionViewId,
    'value',
    'query2',
  ])
  if (!collectionId) {
    log({
      category: 'getNotionPostsFromTable',
      message: 'cannot find collectionId.',
      level: 'error',
    })
    return
  }

  let apiOptions = {
    query: collectionViewQuery, // reuse the filter/sort query from collection view
    type: 'table',
    loadContentCover: true,
    searchQuery: '',
    userTimeZone: 'Asia/Taipei',
  } as any

  // pagination
  if (paginationEnabled) {
    apiOptions.limit = notionConfig?.pagination?.firstLoadCount
  }

  if (typeof options === 'object') {
    apiOptions = Object.assign({}, apiOptions, options)
  }

  const queryPostsCacheKey = cacheClient.createCacheKeyFromContent({
    collectionId,
    collectionViewId,
    apiOptions,
  })
  const queryPosts = await cacheClient.proxy(
    queryPostsCacheKey,
    'getNotionPostsFromTable - queryPosts',
    async () => {
      const response = await notionAPI.getCollectionData(
        collectionId,
        collectionViewId,
        apiOptions
      )
      // hack to fix the missing field of recordMap from notionAPI.getCollectionData so that we can reuse it to reduce duplicated API call
      set(response, ['recordMap', 'collection_query'], collectionQueries)
      set(response, ['recordMap', 'signed_urls'], {})
      return response
    }
  )

  let result = queryPosts

  // workaround for menu items
  if (fetchAllPosts) {
    apiOptions.query = collectionViewQuery
    apiOptions.limit = undefined // disable pagination to fetch all articles
    const queryAllPostsCacheKey = cacheClient.createCacheKeyFromContent({
      name: 'queryAllPosts',
      collectionId,
      collectionViewId,
      apiOptions,
    })
    const queryAllPosts = await cacheClient.proxy(
      queryAllPostsCacheKey,
      'getNotionPostsFromTable - queryAllPosts',
      async () => {
        const response = await notionAPI.getCollectionData(
          collectionId,
          collectionViewId,
          apiOptions
        )
        // hack to fix the missing field of recordMap from notionAPI.getCollectionData so that we can reuse it to reduce duplicated API call
        set(response, ['recordMap', 'collection_query'], collectionQueries)
        set(response, ['recordMap', 'signed_urls'], {})
        return response
      }
    )
    result.allPosts = queryAllPosts
  }

  // provide callback function to format data
  if (typeof dataFormatter === 'function') {
    result = dataFormatter(result)
  }
  return result
}

/**
 * get all image placeholder (aka preview image) from a notion page.
 * @see https://github.com/transitive-bullshit/nextjs-notion-starter-kit/blob/da29754f6ed221901771420025cff2c2d2f45f92/api/create-preview-image.ts
 * @param {object} recordMap
 * @returns {object} previewImageMap
 */
export const getNotionPreviewImages = async (recordMap) => {
  if (!recordMap) {
    log({
      category: 'getNotionPreviewImages',
      message: 'recordMap not found in getNotionPreviewImages',
      level: 'error',
    })
    return {}
  }
  const blockIds = Object.keys(recordMap.block)
  const imageUrls: any[] = blockIds
    .map((blockId) => {
      const block = recordMap.block[blockId]?.value
      if (block) {
        if (block.type === 'image') {
          const source = block.properties?.source?.[0]?.[0]
          if (source) {
            return {
              block,
              url: source,
            }
          }
        }
        if ((block.format as any)?.page_cover) {
          const source = (block.format as any).page_cover
          return {
            block,
            url: source,
          }
        }
      }
      return {
        block: '',
        url: '',
      }
    })
    .filter(({ url, block }) => Boolean(url && block))
    .map(({ url, block }) => mapNotionImageUrl(url, block))
    .filter(Boolean)

  const results = await pMap(
    imageUrls,
    async (url) => {
      let result
      try {
        result = await cacheClient.proxy(
          url,
          'lqip',
          async () => {
            const response = await fetch(url)
            if (!response.ok) {
              log({
                category: 'lqip',
                message: `fetch image url error | status: ${response.status} | statusText: ${response.statusText} | url = ${url}`,
                level: 'error',
              })
              throw Error(`fetch image url error: ${url}`)
            }
            const imageBuffer = await response.buffer()
            const data = await lqip(imageBuffer)
            return data
          },
          { ttl: cacheConfig.ttls.previewImage }
        )
      } catch (err) {
        log({
          category: 'lqip',
          message: `generate preview image error | key: ${url}`,
          level: 'error',
        })
        return {
          url,
          error: true,
        }
      }

      const image = {
        url,
        originalWidth: result?.metadata?.originalWidth,
        originalHeight: result?.metadata?.originalHeight,
        width: result?.metadata?.width,
        height: result?.metadata?.height,
        type: result?.metadata?.type,
        dataURIBase64: result?.metadata?.dataURIBase64,
        error: false,
      }
      return image
    },
    {
      concurrency: notionConfig.previewImages.concurrency,
    }
  )

  return results
    .filter(Boolean)
    .filter((image) => !image.error)
    .reduce(
      (acc, result) => ({
        ...acc,
        [result.url]: result,
      }),
      {}
    )
}
