import { get } from 'lodash'
import { useRouter } from 'next/router'
import { navigation as navItems } from '../lib/site.config'
import { getDateValue } from 'notion-utils'

/**
 * get formatted date string
 * @param {any} date timestamp or date string
 * @returns {string} formatted date string like `January 23, 2021`
 */
export const getDateStr = date => {
  return new Date(date).toLocaleString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })
}

/**
 * extract property path mapping from a collection
 * @param {object} collection
 * @returns {object} map contains property path and type.
 * eg: { Slug: { type: 'text', path: ['value', 'schema', 'QzV^'] }}
 */
const getPropertyPathMap = collection => {
  const schemaPath = ['value', 'schema']
  const basePath = ['value', 'properties']
  const schema = get(collection, schemaPath)
  if (!schema) {
    console.error('schema not found in collection.')
    return
  }
  const propertyPathMap = Object.keys(schema).reduce((result, key) => {
    const propertyName = get(schema, [key, 'name'])
    result[propertyName] = {
      type: get(schema, [key, 'type']),
      path: basePath.concat(key),
    }
    return result
  }, {})
  return propertyPathMap
}

/**
 * extract property value from nested array recursively
 * @param {any} property
 * @returns {string} extracted value
 */
const getPropertyValue = property => {
  if (property && Array.isArray(property)) {
    for (const v of property) {
      const value = getPropertyValue(v)
      if (value) {
        return value
      }
    }
  }
  return property
}

/**
 * exptract page property
 * @param param.pageId
 * @param param.recordMap
 * @returns {object} page property value map
 */
export const getPageProperty = ({ pageId, recordMap }) => {
  if (!pageId || !recordMap) {
    return
  }

  const pageBlock = get(recordMap, ['block', pageId])
  if (!pageBlock || get(pageBlock, ['value', 'type']) !== 'page') {
    return
  }

  // TODO: need a more robust way to get the correct collection id.
  const collectionId = Object.keys(recordMap.collection)[0]
  if (!collectionId) {
    return
  }

  const collection = get(recordMap, ['collection', collectionId])
  const propertyPathMap: any = getPropertyPathMap(collection)

  // add more fields into propertyPathMap
  propertyPathMap.PageCover = {
    type: 'image',
    path: ['value', 'format', 'page_cover'],
  }
  propertyPathMap.LastEditedTime = {
    type: 'timestamp',
    path: ['value', 'last_edited_time'],
  }
  propertyPathMap.PageTitle = {
    type: 'text',
    path: ['value', 'properties', 'title'],
  }

  // extract values from property paths
  const property = {}
  for (let name in propertyPathMap) {
    const { path, type } = propertyPathMap[name]
    property[name] = get(pageBlock, path)
    if (type === 'date') {
      property[name] = getDateValue(property[name])
    } else {
      property[name] = getPropertyValue(property[name])
    }
  }

  return property
}

/**
 * get all posts slug from property
 * @param {object} param.recordMap API response from notion-client
 * @param {array} param.postIds string array of post ids
 * @param {object} param.propertyPathMap map contains property path and type.
 * @returns {array} string array of post slugs
 */
export const getAllPostSlugs = ({ recordMap, postIds, propertyPathMap }) => {
  if (!recordMap || !postIds || !propertyPathMap) {
    console.error('No recordMap or propertyPathMap or postIds')
    return []
  }

  const SLUG_PROPERTY_NAME = 'Slug'
  const slugPath = propertyPathMap[SLUG_PROPERTY_NAME]
  return postIds.map(postId => {
    const slug = get(recordMap, ['block', postId, ...slugPath], [[]])[0][0]
    return { postId, slug }
  })
}

/**
 * detect current next.js page is active or not
 * @param {string} page next.js page pathname
 * @returns {boolean} current next.js page is active or not
 */
export const isActivePage = page => {
  const { pathname } = useRouter()
  return page && page !== '/' && pathname.includes(page)
}

/**
 * get title of current page from navigation config
 * @returns {string} title of current page
 */
export const getCurrentPageTitle = () => {
  const { pathname } = useRouter()
  return navItems.find(({ page }) => page !== '/' && pathname.includes(page))
    ?.label
}
