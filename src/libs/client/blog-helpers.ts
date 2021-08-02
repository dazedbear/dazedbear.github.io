import { get } from 'lodash'
import { useRouter } from 'next/router'
import { navigation as navItems, cdnHost } from '../../../site.config'
import { Block } from 'notion-types'
import { getDateValue, uuidToId } from 'notion-utils'

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
    // reacct-notion-x appends such query params for every images and I still don't know why.
    // just align to it to fix the lazy load with preview image for page cover.
    // eg: ?table=block&id=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx&cache=v2
    if (name === 'PageCover') {
      property[name] = mapNotionImageUrl(property[name], pageBlock.value)
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
  const { asPath } = useRouter()
  if (!page) {
    return false
  }
  const regex = new RegExp(`${page}(\/.+)+`, 'i')
  return page === asPath || regex.test(asPath)
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
 * simple util to combine page id and slug
 * @param {object} param
 * @param {string} param.pageName pageName
 * @param {string} param.pageId pageId
 * @param {object} param.recordMap recordMap
 * @returns {string} pagePath, ex: announce-memos-c1510a50f1b44dbc95f3cd8c733dd472
 */
export const getSinglePagePath = ({ pageName, pageId, recordMap }) => {
  if (!pageName || !pageId || !recordMap) {
    return
  }

  const property: any = getPageProperty({ pageId, recordMap })
  const slug = property.Slug || property.Title
  const pagePath = [encodeURIComponent(slug), uuidToId(pageId)].join('-')
  return pagePath
}

/**
 * extract page id and slug from a pagePath (ex: announce-memos-c1510a50f1b44dbc95f3cd8c733dd472)
 * @param {string} pagePath
 * @returns {object} result like {slug: announce-memos, pageId: c1510a50f1b44dbc95f3cd8c733dd472}
 */
export const extractSinglePagePath = pagePath => {
  if (!pagePath) {
    return {}
  }
  const shades = pagePath.split('-')
  let pageId
  let slug
  if (shades.length > 2) {
    pageId = shades[shades.length - 1]
    slug = shades.slice(0, shades.length - 2).join('-')
  } else if (shades.length === 2) {
    slug = shades[0]
    pageId = shades[1]
  } else {
    console.error(
      `error when extractSinglePagePath. pagePath = ${pagePath}, shades = `,
      shades
    )
  }

  return {
    slug,
    pageId,
  }
}
