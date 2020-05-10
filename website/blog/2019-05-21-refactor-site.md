---
title: 網站翻新 2.0
---

沒錯！這次是網站的 Breaking Change，從網域到背後架構整套翻新了，只留下舊有文章而已。
今天來簡單介紹翻新的理由與過程~

<!-- truncate -->

## 重建的理由

上一版採用 [Gatsby.js](https://www.gatsbyjs.org/docs/)，搭配 Material UI 的 [gastby-material-starter](https://www.gatsbyjs.org/starters/Vagr9K/gatsby-material-starter/) 模板快速建了一個站，雖然還不錯，但有些地方可以再改善：

- 外觀配色不順眼
- 用手機瀏覽文章，一些如文章綱要等操作都沒有，有點不方便
- 要客製化外觀，有點受限於 Material UI 的設計，style 撰寫、顏色選擇上比較受限
- 我建了一個 organization `Einfach Studio` 想獨立經營，但年初換工作時才發現反而自己的 github 帳號都沒有 contribute 活動，索性決定移除它，搬回主帳號下用 `DazedBear Studio` 經營
- 前一版只有放置文章，但我希望能把所有文章、做過的練習、side project、甚至是影音都放在同一個地方，當作數位個人品牌經營

基於這些理由，我才決定要重建網站，雖然想法寫下來到完成拖了很久就是了 (笑)

## 製作過程

### Docusaurus

前兩週我在嘗試製作團隊用的文件時，碰巧查到眾多開源文件的產生器 [Docusaurus](https://docusaurus.io/en/)，試用一下覺得很好上手，加上它的版型是我想要的 (左側有選單、右側有文章綱要導覽 onPageNav)，預設就有支援 RWD ，雖然坦白說客製的彈性比 [gatsby-starter-default](https://www.gatsbyjs.org/starters/gatsbyjs/gatsby-starter-default/) 還少，但它確實能符合我的需求：雙導覽列、demo、文件、blog 等，因此決定採用它。

基本上照官方文件做很快就好了，直接跳過它~

### CI 建置

沒意外持續沿用 Travis CI，只是在 build 成功或失敗時，通知方式由 slack 改回 email (原本個人的 slack 我移除了，追求環保)。

#### Environment Variables 並非萬能

過程中遇到一個問題：我不想要信箱直接寫進原始碼，可能會收到很多垃圾信 (?) 於是嘗試用環境變數像這樣餵進去：

```yml
# .travis.yml
notifications:
  email:
    recipients:
      - "${GH_EMAIL}"
    on_success: always
    on_failure: always
```

BUT！ Travis CI 在 notification 的欄位沒辦法在 runtime 動態帶值進去，詳情請見這個 [issue](https://github.com/travis-ci/travis-ci/issues/2711)，因此行不通導致收不到信，也不會有任何 error 訊息。

#### Encrypt without Travis CLI

既然橫豎都要寫進去，換個手法加密它好了。以往都需要設定 ruby 和 gem，然後安裝 [Travis Client CLI](https://github.com/travis-ci/travis.rb) 像這樣執行加密指令再複製貼回 `.travis.yml`

```bash
$ travis encrypt <my_email>
Please add the following to your .travis.yml file:

  secure: "gSly+Kvzd5uSul15CVaEV91ALwsGSU7yJLHSK0vk+oqjmLm0jp05iiKfs08j\n/Wo0DG8l4O9WT0mCEnMoMBwX4GiK4mUmGdKt0R2/2IAea+M44kBoKsiRM7R3\n+62xEl0q9Wzt8Aw3GCDY4XnoCyirO49DpCH6a9JEAfILY/n6qF8="

Pro Tip: You can add it automatically by running with --add.
```

```yml
# .travis.yml
notifications:
  email:
    recipients:
      - secure: "gSly+Kvzd5uSul15CVaEV91ALwsGSU7yJLHSK0vk+oqjmLm0jp05iiKfs08j\n/Wo0DG8l4O9WT0mCEnMoMBwX4GiK4mUmGdKt0R2/2IAea+M44kBoKsiRM7R3\n+62xEl0q9Wzt8Aw3GCDY4XnoCyirO49DpCH6a9JEAfILY/n6qF8="
```

但其實很麻煩...像我運氣不好環境搞不定時，根本就不能執行安裝指令，怎麼加密啊!! 只好找找看有沒有別的解法了。果然自己並不孤單，StackOverflow 就有人[問過這問題](https://stackoverflow.com/questions/48013546/how-to-encrypt-api-keys-for-travis-ci-configuration-with-bash-cli-without-ruby)，找到可以不用裝 CLI 也能加密的方法：

1. 新建一支 shell script `travis-encrypt.sh` 內容如下：

```shell
#!/bin/bash
# Code from https://gist.github.com/openscript/082bd53b28505337510d9e69386b5fc5

usage() { echo -e "Travis Encrypt Script\nUsage:\t$0 \n -r\t<username/repository> \n -e\t<string which should be encrypted>" 1>&2; exit 1; }

while getopts ":r:e:" param; do
  case "${param}" in
    r)
      r=${OPTARG}
      ;;
    e)
      e=${OPTARG}
      ;;
    *)
      usage
      ;;
  esac
done
shift $((OPTIND -1))

if [ -z "${r}" ] || [[ !(${r} =~ [[:alnum:]]/[[:alnum:]]) ]] || [ -z "${e}" ]; then
  usage
fi

key_match="\"key\":\"([^\"]+)\""
key_url="https://api.travis-ci.org/repos/${r}/key"
request_result=$(curl --silent $key_url)

if [[ !($request_result =~ $key_match) ]]; then
  echo "Couldn't retrieve key from ${key_url}. "
  usage
fi

echo -n "${e}" | openssl rsautl -encrypt -pubin -inkey <(echo -e "${BASH_REMATCH[1]}") | openssl base64 -A
echo
```

2. 添加 script 的執行權限

```bash
chmod +x travis-encrypt.sh
```

3. 執行指令得到加密字串

```bash
./travis-encrypt.sh -r <username>/<repositoryname> -e <YOUR_SECURE_DATA>
```

原理簡單說就是[打 Travis CI API 取得自己 repo 的 public key](https://docs.travis-ci.com/user/encryption-keys/#fetching-the-public-key-for-your-repository)，然後用 [OpenSSL](https://www.openssl.org/) 搭配這把公鑰將輸入的值進行 RSA 加密就完成了！可以不用再裝 Travis CLI 覺得很開心~

### 部署到 Github Pages 與自訂 Domain

將靜態網站部署到 Github Pages 幾乎是常識了，沒有對 domain 有太多要求的話非常方便。[Docusaurus 也內建了指令方便執行 Github Pages 部署](https://docusaurus.io/docs/en/publishing#using-github-pages)。

#### Custom Domain vs. SSL Certificate

但是若想要用自己購買的 domain (custom domain) 的話，以往的教學文章都說不支援 custom domain 之下提供 SSL 憑證，需要搭配 [Cloudflare](https://www.cloudflare.com/zh-tw/) 處理。但從[這篇文章](https://blog.gslin.org/archives/2018/05/02/8295/github-%E9%80%8F%E9%81%8E-lets-encrypt-%E6%8F%90%E4%BE%9B%E8%87%AA%E8%A8%82%E7%B6%B2%E5%9F%9F%E7%9A%84-https-%E6%9C%8D%E5%8B%99/)得知 2018 年 5 月 Github Pages 就和 [Let's Encrypt](https://letsencrypt.org/) 服務合作解決這個問題，正好也要換新 domain 就順便試試看。

#### 通用頂級域名

我的新 domain 是從 AWS Route 53 購買，順道一提 `.com`、`.org` 之類的[通用頂級域名 (gTLD)](https://www.wikiwand.com/zh-tw/%E9%80%9A%E7%94%A8%E9%A0%82%E7%B4%9A%E5%9F%9F) 通常價格都相對便宜，約略每年 USD 10 ~ 15 左右 ( `.io` 現在超貴，一年要 USD 49，不如花 USD 12 買 `.com` )，另外從 2015 年起各個通用頂級網域的限制放寬鬆以後，多了很多選擇，可以多參考比較看看 ~ 像我就買了 `.pro` 的網域自己開心一下哈哈！

#### 設定 DNS Record & SSL Certificate

這一段我卡超久的，主要原因是以前用 AWS 架靜態網站，不外乎是這樣

- 新建 S3 放檔案
- Route 53 購買 Domain
- AWS Certificate Manager 到 US Virginia Region 申請新的 SSL 憑證
- 新建 CloudFront Source 源指向 S3 bucket，備用 CNAME 加上你想使用的網域名稱，然後掛上 SSL 憑證
- Route 53 A record ALIAS 到 CloudFront，大功告成

原先以為 CloudFront 可以類似 Cloudflare 的功能幫網站加上 SSL 憑證，再 CNAME 回 github pages 即可，所以在 Route 53 做了這樣的設定：

```dns
www.dazedbear.pro A ALIAS CloudFront (optinal CNAME: site.dazedbear.pro)
site.dazedbear.pro CNAME dazedbear.github.io
```

打開 Github Repo Setting，custom domain 填入 `site.dazedbear.pro`，勾選 enforce HTTP to HTTPS。

結果各種「轉導次數太多」、「DNS Resolve Failed」的錯誤。又因為短時間一直改 DNS Record，導致每次測試結果都會變來變去 (DNS Propogation 需要一點時間)。後來隔天再嘗試，發現根本不用這麼麻煩，你只需要這樣設定就好：

```dns
www.dazedbear.pro CNAME dazedbear.github.io
```

打開 Github Repo Setting， custom domain 填入 `www.dazedbear.pro` ，勾選 enforce HTTP to HTTPS，就設定完成了！

超簡單的啊對不對～詳細可以參考[官方文件](https://help.github.com/en/articles/using-a-custom-domain-with-github-pages)實作看看。

## 小結

這次用了一個週末整整兩天的時間，從開新 Repo 到全部做完串完 CI 和 Google Analytics，是真的挺衝動的哈哈哈，不過看到全新的樣貌心情就很好，再加上內容空空的就很想要補上去 XD 希望接下來可以持續充實這裡~

今後也請多多指教噢！

<iframe scrolling="no" frameborder="0" class="likecoin" src="https://button.like.co/in/embed/dazedbear/button?referrer=https://www.dazedbear.pro/blog/2019/05/21/refactor-site"></iframe>