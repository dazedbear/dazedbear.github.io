/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
// const users = [
//   {
//     caption: 'User1',
//     // You will need to prepend the image path with your baseUrl
//     // if it is not '/', like: '/test-site/img/image.jpg'.
//     image: '/img/undraw_open_source.svg',
//     infoLink: 'https://www.facebook.com',
//     pinned: true,
//   },
// ];

const siteConfig = {
  title: 'DazedBear Studio', // Title for your website.
  tagline: 'Web。Digital Music。Self Development',
  url: 'https://www.dazedbear.pro', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // The CNAME for your website. It will go into a CNAME file when your site is built.
  cname: 'www.dazedbear.pro',

  // Used for publishing and more
  projectName: 'dazedbear.github.io',
  organizationName: 'dazedbear',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    // {page: 'about', label: 'About'},
    // {doc: 'note', label: 'Notes'},
    {doc: 'demo', label: 'Demos'},
    {href: 'https://www.notion.so/dazedbear/DazedBear-Memos-c9bcf1af4c7e43918af8bcebf8f79991', external: true, label: 'Memos'},
    {blog: true, label: 'Articles'},
    // {search: true},
  ],

  blogSidebarCount: 'ALL',
  blogSidebarTitle: {
    default: '近期文章',
    all: '所有文章'
  },

  // If you have users set above, you add it here:
  // users,

  /* path to images for header/footer */
  headerIcon: 'img/favicon.ico',
  footerIcon: 'img/favicon.ico',
  favicon: 'img/favicon.ico',

  /* Colors for website */
  colors: {
    primaryColor: '#584F8D',
    secondaryColor: '#8F5881',
    primaryHighlightColor: '#D41D47',
    secondaryHightlightColor: '#fecc4d',
    footerColor: '#36324A',
  },

  noIndex: false,
  gaTrackingId: 'UA-83233420-3',

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} DazedBear Studio`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // load css inserted into HTML head
  stylesheets: [],

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    'https://buttons.github.io/buttons.js',
    {
      src: 'https://use.fontawesome.com/releases/v5.8.2/js/all.js',
      defer: true,
      integrity: 'sha384-DJ25uNYET2XCl5ZF++U8eNxPWqcKohUUBUpKGlNLMchM7q4Wjg2CUpjHLaL8yYPH',
      crossOrigin: 'anonymous'
    }
  ],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/undraw_online.svg',
  twitterImage: 'img/undraw_tweetstorm.svg',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',

  // built-in facebook plugin/SDK has issue with configuration and old API version, so just disable it and use `blogSocialSection` instead
  // facebookAppId: '164758098310813',
  // facebookComments: true,

  // extend and customize social sections
  blogSocialSection: {
    facebookAppId: '164758098310813',
    facebookLikeButtons: true,
    facebookComments: true,
  
    // likecoin
    likecoinId: 'dazedbear',
  },

  // community setting
  twitter: false,
  twitterUserName: '',
  github: true,
  githubUserName: 'dazedbear',
  linkedin: false,
  linkedinUserName: 'dazedbear',
  soundcloud: false,
  soundcloudUserName: 'dazedbear',
  youtube: false,
  youtubeChannelHash: 'UCCOXh5_m0xjy24-rUu98xKg',

  // const
  githubProfileBaseUrl: 'https://github.com',
  linkedinProfileBaseUrl: 'https://www.linkedin.com/in',
  soundcloudProfileBaseUrl: 'https://soundcloud.com',
  youtubeChannelBaseUrl: 'https://www.youtube.com/channel',
};

module.exports = siteConfig;
