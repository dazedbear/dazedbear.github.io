import get from 'lodash/get'
import set from 'lodash/set'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { ExtendedRecordMap } from 'notion-types'
import { getBlockTitle } from 'notion-utils'

import { notion } from '../../../site.config'
import log from './log'
import { getNotionPreviewImages } from './notion'
import { ActionPayloadState as StreamActionPayloadState } from '../client/slices/stream'
import { getSinglePagePath } from '../notion'
import {
  ArticleStream,
  NotionPageName,
  logOption,
  PreviewImagesMap,
  MenuItem,
} from '../../../types'

const ajv = new Ajv()
addFormats(ajv)

/**
 * transform Notion API response to article stream
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
    'blockIds',
  ])
  articleStream.hasNext = get(data, [
    'collection_query',
    collectionId,
    collectionViewId,
    'hasMore',
  ])
  articleStream.total = Array.isArray(articleStream.ids)
    ? articleStream.ids.length
    : 0
  articleStream.index = Array.isArray(articleStream.ids)
    ? articleStream.ids.length - 1
    : 0

  const isPreviewImageGenerationEnabled: boolean = get(notion, [
    'previeImages',
    'enable',
  ])

  if (!isEmpty(articleStream.content) && isPreviewImageGenerationEnabled) {
    // we only parse the cover preview images from the recordMap of collection data to prevent duplicated parsing from blog/[slug]
    const previewImageMap: PreviewImagesMap = await getNotionPreviewImages(
      articleStream.content
    )
    set(articleStream, ['content', 'preview_images'], previewImageMap)
  }

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
    throw 'articleStream is invalid'
  }

  return articleStream
}

/**
 * transform article stream to menu items
 */
export const transformMenuItems = (
  pageName: NotionPageName,
  articleStream: ArticleStream
): MenuItem[] => {
  const recordMap = articleStream.content
  const menuItems: MenuItem[] = articleStream.ids.map(pageId => {
    const pagePath = getSinglePagePath({
      pageName,
      pageId,
      recordMap,
    })
    const url = `/${pageName}/${pagePath}`
    const block = get(recordMap, ['block', pageId, 'value'])
    const label = getBlockTitle(block, recordMap as any)
    return {
      label,
      url,
    }
  })

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
    throw 'menuItems are invalid'
  }

  return menuItems
}

/**
 * transform article stream to updateStream action payload
 */
export const transformStreamActionPayload = (
  pageName: NotionPageName,
  articleStream: ArticleStream
): StreamActionPayloadState => {
  return {
    name: pageName as string,
    data: {
      content: cloneDeep(articleStream.content),
      hasNext: articleStream.hasNext,
      ids: articleStream.ids,
      index: articleStream.index,
      total: articleStream.total,
    },
  }
}
