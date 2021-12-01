const siteConfig = require('./site.config')

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
  images: {
    // domain allowlist for images with absolute urls
    // instead of embed external image url directly, re-upload to notion is better
    domains: ['images.unsplash.com', 'www.notion.so', 'dazedbear.notion.site'],
  },

  async rewrites() {
    // TODO: temp redirect for maintain page
    return [
      {
        source: '/(article|coding|music-notebook)(.*)',
        destination: '/maintain',
      },
    ]
  },
}
