---
title: Simple Login
sidebar_label: Simple Login
---

這個小專案是為了測試以下幾點，嘗試將 Restful API 常見的登入情境轉用 GraphQL 實踐。

- Finite State Machine (有限狀態機) 要如何應用在實際案例中
- 是否能無痛從 RESTful API 串接 GraphQL API

## Simple Login Client

主體由 React 開發，採用 FSM 發展較為成熟的套件 xstate 處理 UI 層畫面轉場，以及自動執行對應的資料處理。
API 介接則是直接用 fetch，不需要另外搭配 GraphQL 相關的套件。

<iframe src="https://codesandbox.io/embed/simple-login-client-xol6z4wlwp?fontsize=14&view=preview" title="Simple Login Client" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Simple Login Server

採用 Apollo GraphQL server，一併建立 GraphiQL 文件方便介接端查閱。

<iframe src="https://codesandbox.io/embed/l7lml00qwq?fontsize=14&hidenavigation=1&view=preview" title="Simple Login Server" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
