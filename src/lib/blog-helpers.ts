import { get } from 'lodash'
import { useRouter } from 'next/router'
import { navigation as navItems } from '../lib/site.config'

export const getBlogLink = (slug: string) => {
  return `/blog/${slug}`
}

export const getDateStr = date => {
  return new Date(date).toLocaleString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })
}

export const postIsPublished = (post: any) => {
  return post.Published === 'Yes'
}

export const normalizeSlug = slug => {
  if (typeof slug !== 'string') return slug

  let startingSlash = slug.startsWith('/')
  let endingSlash = slug.endsWith('/')

  if (startingSlash) {
    slug = slug.substr(1)
  }
  if (endingSlash) {
    slug = slug.substr(0, slug.length - 1)
  }
  return startingSlash || endingSlash ? normalizeSlug(slug) : slug
}

/**
 * { Slug: 'value.schema.QzV^ }
 * @param collection
 */
export const getPropertyPathMap = collection => {
  const schemaPath = ['value', 'schema']
  const basePath = ['value', 'properties']
  const schema = get(collection, schemaPath)
  if (!schema) {
    console.error('schema not found in collection.')
    return
  }
  const propertyPathMap = Object.keys(schema).reduce((result, key) => {
    const propertyName = get(schema, [key, 'name'])
    result[propertyName] = basePath.concat(key)
    return result
  }, {})
  return propertyPathMap
}

export const getAllPostSlugs = ({ pageData, postIds, propertyPathMap }) => {
  if (!pageData || !postIds || !propertyPathMap) {
    console.error('No pageData or propertyPathMap or postIDs')
    return []
  }

  const SLUG_PROPERTY_NAME = 'Slug'
  const slugPath = propertyPathMap[SLUG_PROPERTY_NAME]
  return postIds.map(postId => {
    const slug = get(pageData, ['block', postId, ...slugPath], [[]])[0][0]
    return { postId, slug }
  })
}

export const getCurrentPageTitle = () => {
  const { pathname } = useRouter()
  return navItems.find(({ page }) => page !== '/' && pathname.includes(page))
    ?.label
}
