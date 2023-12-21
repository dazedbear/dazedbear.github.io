# Dazedbear Studio

[![Semgrep Scan](https://github.com/dazedbear/dazedbear.github.io/actions/workflows/semgrep-analysis.yml/badge.svg?branch=main)](https://github.com/dazedbear/dazedbear.github.io/actions/workflows/semgrep-analysis.yml) [![Failsafe Page Generation](https://github.com/dazedbear/dazedbear.github.io/actions/workflows/failsafe.yml/badge.svg)](https://github.com/dazedbear/dazedbear.github.io/actions/workflows/failsafe.yml) [![Playwright E2E Tests](https://github.com/dazedbear/dazedbear.github.io/actions/workflows/playwright.yml/badge.svg)](https://github.com/dazedbear/dazedbear.github.io/actions/workflows/playwright.yml) [![Release Note](https://github.com/dazedbear/dazedbear.github.io/actions/workflows/release-note.yml/badge.svg)](https://github.com/dazedbear/dazedbear.github.io/actions/workflows/release-note.yml)

![cover](https://user-images.githubusercontent.com/8896191/113566781-f2782c00-963f-11eb-90da-8d3245c536f1.png)

This is dazedbear's personal website. There are some demo, memos, and articles here that that are related to web development, music composition, digital music, music technology, and so on.

## Screenshot

![screenshot](https://user-images.githubusercontent.com/8896191/166281053-a1c515c2-8daf-4bdd-b60d-4c4939927a6f.png)
![screenshot](https://user-images.githubusercontent.com/8896191/166289192-8476a730-8987-4a29-b153-c5b41e9da1b4.png)
![screenshot](https://user-images.githubusercontent.com/8896191/166289018-5476036b-7396-4e44-bd6d-a5b85cb26c74.png)

## Tech Stack

### Application

- [Notion](https://www.notion.so/) - use it as headless CMS inspired by the below tmeplates
  - [transitive-bullshit/nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit)
    - [NotionX/react-notion-x](https://github.com/NotionX/react-notion-x) for fetching data from Notion then rendering posts
    - [preview image](https://github.com/transitive-bullshit/nextjs-notion-starter-kit#preview-images) to generate image placeholder with lqip.
  - [ijjk/notion-blog](https://github.com/ijjk/notion-blog)
    - [API response cache](https://github.com/ijjk/notion-blog/commit/5955d77b7c26cc22086702885674f1db2f18314d) that I use [@vercel/kv](https://vercel.com/docs/storage/vercel-kv) to implement instead
- [Next.js](https://nextjs.org/) - React core framework
  - [Server Side Rendering](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering) to serve dynamic data from Notion.
- [Redux](https://redux.js.org/) - state management
  - [@reduxjs/toolkit](https://redux-toolkit.js.org/)
  - [react-redux](https://react-redux.js.org/)
- [Tailwind CSS](https://tailwindcss.com/) - utility-first css framework
- Community
  - [Likecoin button](https://liker.land/)
  - [Facebook chat plugin](https://www.facebook.com/business/help/1524587524402327)

### SaaS

#### CI/CD

- [Vercel](https://vercel.com/) - application deployment and serving
- [Github Action](https://github.com/features/actions) - automatic scheduled jobs like e2e test

#### Cache

- [Vercel KV](https://vercel.com/docs/storage/vercel-kv) - serverless Redis database

#### Tracking

- [Google Analytics](https://analytics.google.com/analytics/web/#/) - session signal tracking
- [Microsoft Clarity](https://clarity.microsoft.com/) - free heatmaps & session recordings

#### Monitoring

- [Logalert](https://www.logalert.app/) - Monitor application logs and send email alerts
- [LogRocket](https://logrocket.com/) - Modern Frontend Session Monitoring and Product Analytics
- [SemaText](https://sematext.com/) - Application Logs Monitoring

#### Security

- [Semgrep](https://semgrep.dev/) - Static Application Analytics

#### Search

- [Algolia DocSearch](https://docsearch.algolia.com/) - Algolia Crawler + Search UI component for open source projects and technical blog

#### Testing

- [Jest](https://jestjs.io/) - Unit Test
- [Playright](https://playwright.dev/) - End-to-end Browser/API Test and Visual Test

## Development

```bash
# install dependency
$ npm install

# run local server
$ npm run dev

# run build
$ npm run build
```

### Setup local development domain

```bash
$ sudo vim /etc/hosts

# append this line
127.0.0.1 local.dazedbear.pro
```

then visit the test site http://local.dazedbear.pro:3000

### Environment variables for development

| name                         | default value         | required | description                                                                                                                                          |
| ---------------------------- | --------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| NEXT_PUBLIC_APP_ENV          | `development`         | no       | app env. available values: `development`, `stage`, `production`                                                                                      |
| HOST                         | `local.dazedbear.pro` | no       | app hostname                                                                                                                                         |
| PORT                         | `3000`                | no       | app port                                                                                                                                             |
| CACHE_CLIENT_ENABLED         | `false`               | no       | flag to turn on cache client                                                                                                                         |
| DEBUG                        | -                     | no       | useful flag to turn on debug mode for specific modules. ex: `DEBUG=ioredis:*`                                                                        |
| DISABLE_PAGE_PROCESS_TIMEOUT | `false`               | no       | notion pages will be redirected to failsafe pages if server-side rendering exceeds the page progress timeout (3500 ms). use this flag to turn it off |
| BUNDLE_ANALYSIS              | `false`               | no       | use this flag to turn on bundle analyzer to show the report after running `npm run build`                                                            |

## Testing

### Unit Test

| path                     | description         | tech stack                                                                             |
| ------------------------ | ------------------- | -------------------------------------------------------------------------------------- |
| `src/libs/server`        | helper, transformer | [jest](https://jestjs.io/)                                                             |
| `src/libs/client/hook`   | react hook          | [jest](https://jestjs.io/), [react hook](https://blog.logrocket.com/test-react-hooks/) |
| `src/libs/client/slices` | redux               | [jest](https://jestjs.io/), [redux](https://redux.js.org/usage/writing-tests)          |

### E2E: Browser Test

| path                 | description                                                                | tech stack                            |
| -------------------- | -------------------------------------------------------------------------- | ------------------------------------- |
| `tests/e2e/pages`    | e2e visual test for static and notion pages `src/pages`                    | [Playwright](https://playwright.dev/) |
| `tests/e2e/failsafe` | e2e visual test for static and notion failsafe generated pages `src/pages` | [Playwright](https://playwright.dev/) |

### E2E: API Test

| path            | description                             | tech stack                            |
| --------------- | --------------------------------------- | ------------------------------------- |
| `tests/e2e/api` | e2e test for API routes `src/pages/api` | [Playwright](https://playwright.dev/) |
