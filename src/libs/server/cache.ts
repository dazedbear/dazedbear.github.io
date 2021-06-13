import cacheManager from 'cache-manager'
import redisStore from 'cache-manager-redis-store'
import objectHash from 'object-hash'
import log from './log'
import { cache } from '../../../site.config'

class CacheClient {
  client = null
  defaultTTL = 60

  constructor(option) {
    if (!option || !option.enable) {
      log({ category: 'cacheClient', message: 'cache disabled' })
      this.client = null
      return
    }
    this.client = cacheManager.caching({
      store: redisStore,
      ttl: this.defaultTTL, // seconds, default is 1 min
      host: option.host,
      port: option.port,
      auth_pass: option.token,
    })

    const redisClient = this.client.store.getClient()
    redisClient.on('error', error => {
      log({
        category: 'cacheClient',
        message: error,
        level: 'error',
      })
    })
  }

  async proxy(key, message, execFunction, overrideOption = {}) {
    if (!key || !message || typeof execFunction !== 'function') {
      return
    }

    // cache client disabled
    if (!this.client) {
      const data = await execFunction()
      return data
    }

    // cache client enabled
    const cacheData = await this.client.get(key)
    if (cacheData) {
      log({
        category: 'cacheClient',
        message: `cache HIT | ${message} | key: ${key}`,
        level: 'debug',
      })
      return cacheData
    }
    log({
      category: 'cacheClient',
      message: `cache MISS | ${message} | key: ${key}`,
    })
    const data = await execFunction()

    if (data) {
      await this.client.set(
        key,
        data,
        Object.assign({ ttl: this.defaultTTL }, overrideOption)
      )
    }
    return data
  }

  /**
   * simple util to generate cache key from any types of content such as object, string, ...
   * @param {any} content any types of content
   * @param {string} prefix optional
   * @returns {string} cache key
   */
  createCacheKeyFromContent(content, prefix = '') {
    if (!content) {
      log({
        category: 'cacheClient',
        message: 'content should not be empty in createCacheKeyFromContent',
        level: 'error',
      })
      return
    }
    return `${prefix}${objectHash(content)}`
  }
}

const cacheClient = new CacheClient(cache)

export default cacheClient
