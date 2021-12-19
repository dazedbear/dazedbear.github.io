const { cdnHost, notion, website } = require('./site.config')
const get = require('lodash/get')

const validateRequiredEnv = () => {
  const notionPageConfigs = notion.pages || {}
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
    const currentEnv = process.env.NEXT_PUBLIC_APP_ENV || 'production'
    return {
      beforeFiles: [
        // These rewrites are checked after headers/redirects
        // and before all files including _next/public files which
        // allows overriding page files
        {
          // for failsafe page debug
          source: '/',
          destination: `https://${cdnHost}/${get(website, [
            currentEnv,
            'hostname',
          ])}/index.html`,
          has: [{ type: 'query', key: 'fs', value: '1' }],
        },
        {
          // for failsafe page debug
          source: '/:path*',
          destination: `https://${cdnHost}/${get(website, [
            currentEnv,
            'hostname',
          ])}/:path*.html`,
          has: [{ type: 'query', key: 'fs', value: '1' }],
        },
      ],
      afterFiles: [
        // These rewrites are checked after pages/public files
        // are checked but before dynamic routes
      ],
      fallback: [
        // These rewrites are checked after both pages/public files
        // and dynamic routes are checked
        {
          // failsafe page
          source: '/',
          destination: `https://${cdnHost}/${get(website, [
            currentEnv,
            'hostname',
          ])}/index.html`,
          has: [{ type: 'header', key: 'x-dazedbear-failsafe', value: '1' }],
        },
        {
          // failsafe page
          source: '/:path*',
          destination: `https://${cdnHost}/${get(website, [
            currentEnv,
            'hostname',
          ])}/:path*.html`,
          has: [{ type: 'header', key: 'x-dazedbear-failsafe', value: '1' }],
        },
      ],
    }
  },
}
