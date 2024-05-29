const env = require('env-var')

// use commonJS format
const normalizeId = (id) => {
  if (!id) return id
  if (id.length === 36) return id
  if (id.length !== 32) {
    throw new Error(
      `Invalid blog-index-id: ${id} should be 32 characters long. Info here https://github.com/ijjk/notion-blog#getting-blog-index-and-token`
    )
  }
  return `${id.substr(0, 8)}-${id.substr(8, 4)}-${id.substr(12, 4)}-${id.substr(
    16,
    4
  )}-${id.substr(20)}`
}

// env-var cannot read `NEXT_PUBLIC_` prefix env variables on client-side
const currentEnv = process.env.NEXT_PUBLIC_APP_ENV || 'production'
const siteConfig = {
  aws: {
    s3bucket: env.get('AWS_S3_BUCKET').asString(),
  },
  bundleAnalysis: {
    enabled: env.get('BUNDLE_ANALYSIS').default('false').asBool(),
  },
  cache: {
    enable: env
      .get('CACHE_CLIENT_ENABLED')
      .default(`${currentEnv !== 'development'}`)
      .asBool(),
    forceRefresh: false, // global variable could be mutated by page routes
    token: env.get('CACHE_CLIENT_TOKEN').asString(),
    ttls: {
      // seconds
      default: 30,
      sitemap: 86400,
      notionPage: 86400,
      previewImage: 86400 * 30,
    },
    url: env.get('CACHE_CLIENT_API_URL').asString(),
  },
  cdnHost: 'static.dazedbear.pro',
  failsafe: {
    // AWS S3 upload limit rate: 3500 per sec, ref: https://docs.aws.amazon.com/zh_tw/AmazonS3/latest/userguide/optimizing-performance.html
    // concurrency limit to 30 since redis max connection is fixed to 30 based on the basic plan, ref: https://redis.com/redis-enterprise-cloud/pricing/
    concurrency: 15,
    host: 'failsafe.dazedbear.pro',
  },
  meta: {
    title: 'DazedBear Studio',
    description: 'Web。Music。Creative Coding',
    image: 'https://static.dazedbear.pro/website-thumbnail.png',
  },
  navigation: [
    {
      label: 'About',
      page: '/about',
      enabled: true,
    },
    {
      label: 'Music',
      page: '/music',
      enabled: true,
    },
    {
      label: 'Coding',
      page: '/coding',
      enabled: true,
    },
    {
      label: 'Article',
      page: '/article',
      enabled: true,
    },
  ],
  notion: {
    token: env.get('NOTION_TOKEN').asString(),
    // you can insert any notion index page you need here.
    pages: {
      about: {
        enabled: true,
        navMenuTitle: 'About 關於我',
        pageId: normalizeId(env.get('ABOUT_PAGE_ID').asString()),
        requiredEnv: ['ABOUT_PAGE_ID'],
        type: 'page',
      },
      article: {
        collectionId: normalizeId(env.get('ARTICLE_COLLECTION_ID').asString()),
        collectionViewId: normalizeId(
          env.get('ARTICLE_COLLECTION_VIEW_ID').asString()
        ),
        enabled: true,
        navMenuTitle: 'Article 文章',
        pageId: normalizeId(env.get('ARTICLE_PAGE_ID').asString()),
        requiredEnv: [
          'ARTICLE_PAGE_ID',
          'ARTICLE_COLLECTION_ID',
          'ARTICLE_COLLECTION_VIEW_ID',
        ],
        type: 'stream',
      },
      coding: {
        collectionId: normalizeId(env.get('CODING_COLLECTION_ID').asString()),
        collectionViewId: normalizeId(
          env.get('CODING_COLLECTION_VIEW_ID').asString()
        ),
        enabled: true,
        navMenuTitle: 'Coding 程式',
        pageId: normalizeId(env.get('CODING_PAGE_ID').asString()),
        requiredEnv: [
          'CODING_PAGE_ID',
          'CODING_COLLECTION_ID',
          'CODING_COLLECTION_VIEW_ID',
        ],
        type: 'stream',
      },
      music: {
        collectionId: normalizeId(env.get('MUSIC_COLLECTION_ID').asString()),
        collectionViewId: normalizeId(
          env.get('MUSIC_COLLECTION_VIEW_ID').asString()
        ),
        enabled: true,
        navMenuTitle: 'Music 音樂',
        pageId: normalizeId(env.get('MUSIC_PAGE_ID').asString()),
        requiredEnv: [
          'MUSIC_PAGE_ID',
          'MUSIC_COLLECTION_ID',
          'MUSIC_COLLECTION_VIEW_ID',
        ],
        type: 'stream',
      },
    },
    pagination: {
      enabled: false,
      firstLoadCount: 5,
      batchLoadCount: 5,
    },
    previewImages: {
      concurrency: Infinity,
      enable: false,
    },
  },
  pages: {
    index: {
      enabled: true,
      title: '首頁',
      page: '/',
    },
    maintain: {
      enabled: true,
      title: '頁面維護中',
      page: '/maintain',
    },
  },
  pageProcessTimeout: env
    .get('DISABLE_PAGE_PROCESS_TIMEOUT')
    .default('false')
    .asBool()
    ? 0
    : 3500,
  reduxCookiePersist: {
    enabled: false,
    stateSubTrees: [],
  },
  copyright: `Copyright © ${new Date().getFullYear()} DazedBear Studio`,
  communitySettings: {
    github: {
      profileBaseUrl: 'https://github.com',
      userName: 'dazedbear',
    },
    linkedin: {
      profileBaseUrl: 'https://www.linkedin.com/in',
      userName: 'dazedbear',
    },
    likecoin: {
      userId: 'dazedbear',
    },
    musicLogbook: {
      pageUrl:
        'https://dazedbear.notion.site/Music-Logbook-aaa71680b0a14cc894e3231e7284036a',
    },
    openprocessing: {
      profileBaseUrl: 'https://openprocessing.org/user',
      userName: '277076',
    },
    soundcloud: {
      profileBaseUrl: 'https://soundcloud.com',
      userName: 'dazedbear',
    },
    youtube: {
      channelBaseUrl: 'https://www.youtube.com',
      channelHash: '@dazedbearstudio',
    },
  },
  communityFeatures: {
    siteFooterIcon: [
      {
        name: 'github',
        enable: true,
      },
      {
        name: 'linkedin',
        enable: false,
      },
      {
        name: 'musicLogbook',
        enable: false,
      },
      {
        name: 'openprocessing',
        enable: false,
      },
      {
        name: 'soundcloud',
        enable: false,
      },
      {
        name: 'youtube',
        enable: false,
      },
    ],
    articleFooter: [
      {
        name: 'likecoin',
        enable: false,
      },
    ],
    facebookChat: {
      enable: true,
      pageId: '1835182753446962',
    },
  },
  searchSettings: {
    appId: 'EI9BA02F53',
    apiKey: '2203522d0fcaee3f8dca4c086edd254d',
    indexName: 'dazedbear',
  },
  trackingSettings: {
    googleTagManager: {
      enable: true,
      id: 'GTM-KS2L2F3',
    },
    microsoftClarity: {
      enable: true,
      id: '439pgcc9zo',
    },
    logRocket: {
      enable: true,
      id: 'dazedbear/dazedbear-studio-site',
    },
  },
  website: {
    development: {
      host: `${env.get('HOST').default('local.dazedbear.pro').asString()}:${env
        .get('PORT')
        .default('3000')
        .asString()}`,
      hostname: env.get('HOST').default('local.dazedbear.pro').asString(),
      protocol: 'http',
    },
    stage: {
      host: env.get('VERCEL_URL').default('stage.dazedbear.pro').asString(),
      hostname: env.get('VERCEL_URL').default('stage.dazedbear.pro').asString(),
      protocol: 'https',
    },
    production: {
      host: 'www.dazedbear.pro',
      hostname: 'www.dazedbear.pro',
      protocol: 'https',
    },
  },
}

siteConfig.currentEnv = currentEnv
siteConfig.currentWebsite = siteConfig.website[currentEnv]

module.exports = siteConfig
