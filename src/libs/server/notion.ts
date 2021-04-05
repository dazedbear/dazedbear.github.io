import { NotionAPI } from 'notion-client'
import { notion as notionConfig } from '../../../site.config'
import { mapNotionImageUrl } from '../client/blog-helpers'
import cacheClient from './cache'
import get from 'lodash/get'
import pMap from 'p-map'
import fetch from 'node-fetch'
import lqip from 'lqip-modern'

const notionAPI = new NotionAPI({ authToken: notionConfig.token })
const isLocal = process.env.NODE_ENV === 'development'

export const getNotionPage = async (pageId: string, dataFormatter?: any) => {
  if (!pageId) {
    console.error('pageId or collectionViewName not specify.')
    return
  }
  let result: any
  const cache = await cacheClient.get(pageId)
  if (cache) {
    cacheClient.log('getNotionPage', pageId, true)
    result = cache
  } else {
    cacheClient.log('getNotionPage', pageId)
    result = await notionAPI.getPage(pageId)
    await cacheClient.set(pageId, result, {
      ttl: isLocal
        ? notionConfig?.pageCacheTTL?.development
        : notionConfig?.pageCacheTTL?.production,
    })
  }

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
    console.error('pageId or collectionViewId not specify.')
    return
  }
  let result: any
  const cacheKey = cacheClient.createCacheKeyFromContent({
    pageId,
    collectionViewId,
    options,
  })
  const cache = await cacheClient.get(cacheKey)
  if (cache) {
    cacheClient.log('getNotionPostsFromTable', cacheKey, true)
    result = cache
  } else {
    cacheClient.log('getNotionPostsFromTable', cacheKey)
    const pageData = await notionAPI.getPage(pageId, { fetchCollections: true })

    // Since we put the table page id here, there will be only 1 collection id exist.
    const collectionId = Object.keys(pageData.collection)[0]
    const collectionViewQuery = get(pageData, [
      'collection_view',
      collectionViewId,
      'value',
      'query2',
    ])

    if (!collectionId) {
      console.log(pageId, pageData)
      console.error('cannot find collectionId.')
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
    result = await notionAPI.getCollectionData(
      collectionId,
      collectionViewId,
      apiOptions
    )
    await cacheClient.set(cacheKey, result, {
      ttl: isLocal
        ? notionConfig?.pageCacheTTL?.development
        : notionConfig?.pageCacheTTL?.production,
    })
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
export const getNotionPreviewImages = async recordMap => {
  if (!recordMap) {
    console.error('recordMap not found in getNotionPreviewImages')
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
        const cache = await cacheClient.get(url)
        if (cache) {
          cacheClient.log('lqip', url, true)
          result = cache
        } else {
          const response = await fetch(url)
          if (!response.ok) {
            throw Error(response.error)
          }
          const imageBuffer = await response.buffer()
          result = await lqip(imageBuffer)
          cacheClient.log('lqip', url)
          await cacheClient.set(url, result, {
            ttl: notionConfig?.previeImages?.cacheTTL,
          })
        }
      } catch (err) {
        console.error('lqip error', err)
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
      concurrency: 2, // to prevent segmentation fault when build in Vercel.
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
