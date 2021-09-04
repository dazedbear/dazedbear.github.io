# Dazedbear Studio

[![Semgrep Scan](https://github.com/dazedbear/dazedbear.github.io/actions/workflows/semgrep-analysis.yml/badge.svg?branch=main)](https://github.com/dazedbear/dazedbear.github.io/actions/workflows/semgrep-analysis.yml)

![cover](https://user-images.githubusercontent.com/8896191/113566781-f2782c00-963f-11eb-90da-8d3245c536f1.png)

This is dazedbear's personal website. There are some demo, memos, and articles here that that are related to web development, music composition, digital music, music technology, and so on.

## Screenshot

![screenshot](https://user-images.githubusercontent.com/8896191/113568505-43d5ea80-9643-11eb-973d-166888ed57f4.png)
![screenshot](https://user-images.githubusercontent.com/8896191/113568636-839cd200-9643-11eb-828d-94a329683172.png)
![screenshot](https://user-images.githubusercontent.com/8896191/113568615-7bdd2d80-9643-11eb-8bf3-0996ff3b42ed.png)

## Tech Stack

### Application

- [Notion](https://www.notion.so/) - use it as headless CMS inspired by the below tmeplates
  - [transitive-bullshit/nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit)
    - [NotionX/react-notion-x](https://github.com/NotionX/react-notion-x) for fetching data from Notion then rendering posts
    - [preview image](https://github.com/transitive-bullshit/nextjs-notion-starter-kit#preview-images) to generate image placeholder with lqip.
  - [ijjk/notion-blog](https://github.com/ijjk/notion-blog)
    - [filesystem cache](https://github.com/ijjk/notion-blog/commit/5955d77b7c26cc22086702885674f1db2f18314d) idea that we use [cache-manager](https://www.npmjs.com/package/cache-manager) and [node-cache-manager-fs-hash](https://github.com/rolandstarke/node-cache-manager-fs-hash) to implement instead
- [Next.js](https://nextjs.org/) - React core framework
  - [Server Side Rendering](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering) to serve dynamic data from Notion.
- [Redux](https://redux.js.org/) - state management
  - [@reduxjs/toolkit](https://redux-toolkit.js.org/)
  - [react-redux](https://react-redux.js.org/)
- [Tailwind CSS](https://tailwindcss.com/) - utility-first css framework
- Community
  - [Likecoin button](https://liker.land/)
  - [Facebook like button](https://developers.facebook.com/docs/plugins/like-button)

### SaaS

#### CI/CD

- [Vercel](https://vercel.com/) - application deployment and serving
- [Github Action](https://github.com/features/actions) - automatic scheduled jobs like sitemap generation, functional test..

#### Cache

- [Redis Enterprise Cloud](https://redislabs.com/redis-enterprise-cloud/overview/) - simple cache service

#### Tracking

- [Google Analytics](https://analytics.google.com/analytics/web/#/) - session signal tracking
- [Microsoft Clarity](https://clarity.microsoft.com/) - free heatmaps & session recordings

#### Monitoring

- [LogRocket](https://logrocket.com/) - Modern Frontend Session Monitoring and Product Analytics
- [SemaText](https://sematext.com/) - Application Logs Monitoring

#### Security

- [Semgrep](https://semgrep.dev/) - Static Application Analytics

## Development

```bash
# install dependency
$ npm install

# run local server
$ npm run dev

# run build
$ npm run build
```

### setup local development domain

```bash
$ sudo vim /etc/hosts

# append this line
127.0.0.1 local.dazedbear.pro
```

then visit the test site http://local.dazedbear.pro:3000
