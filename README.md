# Dazedbear Studio 個人工作室

[![Build Status](https://travis-ci.org/dazedbear/dazedbear.github.io.svg?branch=develop)](https://travis-ci.org/dazedbear/dazedbear.github.io)

這是 dazedbear 的個人網站，包含學習筆記、作品 demo，主題涵蓋 Web Development、作曲、數位音樂、音樂科技等。

| Repo | Description |
| -- | -- |
| [dazedbear.github.io](https://github.com/dazedbear/dazedbear.github.io) | 個人網站，展示 demo、Medium 文章 |
| [applets](https://github.com/dazedbear/applets) | 開發庫，包含 UI 元件、模組、API 文件 |
| [apim](https://github.com/dazedbear/apim) | Swagger 展示所有開發的 Back-end API |

## Tech Stack

- [facebook/docusaurus](https://docusaurus.io/en/)
- [travis ci](https://travis-ci.org/)
- [unsplash photo](https://unsplash.com/)

## Develop

請在 `develop` 分支開發，會自動 CI 部署到 `master` 分支。

| path | description |
| -- | -- |
| `website/blog/` | 放置發佈的文章 |
| `docs/demo/` | 放置每個作品的介紹頁 |
| `docs/note-*/` | 放置不同系列筆記文章 |
| `diagram/` | 放置來自 [draw.io](https://www.draw.io) 的各種圖工作檔 |
| `website/sidebar.json` | 作品、系列筆記的左側選單設定檔 |
| `website/siteConfig.js` | 網站的所有設定，包含引用的 js 與 css |