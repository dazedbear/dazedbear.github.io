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

其實現在有許多的 online code editor 服務，只需打開瀏覽器連到網站就可以使用，對前端來說常見的有 [Codepen](https://codepen.io/)、[JS Bin](https://jsbin.com/?html,output)，有些支援單種/多種需編譯的語言，像是 [repl.it](https://repl.it/languages)、[CodeChef](https://www.codechef.com/ide) 等，隨便搜尋一下都非常多。大多數用途是測試語法、練習演算法、社群提問時方便分享程式碼片段等，不太能夠完整開發一個專案。

想要連動使用版控、有 terminal 可以下指令、設置斷點除錯等，這時候你需要的是完整的 Cloud IDE。

Cloud IDE 實際上是起一台 VM 或 Containerr 並安裝 IDE 供你開發使用，因此普遍都是需要收費的，就看只收 VM 運行費用還是包含其他費用的差別。來看一下有哪些常見的服務。

*  [AWS Cloud9](https://aws.amazon.com/tw/cloud9/)：早年有名的 Cloud IDE 就是 Cloud9，後來在 2016 年被 AWS 收購改名
* [Google Cloud Code](https://cloud.google.com/code)：看介紹覺得不太算是 Cloud IDE，它比較像 AWS Lambda 那種 FaaS (function as a service) 的服務，方便你選用熟悉的 IDE 開發 Kubernate
* [Azure Visual Studio Codespaces](https://visualstudio.microsoft.com/zh-hant/services/visual-studio-codespaces/)：VS Code 雲端版，需綁定 Azure 帳戶使用
* [CodeSandbox](https://codesandbox.io/index2)：Web 開發常用的服務，可以免費使用，也是以 VS Code 為基礎
* [Gitpod](https://www.gitpod.io/)：可以免費使用 (有運行時數限制)，也是以 VS Code 為基礎

### Step 1：起一台 AWS Lightsail VM，1G RAM，[價格](https://aws.amazon.com/tw/lightsail/pricing/)

### Step 2：安裝核心 library：[cdr/code-server](https://github.com/cdr/code-server)

```bash
    $ wget https://github.com/cdr/code-server/releases/download/3.1.1/code-server-3.1.1-linux-x86_64.tar.gz
    $ tar zxvf code-server-3.1.1-linux-x86_64.tar.gz
```

### Step 3：處理 DNS

AWS Route 53 新增 subdomain 指向 Lightsail Public IP

### Step 4：處理 SSL 憑證

#### 使用 bitnami https configuration tool

一鍵自動設定 ([doc](https://aws.amazon.com/tw/premiumsupport/knowledge-center/linux-lightsail-ssl-bitnami/))

#### 手動設定 Let's Encrypt 產生新的憑證

完成 [教學](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/amazon-lightsail-using-lets-encrypt-certificates-with-wordpress) 的 step 1 - 7 即可。

* 可以先用 `--dry-run` [測試環境](https://letsencrypt.org/zh-tw/docs/staging-environment/)測過沒問題，再正式處理，否則一直在 TXT DNS challenge 失敗會碰上[ rate 限制](https://letsencrypt.org/zh-tw/docs/rate-limits/) (5次失敗/每小時)
* 幫助 debug 工具：[https://mxtoolbox.com/SuperTool.aspx?action=txt%3a_acme-challenge.dazedbear.pro&run=toolpage](https://mxtoolbox.com/SuperTool.aspx?action=txt%3a_acme-challenge.dazedbear.pro&run=toolpage "https://mxtoolbox.com/SuperTool.aspx?action=txt%3a_acme-challenge.dazedbear.pro&run=toolpage")
* 遇到多筆的 TXT 驗證：route 53 是同一個 domain 新增一行文字
* Let's encrypt 解析：[https://andyyou.github.io/2019/04/13/how-to-use-certbot/](https://andyyou.github.io/2019/04/13/how-to-use-certbot/ "https://andyyou.github.io/2019/04/13/how-to-use-certbot/")

### Step 5：處理 bitnami proxy

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

### Step 6：啟動 code-server 實際檢查一次

```bash
$ sudo ./code-server --host 0.0.0.0 . --cert=/opt/bitnami/apache2/conf/server.crt --cert-key=/opt/bitnami/apache2/conf/server.key
```

拿到 password 從以下的 url 登入，確認是否運作沒問題

[https://code.dazedbear.pro/vscode/](https://code.dazedbear.pro/vscode/)

### Step 7：改為背景執行 code server

停掉 server 然後安裝 PM2，再執行以下指令：

```bash
$ npm intall -g pm2
$ pm2 start sudo --name vscode --no-autorestart -- ./code-server --host 0.0.0.0 . --cert=/opt/bitnami/apache2/conf/server.crt --cert-key=/opt/bitnami/apache2/conf/server.key
```