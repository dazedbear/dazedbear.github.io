import { NotionAPI } from 'notion-client'
import { notion as notionConfig } from './site.config'
import get from 'lodash/get'

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
