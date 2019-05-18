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
  tagline: 'Web x Digital Music x Composing',
  url: 'https://dazedbear.github.io', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'dazedbear.github.io',
  organizationName: 'dazedbear',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  cname: 'dazedbear.pro',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {page: 'help', label: 'About'},
    {doc: 'doc1', label: 'Notes'},
    {doc: 'doc4', label: 'Demos'},
    {blog: true, label: 'Articles'},
  ],

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
    highlightColor: '#D41D47',
    footerColor: '#36324A',
  },

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

  // community setting
  twitter: false,
  twitterUserName: '',
  github: true,
  githubUserName: 'dazedbear',
  linkedin: true,
  linkedinUserName: 'dazedbear',
  soundcloud: true,
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
