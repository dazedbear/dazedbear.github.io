import { NotionAPI } from 'notion-client'
import {
  notion as notionConfig,
  cache as cacheConfig,
} from '../../../site.config'
import { mapNotionImageUrl } from '../notion'
import cacheClient from './cache'
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
