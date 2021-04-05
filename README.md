# Dazedbear Studio

![cover](https://user-images.githubusercontent.com/8896191/113566781-f2782c00-963f-11eb-90da-8d3245c536f1.png)

This is dazedbear's personal website. There are some demo, memos, and articles here that that are related to web development, music composition, digital music, music technology, and so on.

## Screenshot

![screenshot](https://user-images.githubusercontent.com/8896191/113568505-43d5ea80-9643-11eb-973d-166888ed57f4.png)
![screenshot](https://user-images.githubusercontent.com/8896191/113568636-839cd200-9643-11eb-828d-94a329683172.png)
![screenshot](https://user-images.githubusercontent.com/8896191/113568615-7bdd2d80-9643-11eb-8bf3-0996ff3b42ed.png)

## Tech Stack

- [Notion](https://www.notion.so/) - use it as headless CMS inspired by the below tmeplates
  - [transitive-bullshit/nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit)
    - [NotionX/react-notion-x](https://github.com/NotionX/react-notion-x) for fetching data from Notion then rendering posts
    - [preview image](https://github.com/transitive-bullshit/nextjs-notion-starter-kit#preview-images) to generate image placeholder with lqip.
  - [ijjk/notion-blog](https://github.com/ijjk/notion-blog)
    - [filesystem cache](https://github.com/ijjk/notion-blog/commit/5955d77b7c26cc22086702885674f1db2f18314d) idea that we use [cache-manager](https://www.npmjs.com/package/cache-manager) and [node-cache-manager-fs-hash](https://github.com/rolandstarke/node-cache-manager-fs-hash) to implement instead
- [Next.js](https://nextjs.org/) - React core framework
  - [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration) to serve dynamic data from Notion.
- [Redux](https://redux.js.org/) - State management
  - [@reduxjs/toolkit](https://redux-toolkit.js.org/)
  - [react-redux](https://react-redux.js.org/)
- [Vercel](https://vercel.com/) - CI/CD service
- [Tailwind CSS](https://tailwindcss.com/) - utility-first css framework
- Tracking
  - [Google Analytics](https://analytics.google.com/analytics/web/#/)
  - [Microsoft Clarity](https://clarity.microsoft.com/) - Free Heatmaps & Session Recordings
  - [LogRocket](https://logrocket.com/) - Modern Frontend Monitoring and Product Analytics
- Community
  - [Likecoin button](https://liker.land/)
  - [Facebook like button](https://developers.facebook.com/docs/plugins/like-button)
