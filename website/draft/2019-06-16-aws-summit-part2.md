---
title: AWS Summit 2019
---

![Cover](https://user-images.githubusercontent.com/8896191/59561283-20e2dc80-9051-11e9-904a-ae18aeff1561.jpg)

今年按照慣例參與了 [2019 AWS Summit Taipei](https://aws.amazon.com/tw/summits/taipei/) ，比照往年是自己請特休去聽的，畢竟我是寫前端工作上真的碰到 Cloud 的機會很少，不太容易申請到公假。之前因為參與新產品開發跑 scrum 實行跨技能團隊 (Cross-Functional Team)，才有機會同時寫前端和架 pipeline 與 AWS 環境，現在則是根本碰不到，但是每個人都要有 DevOps 能力以便在 pipeline 除錯 (然後叫別人修)。

<!-- truncate -->

說句實話，前端和後端之間還是有點刻板印象，這次遇到以前同事們，他們大多是 BE 和 SA，看到我一個 FE 來聽都覺得我是來玩的，這樣很失禮欸其實！！對我來說才不分什麼 FE 和 BE，有能力靠自己從架部署環境到開發應用才是最重要的，DevOps 根本是現代軟體工程師的必備技能。

稍稍小抱怨了一下，來進入今天的正題~

## 聆聽的議程

議程一共分成兩天，上午是主題演講、下午是分軌主題進行。第一天是安排活動，包含：Dev Day 講座、尖峰學堂 (深入探討服務的 best practice)、備考訓練營等。第二天是官方的主題演講，下午分成六軌不同主題議程進行。這兩年聽下來大約是固定的 pattern，所以可以只挑自己關注的時段來參加即可，不用兩天都到。

這次我選擇至少 Level 200 - 300 的議程，主題大多圍繞在與開發者相關的 Serverless、DevOps，以及一些有趣的議題。我有聽的議程大致如下：

| Day 1 | Day 2 |
| --- | --- |
| Build in 2019: 建立分佈式、開放式、數據中心的人工智慧數據驅動平台 | 尖峰學堂:支援容器的服務和實現方式 |
| 客戶分享案例 - 遠傳擁抱 AI 與雲端的轉型進行式 | Keynote: Innovation at scale at AWS 雲端創新應用規模化 |
| 客戶分享案例 - 傳統企業前進雲端遇到的挑戰與經驗 (神腦) | 客戶案例分享 - Acer IT Digital Transformation |
| 客戶分享案例 - 91APP 如何利用 AWS 導入 DevOps 實戰雙11活動 | 客戶案例分享 - KKBox Innovation with Site Reliability Engineering |
| Dev Day - Building Reusable Serverless Apps | 輕鬆使用 AWS Elemental 媒體服務打造無伺服器 Live Streaming 與 VOD 平台：OTT 業者如何提供百萬用戶流暢的觀影體驗 |
| Dev Day - Essential capabilities behind Microservices | 深探 IaC (Infrastructure as Code, 基礎設施即程式碼 ) 在 AWS 上的應用 |
| Dev Day - Building Modern Distributed Applications | 在 MongoDB Cloud 上構建無服務器化應用 |
| Dev Day - Building Event-Driven Serverless Apps with AWS Event Fork Pipelines | 去中心化身分識別（Decentralized Identifiers) 如何改變著未來的網路型態？ |
| | Enabling an IoT service - from a behind the scene perspective |

順道提一下，每年 AWS Summit 後隔一兩週，都會整理當天的講座錄影和 slides 到 [ON-DEMAND](https://aws.amazon.com/tw/summits/taipei/on-demand/)，所以沒有參與到現場的朋友不用擔心，之後要複習也比較方便！

接下來就來細談今年收穫了什麼吧！

## CNCF 雲端原生運算基金會

![CNCF Logo](https://about.gitlab.com/images/case_study_logos/cncf-logo.png)

開始之前簡單提一下 [CNCF (Cloud Native Computing Foudation Report)](https://www.cncf.io/) 雲端原生運算基金會。

CNCF 的目的在於推動基於開源碼軟體的雲端原生運算，相關的專案必須同時符合容器化、動態調度與微服務導向等特性才會被接納，目前最新加入已認可的產品與品牌可以在 [Cloud Native Landscape](https://landscape.cncf.io/) 查詢。此外，每年都會發布一份 [CNCF Annual Report](https://www.cncf.io/cncf-annual-report-2018/) 描述當年重要的發展概況，並會舉辦 [KubeCon + CloudNativeCon](https://www.cncf.io/community/kubecon-cloudnativecon-events/) 等 conference。有興趣的朋友可以持續關注雲端最新的發展。

## Serverless

![monolith to microservices](https://d1.awsstatic.com/Developer%20Marketing/containers/monolith_1-monolith-microservices.70b547e30e30b013051d58a93a6e35e77408a2a8.png)

早年的軟體系統就像是巨型機器人一樣，裝載各式各樣的精良的配備，能夠完成許多任務目標，賺進許多鈔票。然而開發維護起來複雜度很高，線路、邏輯都糾纏在一起，沒有人知道這幾條線是幹嘛的，也沒人知道到底擁有多少配備裝在其中，更別提哪些模組彼此相依了。很容易弄壞一個地方就全壞，翻修的成本和風險都很高，畢竟是公司的命脈。因此，漸漸地近年來 Decouple 觀念崛起，伴隨著 Containerlized 的「東西壞掉就直接丟掉換新的，不要花時間去修它」的觀念，Serverless 逐漸成為顯學。

> Do you really need Microservices?

有些人聽到 serverless 覺得這是完美的解決方案，獲得一盞明燈啊！很開心地馬上下手拆解舊系統，然後就踩到一堆坑悲劇了，最後帶著懷疑人生的心情離職 (?)。因此，這次就有議程在探討「你真的需要 Microservices 嗎? 何時可以拆解? 有哪些拆解策略?」。

> Reusable Serverless

隨著開始實作 serverless 架構，大家也都在摸索 best practice。舉例來說：今天開發了一些共用工具庫想在 serverless application 間使用，或者是你在東京建了一套 serverless application，某天想在歐洲建立一模一樣的系統，是否有更可靠的方法達成? 因此借鏡了 package、container image、以及 Infrastructure as Code 的觀念，小到模組層級的 Lambda Layer、大到架構層級的 serverless application model (SAM)，讓它可以在不同 serverless application 專案中使用，實現所謂的 **Serverless Stack as Code**。

> Event Driven Architecture + Distributed System

隨著 serverless application 架構的產生，什麼樣的架構兼具容錯力與擴展彈性呢 ? 這裡提出了其中一種最佳實踐：**Event Driven Architecture**，運用 AWS SNS 和 SQS 的 Pub/Sub Model 解耦合，加入多條平行的 pipeline 以符合稽核、備份、分析、replay 等需求，你可以很簡單的 import SAM 來建立這套架構。若是搭上 Application Proxy 的觀念，運用 AWS 新服務組織你的分散式架構，更能確保高度可用性和彈性。

我們接下來針對這幾點來做詳細探討吧！

### Do you really need Microservices

#### 1. 使用 Domain Driven Design 定義微服務架構

開始動手規劃架構前，我們得先回歸根本：軟體最核心的目的是創造商業價值，我們設計架構的核心是為了提升軟體的應對能力，去支持快速的變化與成長的市場。因此先清楚了解公司或產品的「商業模式」非常重要，講者提出了一個方法：使用 Domain Driven Design 這個大型系統設計的方法論來達成目的。

試想幾個專案協作時常見的問題：

- 開發者、PM、行銷、營運聽不懂或誤解對方的想法，消耗大量的溝通成本
- 開發者常不知道為何要做這功能，對於使用者有什麼價值 (~~絕對不是因為 PM、PO 亂寫 user story~~)
- 開發者、甚至 PO 無法知道產品全貌，尤其在老舊系統上更是如此，也不利於功能、架構的劃分

因此，這個方法論提出幾個做法：

- 和**領域專家** (Domain Expert，可以簡略想成營運、行銷、該領域專家等利害關係人 Stakeholders) 開會
- 選擇一個使用者（領域知識專家）覺得重要的 scenario 溝通，定義出 **Domain Model** 和 **Domain Terms**。舉例來說：「使用者新增訂單」就是一個 Model，可能包含 User Story、商業流程圖等。
- 得到多個 Domain Model 後，討論這些 Model 適合用在什麼場合，定義出 **Bounded Context**。舉例來說：「新增訂單」、「取消訂單」會被歸在同一個 Bounded Context 「訂單管理」中，但是結帳的金流會是另一個「金流」的 Bounded Context。
- 按照商業價值劃分 subdomain，找到最有價值的部分著手
  - Core subdomains (核心部分，產品主要的競爭優勢，需投入最優秀的團隊)
  - Supporting subdomains (系統不可或缺的部分，但不會為產品帶來優勢，例如：監控)
  - Generic subdomains (系統需要的常見功能，市面上產品都有，不需要花太多投資，而是找適合廠商支援，像是：用第三方登入實作會員登入)
- 這些 Domain Model 會隨著時間推進而持續討論、修正，會持續迭代演化的 Model，和 agile 精神吻合

定義清楚以後，剩下就是怎麼將它對應到 Microservices。我的理解是：每一個 Microservices 代表一個 bounded context，好比說：訂單系統有一組 microservices，那每個 subdomain 可能就是其中的一個 function 或是 subservice，像是訂單的監控可能是 AWS CloudWatch 搭配 AWS X-Ray
 的 subservice。

TODO:
- Bussiness Boundary
  - Command
  - Aggrigate
  - Bussiness Event
  - Boundary Context = (C + A + E) * N 組
  - Value Driven

說實話這是我第一次聽到 DDD 的詞彙，概念還很模糊，所以這邊只會粗略地提一下，有可以參考這些資料與社群得到更多資訊，待日後我再另開一篇文章聊聊 DDD。

- [Domain-driven design - wiki](https://www.wikiwand.com/en/Domain-driven_design)
- [[Domain Driven Design] 簡介和為什麼你需要DDD](https://medium.com/%E7%A7%91%E6%8A%80%E6%96%B0%E6%83%B3/domain-driven-design-%E7%B0%A1%E4%BB%8B%E5%92%8C%E7%82%BA%E4%BB%80%E9%BA%BC%E4%BD%A0%E9%9C%80%E8%A6%81ddd-6cf4ceed6088)
- [[還少一本書] Domain-Driven Design](http://teddy-chen-tw.blogspot.com/2013/07/domain-driven-design.html)
- [Domain Driven Design (DDD Taiwan)](https://www.facebook.com/groups/dddtaiwan/)

#### 2. 何時才需要 Microservices

這邊我覺得講者有點草草帶過，反正就幾種時機點~~找到理由想用就用~~

- Independent Experiment：開發新的 POC (Proof of Concept) 產品作快速市場驗證
- An event to support (new brand or new event)：建立新的品牌
- Legacy code too long to build：維運老舊系統成本過高

我自己認為對新產品只要能「夠快速」進入市場、或是 POC 產品要 scale out 時就可以使用。對於舊系統來說需要評估投入的成本與效益，不建議「訂個一年的時間做 Migration」這種做法，通常下場都很悲劇，從最有商業價值的部分逐步翻新會是比較好的。後面會再提到有哪些執行策略可以選擇。

#### 3. 可能挑戰

TODO:

- Decompose for agility (priority, customer expection)
- Don't know explicit Bpundary (dealing with transaction, service..)
- How to dive & conquer (by noun, organization, experiment)
- Resource allocation (self employee, out source)
- External dependency (CRM, ERP..)

- Implement
    - 不能用舊觀念直接上雲：Choose the right service to support microservice
    - 交易補償 transaction
      - Saga Pattern (AWS Step Function): Visualize and include state machine concept
      - lambda-saga-pattern
      - State Machine

#### 4. Migration 策略

TODO:

- Bubble Context
- Autonomous Bubble
- Open Host Services in Published Languages
- Event Stream



### Reusable Serverless

> Serverless Stack as Code for reuse

- Template
  - SAM (Serverless Application Model)
  - 用來簡化設定 cloudformation 的模板，想成是 serverless resource package
- Repository
  - SAR (Serverless Application Repository)
- Lambda Dependency
  - Lambda Layer
  - Publish Layer to SAR
  - One-click deploy by Readme
  - AWS CLI in Lambda
  - How to build layer.zip
    - By Docker (build 完將檔案從 docker container 內部複製到 host)
    - By Makefile
  - Custom Runtime for Lambda can let you use any language you want
- Features
  - Parameter Override
  - Zero Code required by ApplicationId
  - Reuse in public/private
  - No server and container
  - Wait for another resouce estsblish by property !GetAttr ...output
- Demo
  - pahud/my-demo-sar-app
  



### Event Driven Architecture + Distributed System

- Container Based: Service Landscape
  - Orchestraction
    - AWS ECS (EC2)
    - AWS ECS on Fargate
    - AWS EKS
  - Compute Engine
    - EC2
    - Fargate
  - Image Registry: AWS ECR
- Application Proxy
  - AWS App Mesh (底層是 Envoy Proxy)
  - Features
    - Can use for canary release (blue green replace)
- Data Store
  - Choose the right data store for your microservice
- Tracking
  - AWS X-Ray: Tracking and Metric in distributed system
  - AWS Cloudwatch Log insight
- Deploy
  - Monolithic Deploy Pipeline is terrible and will block by one person
  - New way to IaC: [CDK](https://docs.aws.amazon.com/cdk/api/latest/)
- Demo: chat room with fargate


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/f2f99961-3ff8-4f12-990d-a8bef4eac38f/image-1560305411943.jpg3672023185417702504.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45L2IQVGLS%2F20190615%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20190615T111346Z&X-Amz-Expires=86400&X-Amz-Security-Token=AgoJb3JpZ2luX2VjENb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCx6Yh46VHhmi%2FochigyJUpkIcm1YVQDXgSOSwIXLoi7QIgEa3kfaV3%2BPjkAer0FHMWeg27H0i62D2u1%2BQNrEQduqMq4wMI%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwyNzQ1NjcxNDkzNzAiDDXmNBr6jY7Qbyoe2Sq3AxwTIVq4K4soBhhuq%2FLwg9fDiW396qUJmqJ%2BZCiXIHxwPOo%2BY%2Fdi%2FEjq%2BBGv4USaU%2By2AWssVRXGIHMJg1mNTP7LrrbPhzi%2FJ3U%2FuBRIZ9aMY3rcDRpLB0A9myWfeVMpYaXcfcjYM4VxjTjzFn0CQpOUXWlREmyeVkBKNOisDac8L%2F85PiVMI9E4%2FFYSauGa28F6iKyk9MkC50a%2Benc8HjhjldN994OIQYjY3Bdne0P%2F1kpVOU%2BliQRhTUsgXnwx0%2FwyBdit9GQA2w%2FBESssXgTA8g5MPC1Yv9un%2FMTZCnwU5DpkClmYlGz3h6h%2BaqZAKXtd%2BNDV15ngIe%2BRx1JPpZjHjHcye0bKZw2658CLwBkzhbKzudq5PvokfDNWcLwmUNXJg8ebMlJbfE5PvFS1m9lQvvmh3rI%2BxZJaeANSEIIVLKl923mH%2FNYAL2s8Mlqw48DiJzcBtOmN0RPmPY1%2F4MilTLaEM5Jo1MrVvlQ4IfCPd0Hj7QEcdvrN%2FUm%2FBJ7px2gMIL4jp2UfrTbW480mfUuNKaTcMf0fNfsjFYEZKdIXdv4lx26HAQN%2BHLNnNy6Ij7AfgmkmP0Iwu4eS6AU6tAG6IKhDiwT%2FBgohisMVpR201zmuZrUDWKBGHQHoXUqS5jEKgfjcjUPCL69Q6cv9jBnptdi5lIPRgQHcGinuyCfpcJmR7qjTq2fLT554hpbtZ%2FyQ5wSL23fNcrXsfNDUTnXtwL7%2BO7fLyEK%2BVkWQ5UYQxmIq5um90FivvgiIGm15A3zTqVK9Pfoa4kRHhCclFhUwVIlmU5euUE5X5bJd3Z1vvV%2FYOBJCfstlmsuyuJmUP3wYt5o%3D&X-Amz-Signature=c6d5cb0165177b8f31f9bdc298c2c3bfa8c4ba85f8580f819b9025c0da948c51&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22image-1560305411943.jpg3672023185417702504.jpg%22)

- AWS ECS is am orchestration of container
- AWS App Mesh
  ![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/300bf98c-f843-4028-8c26-34068ba876a7/20190612_100743.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45BUIGIAH5%2F20190615%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20190615T111305Z&X-Amz-Expires=86400&X-Amz-Security-Token=AgoJb3JpZ2luX2VjENX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDxsbpGAUQqDwpj4VYeWjukhNQm6jHolgvjOUXbd0%2FgpwIgL2zkLYfPNiMWTPG7Ke1wIQj4ZOPa371XT7E%2BpNFzpqwq4wMI%2Fv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwyNzQ1NjcxNDkzNzAiDBiyUu1FiOf3iDb6Liq3AztE%2BY6s9QM6S2G1tH1bhf3tS4N9LYmfHgPaZu8jYdPjNRia0%2B9axDTsqDgtJVxjgUILsWudVdBX6zLDVNIwryv5%2Bs%2BjjVRN4JYnoWTmhYJTFGxNFwdMbsmL%2BlFPITPeJZE%2FFh37fLIImjsPe%2BF6aREuohsJ665Ek48yEKDpnZrGtDWjW48tNYVlRNym3pAWG%2B9fzdrsnmJ3cfuWUkrGYnHzh5T%2FZ3UPaIXZ%2FSqpKQaiWOyyN19mDjltHBb5CGawx2jMbvbU%2Bk2ioxT4LRF7nstA9KdqiJb2dwR%2BQeBX%2FJ%2B%2BmaLrZwoyNz9O786Bx4cKi3nGAaMbXSd4aKvVGFC%2Bb4QuS4T%2FJLvoCNY59dGKKmeeL2sHhRR1Wa%2BBuJLJOtYwtdjCiuF7W%2B3Eo9sIEwFBD0qNm7ogbOqD%2FBkRsfG3iPP4mAXr8eVFQrSXhjzkrkeb182yUwd1ZrEq9Uox6DrBDVB5mtVcGdUYC3abAbSDaWiYGUQ%2FZeeXn%2FaVO5d%2FO%2BY0Mev8wg8%2FXVlGXYftOBWnIGOrB6%2BOSZEUbAGyGgMOT5bQOSsNG4wEfONcKSmabwscM%2F4i5LK3Ry4w7PaR6AU6tAH4PxTl6H8dUpI8IeUQbMSINy%2BTi0cVzJyVZq8ms%2BgjcgNSlDUlzJeb5rqR41MGjdOjq2OZcQ74Cu3rbOAMZpUZsU2lMvDGGZMSm9fQKv3SgrpOkZ0P3gsI2vjfpJe6fCy2BXORrm9cpcRBEvQHZHFneauiWJxnbKOklJgFlt7sZ8AfB7j3QHza7cqF8A8lZ%2FJuG1RJtTXxH6mW5o3UugWoMXkudMq7rBotfq7TldShC1mhw5s%3D&X-Amz-Signature=4e12beef6da856902c0d79169e239565cfc59f36b75af5233b30c13c691c5d81&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%2220190612_100743.jpg%22)

- AWS aurora serverless
- Aws appsync
- Data Store
  ![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ad9ea5b0-a617-4d28-930d-689ceb6bf96f/20190612_101217.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45JCTQCKVP%2F20190615%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20190615T111436Z&X-Amz-Expires=86400&X-Amz-Security-Token=AgoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEJwR8Sx%2B923QLQanQpWpGiDctgS6z2YrxUavD%2FvN1XIAiBtd2QhtJ66vxlySGVMA9%2FhvYloYpFb71dmnclxMgU%2BoyraAwgUEAAaDDI3NDU2NzE0OTM3MCIMDAFqbmL6Q9d6f8gnKrcDvo33Fn5Nb7McihKVmsIpDmSEDaUlNdW%2F4W0aaQebGaPSdhCE8%2Fg6b3UV8Y3r%2FgiwVIyv%2Bm0mGbCeCeJ%2Bqy3S1StWphzx5tTNY7m11fSko2idR2zXob6Vo2fdzBWXpSZYKIxNolJ2fcSfk37N8ga5%2FSVGX4kyT8V58ZBsBw1O9f5GlWmFy5KAXsdWIdYWx7bQNLX71hnG6aJqZRW6DdclQvQQR7Rwg%2BOZSIMlHDjdbczO1UiNUeseyfep2N%2BmgiRnVZbS0ObGK9h%2F758rpIfWLwUgL32k7HZ0youRiy9sBwP3c8ipx8IZeTsAwWB4ZKjMlzgkCamMT7L6OEPd1sYZVo4PW3InipBIY03mqmZjZ967DXv%2F1b%2Fb5Yax6buxYO1vhMoDRDAtuEnadmLI9eipmXFxGN2wTBwMAGhcT8aXg4LedBYLvo1g0RkCUg2GfLWCh1itrTgz9bubsMx1fCtJ51h%2BGQgpAq0VmIRKPp1UOc9IgbVYo1lw0q8%2BGf1rx5o4g1X%2BZ5iVwfKY886tgnDGk9BBobEgFuXM0XDA8tJ0%2FFul9r5%2BpW3RJxhzbPx8qwm23sAFzkeR2zDOnJPoBTq1AT9B0T0Dj6lWQD4Oq94KNG7sa79XEI4tSN2nKIwXeJd26fOY%2BHfNv%2BXV0FjRp0J6BmQgKVGL7iPLFPrLfMlOIYtZWvgAZj2tKuoZS7hMfoYSjX%2FK4gqYXZhltdny3cf78qlonJmjiIknT%2BBmxCMh%2FkjDyQfALTSA%2B%2B3QJEqp78aEHPkYNoO0sx5%2BPPl3lzD6HMpNI2Lna2eq%2FoTDMHdhv5DXLkG5XzyHre4WUdg5gimoBrDTStk%3D&X-Amz-Signature=3e81bd25d470813984a68c922f3076939d7b01bf647163994481d07714819e04&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%2220190612_101217.jpg%22)

## 客戶案例分享

### 91 App 雙 11

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/20ce160f-0ec6-4486-804a-4ebbf1e04d1e/image-1560306277401.jpg2112304181127429008.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45DBHUAP4C%2F20190615%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20190615T111634Z&X-Amz-Expires=86400&X-Amz-Security-Token=AgoJb3JpZ2luX2VjENb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICC6VxYjpl0vvs4BCV1sy6T%2ByidMW%2F5qdikOKjRUfIWrAiAMGZaz8hyHhteU86kejuXZLLXjIO15mMQB3BZs6xwWGCrjAwj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDI3NDU2NzE0OTM3MCIMd6XQ5zIJ%2Bsqbh87GKrcDCyw5FjI1VaOzt7hfMn%2FUVQWg9B6xFoLUQypBAPvGUiM%2Bl2D4KNOHV9jumOjLgb%2Brktu1GUydiWVdxeKpR6pkDXs0XJdL6tOX%2FsxreCkXX9QbZIrRnuPzjSeY%2B2kskME%2F6ZCJrKhNPlFIhlW2ywMs47OLyHt%2Fnh5WgJqBTKpt9zG%2Fiz4a%2BhCnHMeXfl%2BCkFMV1INEyiPQTeSU3vdgKOxgZ2VkGscFSdMwSVTBDZ1m1zX7tX3jsCfk%2Bk5cTFJ5Ta4kw3s770edFNBqzI443jtyldkZXh4UN5MD3o6FRnhLy%2B0moNu7rI0kB3BeO63dpBx8ktGVGHW0fxT3Fo6Akog5RN4Q0LKMDz3lxYbwzL9AcY9kfs%2FAbUktBr4dypubjY%2B5iVqz%2Fd4GrcZE0gw8bA40MeNhG36kThPhQYZqN8KTSbvSr7oeMcblIHcr1ve6x40oqKcIvO%2FeN%2FxYsYmf1lbVgCKEqrb1%2FZNaWhmaydlXBaC1CBbRKjKaV60niJdClVMcuy1pTirl3EJ1OWbe8Oqd0oQSXe3CPQoQcw6DW0H0XvMVLuqKvuuKHzCk3Fcz3R0TWPrNNcxGTjDTipLoBTq1AQ%2F2ftUjuElh3GWmdjiLhjHD8oowyM1HyQEkwb9mj53%2BW%2FzdE54OPNbJfXlzglbsKYoUQseqylWnHbb4MdnjPyH4gzLJztJbzK9GvnF12NN5nXwqiSoa%2FwjbKoLtt7I3TlTUZOl9UEuiu8xAzuGL49qz7MCMbLQI9V6Zdp9OlQCyud689r46vA%2FxdPL2wA2rX%2BzlAAHOHyMNILU5txWK5%2FIN2Khekdq3T3IuflnnVUbtr%2BLzcGM%3D&X-Amz-Signature=4cee4e3ac09468359feb2408245efdc7a309fb593faef72133fa6d2bd59793b2&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22image-1560306277401.jpg2112304181127429008.jpg%22)

### Senao 神腦混合雲架構

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/954b35e5-2631-45f0-9bf6-4613a6b9ec64/image-1560308009798.jpg3790325668841239736.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45B7LK3AHA%2F20190615%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20190615T113010Z&X-Amz-Expires=86400&X-Amz-Security-Token=AgoJb3JpZ2luX2VjENr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBTR7qQ9lu%2FHYG7cwOKm04ETvsb4sfwbsmaKyI5gKMOCAiEAg1SlvaJv9L4nUMs%2BDT2CFnGFcga1OzcXogrGrICsa58q2gMIExAAGgwyNzQ1NjcxNDkzNzAiDNMr1mkVUbj3Vze%2Btyq3Az8TOvr8z71gJPPKhlEzepDrfcccUA5AV0O3nQ66XJj0QEwdaMn3U%2B1YSQ61p7MR1vJBD6TpEy%2FaZzdjfXu24QzXU7FPY%2B02laxhFIaHGag406KPR5t9XsdUTCUUULfM58UfUd9Bg%2F0Iih6TxN0%2Fox1ZeEtPiFx6%2B44GCuWG1hZMvSWsk4EEmvVf%2FIrjOylxqToNLdghuIJyGvpwawTo4%2B%2Bl6lG7lEHhIT5F78tJHw%2BfMsOkczM1WVYKwW0Gldj9sHQ2KcHDREdfdnjf27N2wD%2BpGz9J8Wris4Kwr8RwGGzkZFLXGCcTtu8NhUyFqPa3RkiINfEGvGsYqWtkj%2FgE8DFH4Mrqns5k42Fx%2BNZ%2Fs%2FQo6wcjFSdzY4OrqUbIr4egbOZAlbA73KmWgx%2BzMIZi7KNKRB7LATIUN4SpPFRdzh9UyXECu%2BpJtWVLAMZDs6L8OAQYTcfs%2FM3RHw8J89PmC6F558LstA2pRHiG1drDe5Vd6wiBg5ZM0w4uGGJ94qu39XWnBHuciBn1JyFN9Ql3LtfrxmS1xdbmVr3KQ01CtF4JlXQl6C6k2DVrF37nJ%2B%2B0WHgokqCUWVkwlIKT6AU6tAH0v%2BnDj6iAl%2BIPwVwzJFVAhDUB2WYZCNo9K%2BzXzXLrPVSVDXv%2FELTKXbCzi5UoinnWH%2FvKv%2Fl6A8FpKj%2BoDE53%2FQyqfCDpyf%2BwcGg1nmGFWVTVAJLg7%2BW7rTSWQMzkuantdlDyReybLAEsLgw54WZJJWyCs%2BM3spLAaS8nZBMq0aMR3K4hUC4SOLHMYnS%2FNp6qLsFji0QSUnEi%2FPekUwdiNdEdiinDDQT8%2BtQqTnv55NgnG5g%3D&X-Amz-Signature=c1c4971ef76ac8b81e424e0d1ab7f95abc1f9509d82cf8c723c02abb687babad&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22image-1560308009798.jpg3790325668841239736.jpg%22)

- [AWS KMS (Key Management Service)](https://aws.amazon.com/tw/kms/)
- IP 信用評等模式 For dynamic block insecure IPs by WAF
- Chatbot for WAF operation
- MMS / APM 做遷移指標確認

## AI / ML

- Service 一覽 (三種 level)
  - AI service: Some features used by API call without any ML fundament and experience.
  - ML service: AWS SageMaker to simplify the training model (with ML algorithm built-in)
  - Framework with Tensorflow
- reinforcement learning
  - If no available trainig data
  - Training by trial and error to get reward
  - ![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/bf7db6da-a9cd-4ea7-a1cc-a17d91f721e4/image-1560309691396.jpg2673703812094057978.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45JOMEI5JD%2F20190615%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20190615T113738Z&X-Amz-Expires=86400&X-Amz-Security-Token=AgoJb3JpZ2luX2VjENb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDo00o7mj4yXy6BKu%2Bf4hHx2MQpMCH0gVY5Qo49eKmOuAIgHqeL0lZEj68Tnh29s1gqhXrJSE8XBcAdLZjPkxWca48q4wMI%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwyNzQ1NjcxNDkzNzAiDC3Rcpy3IyyDNo14Oiq3A6jEwbpWCo6%2Bs4AwYJ4tN9dJi926NLePx1AozwXFftslW5Rc3wXZkA4bkyQAzqAgkZCo3bJtbdVeOEZR%2FUuxoOGeIIbJ32sOqCZu0ePR%2Blyxj1mAVjGfX%2Bje7n69UNEAkIEvk4LTSPCrQ4ddTop4Yrr%2F8ajexNTDvPzm2eBoag%2FfzlC9DL4WgSREa5xJIR50jIXFO%2FC0Oc2EZ8rH6HxlT9sk9Xwkfy7NkHHNKUPY4sL6l1oDES82zJJa8EnJCI7ekRzzI5mpVwcc8aEQej5zCBr1sU4Enz63ABWors44JZAfst8POpXmBeRW%2B6EoGQd6txSbJko%2BopsE3TK55VH0iUn%2BAo1cfJJYBC7UCYIxUTkr9eNAw34CzwfzLsr5Qa0mn42XI8HLZpGi6yGinH8O1aY5LGtSsjBm8fV7BydVZi2iWcjscJdtVlL9etAmBT6ZLuELuFpV2jZznWN%2BfuR4IbdDJUICWL2ta6Ka2vtUcHiknqaqxnRzgM8b%2FXBt7celVqoSuar8lvcmYLnTSSmomuCIxF6t8R7%2FzAxK%2BTROON38ec7RG%2FynUv%2BkP2zYEMoIFaFs3LYBepQwgo2S6AU6tAH7VthIeeaS%2BO1BHsAeUzptCXtymtpY7BjpaQjxTXXssMkkVowMb%2B5zQNJdmTpVTFL6YUWIyFkMzb4cqg7iUJnO9TwzEMztjurp%2FJxOVlTzeti68nCZHdgoWSQiDIY5tSwV2Ql0ORR4xAPmsKyBvs4df1dTeO4doB69qKh0893Sa5Ox2mc2Q35LOociAFdGoeMg48jCTqccbJ8IDQ4kmjjHE2IjMn3XGFVPQklgm6CZS8qpe98%3D&X-Amz-Signature=12dcae5cb34e112034f5cfede52d14072434eeaa5ac5f0c819b186330aa83906&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22image-1560309691396.jpg2673703812094057978.jpg%22)
  - ![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/9877176b-56e0-4c21-bf29-5515cbf9c047/image-1560309726447.jpg4925774924680604086.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45FOJ3O5EE%2F20190615%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20190615T113806Z&X-Amz-Expires=86400&X-Amz-Security-Token=AgoJb3JpZ2luX2VjENb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDpYtag70pjca0Umcsm3dm4%2FzplqOcgabtiX8ZqJiCIbwIhALPlyXZAc2iWFgYgUer6MgRFKYBhcipsdH528diRXnLcKuMDCP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMjc0NTY3MTQ5MzcwIgzPpocDs9FiOv85DBIqtwNh7RRkm%2Br5JClnioZp4xhHQJq06GSPF71XeE71988g52H0ak33n6hBVLJ6Q2%2BmA0EDr3TQKzJ90jolHryYVv0IeC%2ByhMe6R9dyUur2ZoGQxtnGHHIdhb3cl8mIe%2FEmjJz79kqhY3prj2%2BFMJOpFWdXx08g1Mwv6LtIoDu7dntXp6evsIg3EgDTOQwcf7itrU%2Bm7%2FbClW%2B6eWvpKbSmtQEhQ7W15MKxorjhfDwhfqfkpzADze886IK5Efzq751L913iOC%2FnFQNsjo3HaJil%2FprKNqQAOJ74AJfbuz5KRbyTvL1XQbfoP5KYRTN%2Bv9ItPwZyoxtbhFnswRbH8hSYGFT62kuKSJFT2nbBkYc824mJkzmRRqM0Vycz6%2FCXF4GYOsNya7Z%2B3KK%2FHAevpgcGXdmDfxs%2By4c6c%2F7hRWMSWIWxnm56mGjSlPXrMF5D28EyZzJxav8xWCutTNfEjMMe33xbMruOijJdH7Q05PrcEkcD3M6o3YqsblAtC%2BqM2sPHZRK7Rsb6HB2N%2BOIq09LWRRjF%2Ff1DZyDaLgwF5TKA4g7IsTqkm9bQD3SUXLO55KZ2aWRhLl08XDiqMK2MkugFOrMBYWkSJNdvfThBJzspg9zACQ8SHxaEIR6SAoAioSAeuKBNvZnjfBwNT6QujzC6%2BCVDNl6%2BKdjV%2FdzL6ddbeaWFosdMyyAhx2kaN%2BC4ieXIPUAC3nkkY0u3%2FpsI0UB5yApaidJCWlXZZh89AI9TBi742KVE6%2B0RWSavCkro2zloihOgj8N8wiv373c2zlhs%2BYRR2dCk61Z3PHJOLRuB1zBhEDviFqafs1t2aVdTnBy6tUxzpZU%3D&X-Amz-Signature=e596d2ff60c6cd85854190e758e60486014eafe69307331b664d9f9795db9526&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22image-1560309726447.jpg4925774924680604086.jpg%22)
  - Demo: Unicorn to find hot dog
  - AWS SageMaker RL
  - AWS Sumerian
- ML 搭配 AR 協助 3D 建模
  - Demo: https://bit.ly/oli-3d
- Data Lake
  - [AWS Redshift](https://aws.amazon.com/tw/redshift/) with concurrency scaling
  ![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/987abc86-9905-45a8-9422-447e6025ce4b/image-1560307582164.jpg7891552894504388874.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45JCTQCKVP%2F20190615%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20190615T112637Z&X-Amz-Expires=86400&X-Amz-Security-Token=AgoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEJwR8Sx%2B923QLQanQpWpGiDctgS6z2YrxUavD%2FvN1XIAiBtd2QhtJ66vxlySGVMA9%2FhvYloYpFb71dmnclxMgU%2BoyraAwgUEAAaDDI3NDU2NzE0OTM3MCIMDAFqbmL6Q9d6f8gnKrcDvo33Fn5Nb7McihKVmsIpDmSEDaUlNdW%2F4W0aaQebGaPSdhCE8%2Fg6b3UV8Y3r%2FgiwVIyv%2Bm0mGbCeCeJ%2Bqy3S1StWphzx5tTNY7m11fSko2idR2zXob6Vo2fdzBWXpSZYKIxNolJ2fcSfk37N8ga5%2FSVGX4kyT8V58ZBsBw1O9f5GlWmFy5KAXsdWIdYWx7bQNLX71hnG6aJqZRW6DdclQvQQR7Rwg%2BOZSIMlHDjdbczO1UiNUeseyfep2N%2BmgiRnVZbS0ObGK9h%2F758rpIfWLwUgL32k7HZ0youRiy9sBwP3c8ipx8IZeTsAwWB4ZKjMlzgkCamMT7L6OEPd1sYZVo4PW3InipBIY03mqmZjZ967DXv%2F1b%2Fb5Yax6buxYO1vhMoDRDAtuEnadmLI9eipmXFxGN2wTBwMAGhcT8aXg4LedBYLvo1g0RkCUg2GfLWCh1itrTgz9bubsMx1fCtJ51h%2BGQgpAq0VmIRKPp1UOc9IgbVYo1lw0q8%2BGf1rx5o4g1X%2BZ5iVwfKY886tgnDGk9BBobEgFuXM0XDA8tJ0%2FFul9r5%2BpW3RJxhzbPx8qwm23sAFzkeR2zDOnJPoBTq1AT9B0T0Dj6lWQD4Oq94KNG7sa79XEI4tSN2nKIwXeJd26fOY%2BHfNv%2BXV0FjRp0J6BmQgKVGL7iPLFPrLfMlOIYtZWvgAZj2tKuoZS7hMfoYSjX%2FK4gqYXZhltdny3cf78qlonJmjiIknT%2BBmxCMh%2FkjDyQfALTSA%2B%2B3QJEqp78aEHPkYNoO0sx5%2BPPl3lzD6HMpNI2Lna2eq%2FoTDMHdhv5DXLkG5XzyHre4WUdg5gimoBrDTStk%3D&X-Amz-Signature=a9b0ec03556e04e36935485e0399da8d71ebc9743c813c35957dabfe265e7bf3&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22image-1560307582164.jpg7891552894504388874.jpg%22)

## DevOps

Deploy (automate roll out and rollback)
![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/3c9ed08f-65da-4c2b-b1fe-8771bf44f3eb/image-1560305749580.jpg2675385528150757719.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45FSBQC7VP%2F20190615%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20190615T111514Z&X-Amz-Expires=86400&X-Amz-Security-Token=AgoJb3JpZ2luX2VjENb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA7K69SL0TuC015qCHA2rnOyUu3p9FuhUbkEOQ03N9VDAiA1I7AJUG7oLZokqEVCiJkq0FiuTgclcwu58rvhLGMnxyrjAwj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDI3NDU2NzE0OTM3MCIMJwSxwMHiW53Ue4b8KrcDiScGfuiR4oQoH%2Bw%2FaqCstkO9ccXR2JdOgs58ZC%2Fl0rTZKMKzM4Z3DaFkUaZMiXJcH8D%2BEdKOr6tdqJopn%2FK2IlPAbCYaSwaEq7gt%2BevuH91CjGI6efq22rB%2F%2BvvnW%2Br8OwkP8Dd0v8wsoz1%2Fc%2BB2rc1si4TcDOEi7KUM2LTti51%2F4Gd%2BMnzgiVVSCsh5rY1mSFw%2Bu1sWKxzTyjo4DrLTs%2BjFyro2ONrj2yh2V2EAD%2B2DzLJMsDxHjLHK6pkUmBHCD61eJxV7WSU4ZvD6lb8B%2FzaIsC89Fc2%2BwRhAzpILxIhgTJ3dL9QDfBKDU9wEvG8TglaiY4LZ46eT2IXQNqdttJiNPqObcl%2BizQgTG%2BRHGc1vkEJDFaGaBodzGdvcmzoL1EZi9PuwbPchwsJB7Btfc3fz9HGa3P4eLQNoF%2FxbpkutJIxApGwdoWOIRdoMWukXo5kXmbHj2o16BGfYh3SBbc1F1YaQx%2FX5Eqsk1C2kL3wWoI0ZvVdLE0w3%2Fy7zi0a8pifmZncRNiwXvNGGmYDlnpHzpbgCsS%2FZbikbqIPPSu0in4xqQ3VjKiXLfRbLzhkWBw%2F4LAghjzD1kJLoBTq1AZQKEtp6X6neWZVUn0xJbA0Vq8UoLRTYN3JbmUSApjUbkR821j%2F%2BiupEUNskjVK%2Be7WqLyN0ZW%2FG8Gm4Tc5dz0Nj7e0ArUW7rlZpy0K1JU63Yg0u14wKEwv%2F0xk7HIXdtlr%2F30c01s4K0yvNJSI81YXn4c8nX5uT14xriJJM5GG59ebljhK5r6h%2BAjsaST%2FKIZnNH3oW6pTSXTRjiZbkOMhUfgQ9vuiAVoPOJQVXhV5IPaqHCrI%3D&X-Amz-Signature=8fa309f4f69af067ca080a74611f3e4a6cdaf02913a2f6a119961d7983057abd&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22image-1560305749580.jpg2675385528150757719.jpg%22)

## IoT

- Service 一覽
- Demo: [3D cube art](https://bit.ly/awscube)
- AWS RoboMaker
- Demo: 開地圖的 robot

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/71d61770-42fb-442d-8f94-943a39cee1d2/image-1560306638018.jpg4808603543086544655.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45LALWTDUQ%2F20190615%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20190615T112159Z&X-Amz-Expires=86400&X-Amz-Security-Token=AgoJb3JpZ2luX2VjENb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDi8FpfepdVwbbHi8BzwnDUp2eb%2F95TPLHXK9%2FqRgmTSAiEArq3ixEuVqDJpmMtPzkUDhFUPi%2BhlXN5JuRFAXOK9E34q4wMI%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwyNzQ1NjcxNDkzNzAiDF5KtWJwwfHpiG%2FFGCq3A2msGPKOJsRpar5FgrzviJxv2nTCTizTPw1BSv7Kyf1yudhg0lprOpmdvC409aQfwTKszFOb%2Fv00PmAPeYq26htbMTdFKIKSxQNxfkiPKtLuTq%2BtqlQ47ewainMZHwy1qAEjZtzfK5%2BRv7TJCY%2Burhto%2FzQur35%2FxvroEgLG9%2F17Zv%2FO9%2BZzQwA%2B9hHhl0BwzZX7Uu5GeHInPlEbHgJNEv%2F6yZT2E1gXJbm0dFj5yYFnDi7b2pelHWROXuJWp7RiymH%2BekuRQmICX3s8T8ZyfBtXinJxL08QVuG%2BQVpzxnO2b9P%2FVmqq3JGFkBRhZuR%2Fv62nQfcuqDCMlvResLNJlB4oJPpOupXbrnFbDXwcXeSTYjQMGBFoWTGZv7pF%2Fd67%2F6q1kLTWVTvlLMEy3XbV%2FCfuzU8hCdWK7Rwgp8ldNGTTOgHbkk6JxUxIprFkNGG%2FrRQxX78WROMnFIHDqKr%2FxuVZYKmoIveDgkJ1Wh6rbaIc8UdN%2BqySFJ3frhRyFXIfkYFxqZZGavUvCYJ%2Fxe4rSZqtOh7c1gVfDCtdXdvHFgWH%2FeF7bzdpMr4dGGru5oUyCU0vu%2FRN0BUwtISS6AU6tAGG4T1fu5aur8De%2Fugy6w5jm4H5CidWrl8ZJKAuNpW11mdpscrxxY0Y5PLZuMnTVGRD1LhDKHFkGp37%2BFFGYzRvrhybGb4epHeFibfnk3PnZBv4sJRKNopwBL8U6Hiih8ayQTZrPyrEsI02Kfdu%2FB08%2FFrQQGOJOmVaCxZe0gbXt1cci9snHgKH7%2BN7ldKNG6TXAplE2PoAOJ88lvI8qLL3K%2F%2F7qyBloQfWzSScX%2Fshqo3IuIQ%3D&X-Amz-Signature=61c4fd0d784c27fd334592bce798ad8024be32c2b340d971a48f0c2d4ba6a6cf&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22image-1560306638018.jpg4808603543086544655.jpg%22)

## 其他產品

### MongoDB Cloud

- MongoDB Atlas
- MongoDB Stitch

### Darktrace

Security Defense with ML

## 商業概念、開發經驗

- OMO：全通路（線上加線下）（online merge offline)
- 對比 re:invent 2018 新產品介紹
- Kanban Driven + Metrics
![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/70dea256-15a7-404e-a1bb-efc91e5eac4c/image-1560306115297.jpg4963212806908691755.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45GDXLB276%2F20190615%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20190615T111559Z&X-Amz-Expires=86400&X-Amz-Security-Token=AgoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHfRy8IN0WHZGuE4ozCVH22feIOUjFGdpBWz3WMS43uYAiB%2BeMsIM%2FZ5PoD3Wcq7y8G9l3eQdnS3ZDzV39tEIky1ECraAwgUEAAaDDI3NDU2NzE0OTM3MCIM1ENJfQo7kz%2BZbo%2FRKrcDLkHcEnurZSf%2FTcm5m7FXc4r6cQKCMOvHooRgPMJrIZi1GAsASC%2BRTwStzE55SmMI%2BQ6C4vaVDoMFWskhv8BtAuzS%2FaYFuR219W5VCl5b4aPBj9UUJzs1%2FwOryVJ2%2BFn%2Fd1jmL4TBQLvz7c3RxS9KmOaVVPw3J2r%2BeX3EuUF6Uv333PnPACmo%2BxxxYgf0EsupyVIVEdbHMsyoaV2yu9I9xDmRtv89QNzxLuJt89%2FiYEVDhghlrvLXDM0PBd2dgL16vOIEhlfu27ARUTlZWazggyxwj5BiuoA36HUvPrW4vO6IZUryzeD4ZURH1qHFb85dPD0hp6egsiNhPPr3xEVZd4cHL4%2Fi8%2FfuEq64r9AnjICAhJug2T8p7y6%2FvRWe%2FgK4FQ%2F5x82eHrKgqU4wMzU1RDNWLwsNXgbbeN3uazYFnLhjri4BaN%2FU4s0EHwbDKxf2T0RV2OvZfRxvSN3FSxujSPpVwV1zrTiy6tDR5gC5%2F6OrS7p5I3aAc5n4ihzm9S6VdGOPnRfbjlIoomkIROhxVdpk50UnQXgg9g79k82bcHkgyOEyExjHqeCFrixwFCCVBh5x3nRC0jCknZPoBTq1Ad8d32P44zN6G8kCcSB4%2FP3%2BScKo24NMPsk39%2Bi2S7J4FGcc6tt8JFQzboWOm21U1Hp2kdZ2o0HqtVN1uJXbel9rb39zMdTCfuwUax56HdnemxU1u%2Fo4Ampa%2B69GO7mA92%2F4xswauxjY5b6WK2nTIaNeRt8nA3CbF7s%2FVlcq%2FLF0fn2TdwxtyZ94Y7vKgVXtbapaB41AcDAZuWrNnGUEhilpYeR705Nlv3QsTY%2B1bvUQN%2B0%2F1%2FM%3D&X-Amz-Signature=ffe5bb9f554e481292083a3de75f7bf1e0105e57413b612c762a586cf301b6dd&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22image-1560306115297.jpg4963212806908691755.jpg%22)
- 戰情室（一面牆投出所有監控）
- AWS 認證
  - 個人為單位
  - 公司為單位
    - AWS MSP
    - AWS Competency





## AWS 系列活動

- re:invent
- re:invent recap
- summit
- awsome day
- aws user group
- aws startup day

## 活動感想

- Level
- 兩天的議程內容型態
- quick tips
- DeepRacer League
- 贈品
- 伙食
- 小插曲
- 逛攤位




