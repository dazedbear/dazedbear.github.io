---
title: Swagger API Playground
sidebar_label: Swagger API Playground
---

先前為了交接所做的教學練習，以便讓前端練習介接 API。
主要使用 Swagger UI 建置 API 文件，採用 Open API 3.0 標準撰寫。

## Movie API

介接政府開放資料 API 並加上客製的一些商務邏輯，提供給前端使用。

背後實作細節如下

- AWS API Gateway：負責 API 管理 (key 派發與用量計算)、提供 mock 資料、觸發 Lambda 執行拉資料的程序
- Lambda 負責從 Layer 取得預置的 Raw Data 再經過排序等處理返回給上游的 API Gateway

## Preview

[API Doc](https://www.dazedbear.pro/apim/) | [Github Repo](https://github.com/dazedbear/apim)

<iframe src="https://www.dazedbear.pro/apim/" width="100%" height="500"></iframe>