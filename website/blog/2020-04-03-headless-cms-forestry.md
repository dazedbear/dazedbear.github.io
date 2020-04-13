---
unlisted: true
title: "[DRAFT] 串接 Headless CMS Forestry 心路歷程"
status: Idea

---

![Cover](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/0DB65523-3BE4-4535-AD17-6E6C0C35038E.png)

趁著連假的慣例來還還技術債，玩一些平常沒時間碰的新東西。本來打算要把 blog 主要的 library docusaurus migrate 到 v2 版本以便擁有更多自訂彈性，但發現它還沒正式 stable 便暫時作罷。事不宜遲，那就來介紹這次的工事：導入 CMS 優化寫文章的流程。

<!-- truncate -->

## 背景需求

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

### 需求

其實如果你不需要自建圖床的話，使用 hackmd 是相當便利直覺的方案，不需要開 IDE 寫文章再 commit，用它的服務就能一次解決。不過對我來說，這樣反而有點小繁瑣，所以才會考慮：是不是能有一個後台集中管理? 為此我們需要的就是 CMS (Content Management System) 系統，最具代表性的就屬 wordpress 了。

想像中需求會有：

* 上傳、管理全部圖片
* 可以使用 Markdown 撰寫文章
* 文章可以切換草稿/發布的狀態
* 不需要收費，也不需要管理 server

介紹 blog 串接 CMS 的過程

1. 可用服務選項、特點介紹
2. 選擇理由 & 串接 Forestry 過程
   1. Front Matter 介紹 & FM title 檔名衝突 (YYYY-_MM-_DD- prefix) 導致 build 不過問題
   2. [travis ci condition build](https://docs.travis-ci.com/user/conditional-builds-stages-jobs/#testing-conditions)
   3. 串接 AWS S3 上傳 Media Asset

採用 forestry.io，理由如下

\- WYSIWYG editor 可以撰寫並預覽 Markdown

\- 可以自訂 media/asset 上傳的地點 (Github or AWS S3...)

\- git based，不需要另外再架伺服器

補充資料

服務評比文章：[https://www.twblogs.net/a/5bf88da1bd9eee18cf8acdfd](https://www.twblogs.net/a/5bf88da1bd9eee18cf8acdfd "https://www.twblogs.net/a/5bf88da1bd9eee18cf8acdfd")

![](https://user-images.githubusercontent.com/8896191/78230154-89794800-7503-11ea-9a34-3dcf13f2c0b8.png)

\- [https://app.stackbit.com/dashboard](https://app.stackbit.com/dashboard "https://app.stackbit.com/dashboard")

\- [https://graphcms.com/](https://graphcms.com/ "https://graphcms.com/")

\- [https://getcockpit.com/](https://getcockpit.com/ "https://getcockpit.com/")

\- [https://strapi.io/](https://strapi.io/ "https://strapi.io/")