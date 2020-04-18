---
unlisted: true
title: "[DRAFT] 在手機上用 VS Code 開發！！"

---
介紹 mobile 跑 VSCode 的方法

* 起一台 AWS Lightsail VM，1G RAM，[價格](https://aws.amazon.com/tw/lightsail/pricing/)
* 安裝 docker [https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script](https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script "https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script")

    $ curl -fsSL https://get.docker.com -o get-docker.sh
    $ sudo sh get-docker.sh
    $ sudo usermod -aG docker $USER

* 重開 SSH session，確認 docker 安裝成功

    $ docker -v

* 安裝核心 library：[cdr/code-server](https://github.com/cdr/code-server)

    docker run -it -p 8080:8080 -v "$PWD:/home/coder/project" -u "$(id -u):$(id -g)" codercom/code-server:latest

* 拿到 password 從 public IP 登入，確認運作沒問題
* 處理 SSL 憑證
  * AWS Route 53 新增 subdomain 指向 lightsail public IP
  * 使用 Let's Encrypt 產生新的憑證，[教學](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/amazon-lightsail-using-lets-encrypt-certificates-with-wordpress)
  * 可以先用 `--dry-run` [測試環境](https://letsencrypt.org/zh-tw/docs/staging-environment/)測過沒問題，再正式處理，否則一直在 TXT DNS challenge 失敗會碰上[ rate 限制](https://letsencrypt.org/zh-tw/docs/rate-limits/) (5次失敗/每小時)
  * 幫助 debug 工具：[https://mxtoolbox.com/SuperTool.aspx?action=txt%3a_acme-challenge.dazedbear.pro&run=toolpage](https://mxtoolbox.com/SuperTool.aspx?action=txt%3a_acme-challenge.dazedbear.pro&run=toolpage "https://mxtoolbox.com/SuperTool.aspx?action=txt%3a_acme-challenge.dazedbear.pro&run=toolpage")
  * 遇到多筆的 TXT 驗證：route 53 是同一個 domain 新增一行文字
  * Let's encrypt 解析：[https://andyyou.github.io/2019/04/13/how-to-use-certbot/](https://andyyou.github.io/2019/04/13/how-to-use-certbot/ "https://andyyou.github.io/2019/04/13/how-to-use-certbot/")

<!-- truncate -->