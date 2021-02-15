const siteConfig = require('./src/lib/site.config')
const warnOrError =
  process.env.NODE_ENV !== 'production'
    ? console.warn
    : msg => {
        throw new Error(msg)
      }

const validateRequiredEnv = (envList = []) => {
  envList.forEach(name => {
    if (!process.env[name]) {
      warnOrError(
        `\n${name} is missing from env, this will result in an error\n` +
          `Make sure to provide one before starting Next.js`
      )
    }
  })
}

validateRequiredEnv(siteConfig.notion.requiredEnv)

module.exports = {
  target: 'experimental-serverless-trace',

  webpack(cfg, { dev, isServer }) {
    // only compile build-rss in production server build
    if (dev || !isServer) return cfg

    // we're in build mode so enable shared caching for Notion data
    process.env.USE_CACHE = 'true'
    return cfg
  },
}
