---
unlisted: true
title: 在手機上用 Remote VS Code 開發吧！

---
![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/nicholas-santoianni-bgFB2WJSvLA-unsplash (1).jpg)

> Photo by [Nicholas Santoianni](https://unsplash.com/@nsantoianni?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

還記得幾年前寫過的文章 [ Eee PC 翻身計劃！](https://www.dazedbear.pro/blog/2017/08/21/eeepc-relife-plan) 就有提過，我一直很想要找到一個簡便的行動工作方式。這次將腦筋動到了手機身上，希望可以用來寫文章、開發程式，出門時帶著手機、藍芽滑鼠、以及藍牙鍵盤，就可以隨時隨地的工作，聽起來真是非常美好的事不是嗎?

由於我慣用的 IDE 是 VS Code，這次就來介紹如何在手機上使用 Remote VS Code 開發程式吧！

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

> 有沒有可能使用真正的 Remote VS Code ?

起初先看了 Microsoft 官方推出的 Visual Studio Codespaces，試算了一下[價格](https://azure.microsoft.com/zh-tw/pricing/details/visual-studio-online/)：收取 Storage 和 Calculation 費用，如果建了 instance 30 天都 inactive 沒有使用，基本 Storage 就要 NTD 250、如果週末偶爾開發個 4 小時，Calculation 約是 NTD 53。簡單來說，建好 Cloud IDE 環境基本低消就是 NTD 250 (雖然雲端沒有低消這件事，而是用多少算多少錢，這只是比喻)。總覺得為了不一定常用的 Cloud IDE 花得比 Spotify 還多讓我有點掙扎。

> 有沒有可能使用 Remote VS Code 花費得更少呢?

答案是有的，就是接下來要介紹的重點：[cdr/code-server](https://github.com/cdr/code-server)。

## 建立自己的 Remote VS Code

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

因此我們需要調整 DNS 設定，如果你對 DNS 不是很了解，推薦你看這篇 [Lightsail 的 DNS 介紹](https://lightsail.aws.amazon.com/ls/docs/zh_tw/articles/understanding-dns-in-amazon-lightsail)。接下來依據你打算用什麼服務管 DNS Record，設定會有所不同。

### 使用 Lightsail DNS Zone 管理

如果你的 Root Domain 是從其他地方註冊的，可以在 Lightsail 新增 DNS Zone 管理你註冊好的 Domain。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-dns-zone.png)

* 先在你的 Domain Register 管理介面新增 NS Record 指到 Lightsail 的 Name servers
* 再回到 Lightsail console 點選 Networking，點選 create DNS zone，輸入註冊的 Domain ，點選 create
* 回到剛建好的 DNS zone，點選 Add record 新增一筆 A record 將 `code.dazedbear.pro` 指向你的 instance 就完成了

### 使用 AWS Route 53 管理

如果你的 Root Domain 是從 AWS Route 53 註冊的，或者你雖然是從別的 Domain Register 註冊但想用 AWS Route 53 管理 DNS，就需要先幫 Lightsail instance 新建一組 Static IP。[詳細的官方教學在此](https://lightsail.aws.amazon.com/ls/docs/zh_tw/articles/amazon-lightsail-using-route-53-to-point-a-domain-to-an-instance)。

一般來說，剛建好 instance 就會拿到一組 Public IP，你可以在瀏覽器網址列用這組 IP 連到 instance，然而這組 AWS 分配的 Public IP 是有機會被 AWS 調節改動，AWS 確保一定有一組 Public IP 給每一個 instance，但是不保證 Public IP 永遠不會變，就算變了也不會主動通知使用者。因此我們需要新建一個永遠不變的公開 Static IP，將 instance attach 到這組 Static IP，再建一組 DNS A record 指到這組 Static IP。

回到 Lightsail Console，點選 Networking，點選 Create static IP。選擇和你的 instance 一樣的 region。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-static-ip-1.png)

Attach static IP 到你的 instance，再取個名字按 create 就完成了。其中要注意：**Static IP 的收費方式很特別：只要沒有任何 instance attach 到這組 IP 就開始收你錢，如果有 attach 就免費**，確保 IP 資源不會被浪費，所以之後如果清除 instance 別忘了檢查 Static IP 有沒有被清除，否則會被收冤望錢喔 OAO (曾經因為這樣被收過 USD 1x 過...)。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-static-ip-2.png)

回到 AWS Route 53，新增一組 A record 將 `code.dazedbear.pro` 指向 Lightsail Static IP。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-route53-add-record.png)

由於 DNS record 改動要 Push 到網路上各台 DNS server 需要一點時間，可以點選 Test Record Set 先試試看是否有改對。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-route53-test-record.png)

稍等一段時間以後，直接開瀏覽器輸入網址 http://code.dazedbear.pro，看到 bitnami 歡迎頁面就代表成功了。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-bitnami-index.png)

## Step 4：處理 SSL 憑證

接下來要處理 SSL 憑證。需要設定這個是因為 code-server 雖然可以在 http 情況下運行，但你實際使用會出現錯誤訊息：**需要讓 code-server 運行在 https 下所有功能才能正常使用**。因此我們得要幫 instance 加上 SSL 憑證才行。

這一關我卡了超久的，按照正常 Practice 的作法如下：

* 幫 Lightsail 新建一組 ELB (Elastic Load Balancer)
* 到 AWS Certificate Manager 申請 SSL 憑證
* 完成 SSL 憑證申請的 verification
* 回到 Lightsail ELB 裝上申請好的 SSL 憑證

**但是！那個 ELB 收費一個月就要 USD 18**，這根本就超過我們的預算了嗚嗚，所以這招行不通。原本還有嘗試用 Route 53 Alias 指向 Cloudfront，再把 Cloudfront 指到 Lightsail instance，結果 Cloudfront 不支援使用 IP 當作上游 source，因此在 DNS record 繞了很久都試不出來，看來這個方法也不可行。

最後可行的方法是：**直接在 instance 內處理 SSL 憑證！**

### 使用 bitnami https configuration tool 設定憑證

其實我是先用待會介紹的 Let's Encrypt 設定完後，才看到官方教學有這種做法，可以一鍵完成 SSL 憑證的產生與設定。由於沒有實際用過，這邊附上 [官方教學文件](https://aws.amazon.com/tw/premiumsupport/knowledge-center/linux-lightsail-ssl-bitnami/) 有興趣的可以試試看。

### 使用 Let's Encrypt 設定憑證

這邊我是照著 [官方教學](https://lightsail.aws.amazon.com/ls/docs/zh_tw/articles/amazon-lightsail-using-lets-encrypt-certificates-with-wordpress) 做的，由於它是寫給 wordpress，我們只需要照著**做完步驟 1 到 7 即可**，詳細的過程我就不多贅述了，這邊提幾個步驟中我碰到的問題：

#### 步驟 4：TXT DNS Challenge 的眉角

這一步 Let's Encrypt 會請你新增 DNS TXT record 來做驗證。建議指令可以加上 `--dry-run` 使用 [Lets Encrypt 測試環境](https://letsencrypt.org/zh-tw/docs/staging-environment/) 來確保驗證都沒問題後，再拿掉選項使用正式環境處理。我因為卡在這步 TXT DNS challenge 失敗踩到了正式環境的 [Fail Rate 限制](https://letsencrypt.org/zh-tw/docs/rate-limits/) (5次失敗/每小時)，只好去喝杯茶等下一個小時再來...測試環境的 Fail Rate 限制比較寬鬆，可以容許你錯比較多次。

另外，TXT DNS challenge 可能會給你不只一組驗證字串要加進 TXT record，如果你是用 AWS Route 53 的話，它指的是「同一組 TXT record 換一行加入字串」，大約長這樣：

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-route53-lets-encrypt-txt.png)

我就是在這搞不清楚驗證 string 要怎麼填才會一直失敗踩到限制..(汗。由於前面說過 DNS Record 推到各台 DNS server 需要一點時間，這邊 [有個工具](https://mxtoolbox.com/SuperTool.aspx?action=txt%3a_acme-challenge.dazedbear.pro&run=toolpage) 可以幫助你確認 TXT Record 現在的值是多少，確認字串更新上去以後再繼續進行下一步的 TXT DNS 驗證。

#### Reference：解析 Certbot (Let's Encrypt) 使用方式

在查資料時偶然查到 [『解析 Certbot (Let's Encrypt) 使用方式』](https://andyyou.github.io/2019/04/13/how-to-use-certbot/) 這篇文章，雖然還沒有完全拜讀過，但看起來介紹得滿詳細的，就放在這邊推薦給有興趣的人看看。

## Step 5：處理 bitnami proxy

完成上個步驟後，如果你瀏覽 https://code.dazedbear.pro 應該會看到 https 正常運作。那麼這一步驟要做的事情是：

> 起在 8080 port 的 code-server 可以吃到 SSL 憑證，並且指到 /vscode 路徑

為此我們需要改 bitnami proxy，詳細資訊可以參考 [這份官方文件](https://docs.bitnami.com/bch/infrastructure/lamp/administration/enable-https-ssl-apache/) ，這邊簡單講解怎麼改它。首先編輯 `bitnamo.conf` 加上這段設定：

```bash
$ vi /opt/bitnami/apache2/conf/bitnami/bitnami.conf
```

```vi
<VirtualHost _default_:443>
...
# 新增這段
# Proxy for servinf SSL to additional ports
ProxyPass /vscode http://code.dazedbear.pro:8080
ProxyPassReverse /vscode/ http://code.dazedbear.pro:8080
...
</VirtualHost>
```

儲存以後，重新啟動 bitnami 即可。

```bash
$ sudo /opt/bitnami/ctlscript.sh restart
```

## Step 6：調整 Lightsail instance firewall rules

這時候瀏覽 https://code.dazedbear.pro:8080 還打不到任何東西，一方面 code-server 還沒起，而且 Lightsail instance 的 Firewall 也沒有開通這個 port，所以我們需要做調整。

回到 Lightsail console，點選 instance 再點選 Networking，往下找到 Firewall Rules，這邊我們要新增一組 Rule 讓外界打的到 8080 port，填完設定點選 create 就完成了。

    custom / TCP protocal / 8080

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-firewall.png)

## Step 7：啟動並登入 code-server

終於到了令人興奮的一刻：要啟動 code-server 做最後的驗證了。首先回到 Lightsail console，重新點選 Connect using SSH 連到你的 instance 裡面，進到先前解壓縮的資料夾，執行以下指令啟動 server 並將 SSL 憑證餵進去試跑看看。

```bash
$ cd code-server-3.1.1-linux-x86_64
$ sudo ./code-server --host 0.0.0.0 . --cert=/opt/bitnami/apache2/conf/server.crt --cert-key=/opt/bitnami/apache2/conf/server.key
```

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-terminal-code-server.png)

這邊你應該會看到 `Using provided certificate and key for HTTPS` 這行字，代表 https 有運作成功。另外還有一行 `Password is xxxxxx` 這是指每次 code-server 啟動時，預設隨機產生一組 password 供你登入使用，請記得妥善保管喔！

試跑確認沒問題後，ctrl+c 停掉 code-server，我們來安裝好用的 Process 管理工具 [PM2](https://pm2.keymetrics.io/) 讓 code-server 可以在背景執行，也方便我們管理。

    $ npm install -g pm2
    $ pm2 ls

改用以下指令啟動 code-server，並查閱 log 拿到這次的 password：

    $ pm2 start sudo --name vscode --no-autorestart -- ./code-server --host 0.0.0.0 . --cert=/opt/bitnami/apache2/conf/server.crt --cert-key=/opt/bitnami/apache2/conf/server.key
    $ pm2 logs vscode

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/aws-lightsail-terminal-pm2.png)

最後就是到我們辛苦設定好的網址登入，確認一切運作正常就大功告成了！

[https://code.dazedbear.pro/vscode/](https://code.dazedbear.pro/vscode/ "https://code.dazedbear.pro/vscode/")

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/remote-vscode-login.png)

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/remote-vscode-editor.png)

## 成果：手機上運行 Remote VS Code

搭配各種配備在手機上實際跑起來長這樣。

![](https://dazedbear-pro-assets.s3-ap-northeast-1.amazonaws.com/website/remote-vscode-mobile.jpg)

實際上 4.7 吋手機是真的有點小，不過還算可以開發啦哈哈，若是更大一點的平板就非常適合了，操作速度上比起 CodeSandbox 之類的服務快很多，這樣的解決方案一個月收費才 USD 5，比起其他的方案都來得便宜，真的很令人興奮啊啊啊！之後應該會試試官方版本的 Visual Studio Codespaces，更仔細的比較一下兩個版本的差異，應該滿有趣的\~

最近還聽到 [Github 要推出 Built-in IDE](https://www.ithome.com.tw/news/137465) 的消息，看 screenshot 也是使用 VS Code，很期待實際玩起來如何，說不定過一段時間根本不需要這套自架的解決方案，只要開啟 Github 網頁就能直接開發了，真的很令人期待！