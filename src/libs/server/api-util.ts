import { NextApiRequest } from 'next'
import createError from 'http-errors'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import log from '../../libs/server/log'

const ajv = new Ajv()
addFormats(ajv)

const schemaMap = {
  route: {
    type: 'string',
    format: 'uri-reference',
  },
  methods: {
    type: 'array',
    items: [
      {
        enum: ['GET', 'POST', 'OPTION', 'PUT', 'PATCH', 'DELETE'],
      },
    ],
    minItems: 1,
    additionalItems: false,
  },
  message: {
    type: 'string',
  },
  querySchema: {
    type: ['object', 'null'],
  },
}

/**
 * getCategory
 * @param {string} route route path
 * @returns {string} log category prefix text
 */
export const getCategory = (route: string) => {
  const validate = ajv.compile(schemaMap.route)
  if (!validate(route)) {
    throw Error(`Invalid route found in getCategory: ${route}`)
  }
  return `API route: /api${route}`
}

/**
 * isSupportedMethod
 * @param {object} req next.js api request object
 * @param {array} methods allow request methods
 * @returns {boolean} true if request method is allowed
 */
export const isSupportedMethod = (
  req: NextApiRequest,
  methods: Array<string>
) => {
  const validate = ajv.compile(schemaMap.methods)
  if (!validate(methods)) {
    throw Error(`Invalid HTTP request methods found: ${methods}`)
  }
  const allowMethods = new Set(methods)
  return allowMethods.has(req.method)
}

/**
 * messageWithHeaders
 * @param {object} req next.js api request object
 * @param {string} message main log message
 * @returns {string} composite log message
 */
export const messageWithHeaders = (
  req: NextApiRequest,
  message = '' as string
) => {
  const validate = ajv.compile(schemaMap.message)
  if (!validate(message)) {
    throw Error(`Invalid message found in messageWithHeaders: ${message}`)
  }
  return `${message} \n${JSON.stringify(req.headers)}`
}

/**
 * validateRequest
 * @param {object} req next.js api request object
 * @param {object} param param
 * @param {array} param.methods string array for allow http methods
 * @param {object} param.querySchema JSON schema for query params
 * @param {string} param.route route path
 * @returns {void}
 */
export const validateRequest = (
  req: NextApiRequest,
  param: { methods: string[]; querySchema?: object; route: string }
) => {
  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      methods: schemaMap.methods,
      querySchema: schemaMap.querySchema,
      route: schemaMap.route,
    },
    required: ['methods', 'route'],
  }
  const validateParam = ajv.compile(schema)
  if (!validateParam(param)) {
    throw Error('Invalid param found validateRequest.')
  }

  const { methods, querySchema = {}, route } = param as any
  const validate = ajv.compile(querySchema)
  const category = getCategory(route)

  if (!isSupportedMethod(req, methods)) {
    log({
      category,
      message: messageWithHeaders(req, `unsupport method: ${req.method}`),
      level: 'warn',
    })
    throw createError(400)
  }
  if (!validate(req.query)) {
    log({
      category,
      message: messageWithHeaders(
        req,
        `invalid query params: ${JSON.stringify(req.query)}`
      ),
      level: 'warn',
    })
    throw createError(400)
  }
}
