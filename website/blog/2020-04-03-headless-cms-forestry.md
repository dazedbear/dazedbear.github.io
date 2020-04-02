---
unlisted: true
title: ''
status: Idea

---
介紹 blog 串接 CMS 的過程

1. 簡述需求
2. 先前作法：開 S3 console, hackmd.io
3. 可用服務選項、特點介紹
4. 選擇理由 & 串接 Forestry 過程
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