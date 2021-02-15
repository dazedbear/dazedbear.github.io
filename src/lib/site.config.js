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
  meta: {
    title: 'DazedBear Studio',
    description: 'Web。Digital Music。Self Development',
    image: '',
  },
  navigation: [
    { label: 'Home', page: '/' },
    // { label: 'Demos', page: '/demo' },
    // { label: 'Memos', page: '/memo' },
    { label: 'Blog', page: '/blog' },
  ],
  notion: {
    token: process.env.NOTION_TOKEN,
    // you can insert any notion index page you need here.
    blog: {
      keyName: 'BLOG_INDEX_ID',
      pageId: normalizeId(process.env.BLOG_INDEX_ID),
      collectionViewName: 'Publish',
    },
    memo: {
      keyName: 'MEMO_INDEX_ID',
      pageId: normalizeId(process.env.MEMO_INDEX_ID),
      collectionViewName: null,
    },
    demo: {
      keyName: 'DEMO_INDEX_ID',
      pageId: normalizeId(process.env.DEMO_INDEX_ID),
      collectionViewName: null,
    },
    requiredEnv: ['NOTION_TOKEN', 'BLOG_INDEX_ID'],
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
    siteFooterIcon: {
      github: true,
      linkedin: false,
      soundcloud: false,
      youtube: false,
    },
    articleFooter: {
      facebookLikeButtons: false,
      facebookComments: false,
      likecoin: false,
    },
  },
}
