---
unlisted: true
title: "[DRAFT] 在手機上用 VS Code 開發！！"

---
介紹 mobile 跑 VSCode 的方法

<!-- truncate -->

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
$ pm2 start sudo --name vscode --no-autorestart -- "./code-server --host 0.0.0.0 . --cert=/opt/bitnami/apache2/conf/server.crt --cert-key=/opt/bitnami/apache2/conf/server.key"
```