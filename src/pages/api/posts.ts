import { NextApiRequest, NextApiResponse } from 'next'
import createError from 'http-errors'
import get from 'lodash/get'
import set from 'lodash/set'
import log from '../../libs/server/log'
import {
  getNotionPostsFromTable,
  getNotionPreviewImages,
} from '../../libs/server/notion'
import {
  getCategory,
  messageWithHeaders,
  validateRequest,
} from '../../libs/server/api-util'
import { notion } from '../../../site.config'

const route = '/posts'
const methods = ['GET']
const querySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    index: {
      type: 'string',
      pattern: '^[0-9]+$',
    },
    pageName: {
      enum: ['article', 'coding'], // align to site.config notion page names
      type: 'string',
    },
    count: {
      type: 'string',
      pattern: '^[0-9]+$',
    },
  },
  required: ['count', 'index', 'pageName'],
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const category = getCategory(route)
    validateRequest(req, { querySchema, route, methods })

    const pageName = req.query?.pageName
    const pageId = get(notion, ['pages', pageName, 'pageId'])
    const collectionViewId = get(notion, [
      'pages',
      pageName,
      'collectionViewId',
    ])
    const pageEnabled = get(notion, ['pages', pageName, 'enabled'])

    if (!pageEnabled) {
      log({
        category,
        message: messageWithHeaders(
          req,
          `posts data not found because this page is disabled \nquery params = ${JSON.stringify(
            req.query
          )}`
        ),
        level: 'warn',
      })
      throw createError(404)
    }
    if (!pageId || !collectionViewId) {
      log({
        category,
        message: messageWithHeaders(
          req,
          `posts data not found because some required configs are missing \nquery params = ${JSON.stringify(
            req.query
          )}`
        ),
        level: 'warn',
      })
      throw createError(404)
    }

    const index: any = req.query?.index
    const count: any = req.query?.count
    const limit = Number.parseInt(index) + Number.parseInt(count)
    if (isNaN(limit) || !Number.isInteger(limit)) {
      log({
        category,
        message: messageWithHeaders(
          req,
          `invalid index or count, query params: ${JSON.stringify(req.query)}`
        ),
        level: 'warn',
      })
      throw createError(400)
    }

    // fetch notion post data
    log({
      category,
      message: messageWithHeaders(
        req,
        `dumpaccess, query params: ${JSON.stringify(req.query)}`
      ),
    })
    const data = await getNotionPostsFromTable({
      pageId,
      collectionViewId,
      options: { limit },
    })

    if (get(notion, ['previeImages', 'enable'])) {
      const previewImageMap = await getNotionPreviewImages(data.recordMap)
      set(data, ['recordMap', 'preview_images'], previewImageMap)
    }

    res.status(200).json(data)
  } catch (err) {
    const statusCode = err.status || 500
    res.status(statusCode).send(err.message)
  }
}

export default handler