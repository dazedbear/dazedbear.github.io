import { createClient } from '@vercel/kv'
import objectHash from 'object-hash'
import log from './log'
import { currentEnv, cache as cacheConfig } from '../../../site.config'

class CacheClient {
  client = null
  option = null

  constructor(option) {
    this.option = option
    if (!this.option || !this.option?.enable) {
      log({ category: 'cacheClient', message: 'cache is disabled' })
      this.client = null
      return
    }

    log({
      category: 'cacheClient',
      message: 'cacheClient is enabled and start initialization',
    })

    this.client = createClient({
      url: this.option?.url,
      token: this.option?.token,
    })
  }

  /**
   * get data from cache (HIT) or from executed async function (MISS)
   * @param {string} originKey
   * @param {string} message
   * @param {AsyncGeneratorFunction} execFunction
   * @param {object} overrideOption
   * @returns {any} data
   */
  async proxy(originKey, message, execFunction, overrideOption = {} as any) {
    if (!originKey || !message || typeof execFunction !== 'function') {
      return
    }

    // add dev prefix to prevent key collision with production data
    const key = `${currentEnv}_${originKey}`
    const ttl = overrideOption?.ttl || this.option?.ttls.default
    const forceRefresh =
      overrideOption?.forceRefresh || this.option?.forceRefresh

    if (!this.client) {
      log({
        category: 'cacheClient|proxy',
        message: `cache MISS: cacheClient is disabled. | ${message} | key: ${key}`,
      })
      const data = await execFunction()
      return data
    }

    try {
      const cacheData = await this.client?.get(key)
      if (cacheData && !forceRefresh) {
        log({
          category: 'cacheClient|proxy',
          message: `cache HIT | ${message} | key: ${key}`,
          level: 'debug',
        })
        return cacheData
      }
    } catch (err) {
      // swallow redis client errors to prevent app crash
      log({
        category: 'cacheClient|proxy',
        message: err,
        level: 'error',
      })
    }

    log({
      category: 'cacheClient|proxy',
      message: `cache MISS${
        forceRefresh ? ' (force refresh)' : ''
      } | ${message} | key: ${key}`,
    })
    const data = await execFunction()
    try {
      if (data) {
        await this.client?.set(key, data)
        await this.client?.expire(key, ttl)
      }
    } catch (err) {
      // swallow redis client errors to prevent app crash
      log({
        category: 'cacheClient|proxy',
        message: err,
        level: 'error',
      })
    } finally {
      return data
    }
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
        category: 'cacheClient|createCacheKeyFromContent',
        message: 'content should not be empty',
        level: 'error',
      })
      return
    }
    return `${prefix}${objectHash(content)}`
  }
}

const cacheClient = new CacheClient(cacheConfig)

export default cacheClient
