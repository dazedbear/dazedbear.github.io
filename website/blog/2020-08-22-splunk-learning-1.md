---
unlisted: true
title: "[DRAFT] Splunk 基礎介紹"

---
# Spunk 基礎介紹

前言

cover

<!-- truncate -->

## 環境架設

* [https://hub.docker.com/r/splunk/splunk](https://hub.docker.com/r/splunk/splunk "https://hub.docker.com/r/splunk/splunk")

      docker run -d -p 8000:8000 -e "SPLUNK_START_ARGS=--accept-license" -e "SPLUNK_PASSWORD=<password>" --name splunk splunk/splunk:latest
* 從官網教學下載測試資料: [https://docs.splunk.com/Documentation/Splunk/8.0.5/SearchTutorial/Systemrequirements#Download_the_tutorial_data_files](https://docs.splunk.com/Documentation/Splunk/8.0.5/SearchTutorial/Systemrequirements#Download_the_tutorial_data_files "https://docs.splunk.com/Documentation/Splunk/8.0.5/SearchTutorial/Systemrequirements#Download_the_tutorial_data_files")
* 匯入測試資料: [https://docs.splunk.com/Documentation/Splunk/8.0.5/SearchTutorial/GetthetutorialdataintoSplunk](https://docs.splunk.com/Documentation/Splunk/8.0.5/SearchTutorial/GetthetutorialdataintoSplunk "https://docs.splunk.com/Documentation/Splunk/8.0.5/SearchTutorial/GetthetutorialdataintoSplunk")
* 試玩環境：[http://code.dazedbear.pro:8000/](http://code.dazedbear.pro:8000/ "http://code.dazedbear.pro:8000/") (guest/dazedbear.guset)

## Search 指令介紹

* reference: [https://docs.splunk.com/Documentation/Splunk/8.0.5/SearchReference/Whatsinthismanual](https://docs.splunk.com/Documentation/Splunk/8.0.5/SearchReference/Whatsinthismanual "https://docs.splunk.com/Documentation/Splunk/8.0.5/SearchReference/Whatsinthismanual")
* manual: [https://docs.splunk.com/Documentation/Splunk/8.0.5/Search/GetstartedwithSearch?ref=hk](https://docs.splunk.com/Documentation/Splunk/8.0.5/Search/GetstartedwithSearch?ref=hk "https://docs.splunk.com/Documentation/Splunk/8.0.5/Search/GetstartedwithSearch?ref=hk")

## 常用搜尋情境

* RPS
* 某個 request

## Visualization 指令介紹

## 串接 K8S 注入 logs