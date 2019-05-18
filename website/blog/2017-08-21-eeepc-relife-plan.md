---
title: Eee PC 翻身計畫！
---

## 談談舊電腦翻身計畫


先聲明一下～這篇是單純的紀錄與心得，網路上有太多寫得很好的教學了，因此直接貼連結照著做就OK啦！

想重新整理舊電腦的契機，最早追溯到去年6月的某個週末，我回台南參加母校社團的畢業演唱會。當時正值準備碩士班考試的備審資料，為了輕巧，我帶了iPad和EeePC下去作業，結果可害慘我了！XP沒裝office，網路又只有手機3G，chrome瀏覽器跑不太動office 365 online，google docs也跑得頗痛苦，但是隔天週日要拿推薦信給鋼琴老師簽，結果完全沒辦法打！最後還被迫取消隔天中午的聚餐，直接改用手寫的推薦信取代，吃足了苦頭。

所以後來才開始思考：要如何才能行動作業，兼顧輕巧和效能性（當然，前提是盡可能的省錢，買不起Macbook的窮人家），另一方面，家裡有些舊電腦沒在使用，想說盡可能改造後讓它重生吧！

<!--truncate -->

於是腦筋就動到了EeePC和iPad上。

### iPad：可擴充性高，但取代不了筆電

我從以前到現在，為了擴充iPad的用途，還真的花了不少錢Orz。從Moshi的藍芽鍵盤保護支撐架、SwiftPointer滑鼠、Wacom Creative Stylus 2048觸控筆、50% Pencil觸控筆、還有零零總總的付費App和訂閱，算一算都可以買一台新的iPad Air了...

結果呢？用起來還是有限制。

我曾試過帶iPad去圖書館整理markdown筆記，鍵盤用的滿順手的，但唯一的缺點：一直用手觸控滑螢幕，有點不方便。但要在不JB的情況下，iPad使用滑鼠就是很困難的事。即使是swiftpointer搭配jump的app，也只有在連遠端桌面時才能使用滑鼠。先前有個在集資網站kikstarter的mbox，看了是很想買，但看評論貌似一直推遲出貨，感覺很危險。所以無法使用滑鼠這件事，暫時無法解決。

行動coding目前都走web browser，也就是用chrome開啟線上的編輯器網頁（CodePad、CodePen、JS Bin、coddingground）。但鍵盤操作上有些bug，用起來仍有些不順。至於App版的codeanywhere，雖然是裡面功能最強、整合雲端服務可以起sandbox，但是一堆設定都要你開啟網頁操作，還每次都要登入，重點是有收訂閱費用啊！！用起來不太開心。

用iPad手繪筆記、手寫樂譜這個我都弄過，平日用到機率極低，也不太好用老實說。

基於以上理由，還是乖乖弄台電腦比較實在。

### EeePC
首先動它是有幾個原因：

1. 輕巧，真的很輕巧
2. 有質感的筆電哪裡找呢？
3. 幾乎沒在使用，所以可以放心的整台洗掉重弄

其中壓垮駱駝的最後一根稻草(?的其實是chromebook。

剛好看到Google有推出自家的雲端作業系統chrome OS，搭載的硬體規格幾乎和我的EeePC一樣，我的還略勝一點點。雖然沒有直接提供chrome OS下載，但是有推出開源實驗版的chromium OS，何不自己來試試看呢？

於是兩個週末就栽下去了~

## EeePC大變身！

改造的方案就兩個方向：灌chromium OS變成偽chromebook、或者安裝linux發行板。

### Chromium OS & CloudReady

個人的體驗是：如果想快速無腦、只要USB不需要重灌就能嘗試chromeium OS的操作，請直接搜尋CloudReady。他是基於chromium OS再開發的，基本上2007年以後的電腦都能跑（只要有支援EFI的開機選項即可），但也有像我一樣的例外（淚

用起來的感覺：像是所有事情都在chrome上面完成，修圖、文書處理、開發....等。要安裝的軟體只能從Application Store找，本機只有少少的空間存資料，其他都需要直接存到雲端硬碟，因此行動網路是不可或缺的。看個人工作習慣而定。

後來有嘗試自己編譯chromium OS的原始碼，但是起了兩次ubuntu的虛擬機跑，都因為原始碼太肥大載不完、無法順利編譯而宣告失敗。此外，考量到有開發程式的需求（要裝有的沒的），故改成裝linux的發行版。

### 輕量的Linux發行版

上網搜尋「輕量的Linux發行版」就能找到wiki的清單，相較於一般linux系統比較不吃電腦資源、運算效能也比較高、安裝容量也很少，相當適合老舊電腦使用。

然而，小筆電的硬體規格真的很低，最新的ubuntu或是介面很潮的elementary OS，基本上跑不動。小一點的Zorin OS跑起來也是會讓人抓狂。最後只好選擇輕量特化的Lubuntu安裝。Lubuntu是基於Ubuntu做效能優化的版本，Zorin和Lubuntu雖然同屬輕量的版本，但執行速度卻差了一大截。唯一令人詬病的，就是介面太醜Orz

好在因為Lubuntu屬於Ubuntu家族，有許多修改介面的套件可以使用。其中最潮的，大概就是Macbuntu了。

### 從Lubuntu到（偽）Mac OS

Lubuntu要修改介面，必須自己手動改很多部份：openbox（視窗）、icons圖示、圖形元件...，真的要花一番功夫找齊零件後再更換。詳細可以參考 [How to Theme Up Lubuntu](https://www.maketecheasier.com/theme-up-lubuntu/) 這篇文章。

不過，現在有打包好的套件可以直接裝，沒意外的話立馬就能大變身！

### Macbuntu with NoobsLab

NoobsLab會在每次Ubuntu推新版本後，針對新版本找齊可用的套件，將Ubuntu打造成Mac OS的外觀。如果喜歡自己一步步動手改的，可以參考他們的官方教學。
* [Macbuntu with NoobsLab](http://www.noobslab.com/2017/06/macbuntu-transformation-pack-ready-for.html)

至於希望直接簡單裝裝改改就好的，可以參考這篇 [How To Make Ubuntu Look Like Mac (In 5 Steps) - OMG! Ubuntu!](http://www.omgubuntu.co.uk/2017/03/make-ubuntu-look-like-mac-5-steps) 。安裝GNOME Shell大幅減化拉皮的複雜程度，再搭上非常便利的套件管理工具，幾乎像是下載一個theme然後按啟用(?一樣簡單。

我其實上面兩種都嘗試過了（花了一整天美好的週六...），第二種方式雖然最接近Mac OS介面，但是會影響到效能，因此還是用第一種方式改造～就大功告成啦～

(圖我再補上 OAO)

## Next: 老舊Win7筆電改造！

下一步我打算重灌5年的ASUS筆電，然後申請帶去公司使用。不然上班只能用虛擬桌機也太慘了，捲個chrome的網頁畫面都會破圖....目前筆電送回華碩皇家做維修，預計週五前會回來，原則上大概就是Ubuntu + Macbuntu啦 XDD

再見了Windows，我已經回不去了（揮手帕
