---
unlisted: true
title: "[DRAFT] 在手機上用 VS Code 開發！！"

---
![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/nicholas-santoianni-bgFB2WJSvLA-unsplash.jpg)

> Photo by [Nicholas Santoianni](https://unsplash.com/@nsantoianni?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

還記得幾年前寫過的文章 [ Eee PC 翻身計劃！](https://www.dazedbear.pro/blog/2017/08/21/eeepc-relife-plan) 就有提過，我一直很想要找到一個簡便的行動工作方式。這次將腦筋動到了手機身上，希望可以用來寫文章、開發程式，出門時帶著手機、藍芽滑鼠、以及藍牙鍵盤，就可以隨時隨地的工作，聽起來真是非常美好的事不是嗎?

這次就來介紹如何在手機上使用 IDE 開發程式吧！

<!-- truncate -->

## 簡介 Cloud IDE

### 常見服務

其實現在有許多的 Online Code Editor 服務，只需打開瀏覽器連到網站就可以使用，對前端來說常見的有 [Codepen](https://codepen.io/)、[JS Bin](https://jsbin.com/?html,output)，有些支援單種/多種需編譯的語言，像是 [repl.it](https://repl.it/languages)、[CodeChef](https://www.codechef.com/ide) 等，隨便搜尋一下都非常多。大多數用途是測試語法、練習演算法、社群提問時方便分享程式碼片段等，不太能夠完整開發一個專案。想要使用 git、有 terminal 可以下指令、設置斷點除錯等，這時候你需要的是完整的 Cloud IDE。

Cloud IDE 實際上是起一台 VM/Container 並安裝 IDE 供你開發使用，因此普遍都是需要收費的。來看一下有哪些常見的服務：

* [AWS Cloud9](https://aws.amazon.com/tw/cloud9/)：早年有名的 Cloud IDE 就是 Cloud9，後來在 2016 年被 AWS 收購改名
* [Google Cloud Code](https://cloud.google.com/code)：看介紹覺得不太算是 Cloud IDE，它比較像 AWS Lambda 那種 FaaS (function as a service) 的服務，方便你選用熟悉的 IDE 開發 Kubernate
* [Azure Visual Studio Codespaces](https://visualstudio.microsoft.com/zh-hant/services/visual-studio-codespaces/)：VS Code 雲端版，需綁定 Azure 帳戶使用
* [CodeSandbox](https://codesandbox.io/index2)：Web 開發常用的服務，可以免費使用，也是以 VS Code 為基礎
* [Gitpod](https://www.gitpod.io/)：可以免費使用 (有運行時數限制)，也是以 VS Code 為基礎

### 不選用 Cloud IDE 服務的原因

其中我自己愛用的是 CodeSandbox，不用額外付費就能開發專案，免費版也沒有運行時間的限制。不過它對於 server side 程式開發、連動 git repo 的部分老實說我還用不習慣，雖說有 terminal 但用起來跟原生的差異很大，沒辦法下 ls 之類的指令，只是單純方便你看 log 而已。編輯器使用起來很像 VS Code 但還是不太一樣。

基於以上原因，我才開始思考：

> 有沒有可能使用真正的 Cloud VS Code ?

起初先看了 Microsoft 官方推出的 Visual Studio Codespaces，試算了一下[價格](https://azure.microsoft.com/zh-tw/pricing/details/visual-studio-online/)：收取 Storage 和 Calculation 費用，如果建了 instance 30 天都 inactive 沒有使用，基本 Storage 就要 NTD 250、如果週末偶爾開發個 4 小時，Calculation 約是 NTD 53。簡單來說，建好 Cloud IDE 環境基本低消就是 NTD 250 (雖然雲端沒有低消這件事，而是用多少算多少錢，這只是比喻)。總覺得為了不一定常用的 Cloud IDE 花得比 Spotify 還多讓我有點掙扎。

> 有沒有可能使用 Cloud VS Code 花費得更少呢?

答案是有的，就是接下來要介紹的重點：[cdr/code-server](https://github.com/cdr/code-server)。

## 建立自己的 Cloud VS Code

> 起一個不貴的機器，安裝 Code Server，設定一組網址，開始使用

[cdr/code-server](https://github.com/cdr/code-server) 是**社群版本**的 VS Code，方便讓你在任何機器建立 VS Code 開發環境。請注意重點：**社群版本**，它並不是官方維護的，雖然使用起來跟一般 VS Code 沒兩樣，最大的差異就是擴充套件：Code Server 另建一個 Community 的 Martketplace，有些原本官方版 VS Code 好用的擴充套件，換到社群版就不一定有 (像是 [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph))。另外像一些進階的 Live Share 即時協作功能在這版也是沒有的。如果你的需求已經到這種地步，直接使用 Visual Studio Codespaces 應該是最適合的。如果是簡單的開發需求，擴充套件也沒有用很兇，那可以考慮這個方案。

看起來簡單，實際上有些眉眉角角要處理。接下來我們手把手來實作吧！

## Step 1：建立一台 AWS Lightsail Instance

由於我習慣使用 AWS，再加上 AWS 的服務穩定性相較於 GCP 和 Azure 來得高，幾乎沒什麼聽過某資料中心炸裂使客戶服務完全停擺的糾紛，故就以 AWS 的服務為範例，這邊你可以替換成自己熟悉的服務。

說到 AWS 起 Instance，第一個想到是使用 EC2，不過 [試算了價格](https://calculator.aws/#/createCalculator)：1 台 t2.micro (1GB RAM, 1 vCPU) 30 天 24 小時都不關的 EC2 Instance 最少要 USD 11，這樣根本就比 Visual Studio Codespaces 還貴嗎!! 按捏姆湯，有沒有更好的辦法?

事實上，如果想要起便宜的 Instance，你可以考慮 [AWS Lightsail](https://aws.amazon.com/tw/lightsail/)。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-intro.png)

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-dashboard.png)

從精心設計過的親切 UI console、簡單少量的設定按鈕，個人覺得 Lightsail 定位很像早年 [ByetHost](https://byet.host/) 之類的虛擬主機供應商，提供給技術背景不深的使用者快速管理一台機器，省去很多建 EC2 要處理的步驟 (機器規格、Policy、設定 VPC 和 AZ ... 等)，完全交由 AWS 託管。[服務的定價](https://aws.amazon.com/tw/lightsail/pricing/) 滿便宜的，最低一個月 USD 3.5 就可以擁有一台機器，當然這邊也是用多少算多少，如果中途刪除了 instance 就不會算滿 USD 3.5 這樣 (inactive 還是照樣計價喔)。

首先點選 Create instance，開始選擇這台 VM 你要放的 Region 和 AZ。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-create-1.png)

再來選擇要裝的 image，我因為未來會拿這台做其他實驗用途，預先裝好 Node.js 可以幫我省下一些環境設定的工，因此選了 Node.js。要注意的是，這邊大多數的 image 都是 bitnami 提供的，所以預設會裝 bitnami 在內，剛起好就有一台 http server 可以瀏覽頁面。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-create-2.png)

再來選擇機器規格 (費率)，這邊都是以 24 小時 30 天一共運行 730 小時來算的價格，以 [code-server 的最低規格要求](https://github.com/cdr/code-server#requirements)，至少要 1GB RAM、1 vCPU、64bit，所以我選 USD 5 的規格。選完規格再幫 instance 取名字，最後捲到最下方點選 Create 就完成了。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-create-3.png)

點左上角 Logo 回到 Dashboard 首頁，可以看到你新建好的機器，點選機器就可以看見這個詳細資訊與相關設定。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-create-4.png)

## Step 2：安裝核心 library：cdr/code-server

下一步是 SSH 連進 instance 安裝 [cdr/code-server](https://github.com/cdr/code-server)。我們先到 code-server 的 Github repo 去[找最新的 release](https://github.com/cdr/code-server/releases)，我們要找的是 `linux-x86_64.tar.gz` 版本，然後複製連結。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/code-server-release.png)

接著回到 Lightsail Console，進入新建的 instance 點選 Connect using SSH 開啟 Browser 版的 Terminal，輸入指令下載 code-server 並解壓縮。這邊選用 binary 版本而非 docker image 啟動 code-server 是有原因的，等等後面會再提到。

```bash
$ wget https://github.com/cdr/code-server/releases/download/3.1.1/code-server-3.1.1-linux-x86_64.tar.gz
$ tar zxvf code-server-3.1.1-linux-x86_64.tar.gz
```

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-terminal.png)

基本上到這裡就完成安裝了，只要進到資料夾執行這個指令就能運行 code-server。不過我們還有一些設定要處理故先不啟動。

    $ cd code-server-3.1.1-linux-x86_64
    $ ./code-server

## Step 3：處理 DNS

接下來要處理網址部分。以我的 case 來說，我希望可以有一組好記憶的網址來使用 VS Code：

> [https://code.dazedbear.pro/vscode/](https://code.dazedbear.pro/vscode/ "https://code.dazedbear.pro/vscode/")

那麼需要調整 DNS 設定，如果你對 DNS 不是很了解，推薦你看這篇 [Lightsail 的 DNS 介紹](https://lightsail.aws.amazon.com/ls/docs/zh_tw/articles/understanding-dns-in-amazon-lightsail)。接下來依據你打算用什麼服務管 DNS Record，設定會有所不同。

### 使用 Lightsail DNS Zone 管理

如果你的 Root Domain 是從其他地方註冊的，可以在 Lightsail 新增 DNS Zone 管理你註冊好的 Domain。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-dns-zone.png)

* 先在你的 Domain Register 管理介面新增 NS Record 指到 Lightsail 的 Name servers
* 再回到 Lightsail console 點選 Networking，點選 create DNS zone，輸入註冊的 Domain ，點選 create
* 回到剛建好的 DNS zone，點選 Add record 新增一筆 A record 將 `code.dazedbear.pro` 指向你的 instance 就完成了

### 使用 AWS Route 53 管理

如果你的 Root 是從 AWS Route 53 註冊的，或者你雖然是從別的 Domain Register 註冊但想用 AWS Route 53 管理 DNS，就需要先幫 Lightsail instance 新建一組 Static IP。[詳細的官方教學在此](https://lightsail.aws.amazon.com/ls/docs/zh_tw/articles/amazon-lightsail-using-route-53-to-point-a-domain-to-an-instance)。

一般來說，剛建好 instance 就會拿到一組 Public IP，你可以在瀏覽器網址列用這組 IP 連到 instance，然而這組 AWS 分配的 Public IP 是有機會被 AWS 調節改動，AWS 確保一定有一組 Public IP 給每一個 instance，但是不保證 Public IP 永遠不會變，就算變了也不會主動通知使用者。因此我們需要新建一個永遠不變的公開 Static IP，將 instance attach 到這組 Static IP，再建一組 DNS A record 指到這組 Static IP。

回 Lightsail Console，點選 Networking，點選 Create static IP。選擇和你的 instance 一樣的 region。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-static-ip-1.png)

Attach static IP 到你的 instance，再取個名字按 create 就完成了。其中要注意：**Static IP 的收費方式很特別：只要沒有任何 instance attach 到這組 IP 就開始收你錢，如果有 attach 就免費**，確保 IP 資源不會被浪費，所以之後如果清除 instance 別忘了檢查 Static IP 有沒有被清除，否則會被收冤望錢喔 OAO (曾經因為這樣被收過 USD 1x 過...)。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-static-ip-2.png)

回到 AWS Route 53，新增一組 A record 將 `code.dazedbear.pro` 指向 Lightsail Static IP。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-route53-add-record.png)

由於 DNS 改動要 Push 到網路上各台 Name server 需要一點時間，可以點選 Test Record Set 先試試看是否有改對。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-route53-test-record.png)

稍等一段時間以後，直接開瀏覽器輸入網址 http://code.dazedbear.pro，看到 bitnami 歡迎頁面就代表成功了。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-bitnami-index.png)

## Step 4：處理 SSL 憑證

### 使用 bitnami https configuration tool

一鍵自動設定 ([doc](https://aws.amazon.com/tw/premiumsupport/knowledge-center/linux-lightsail-ssl-bitnami/))

### 手動設定 Let's Encrypt 產生新的憑證

完成 [教學](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/amazon-lightsail-using-lets-encrypt-certificates-with-wordpress) 的 step 1 - 7 即可。

* 可以先用 `--dry-run` [測試環境](https://letsencrypt.org/zh-tw/docs/staging-environment/)測過沒問題，再正式處理，否則一直在 TXT DNS challenge 失敗會碰上[ rate 限制](https://letsencrypt.org/zh-tw/docs/rate-limits/) (5次失敗/每小時)
* 幫助 debug 工具：[https://mxtoolbox.com/SuperTool.aspx?action=txt%3a_acme-challenge.dazedbear.pro&run=toolpage](https://mxtoolbox.com/SuperTool.aspx?action=txt%3a_acme-challenge.dazedbear.pro&run=toolpage "https://mxtoolbox.com/SuperTool.aspx?action=txt%3a_acme-challenge.dazedbear.pro&run=toolpage")
* 遇到多筆的 TXT 驗證：route 53 是同一個 domain 新增一行文字
* Let's encrypt 解析：[https://andyyou.github.io/2019/04/13/how-to-use-certbot/](https://andyyou.github.io/2019/04/13/how-to-use-certbot/ "https://andyyou.github.io/2019/04/13/how-to-use-certbot/")

## Step 5：處理 bitnami proxy

還需要多一步驟改 bitnami proxy ([SSL docs](https://docs.bitnami.com/bch/infrastructure/lamp/administration/enable-https-ssl-apache/))

```bash
$ vi /opt/bitnami/apache2/conf/bitnami/bitnami.conf
```

          <VirtualHost _default_:443>
          ...
          # 新增這段
          # Proxy for servinf SSL to additional ports
          ProxyPass /vscode http://code.dazedbear.pro:8080
          ProxyPassReverse /vscode/ http://code.dazedbear.pro:8080
          ...
          </VirtualHost>

```bash
# 重新啟動 bitnami
$ sudo /opt/bitnami/ctlscript.sh restart
```

## Step 6：啟動 code-server 實際檢查一次

```bash
$ sudo ./code-server --host 0.0.0.0 . --cert=/opt/bitnami/apache2/conf/server.crt --cert-key=/opt/bitnami/apache2/conf/server.key
```

拿到 password 從以下的 url 登入，確認是否運作沒問題

[https://code.dazedbear.pro/vscode/](https://code.dazedbear.pro/vscode/)

## Step 7：改為背景執行 code server

停掉 server 然後安裝 PM2，再執行以下指令：

```bash
$ npm intall -g pm2
$ pm2 start sudo --name vscode --no-autorestart -- ./code-server --host 0.0.0.0 . --cert=/opt/bitnami/apache2/conf/server.crt --cert-key=/opt/bitnami/apache2/conf/server.key
```