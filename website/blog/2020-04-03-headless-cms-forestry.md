---
unlisted: true
title: "[DRAFT] 串接 Headless CMS Forestry 心路歷程"
status: Idea

---
![Cover](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/0DB65523-3BE4-4535-AD17-6E6C0C35038E.png)

趁著連假的慣例來還還技術債，玩一些平常沒時間碰的新東西。本來打算要把 blog 主要的 library docusaurus migrate 到 v2 版本以便擁有更多自訂彈性，但發現它還沒正式 stable 便暫時作罷。事不宜遲，那就來介紹這次的工事：導入 CMS 優化寫文章的流程。

<!-- truncate -->

## 舊的解決方案

這次要解決的問題是「文章撰寫流程的優化」，那先介紹之前使用哪些工具服務來寫出這些文章的吧！

### 文章撰寫：Hackmd.io

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/hackmd-write.png "hackmd")

先前我使用 [hackmd](https://hackmd.io/) 當作主要的書寫工具，文章寫好就儲存為新版本，透過 [Github 同步功能](https://hackmd.io/c/tutorials-tw/%2Fs%2Flink-with-github-tw) 將文章 commit 回 blog 的 repo。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/hackmd-version.png "建立 version")

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/hackmd-push.png)

這個特定分支的 commit 會觸發 Travis CI 進行部署，於是新文章就可以自動部署到網站上。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/travis-ci.png)

### 靜態資源：AWS S3

其實 hackmd 本身有串接 [imgur](https://imgur.com/) 的圖床服務，只要把檔案拖拉到編輯區域就能上傳。只是我個人對於這個服務印象不好，再加上除非你有買私有團隊的收費方案，否則檔案會被放在某個公開的空間中，如果想刪掉圖片會滿麻煩的。因此才會自建一個 AWS S3 bucket 存放圖片，每次需要時就得登入 AWS console 手動上傳圖片、修改公開閱覽權限、最後複製連結貼到 hackmd 當中。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-s3-asset.png)

### 對 CMS 的需求

其實如果你不需要自建圖床的話，使用 hackmd 是相當便利直覺的方案，不需要開 IDE 寫文章再 commit，用它的服務就能一次解決。不過對我來說，這樣反而有點小繁瑣，所以才會考慮：是不是能有一個後台集中管理? 為此我們需要的就是 CMS (Content Management System) 系統，最具代表性的就屬 Wordpress 了。

想像中需求會有：

* 可以自訂圖片上傳空間、管理全部圖片
* 可以使用 Markdown 撰寫/預覽文章 (WYSIWYG editor)
* 文章可以切換草稿/發布的狀態
* 不需要收費
* 不需要管理 server

那接下來介紹一下常見的 CMS 解決方案組合吧！

## CMS 解決方案組合

現有的 CMS 相關服務其實很多種，根據我的理解大致分成幾個類型：

1. Commit-Based Headless CMS：僅提供管理後台，設定和文章存在額外設定的 VSC (Version Control System)(ex: Github、Gitlab) 中。
2. Server-Based Headless CMS：提供管理後台、API Server 提供自動產生的 API 介面 (RESTful/GraphQL)，文章和設定存在額外設定的 Database (ex: MongoDB) 或 VCS 中，亦有包含託管文章與設定的服務。
3. All in one CMS：提供 Database、Server、管理後台、擴充功能等，文章和設定都存在自己的 Database 當中。(ex: Wordpress)。

其中第 1、2 種 CMS 只有提供資料管理，差別在儲存方式不同、是否需要 server，必須自己另外建前台頁面來顯示，常見會搭配 Static Site Generator (SSG)。

來稍稍介紹一下有哪些服務吧！

### Static Site Generator (SSG)

* [Hugo](https://gohugo.io/)
* [Hexo](https://hexo.io/)
* [Gatsby.js](https://www.gatsbyjs.com/)
* [Jekyll](https://jekyllrb.com/)
* [Next.js](https://nextjs.org/)
* [Nuxt.js](https://nuxtjs.org/)

### Headless CMS (commit-based)

* Forestry

### Headless CMS (server-based)

![](https://user-images.githubusercontent.com/8896191/78230154-89794800-7503-11ea-9a34-3dcf13f2c0b8.png)

* [Cosmic JS](https://www.cosmicjs.com/)
* [strapi](https://strapi.io/)
* Netlify CMS
* Contentful
* DatoCMS
* Sanity
* Prismic

### 同時整合 SSG 和 CMS 的服務

有些服務像是提供懶人包一樣，幫你一次處理好建站的所有事情包含：新增 git repo、選擇並設定喜歡的模板與 SSG、選擇與設定喜歡的 CMS、內建 CI build 與 webhook、整合 Google Analytics 等 Tracking 服務 ... 等。讓你不需要寫任何一行 code 就能產出符合 [JAMStack](https://www.gatsbyjs.org/docs/glossary/jamstack/) 精神的網站。

* [Gastby Cloud](https://www.gatsbyjs.com/cloud/)
* [Stackbit](https://www.stackbit.com/)
* [Netilify](https://www.netlify.com/)

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/stackbit-preview.png)

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/截圖 2020-04-18 上午12.03.46.png)

1. 可用服務選項、特點介紹
2. 服務評比文章：[https://www.twblogs.net/a/5bf88da1bd9eee18cf8acdfd](https://www.twblogs.net/a/5bf88da1bd9eee18cf8acdfd "https://www.twblogs.net/a/5bf88da1bd9eee18cf8acdfd")

## 新的解決方案

### 選擇 Forestry 的理由

1. 確認自己的 SSG 是屬於哪種類型 (API or build)
2. 支援 Markdown 的編輯器 (WYSIWYG editor)
3. 
   * WYSIWYG editor 可以撰寫並預覽 Markdown

   \- 可以自訂 media/asset 上傳的地點 (Github or AWS S3...)

   \- git based，不需要另外再架伺服器

### 串接與功能簡介

#### 基本設定

#### Front matter

#### Media 上傳設定

1. 串接 AWS S3 上傳 Media Asset

#### 避免 Trigger 多餘的 CI Build

1. [travis ci condition build](https://docs.travis-ci.com/user/conditional-builds-stages-jobs/#testing-conditions)

#### Preview 功能設定

### 踩到的雷

1. Front Matter 介紹 & FM title 檔名衝突 (YYYY-_MM-_DD- prefix) 導致 build 不過問題

## 小結

## 補充資料

\- [https://app.stackbit.com/dashboard](https://app.stackbit.com/dashboard "https://app.stackbit.com/dashboard")

\- [https://graphcms.com/](https://graphcms.com/ "https://graphcms.com/")

\- [https://getcockpit.com/](https://getcockpit.com/ "https://getcockpit.com/")

\- [https://strapi.io/](https://strapi.io/ "https://strapi.io/")