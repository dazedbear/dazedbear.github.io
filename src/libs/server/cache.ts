import cacheManager from 'cache-manager'
import fsStore from 'cache-manager-fs-hash'
import objectHash from 'object-hash'
import chalk from 'chalk'

chalk.level = 2 // disable level auto detection to make sure all log has correct color, see https://www.npmjs.com/package/chalk#chalklevel

export const CACHE_TTL_ASSETS = 86400 * 365 // 1 year seconds
export const CACHE_TTL_DEVELOPMENT = 60 * 5 // 5 min seconds
export const CACHE_TTL_PRODUCTION = 60 * 60 // 1 hour seconds

// https://github.com/rolandstarke/node-cache-manager-fs-hash/blob/master/src/index.js#L27-L40
const cacheClient = cacheManager.caching({
  store: fsStore,
  ttl:
    process.env.NODE_ENV === 'development'
      ? CACHE_TTL_DEVELOPMENT
      : CACHE_TTL_PRODUCTION, // seconds
  path: '.next/cache/application',
})

/**
 * simple util to generate cache key from any types of content such as object, string, ...
 * @param {any} content any types of content
 * @param {string} prefix optional
 * @returns {string} cache key
 */
cacheClient.createCacheKeyFromContent = (content, prefix = '') => {
  if (!content) {
    console.error('content should not be empty in createCacheKeyFromContent')
    return
  }
  return `${prefix}${objectHash(content)}`
}

/**
 * simple log util to unify cache log format and color
 * @param {string} identifier id or function name
 * @param {string} cacheKey cache key
 * @param {boolean} isCached is it a cache log, or it would be fetch log instead
 * @returns {undefined}
 */
cacheClient.log = (identifier = '', cacheKey = '', isCached = false) => {
  if (!identifier || !cacheKey) {
    return
  }
  const message = `[cacheClient] ${
    isCached ? 'cache' : 'fetch'
  } | id: ${identifier} | key: ${cacheKey}`
  const logColor = isCached ? chalk.grey : chalk.whiteBright

  // disable logs only when build time
  if (process.env.NEXT_BUILD_TIME !== 'true') {
    console.log(logColor(message))
  }
}

export default cacheClient
