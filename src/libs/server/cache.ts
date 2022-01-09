import cacheManager from 'cache-manager'
import redisStore from 'cache-manager-ioredis'
import objectHash from 'object-hash'
import Redis from 'ioredis'
import log from './log'
import { currentEnv, cache as cacheConfig } from '../../../site.config'
import { CacheClientServingStatus } from '../../../types'

class CacheClient {
  client = null
  status: CacheClientServingStatus = 'default'
  option = null

  constructor(option) {
    if (!option || !option.enable) {
      log({ category: 'cacheClient', message: 'cache is disabled' })
      this.client = null
      this.status = 'terminated'
      return
    }
    this.option = option

    log({
      category: 'cacheClient',
      message: 'cacheClient is enabled and start initialization',
    })

    const connectionMaxRetries = this.option.connectionMaxRetries
    const connectionRetriesDelay = this.option.connectionRetriesDelay

    const redisClient = new Redis({
      host: this.option.host,
      port: this.option.port,
      password: this.option.token,
      connectTimeout: this.option.connectionTimeout,
      maxRetriesPerRequest: this.option.maxRetriesPerCommandRequest,
      retryStrategy(times) {
        if (times <= connectionMaxRetries) {
          return connectionRetriesDelay
        }
        return
      },
    })

    this.client = cacheManager.caching({
      store: redisStore,
      ttl: this.option.ttls.default,
      redisInstance: redisClient,
      ignoreCacheErrors: true,
    })

    this.status = 'initializing'

    redisClient.on('ready', () => {
      log({
        category: 'cacheClient|redis',
        message: 'Redis server is connected. cacheClient is running.',
      })
      this.status = 'running'
    })

    redisClient.on('end', () => {
      log({
        category: 'cacheClient|redis',
        message: 'Redis server is disconnected. cacheClient is terminated.',
        level: 'warn',
      })
      this.status = 'terminated'
    })

    redisClient.on('error', error => {
      log({
        category: 'cacheClient|redis',
        message: error,
        level: 'error',
      })
    })
  }

  /**
   * check and wait for cache client status to be either running or terminated
   * @returns {Promise<boolean>} is status 'running'
   */
  async isClientRunning(): Promise<boolean> {
    if (!this.client) {
      return false
    }
    return new Promise(resolve => {
      const timeout = this.option.statusCheckTimeout
      const delay = this.option.statusCheckDelay
      let duration = 0

      const checkStatusFn = () => {
        log({
          category: 'cacheClient|isClientRunning',
          message: `status checking | duration: ${duration} | client status: ${this.status}`,
          level: 'debug',
        })
        if (this.status === 'running') {
          return resolve(true)
        }
        if (this.status === 'terminated') {
          return resolve(false)
        }
        duration += delay
        if (duration >= timeout) {
          // swallow timeout
          log({
            category: 'cacheClient|isClientRunning',
            message: `function exceeds timeout | timeout: ${timeout} | duration: ${duration} | client status: ${this.status}`,
            level: 'warn',
          })
          return resolve(false)
        }
        if (duration < timeout) {
          setTimeout(checkStatusFn, delay)
        }
      }
      checkStatusFn()
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
  async proxy(originKey, message, execFunction, overrideOption = {}) {
    if (!originKey || !message || typeof execFunction !== 'function') {
      return
    }

    // add dev prefix to prevent key collision with production data
    const key = `${currentEnv}_${originKey}`

    const isClientRunning = await this.isClientRunning()
    if (!isClientRunning) {
      log({
        category: 'cacheClient|proxy',
        message: `cache MISS: cacheClient is disabled. | ${message} | key: ${key}`,
      })
      const data = await execFunction()
      return data
    }

    try {
      const cacheData = await this.client.get(key)
      if (cacheData) {
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
      message: `cache MISS | ${message} | key: ${key}`,
    })
    const data = await execFunction()
    try {
      if (data) {
        await this.client.set(
          key,
          data,
          Object.assign({ ttl: this.option.ttls.default }, overrideOption)
        )
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
