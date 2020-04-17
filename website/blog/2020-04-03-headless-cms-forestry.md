---
unlisted: true
title: "[DRAFT] 串接 Headless CMS Forestry 心路歷程"
status: Idea

---
![Cover](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/0DB65523-3BE4-4535-AD17-6E6C0C35038E.png)

趁著連假的慣例來還還技術債，玩一些平常沒時間碰的新東西。本來打算要把 blog 主要的 library [docusaurus](https://docusaurus.io/) migrate 到 v2 版本以便擁有更多自訂彈性，但發現它還沒正式 stable 便暫時作罷。事不宜遲，那就來介紹這次的工事：導入 CMS 優化寫文章的流程。

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

其實如果你不需要自建圖床的話，使用 hackmd 是相當便利直覺的方案，不需要開 IDE 寫文章再 commit，用它的服務就能一次解決。不過對我來說，這樣反而有點小繁瑣，所以才會考慮：是不是能有一個後台集中管理? 為此我們需要的就是 CMS (Content Management System) 系統。

## CMS 介紹

現有的 CMS 服務其實很多種，根據我的理解大致分成幾個類型：

1. Git-based CMS：僅提供管理後台，設定和文章存在自行設定的 Github Repo 中，適合網站 content 管理。
2. [Headless CMS](https://www.fansysoft.com/blogs/-/asset_publisher/CWuRKonAWio8/blog/headless-cm-1)：提供管理後台、自動產生的 API 介面 (RESTful or GraphQL)，文章和設定託管在服務供應商 (cloud) 或者自架伺服器 (self-hosted)，適合跨裝置/跨媒體的 content 集中管理。有些服務也提供 A/B Test、寄信等豐富的 Extensions/Add-ons。
3. Monolithic CMS：提供 Database、Server、管理後台、Extensions/Plugins 等整套服務，文章和設定都存在自己的 Database 當中。(ex: [Wordpress](https://zh-tw.wordpress.com/))。

其中第 1、2 種 CMS 由於只有管理資料，必須自己另外建前台頁面來顯示文章，經常會搭配 Static Site Generator (SSG) 使用。

### Static Site Generator (SSG)

產生靜態網站的 Libraries/Services，會解析寫好的文章檔案並打包成包含 JS/CSS/HTML 的靜態 Artifact 方便部署到 CDN。每一款 SSG 支援的文章 render 方式都不同，大致可分成三種類型：

1. 文章資料全部打包進靜態 HTML，完全不需要 client side fetch
2. Single Page Application (SPA)，需要靠 client side fetch 拉文章資料
3. 以上都支援

你所選用的 SSG 會影響到可搭配的 CMS 選擇，若該 SSG 只支援第 1 種方式，要使用 Headless CMS 就必須自己會再寫 Javascript fetch 文章並動態加到 HTML 中，這通常有點麻煩，這時候能選用的就是支援 parse 現有網站 repo 的 Git-based CMS。

* [Hugo](https://gohugo.io/)
* [Hexo](https://hexo.io/)
* [Gatsby.js](https://www.gatsbyjs.com/)
* [Jekyll](https://jekyllrb.com/)
* [Next.js](https://nextjs.org/)
* [Nuxt.js](https://nuxtjs.org/)

### Headless CMS

因為服務種類真的非常多，我這邊就只挑了一兩款有 free plan 的服務試玩看看，有興趣可以參考這篇 [Picking a back-end for GatsbyJS](https://www.gatsbyjs.org/blog/2018-2-6-choosing-a-back-end/) ([中譯](https://www.twblogs.net/a/5bf88da1bd9eee18cf8acdfd)) 來了解其他的服務。

* [Cosmic JS](https://www.cosmicjs.com/) (cloud)
* [Contentful](https://www.contentful.com/) (cloud)
* [strapi](https://strapi.io/) (self-hosted)
* [DatoCMS](https://www.datocms.com/)
* [Sanity](https://www.sanity.io/)
* [Prismic](https://prismic.io/) (cloud)
* [GraphCMS](https://graphcms.com/)
* [Cockpit](https://getcockpit.com/)

![](https://user-images.githubusercontent.com/8896191/78230154-89794800-7503-11ea-9a34-3dcf13f2c0b8.png)

### Git-based CMS

這類型的 CMS 由於就是在 github repo 加入設定檔而已，通常可以無痛導入現有的網站，適合 deployment 只支援 static HTML build 的 SSG 使用。管理後台入口可以選擇放在自己網站上，或者是服務提供的 console 介面。由於它並不會自動產生 API 介面，有跨裝置管理 content 需求就不適合採用。

* [Netlify CMS](https://www.netlifycms.org/)
* [Forestry](https://forestry.io/)

### 同時整合 SSG 和 CMS 的服務

有些服務像是提供懶人包一樣，幫你一次處理好建站的所有事情包含：新增 git repo、選擇並設定喜歡的模板與 SSG、選擇與設定喜歡的 CMS、內建 CI build 與 webhook、整合 Google Analytics 等 Tracking 服務 ... 等。讓你不需要寫任何一行 code 就能產出符合 [JAMStack](https://www.gatsbyjs.org/docs/glossary/jamstack/) 精神的網站。這些服務單純只是將各種 stack 整合在一起，實際上要寫文章或者調設定還是得回到各個服務處理。

* [Stackbit](https://www.stackbit.com/)
* [Gastby Cloud](https://www.gatsbyjs.com/cloud/)
* [Netilify](https://www.netlify.com/)

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/stackbit-preview.png)

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/stackbit-preview-2.png)

## 新的解決方案

看了各種的 CMS 服務以後，我大概整理了一些需求方便挑選：

* 可以自訂圖片上傳空間 (AWS S3)、管理全部圖片
* 可以使用 Markdown 撰寫/預覽文章 (WYSIWYG editor)
* 文章可以切換草稿/發布的狀態
* 不需要收費
* 不需要管理 server

再加上 Blog 現在使用的 SSG 是 Facebook 開源的技術文件 SSG [Docusaurus](https://docusaurus.io/)，它的 deployment 只支援 build static HTML，因此我只能從 Git-based CMS 裡面的服務來挑。由於 Netlify CMS 設定上似乎看起來比較複雜，我最終挑了 Forestry 來做嘗試。

### Forestry 安裝

安裝其實滿簡單的，照著步驟做就會把 Forestry 設定檔寫到你的 Github Rope 中。

Step 1：首先選擇你所使用的 SSG。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/install-step-1.png)

Step 2：選擇你所使用的版本控制庫 Version Control System 取得 OAuth 授權。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/install-step-2.png)

Step 3：選擇要導入的 Repo 和未來要用來讀取文章與 commit 的分支。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/install-step-3.png)

Step 4：稍等一下就進入 Dashboard 完成基本安裝。此時可以回到你的 Github Repo 會看到多了一個放設定檔的 `.forestrty` 的資料夾。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/install-step-4.png)

Step 5：下一步就是進去 Settings 設定後台左側的選單，設定看起來都滿清楚的就不細講了。此外還可以設定 URL、後台 Logo 等。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/install-dashboard-finish.png)

### Forestry 文章列表

文章列表大約長這樣，還算滿清楚，也有搜尋功能，這邊可以調整要顯示的欄位，不過可惜的是不太好用，沒辦法同時顯示文章標題、日期、發布 / 草稿等狀態。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/install-articles.png)

### Forestry 文章編輯器

撰寫文章的編輯器畫面長這樣，左半邊是 Front Matter 設定，也就是一般文章最上面會放的 Yaml 設定，這對 SSG 來說很重要，它們會用這些欄位來做到很多功能，像我自己就只設定兩個欄位：標題、發布/隱藏。右半邊是 WYSIWYG editor，支援 Markdown 撰寫與預覽，比較可惜的是它沒有支援 Table，雖然可以透過新增 Snippet 來達成但效果不太好。另外就是中間的那條分隔線是沒辦法拖動的，因此寫文章的空間就有限。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/install-editor.png)

### Forestry Preview 功能設定

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/install-preview.png)

### Forestry Media 自訂上傳設定

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/install-asset.png)

Forestry 支援幾種 Media 自訂上傳：

* 直接存在 Git Repo
* AWS S3
* Cloudinary
* Netlify Large Media

設定 AWS S3 其實滿簡單的：

* S3 新增一個 bucket，開啟 Public Read 權限
* IAM 新增一個 Forestry 專用的 Headless User
* 新增一個 Policy 讓 Headless User 只能對你要上傳的 S3 bucket 有權限操作
* 把 Key 和 Token 貼回 Forestry 後台的設定就完成了

其他詳細設定方式請直接參閱[官方文件](https://forestry.io/docs/media/)。

### 

#### 避免 Trigger 多餘的 CI Build

1. [travis ci condition build](https://docs.travis-ci.com/user/conditional-builds-stages-jobs/#testing-conditions)

#### 

### 踩到的雷

1. Front Matter 介紹 & FM title 檔名衝突 (YYYY-_MM-_DD- prefix) 導致 build 不過問題

## 小結