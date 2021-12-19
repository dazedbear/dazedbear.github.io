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

module.exports = {
  aws: {
    s3bucket: process.env.AWS_S3_BUCKET,
  },
  cache: {
    enable: process.env.NEXT_PUBLIC_APP_ENV !== 'development',
    host: 'redis-18768.c54.ap-northeast-1-2.ec2.cloud.redislabs.com',
    port: 18768,
    token: process.env.REDIS_TOKEN,
    ttls: {
      // seconds
      default: 60,
      sitemap: 86400,
      notionPage: 1800,
      previewImage: 86400 * 30,
    },
  },
  cdnHost: 'static.dazedbear.pro',
  splunk: {
    enable: false,
    // https://docs.splunk.com/Documentation/SplunkCloud/8.2.2105/Data/UsetheHTTPEventCollector#Send_data_to_HTTP_Event_Collector_on_Splunk_Cloud
    // https://github.com/splunk/splunk-javascript-logging/blob/master/splunklogger.js
    option: {
      batchInterval: 2500,
      host: `inputs.${process.env.SPLUNK_HEC_HOST}`,
      path: '/services/collector',
      port: 8088,
      protocol: 'https',
      maxBatchCount: 25,
      token: process.env.SPLUNK_HEC_TOKEN,
    },
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
    token: process.env.NOTION_TOKEN,
    // you can insert any notion index page you need here.
    pages: {
      article: {
        collectionId: normalizeId(process.env.ARTICLE_COLLECTION_ID),
        collectionViewId: normalizeId(process.env.ARTICLE_COLLECTION_VIEW_ID),
        enabled: true,
        navMenuTitle: 'Article 文章',
        pageId: normalizeId(process.env.ARTICLE_PAGE_ID),
        requiredEnv: [
          'ARTICLE_PAGE_ID',
          'ARTICLE_COLLECTION_ID',
          'ARTICLE_COLLECTION_VIEW_ID',
        ],
      },
      coding: {
        collectionId: normalizeId(process.env.CODING_COLLECTION_ID),
        collectionViewId: normalizeId(process.env.CODING_COLLECTION_VIEW_ID),
        enabled: true,
        navMenuTitle: 'Coding 程式',
        pageId: normalizeId(process.env.CODING_PAGE_ID),
        requiredEnv: [
          'CODING_PAGE_ID',
          'CODING_COLLECTION_ID',
          'CODING_COLLECTION_VIEW_ID',
        ],
      },
      'music-notebook': {
        collectionId: normalizeId(process.env.MUSIC_COLLECTION_ID),
        collectionViewId: normalizeId(process.env.MUSIC_COLLECTION_VIEW_ID),
        enabled: true,
        navMenuTitle: 'Music Notes 音樂筆記',
        pageId: normalizeId(process.env.MUSIC_PAGE_ID),
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
      host: `${process.env.HOST}:${process.env.PORT}`,
      hostname: process.env.HOST,
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
