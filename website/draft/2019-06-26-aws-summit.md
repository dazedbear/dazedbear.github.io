
大約知道各服務的用途，需要實作時再投入時間讀文件



## Build in 2019: 建立分佈式、開放式、數據中心的人工智慧數據驅動平台

- 3D cube art in https://bit.ly/awscube
- AWS ECS orchestration of container
- [AWS App Mesh](https://aws.amazon.com/tw/app-mesh/): Application level proxy for serverless
- [AWS Aurora Serverless](https://aws.amazon.com/tw/rds/aurora/serverless/): 關聯式資料庫 for serverless
- [AWS AppSync](https://aws.amazon.com/tw/appsync/): Facade Pattern in API (單一 API 入口) by GraphQL
- Event Driven Architecture is the future
  - Decouple state from code using messaging
    - Client to Service
      - Connect by API Gateway
    - Service to Service
      - Queues by SQS
      - Pub/Sub by SNS
    - Orchestraction
      - Step Function
- Choose the right data store for your microservice
  - Relational
    - Aurora
    - RDS
  - Key Value
    - DynamoDB
  - Document
    - DocumentDB
  - In-Memory
    - ElasticCache
  - Graph
    - Neptune
  - Time-Series
    - Timestream
  - Ledger
    - QLDB
- Developer Tool for software delivery
  - Author: Cloud9 IDE
  - Source: CodeCommit
  - Build: CodeBuild
  - Test: CodeBuild + 3rd party
  - Deploy: CodeDeploy
  - Monitor: CloudWatch + X-Ray
  - CodePipeline: control work flow from Source to Deploy
- Broad and deep Iot Services
  - Data Services
    - IoT Events
    - IoT Sitewise
    - IoT Analytics
  - Control Services
    - IoT Things Graph
    - IoT Device Management
    - IoT Core
  - Device Software
    - Iot Greengrass
    - FreeRIOTS
    - IoT Device SDK
    - IoT Device Tester
- [AWS RoboMaker](https://aws.amazon.com/tw/robomaker/): 開發、測試、部署機器人應用程式
  - Demo: 開地圖的 Robot
- Cloud Data Lakes are the future
  ![cover](https://dazedbear-assets.s3-ap-northeast-1.amazonaws.com/aws-summit-2019/image-1560307582164.jpg)
- [AWS Sumerian](https://aws.amazon.com/tw/sumerian/): 快速建立 AR/VR/3D 應用程式
  - Photogrammetry: Image-based 3D Modeling, [Demo](https://bit.ly/oli-3d)
- AI/ML 不同層級的服務
  - AI Service: Some features used by API call without any ML fundament and experience.
  - ML Services: AWS SageMaker to simplify the training model (with ML algorithm built-in)
  - Frameworks on AWS: TensorFlow, Apache MXNet, ONNX...
  - Infrastructure: Inferentia 晶片、Amazon Elastic Inference GPU 加速功能、動態調整訓練所需的資源以節省費用
  - 硬體: AWS DeepRacer
- ML training model 方法
  ![](https://cdn-images-1.medium.com/max/1600/1*eVrtdyx711nZUlgRgO5YvA.png)
  - [Supervised learning](https://www.wikiwand.com/zh-tw/%E7%9B%A3%E7%9D%A3%E5%BC%8F%E5%AD%B8%E7%BF%92)
  - [Unsupervised learning](https://www.wikiwand.com/zh/%E7%84%A1%E7%9B%A3%E7%9D%A3%E5%AD%B8%E7%BF%92)
  - [Reinforcement Learning](https://www.wikiwand.com/zh/%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0)
  - Demo with AWS SageMaker RL + Sumerian (Unicorn to find hot dog)

## 客戶分享案例 - 遠傳擁抱 AI 與雲端的轉型進行式

沒有重點 (欸)

## 客戶分享案例 - 傳統企業前進雲端遇到的挑戰與經驗 (神腦)

Kanban Driven + Metrics

![kanban-plus-metric](https://dazedbear-assets.s3-ap-northeast-1.amazonaws.com/aws-summit-2019/image-1560306115297.jpg)

![架構圖](https://dazedbear-assets.s3-ap-northeast-1.amazonaws.com/aws-summit-2019/image-1560308009798.jpg)

- 混合雲
- [AWS Key Management Service (KMS)](https://aws.amazon.com/tw/kms/)
- IP 信用評等模式 For dynamic block insecure IPs by WAF
- Chatbot for WAF operation

## 客戶分享案例 - 91APP 如何利用 AWS 導入 DevOps 實戰雙11活動

![架構圖](https://dazedbear-assets.s3-ap-northeast-1.amazonaws.com/aws-summit-2019/image-1560306277401.jpg)

- 算是比較混合雲的傳統架構，包含部分自架機器與雲端服務整合
- 戰情室：一整面牆投出所有監控面板 (超帥)

## Dev Day - Building Reusable Serverless Apps

- function 層級共用：[AWS Lambda Layer](https://docs.aws.amazon.com/zh_tw/lambda/latest/dg/configuration-layers.html)
  - 像 packages 一樣跨 application 共用：單獨打包並發佈到 SAR
  - Type is AWS::Serverless::LayerVersion
  - 可以做到 One-click deploy badge in Readme
  - [lambda-layer-awscli](https://github.com/aws-samples/aws-lambda-layer-awscli)
  - How to build layer.zip
    - By docker
      ```bash
        #!/bin/bash
        docker build -t awscli:amazonlinux .
        CONTAINER=${docker run -d awscli:amazonlinux false}
        docker cp ${CONTAINER}:/layer.zip layer.zip
        docker cp ${CONTAINER}:/AWSCLI_VERSION AWSCLI_VERSION .
        exit 0
      ```
    - By Makefile
- service 層級共用：[Serverless Application Model (SAM)](https://github.com/awslabs/serverless-application-model)
  - 用來簡化設定 cloudformation 的模板，想成是 serverless resource package
- 託管庫：[Serverless Application Repository (SAR)](https://aws.amazon.com/tw/serverless/serverlessrepo/)
- Serverless Stack as Code by SAM
  - Parameter Override
  - Zero Code required by ApplicationId
  - Reuse in public/private
  - No server and container
  - Recipes: Wait for another resouce estsblish by property !GetAttr ...output

## Dev Day - Essential capabilities behind Microservices

https://microservices.io/

- Microservices + Domain Driven Design
  - 回歸商業本身：使用 Domain Driven Design 定義與規劃你的商模和業務
    - 如何劃分業務範疇：Command、Aggrigate、Bussiness Event
    - 多組 CAE 會產生 boundary context
  - 適合 migrate 舊系統成 microservices 的時機
    - 自我檢查量表: https://github.com/humank/microservices
  - 可能挑戰
    - 敏捷性被破壞 (一年時間全力完成 migration)
    - 不知道確切的 boundary
    - 如何分而治之
    - 資源分配
    - 外部依賴 (CRM, ERP)
  - 策略 for Legacy System Migration (refer to https://dev.to/asarnaout/the-anti-corruption-layer-pattern-pcd)
    - Bubble Context: 建立新的服務 (存在舊系統中)，並建立 Anti-Corruption Layer 與 Legacy System 溝通
    - Autonomous Bubble: 建立新服務 (獨立於舊系統)，需要建立 Anti-Corruption Layer 處理資料，但同樣的資料舊系統也會處理一次
    - Open Host Services in Published Language: 將舊系統資料 expose 成一個 host service，並使用 Anti-Corruption Layer 將資料轉換成新系統可以用的方式
    - Event Streams: 系統間使用 event 溝通，Anti-Corruption Layer 負責資料轉換外，也負責 monitor 其他系統的狀態
  - 最佳實踐
    - https://microservices.io/index.html
    - 微服務的資料一致性：有些交易是會跨服務的，舉例像是刷 debit 卡會需要很注意額度問題
      - 常見思維：2 Phase Commit ([二階段提交](https://www.wikiwand.com/zh-tw/%E4%BA%8C%E9%98%B6%E6%AE%B5%E6%8F%90%E4%BA%A4))，一個投票表決者，會造成阻塞、成員節點資源浪費
      - 使用 saga pattern 取代它
        - Choreography-based: event bus 發出事件到公用渠道，每個服務自己關注要關注的事件
        ![](https://microservices.io/i/data/Saga_Choreography_Flow.001.jpeg)
        - Orchestration-based: 一個協調者負責處理流程，告訴哪些服務該開工囉
        ![](https://microservices.io/i/data/Saga_Orchestration_Flow.001.jpeg)
        - AWS Step Function
        - demo: https://github.com/humank/lambda-saga-pattern
- Recap
  - Do we need microservices
  - Value driven
  - State Machine to Do Transaction Compensate


## Dev Day - Building Modern Distributed Applications

- 根據需求選擇 container 服務：AWS Container Landscape

![](https://dazedbear-assets.s3-ap-northeast-1.amazonaws.com/aws-summit-2019/image-1560324257253.png)

- 微服務之間的溝通彈性：proxy
  - AWS App Mesh
    - 內部是使用 https://www.envoyproxy.io/
    - 可以做到單一服務層級的 load balancer 、 藍綠部署、canary deploy
    - 可以搭配 AWS CloudWatch 監控 log、AWS X-Ray 監控流量走向
  > Monolithic Deploy Pipeline is terrible and will block by one person
- 另一種 IaC 工具：[AWS CDK](https://docs.aws.amazon.com/cdk/api/latest/)
  - [Demo](https://github.com/enghwa/chat-websocket-fargate)


## Dev Day - Building Event-Driven Serverless Apps with AWS Event Fork Pipelines

![](https://dazedbear-assets.s3-ap-northeast-1.amazonaws.com/aws-summit-2019/image-1560326986304.png)

- concept
  - Producer
  - Consumer
  - 使用 Pipeline / Buffer 連結 Producer 與 Consumer
    - SNS
    - SQS
    - Kinesis Data Streams (事件不會被取走，可以被多個關注)
    - [Kinesis 串流服務生態系](https://aws.amazon.com/tw/kinesis/?nc2=type_a)
    - 好處：允許部分壞掉、隨時要 scale 都很方便
    - 只要該服務可以觸發 Lambda 就能被加入 serverless 架構

- AWS Event Fork Pipelines
![](https://github.com/aws-samples/aws-serverless-event-fork-pipelines/raw/master/images/aws-event-fork-pipelines-architecture.png)
  - https://github.com/aws-samples/aws-serverless-event-fork-pipelines
  - 幾條 pipeline 隨你自訂，這邊是舉常見的 4 種應用
  - 透過 AWS SNS subscription filter policy 讓每一條 pipeline 各自關注自己需要的事件
  - 各自介紹每一條的實作
    - fork-event-storage-backup-pipeline
      - for audit / compliance requirement
      - 可搭配 [AWS Kinesis Data Firehose](https://aws.amazon.com/tw/kinesis/data-firehose/) invoke in place Lambda 讓它去除敏感資料
    - fork-event-search-analytics-pipeline
      - 建 search index (搭配 AWS Elasticsearch Domain)
      - i13n track 或數據分析
    - fork-event-replay-pipeline
      - 算是保留歷史 input 資料，但是 lambda 不 enable ，以便在任何災難性錯誤時有機會 enable lambda 讓一切重來
- 前端再接這種後端是 serverless 該怎麼做
  - 全部異步處理打 restful 觸發處理任務 (API Gateway REST API)
  - 用 websocket 頁面去等待結果 (API Gateway Websocket API)
  ![](https://dazedbear-assets.s3-ap-northeast-1.amazonaws.com/aws-summit-2019/20190612_163122.png)

## 場邊

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas): 建構在 AWS 上的 SaaS
- [Darktrace](https://www.darktrace.com/en/): 使用 ML 協助華信航空資安團隊

---

## 尖峰學堂:支援容器的服務和實現方式

- 系統架構的演進
  - Monolithic
  - SOA 架構 （Service-oriented architecture with bus）
  - Container
  - 當 Container 數量達到百萬千萬級：需要一套管理、編排這些容器的方法
- AWS ECS
![](https://dazedbear-assets.s3-ap-northeast-1.amazonaws.com/aws-summit-2019/yyy.png)
![](https://dazedbear-assets.s3-ap-northeast-1.amazonaws.com/aws-summit-2019/ttt.png)
![](https://dazedbear-assets.s3-ap-northeast-1.amazonaws.com/aws-summit-2019/test.png)
- K8S
  - 大規模容器編排
  - 跨 3 個 AZ 拓展，直接使用 kubectl
  - 使用 kubectl cli 做操作，AWS console 只會顯示機器最少資訊
  - GUI 介面：[VNC viewer](https://www.realvnc.com/en/connect/download/viewer/) (localhost:8001)
- 服務發現
  - [istio](https://istio.io/)
  - [AWS Cloud Map](https://aws.amazon.com/tw/cloud-map/)
  - [AWS X-Ray to trace service map ](https://aws.amazon.com/tw/xray/)
- ServiceMesh
  - ![](https://dazedbear-assets.s3-ap-northeast-1.amazonaws.com/aws-summit-2019/kyky.png)
  - ![](https://dazedbear-assets.s3-ap-northeast-1.amazonaws.com/aws-summit-2019/fgfg.png)
  - 早期需要部署 sdk 到 container，現在只要加上一層 proxy 以便容器間溝通
  - 講解：https://www.inwinstack.com/2018/01/12/service-mesh-istio/


## Keynote: Innovation at scale at AWS 雲端創新應用規模化

- [AWS Outposts](https://aws.amazon.com/tw/outposts/): 客製化的 infrastructure, 搭配 VMware Cloud on AWS 讓地端與雲端溝通
  - 1) VMware Cloud on AWS Outposts allows you to use the same VMware control plane and APIs you use to run your infrastructure
  - 2) AWS native variant of AWS Outposts allows you to use the same exact APIs and control plane you use to run in the AWS cloud, but on-premises.
  - [VMware on AWS](https://aws.amazon.com/tw/vmware/)

![](https://dazedbear-assets.s3-ap-northeast-1.amazonaws.com/aws-summit-2019/ppp.png)
![](https://dazedbear-assets.s3-ap-northeast-1.amazonaws.com/aws-summit-2019/qqq.png)

開始出現一些 PaaS, 例如：MongoDB Cloud



- blockchain
  - [AWS QLDB](https://aws.amazon.com/tw/qldb/)
  - [AWS Managed Blockchain](https://aws.amazon.com/tw/managed-blockchain/)

- IoT

![](https://dazedbear-assets.s3-ap-northeast-1.amazonaws.com/aws-summit-2019/tqa.jpg)

## 客戶案例分享 - Acer IT Digital Transformation

## 客戶案例分享 - KKBox Innovation with Site Reliability Engineering

## 輕鬆使用 AWS Elemental 媒體服務打造無伺服器 Live Streaming 與 VOD 平台：OTT 業者如何提供百萬用戶流暢的觀影體驗

## 深探 IaC (Infrastructure as Code, 基礎設施即程式碼 ) 在 AWS 上的應用

## 在 MongoDB Cloud 上構建無服務器化應用

## 去中心化身分識別（Decentralized Identifiers) 如何改變著未來的網路型態？

## Enabling an IoT service - from a behind the scene perspective
