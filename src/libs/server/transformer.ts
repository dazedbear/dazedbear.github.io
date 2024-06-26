import get from 'lodash/get'
import set from 'lodash/set'
import isEmpty from 'lodash/isEmpty'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { ExtendedRecordMap } from 'notion-types'
import { getBlockTitle, idToUuid, getPageTableOfContents } from 'notion-utils'

import { notion } from '../../../site.config'
import log from './log'
import { getNotionPreviewImages } from './notion'
import { getSinglePagePath, getPageProperty } from '../notion'
import {
  ArticleStream,
  NotionPageName,
  logOption,
  PageMeta,
  PreviewImagesMap,
  MenuItem,
  SinglePage,
} from '../../../types'

const ajv = new Ajv()
addFormats(ajv)

/**
 * transform Notion API response to article stream
 * @param {string} pageName
 * @param {object} data
 * @returns {object} article stream
 */
export const transformArticleStream = async (
  pageName: NotionPageName,
  data: ExtendedRecordMap
): Promise<ArticleStream> => {
  const articleStream: ArticleStream = {}
  const collectionId: string = get(notion, ['pages', pageName, 'collectionId'])
  const collectionViewId: string = get(notion, [
    'pages',
    pageName,
    'collectionViewId',
  ])

  articleStream.content = data
  articleStream.ids = get(data, [
    'collection_query',
    collectionId,
    collectionViewId,
    'collection_group_results',
    'blockIds',
  ])
  articleStream.hasNext = get(data, [
    'collection_query',
    collectionId,
    collectionViewId,
    'collection_group_results',
    'hasMore',
  ])
  articleStream.total = Array.isArray(articleStream.ids)
    ? articleStream.ids.length
    : 0
  articleStream.index = Array.isArray(articleStream.ids)
    ? articleStream.ids.length - 1
    : 0

  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      content: {
        type: 'object',
      },
      ids: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      hasNext: {
        type: 'boolean',
      },
      index: {
        type: 'integer',
      },
      total: {
        type: 'integer',
      },
    },
    required: ['content', 'ids', 'hasNext', 'index', 'total'],
  }
  const validate = ajv.compile(schema)
  if (!validate(articleStream)) {
    const options: logOption = {
      category: 'transformArticleStream',
      message: validate.errors,
      level: 'warn',
    }
    log(options)
    throw Error('articleStream is invalid')
  }

  return articleStream
}

export const transformArticleStreamPreviewImages = async (
  articleStream: ArticleStream
): Promise<ArticleStream> => {
  const isPreviewImageGenerationEnabled: boolean = get(notion, [
    'previewImages',
    'enable',
  ])

  if (!isEmpty(articleStream.content) && isPreviewImageGenerationEnabled) {
    // we only parse the cover preview images from the recordMap of collection data to prevent duplicated parsing from blog/[slug]
    const previewImageMap: PreviewImagesMap = await getNotionPreviewImages(
      articleStream.content
    )
    set(articleStream, ['content', 'preview_images'], previewImageMap)

    const schema = {
      type: 'object',
      additionalProperties: true,
      properties: {
        content: {
          type: 'object',
          properties: {
            preview_images: {
              type: 'object',
            },
          },
          required: ['preview_images'],
        },
      },
      required: ['content'],
    }
    const validate = ajv.compile(schema)
    if (!validate(articleStream)) {
      const options: logOption = {
        category: 'transformArticleStreamPreviewImages',
        message: validate.errors,
        level: 'warn',
      }
      log(options)
    }
  }

  return articleStream
}

/**
 * transform Notion API response to single article
 * @param {object} data
 * @returns {object} article stream
 */
export const transformSingleArticle = async (
  data: ExtendedRecordMap
): Promise<ArticleStream> => {
  const singleArticle: ArticleStream = {}
  singleArticle.content = data

  const isPreviewImageGenerationEnabled: boolean = get(notion, [
    'previewImages',
    'enable',
  ])

  if (!isEmpty(singleArticle.content) && isPreviewImageGenerationEnabled) {
    // we only parse the cover preview images from the recordMap of collection data to prevent duplicated parsing from blog/[slug]
    const previewImageMap: PreviewImagesMap = await getNotionPreviewImages(
      singleArticle.content
    )
    set(singleArticle, ['content', 'preview_images'], previewImageMap)
  }

  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      content: {
        type: 'object',
      },
    },
    required: ['content'],
  }
  const validate = ajv.compile(schema)
  if (!validate(singleArticle)) {
    const options: logOption = {
      category: 'transformSingleArticle',
      message: validate.errors,
      level: 'warn',
    }
    log(options)
    throw Error('singleArticle is invalid')
  }

  return singleArticle
}

/**
 * transform Notion API response to single page
 * @param {object} data
 * @returns {object} single page
 */
export const transformSinglePage = async (
  data: ExtendedRecordMap
): Promise<SinglePage> => {
  let pageContent: SinglePage = data || {}

  const isPreviewImageGenerationEnabled: boolean = get(notion, [
    'previewImages',
    'enable',
  ])

  if (!isEmpty(pageContent) && isPreviewImageGenerationEnabled) {
    // we only parse the cover preview images from the recordMap of collection data to prevent duplicated parsing from blog/[slug]
    const previewImageMap: PreviewImagesMap = await getNotionPreviewImages(
      pageContent
    )
    set(pageContent, ['preview_images'], previewImageMap)
  }

  const schema = {
    type: 'object',
  }
  const validate = ajv.compile(schema)
  if (!validate(pageContent)) {
    const options: logOption = {
      category: 'transformSinglePage',
      message: validate.errors,
      level: 'warn',
    }
    log(options)
    throw Error('single page is invalid')
  }

  return pageContent
}

/**
 * transform article stream to menu items
 * @param {string} pageName
 * @param {object} articleStream
 * @returns {array} menu items array
 */
export const transformMenuItems = (
  pageName: NotionPageName,
  articleStream: ArticleStream
): MenuItem[] => {
  const recordMap = articleStream.content
  const ids = articleStream.ids || []
  const menuItems: MenuItem[] = ids.reduce((items: any[], pageId) => {
    const pagePath = getSinglePagePath({
      pageName,
      pageId,
      recordMap,
    })
    if (pagePath) {
      const url = `/${pageName}/${pagePath}`
      const block = get(recordMap, ['block', pageId, 'value'])
      const label = getBlockTitle(block, recordMap as any)
      const item = {
        label,
        url,
      }
      items.push(item)
    } else {
      const options: logOption = {
        category: 'transformMenuItems',
        message: `strip out empty pagePath. | pageName: ${pageName} | pageId: ${pageId}`,
        level: 'warn',
      }
      log(options)
    }
    return items
  }, [])

  const schema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        label: {
          type: 'string',
        },
        url: {
          type: 'string',
        },
      },
    },
  }
  const validate = ajv.compile(schema)
  if (!validate(menuItems)) {
    const options: logOption = {
      category: 'transformMenuItems',
      message: `${validate.errors}`,
      level: 'warn',
    }
    log(options)
    throw Error('menuItems are invalid')
  }

  return menuItems
}

/**
 * transform article stream to page meta
 * @param {string} pageName
 * @param {object} articleStream
 * @returns {array} menu items array
 */
export const transformArticleSinglePageMeta = (
  articleStream: ArticleStream,
  articleId: string
): PageMeta => {
  const recordMap = articleStream.content
  const pageId = idToUuid(articleId)
  const property: any = getPageProperty({ pageId, recordMap })

  const pageMeta = {
    // description: '', TODO: add description later
    // image: property.PageCover, TODO: notion image url doesn't work
    title: property.PageTitle,
  }

  const schema = {
    type: 'object',
    properties: {
      description: {
        type: 'string',
      },
      image: {
        type: 'string',
      },
      title: {
        type: 'string',
      },
    },
  }
  const validate = ajv.compile(schema)
  if (!validate(pageMeta)) {
    const options: logOption = {
      category: 'transformArticleSinglePageMeta',
      message: `${validate.errors}`,
      level: 'warn',
    }
    log(options)
    throw Error('page meta are invalid')
  }

  return pageMeta
}

/**
 * transform article stream to page urls for sitemap
 * @param {string} pageName
 * @param {object} articleStream
 * @returns {array} url array
 */
export const transformPageUrls = (
  pageName: NotionPageName,
  articleStream: ArticleStream
): string[] => {
  const recordMap = articleStream.content
  const ids: any[] = articleStream?.ids || []
  let pageUrls: string[] = ids?.reduce((items, pageId) => {
    const pagePath = getSinglePagePath({
      pageName,
      pageId,
      recordMap,
    })
    if (pagePath) {
      const url = `/${pageName}/${pagePath}`
      items.push(url)
    } else {
      const options: logOption = {
        category: 'transformPageUrls',
        message: `strip out empty pagePath. | pageName: ${pageName} | pageId: ${pageId}`,
        level: 'warn',
      }
      log(options)
    }
    return items
  }, [])

  pageUrls.push(`/${pageName}`)

  const schema = {
    type: 'array',
    items: {
      type: 'string',
    },
  }
  const validate = ajv.compile(schema)
  if (!validate(pageUrls)) {
    const options: logOption = {
      category: 'transformPageUrls',
      message: `${validate.errors}`,
      level: 'warn',
    }
    log(options)
    throw Error('page urls are invalid')
  }

  return pageUrls
}

/**
 * transform article stream to table of content
 * @param {object} articleStream
 * @param {string} articleId
 * @returns {object} table of content for current page
 */
export const transformTableOfContent = (
  articleStream: ArticleStream,
  articleId: string
) => {
  const recordMap = articleStream.content
  const currentPostId = idToUuid(articleId)
  const pageBlock = get(articleStream, [
    'content',
    'block',
    currentPostId,
    'value',
  ])
  return getPageTableOfContents(pageBlock, recordMap as any)
}
