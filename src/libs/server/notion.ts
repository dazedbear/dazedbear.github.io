import { NotionAPI } from 'notion-client'
import { notion as notionConfig } from '../../../site.config'
import { mapNotionImageUrl } from '../client/blog-helpers'
import cacheClient from './cache'
import get from 'lodash/get'
import pMap from 'p-map'
import fetch from 'node-fetch'
import lqip from 'lqip-modern'
import log from './log'

const notionAPI = new NotionAPI({ authToken: notionConfig.token })

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
      ttl: notionConfig?.pageCacheTTL,
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
  }: { pageId: string; collectionViewId: string; options?: object },
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
  const cacheKey = cacheClient.createCacheKeyFromContent({
    pageId,
    collectionViewId,
    options,
  })

  let result = await cacheClient.proxy(
    cacheKey,
    'getNotionPostsFromTable',
    async () => {
      const pageData = await notionAPI.getPage(pageId, {
        fetchCollections: true,
      })
      // Since we put the table page id here, there will be only 1 collection id exist.
      const collectionId = Object.keys(pageData.collection)[0]
      const collectionViewQuery = get(pageData, [
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
        // limit: 20,
        loadContentCover: true,
        searchQuery: '',
        userTimeZone: 'Asia/Taipei',
      } as any

      if (typeof options === 'object') {
        apiOptions = Object.assign({}, apiOptions, options)
      }
      const data = await notionAPI.getCollectionData(
        collectionId,
        collectionViewId,
        apiOptions
      )
      return data
    },
    { ttl: notionConfig?.pageCacheTTL }
  )

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
export const getNotionPreviewImages = async recordMap => {
  if (!recordMap) {
    log({
      category: 'getNotionPreviewImages',
      message: 'recordMap not found in getNotionPreviewImages',
      level: 'error',
    })
    return
  }
  const blockIds = Object.keys(recordMap.block)
  const imageUrls: string[] = blockIds
    .map(blockId => {
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
      return null
    })
    .filter(Boolean)
    .map(({ block, url }) => mapNotionImageUrl(url, block))
    .filter(Boolean)

  const results = await pMap(
    imageUrls,
    async url => {
      let result
      try {
        result = await cacheClient.proxy(
          url,
          'lqip',
          async () => {
            const response = await fetch(url)
            if (!response.ok) {
              log({ category: 'lqip', message: response.error, level: 'error' })
              return
            }
            const imageBuffer = await response.buffer()
            const data = await lqip(imageBuffer)
            return data
          },
          { ttl: notionConfig?.previeImages?.cacheTTL }
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
        originalWidth: result.metadata.originalWidth,
        originalHeight: result.metadata.originalHeight,
        width: result.metadata.width,
        height: result.metadata.height,
        type: result.metadata.type,
        dataURIBase64: result.metadata.dataURIBase64,
        error: false,
      }
      return image
    },
    {
      concurrency: 5,
    }
  )

  return results
    .filter(Boolean)
    .filter(image => !image.error)
    .reduce(
      (acc, result) => ({
        ...acc,
        [result.url]: result,
      }),
      {}
    )
}
