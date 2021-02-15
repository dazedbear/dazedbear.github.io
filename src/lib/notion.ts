import { NotionAPI } from 'notion-client'
import { notion as notionConfig } from './site.config'

const notionAPI = new NotionAPI({ authToken: notionConfig.token })

export const getNotionPosts = async (
  { pageId, collectionViewName }: any,
  dataFormatter?: any
) => {
  if (!pageId) {
    console.error('pageId or collectionViewName not specify.')
    return
  }
  const pageData = await notionAPI.getPage(notionConfig.blog.pageId)
  let result = pageData as any

  // extract data from specific collection view when provided.
  if (collectionViewName) {
    // TODO: support 1 page has multiple tables
    const collectionId = Object.keys(pageData.collection)[0]
    if (!collectionId) {
      console.error('collectionId not found.')
      return
    }

    const collectionViewId = Object.keys(pageData.collection_view).find(
      id =>
        pageData.collection_view[id]?.value?.name ===
        notionConfig.blog.collectionViewName
    )
    if (!collectionViewId) {
      console.error('collectionViewId not found.')
      return
    }

    result = await notionAPI.getCollectionData(collectionId, collectionViewId)
  }

  // provide callback function to format data
  if (typeof dataFormatter === 'function') {
    result = dataFormatter(result)
  }

  return result
}

export const getNotionSinglePost = async (
  pageId: string,
  dataFormatter?: any
) => {
  if (!pageId) {
    console.error('pageId or collectionViewName not specify.')
    return
  }
  let result = await notionAPI.getPage(notionConfig.blog.pageId)

  // provide callback function to format data
  if (typeof dataFormatter === 'function') {
    result = dataFormatter(result)
  }

  return result
}
