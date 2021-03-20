import { NotionAPI } from 'notion-client'
import { Block } from 'notion-types'
import { notion as notionConfig, cdnHost } from './site.config'
import get from 'lodash/get'
import pMap from 'p-map'
import fetch from 'node-fetch'
import lqip from 'lqip-modern'

const notionAPI = new NotionAPI({ authToken: notionConfig.token })

export const getNotionPage = async (pageId: string, dataFormatter?: any) => {
  if (!pageId) {
    console.error('pageId or collectionViewName not specify.')
    return
  }
  let result = await notionAPI.getPage(pageId)

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

  let result: any = await notionAPI.getCollectionData(
    collectionId,
    collectionViewId,
    apiOptions
  )
  if (typeof dataFormatter === 'function') {
    result = dataFormatter(result)
  }
  return result
}

/**
 * get notion image url that handles some cache logic
 * @see https://github.com/transitive-bullshit/nextjs-notion-starter-kit/blob/af8ed575d188021d4676633d17e25e4c59ce0b36/lib/map-image-url.ts
 * @param {string} url
 * @param {object} block
 * @returns {string} final image url
 */
export const mapNotionImageUrl = (url: string, block: Block) => {
  if (!url) {
    return null
  }

  if (url.startsWith('data:')) {
    return url
  }

  if (cdnHost && url.startsWith(cdnHost)) {
    return url
  }

  if (url.startsWith('/images')) {
    url = `https://www.notion.so${url}`
  }

  // more recent versions of notion don't proxy unsplash images
  if (!url.startsWith('https://images.unsplash.com')) {
    url = `https://www.notion.so${
      url.startsWith('/image') ? url : `/image/${encodeURIComponent(url)}`
    }`

    const notionImageUrlV2 = new URL(url)
    let table = block.parent_table === 'space' ? 'block' : block.parent_table
    if (table === 'collection') {
      table = 'block'
    }
    notionImageUrlV2.searchParams.set('table', table)
    notionImageUrlV2.searchParams.set('id', block.id)
    notionImageUrlV2.searchParams.set('cache', 'v2')

    url = notionImageUrlV2.toString()
  }

  if (url.startsWith('data:')) {
    return url
  }

  // use CDN to cache these image assets
  return cdnHost ? `${cdnHost}/${encodeURIComponent(url)}` : url
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

  const results = await pMap(imageUrls, async url => {
    let result
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw Error(response.error)
      }
      const imageBuffer = await response.buffer()
      result = await lqip(imageBuffer)
      console.log('lqip', result.metadata)
    } catch (err) {
      console.error('lqip error', err)
      return
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
  })

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
