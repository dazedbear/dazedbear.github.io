const env = require('env-var')

// use commonJS format
const normalizeId = id => {
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

const currentEnv = env
  .get('NEXT_PUBLIC_APP_ENV')
  .default('production')
  .asString()
module.exports = {
  aws: {
    s3bucket: env.get('AWS_S3_BUCKET').asString(),
  },
  cache: {
    enable: env
      .get('CACHE_CLIENT_ENABLED')
      .default(`${currentEnv !== 'development'}`)
      .asBool(),
    host: 'redis-18768.c54.ap-northeast-1-2.ec2.cloud.redislabs.com',
    port: 18768,
    token: env.get('REDIS_TOKEN').asString(),
    ttls: {
      // seconds
      default: 60,
      sitemap: 86400,
      notionPage: 1800,
      previewImage: 86400 * 30,
    },
    connectionRetriesDelay: 50, // redis server connection retries delay (ms)
    connectionMaxRetries: 1, // redis server connection retries
    connectionTimeout: 500, // redis server connection timeout (ms)
    maxRetriesPerCommandRequest: 1, // each redis command connection retries
    statusCheckDelay: 50, // delay time for each connection status checks (ms)
    statusCheckTimeout: 1000, // timeout for connection status checks (ms)
  },
  cdnHost: 'static.dazedbear.pro',
  currentEnv,
  failsafe: {
    // AWS S3 upload limit rate: 3500 per sec, ref: https://docs.aws.amazon.com/zh_tw/AmazonS3/latest/userguide/optimizing-performance.html
    // concurrency limit to 30 since redis max connection is fixed to 30 based on the basic plan, ref: https://redis.com/redis-enterprise-cloud/pricing/
    concurrency: 15,
    host: 'failsafe.dazedbear.pro',
  },
  meta: {
    title: 'DazedBear Studio',
    description: 'Web。Digital Music。Self Development',
    image: '',
  },
  navigation: [
    {
      label: 'Music',
      page: '/music',
      theme: 'modern',
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
      },
      'music-notebook': {
        collectionId: normalizeId(env.get('MUSIC_COLLECTION_ID').asString()),
        collectionViewId: normalizeId(
          env.get('MUSIC_COLLECTION_VIEW_ID').asString()
        ),
        enabled: true,
        navMenuTitle: 'Music Notes 音樂筆記',
        pageId: normalizeId(env.get('MUSIC_PAGE_ID').asString()),
        requiredEnv: [
          'MUSIC_PAGE_ID',
          'MUSIC_COLLECTION_ID',
          'MUSIC_COLLECTION_VIEW_ID',
        ],
      },
    },
    pagination: {
      enabled: false,
      firstLoadCount: 5,
      batchLoadCount: 5,
    },
    previeImages: {
      concurrency: Infinity,
      enable: false,
    },
  },
  pages: {
    index: {
      enabled: true,
      page: '/',
    },
    music: {
      // should always be 4 blocks
      blocks: [
        {
          title: 'Demos',
          description: '音樂編曲、創作片段',
          link: 'https://soundcloud.com/dazedbear',
        },
        {
          title: 'Videos',
          description: '演出紀錄、Cover 影片',
          link: 'https://www.youtube.com/channel/UCvyYCMFjUbcHtZhnC-VGwHw',
        },
        {
          title: 'Sheets',
          description: '創作、採譜樂譜',
          link:
            'https://www.noteflight.com/profile/9a486122ae3cc1fbf78bb973e280f8cc35f67e27',
        },
        {
          title: 'Notes',
          description: '音樂筆記',
          link: '/music-notebook',
        },
      ],
      enabled: true,
      page: '/music',
    },
    maintain: {
      enabled: true,
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
    facebook: {
      facebookAppId: '164758098310813',
    },
    likecoin: {
      userId: 'dazedbear',
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
      channelBaseUrl: 'https://www.youtube.com/channel',
      channelHash: 'UCvyYCMFjUbcHtZhnC-VGwHw',
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
        name: 'openprocessing',
        enable: false,
      },
      {
        name: 'soundcloud',
        enable: true,
      },
      {
        name: 'youtube',
        enable: true,
      },
    ],
    articleFooter: [
      {
        name: 'facebookLikeButtons',
        enable: true,
      },
      {
        name: 'likecoin',
        enable: true,
      },
      {
        name: 'facebookComments',
        enable: false,
      },
    ],
  },
  trackingSettings: {
    googleAnalytics: {
      enable: true,
      id: 'G-J8DQ8XDQ71', // GA4 id: G-J8DQ8XDQ71, current id: UA-83233420-3
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
      host: `${env
        .get('HOST')
        .default('local.dazedbear.pro')
        .asString()}:${env
        .get('PORT')
        .default('3000')
        .asString()}`,
      hostname: env
        .get('HOST')
        .default('local.dazedbear.pro')
        .asString(),
      protocol: 'http',
    },
    stage: {
      host: 'stage.dazedbear.pro',
      hostname: 'stage.dazedbear.pro',
      protocol: 'https',
    },
    production: {
      host: 'www.dazedbear.pro',
      hostname: 'www.dazedbear.pro',
      protocol: 'https',
    },
  },
}
