import cacheManager from 'cache-manager'
import fsStore from 'cache-manager-fs'
import util from 'util'

const storeMap = {
  fs: {
    store: fsStore,
    storeOptions: {
      ttl: 86400 * 365, // seconds
      maxsize: 0, // unlimit size
      path: '.next/cache/application',
      preventfill: false, // load existing cache file first
    },
  },
}

const storeType = 'fs'
const cacheClient = cacheManager.caching({
  store: storeMap[storeType].store,
  ...storeMap[storeType].storeOptions,
})

// manually promisify since node-cache-manager-fs only support node.js style callback
// https://github.com/hotelde/node-cache-manager-fs/blob/master/index.js
if (storeType === 'fs') {
  const methods = [
    'del',
    'zipIfNeeded',
    'set',
    'get',
    'keys',
    'reset',
    'cleancache',
    'initializefill',
    'freeupspace',
    'freeupspacehelper',
  ]
  methods.forEach(method => {
    if (typeof cacheClient[method] === 'function') {
      cacheClient[method] = util.promisify(cacheClient[method])
    }
  })
}

export default cacheClient
