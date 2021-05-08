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
  cache: {
    enable: true,
    host: 'redis-18768.c54.ap-northeast-1-2.ec2.cloud.redislabs.com',
    port: 18768,
    token: process.env.REDIS_TOKEN,
  },
  cdnHost: '',
  meta: {
    title: 'DazedBear Studio',
    description: 'Web。Digital Music。Self Development',
    image: '',
  },
  navigation: [
    {
      label: 'Home',
      page: '/',
    },
    {
      label: 'Article',
      page: '/article',
    },
  ],
  notion: {
    token: process.env.NOTION_TOKEN,
    // you can insert any notion index page you need here.
    pages: {
      article: {
        collectionViewId: normalizeId(process.env.ARTICLE_TABLE_VIEW_ID),
        enable: true,
        navMenuTitle: 'Article 文章',
        pageId: normalizeId(process.env.ARTICLE_TABLE_PAGE_ID),
        requiredEnv: ['ARTICLE_TABLE_PAGE_ID', 'ARTICLE_TABLE_VIEW_ID'],
      },
    },
    pageCacheTTL: 60, // seconds
    previeImages: {
      cacheTTL: 86400 * 30, // seconds, 1 month
      enable: true,
    },
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
    soundcloud: {
      profileBaseUrl: 'https://soundcloud.com',
      userName: 'dazedbear',
    },
    youtube: {
      channelBaseUrl: 'https://www.youtube.com/channel',
      channelHash: 'UCCOXh5_m0xjy24-rUu98xKg',
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
}
