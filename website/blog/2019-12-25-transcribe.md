---
title: 簡介我的採譜工具與流程
---

![文章 Cover](https://images.unsplash.com/photo-1453906971074-ce568cccbc63?ixlib=rb-1.2.1&auto=format&fit=crop&w=3300&q=80)
> Photo by [Dayne Topkin](https://unsplash.com/@dtopkin1) on [Unsplash](https://unsplash.com/)

好久沒發文了，趁著今天休假，來簡單介紹我的採譜配備與流程，刷刷存在感~

<!-- truncate -->

## 什麼是「採譜」?

它有另一個叫「抓歌」，就是一邊聽著歌曲一邊寫出它的樂譜，把曲子裡的調性、和聲、段落、旋律、演奏技巧記錄到樂譜上，以便拿來給自己或樂團演奏、或是進一步分析曲式。

先來看一段 [Nice Chord 好和弦](https://www.youtube.com/channel/UCVXstWyJeO6No3jYELxYrjg) 介紹採譜的影片：

<div style="overflow:hidden;padding-top:56.25%;position:relative;">
    <iframe src="https://www.youtube.com/embed/DA3-sINdvHk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" style="width:100%; height:100%; position:absolute; top:0; bottom:0; left:0; right:0;" allowfullscreen></iframe>
</div>


我整理一下影片中提到的重點：

- 音感不夠好時，輔助工具很重要（速度控制、loop、filter、spectrum）
    - Sonic Visualizer
    - DAW
- 採譜的深度
    - 原位和弦
    - 轉位和弦
    - 延伸音、變化音
    - 全部的音 voicing
- 採譜流程
    - 先找 bass 音
    - 單獨演奏 3度、5度、7度判斷和弦性質
    - 最後大絕招：頻譜分析圖 (spectrum) 直接看每個音與 voicing

這篇會著重在輔助工具的介紹，因為我看完影片實際試用軟體後，覺得不太好用，尤其是 Sonic Visualizer 還要安裝 Plugin，安裝方法老實說連工程師都覺得滿麻煩的。因此決定另行出路，嘗試找到最簡單的作業方式。

## 採譜的輔助工具 (軟體)

由於我的音感還算可以，不需要開大絕招開頻譜分析圖看音高是哪些，再加上是採 Bass 譜，旋律線經常被各種樂器掩蓋聽不清楚，所以 EQ Filter 過濾不必要的高頻、速度控制這兩項對我來說很重要。

![](https://dazedbear-assets.s3-ap-northeast-1.amazonaws.com/music-tech/workspace.png)

- 歌曲來源
    - [Spotify](https://open.spotify.com/)
    - [Youtube](https://www.youtube.com/)
- 製譜軟體
    - [Sibelius | Ultimate](https://www.avid.com/sibelius-ultimate)
- 輔助工具 (Chrome Extension)
    - [EQ - Audio Equalizer](https://chrome.google.com/webstore/detail/eq-audio-equalizer/ffhjbkfidmbmakichopfmikigcfndjgf)
    - [Spotify Playback Speed Access](https://chrome.google.com/webstore/detail/spotify-playback-speed-ac/cgbihpjbhpdfbdckcabcniojdhcgblhd)


我是分割視窗的愛好者，所以會盡可能把用到的工具放到同一個桌面上，而播放音樂的來源是用網頁播放器，因此將腦筋動到 Chrome Extension 上，找到兩個擴充套件來協助頻率過濾、播放速度調整 (Youtube 就有內建此功能)。

至於製譜軟體，個人習慣用 Sibelius，它分成免費 Sibelius|First 和付費的 Sibelius 與 Sibelius|Ultimate 版，由於會使用到一些特殊記號，Ultimate 版才能符合我的需求。它也可以用來寫吉他貝斯的 Tab 譜，可以不用特地再裝 Guitar Pro。

如果有錢且需要寫複雜的管弦樂譜，推薦直上 [Finale](https://www.finalemusic.com/)。如果沒什麼預算，可以考慮 [MuseScore](https://musescore.org/zh-hant)，雖然 UX 設計實在有些需要加強，不過功能算滿成熟的，一般製譜需求應該相當足夠。

## 採譜的輔助工具 (硬體)

![](https://dazedbear-assets.s3-ap-northeast-1.amazonaws.com/music-tech/equipment.jpg)

- [Sony MDR-7506 監聽耳機](https://digilog.tw/products/357)
- [Keith McMillen Instruments K-Board MIDI 鍵盤](https://digilog.tw/products/365)
- [Swiftpoint GT 滑鼠 (絕版)](https://www.swiftpoint.com/ap/store/swiftpoint-gt-mouse-2/)
- [innowatt DOCK Pro Plus - USB Type-C Combo Hub iW71](https://innowatt.waca.ec/product/detail/84194)
- Macbook Pro 15' 筆電 (公司的哈哈)

我的配備大約就這些，耳機選擇經典不敗 7506 (捲線的設計讓我不用煩惱收線)、搭配輕巧的轉接器、滑鼠、MIDI Keyboard，即使外出作業也非常輕便，全部收起來就一個筆電包 + 耳機袋而已，在美食街那種兩人座的小方桌都可以工作。

## 我的採譜製作流程

其實製作流程每個人都大相徑庭，這邊介紹我自己的流程。

我希望樂譜寫得越細越好，這是為了以後重新拿出來彈奏時，可以馬上回想起所有細節，因此有五線譜記旋律線、Tab 譜記編好的彈法。但五線譜有個致命缺陷：無法即時轉調，這在流行樂團中滿吃虧的，因此我會再補上旋律線的音級 (最好再補上和弦級數)，比起簡譜記號更好看懂。所以一份樂譜其實要花至少 5 - 10 小時完成，但完成後練團就很輕鬆了 (?)

因此我是照這個順序完成一份 Bass 採譜：

1. 先找出調性、拍號、速度
2. 先插入空白小節，把段落劃分好
3. 在五線譜寫 Bass 旋律線 (因為音高節奏只會有一個，不會有模糊地帶)
4. 複製所有五線譜音符，貼到 Tab 譜上自動產生指法 (Sibelius 這功能超好用)
5. 從頭順過一次 Tab 譜指法，調整不順手或音色不對的地方
6. 補上旋律線音級、和弦級數以便轉調
7. 實際練團時照跑一次，標出有問題 or 要調整的地方，回家再修改

這邊放一個範例當作參考~

<div style="overflow:hidden;padding-top:100%;position:relative;">
    <iframe src="https://sibl.pub/BJe2dkZkI" frameborder="0" style="height: 100%; width: 100%; position: absolute; top: 0; bottom: 0; left: 0; right: 0;" allowfullscreen></iframe>
</div>

## 小結

今天簡單介紹了我的採譜工具與流程，希望對於有類似需求的人能有點幫助。下一個階段我想嘗試用最輕巧的方式採譜：只用一隻智慧手機和耳機，這部分我想是需要自己開發軟體來達成了，希望有朝一日能夠和大家分享這個主題~感謝收看！


<iframe scrolling="no" frameborder="0" class="likecoin" src="https://button.like.co/in/embed/dazedbear/button?referrer=https://www.dazedbear.pro/blog/2019/12/25/transcribe"></iframe>