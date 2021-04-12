import cacheManager from 'cache-manager'
import fsStore from 'cache-manager-fs-hash'
import objectHash from 'object-hash'
import chalk from 'chalk'
import { cache } from '../../../site.config'

chalk.level = 2 // disable level auto detection to make sure all log has correct color, see https://www.npmjs.com/package/chalk#chalklevel

// https://github.com/rolandstarke/node-cache-manager-fs-hash/blob/master/src/index.js#L27-L40
const cacheClient = cache.enable
  ? cacheManager.caching({
      store: fsStore,
      ttl: 60, // seconds, default is 1 min
      path: '.next/cache/application',
    })
  : {
      get: () => {},
      set: () => {},
    }

if (!cache.enable) {
  console.log(`[${new Date().toUTCString()}][cacheClient] cache disabled`)
}

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
  if (!identifier || !cacheKey || !cache.enable) {
    return
  }
  const message = `[${new Date().toUTCString()}][cacheClient] ${
    isCached ? 'cache' : 'fetch'
  } | id: ${identifier} | key: ${cacheKey}`
  const logColor = isCached ? chalk.grey : chalk.whiteBright

  // disable logs only when build time
  if (process.env.NEXT_BUILD_TIME !== 'true') {
    console.log(logColor(message))
  }
}

export default cacheClient
