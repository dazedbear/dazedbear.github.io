const siteConfig = require('./src/lib/site.config')

const validateRequiredEnv = () => {
  const notionPageConfigs = siteConfig.notion.pages || {}
  const envList = Object.values(notionPageConfigs).reduce((list, config) => {
    if (
      config.enable &&
      config.requiredEnv &&
      Array.isArray(config.requiredEnv)
    ) {
      return list.concat(config.requiredEnv)
    }
    return list
  }, [])
  envList.forEach(name => {
    if (!process.env[name]) {
      throw new Error(
        `\n${name} is missing from env, this will result in an error\n` +
          `Make sure to provide one before starting Next.js`
      )
    }
  })
}

module.exports = {
  target: 'experimental-serverless-trace',

  webpack(cfg, { dev, isServer }) {
    validateRequiredEnv()

    // only compile build-rss in production server build
    if (dev || !isServer) return cfg

    // we're in build mode so enable shared caching for Notion data
    process.env.USE_CACHE = 'true'
    return cfg
  },
}
