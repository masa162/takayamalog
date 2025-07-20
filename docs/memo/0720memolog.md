20250720
作業を開始します。

/Users/nakayamamasayuki/Documents/GitHub/takayamalog/docs/作業報告書/作業報告書\_夜遊び研究所\_20250719.md

/Users/nakayamamasayuki/Documents/GitHub/takayamalog/docs/基本設計書

プロジェクト資料を共有します。
把握してください

＠/Users/nakayamamasayuki/Documents/GitHub/takayamalog/docs/tem_img/screenshot 2025-07-20 12.15.57.jpg

gemini CLIではディレクトリを示すときは「＠」をつけるんでしたっけ？

記事ページUIの調整から行います

https://shakinghip.com/blog-entry-5029.html
競合サイト↑

記事ページはタイトル、サムネが０スクロールの次点で表示されることが重要です。

「夜遊び研究所
研究報告書
Report No. SETOKANNAAVDEBUT / 2025719
FANZA動画
研究完了」

「研究日
2025年7月19日
読了時間
4分
閲覧数
7
研
研究員
高山まさあき
研究キーワード:
AVデビュー
S1
新人
元アイドル
瀬戸環奈
⚠️ この記事は18歳未満の方の閲覧を禁止しています。成人向けコンテンツが含まれています。」

の記事メタ情報を
メイン記事の下に移してください

サイトのTOPで年齢の確認、認証を行っています。
各ページでは
「⚠️ この記事は18歳未満の方の閲覧を禁止しています。成人向けコンテンツが含まれています。」
の項目の表示は必要ありません。削除してください。

@/Users/nakayamamasayuki/Documents/GitHub/takayamalog/docs/tem_img/screenshot 2025-07-20 12.24.58.jpg
ありがとうございます、
細かく記事ページUIを理想に近づけていきましょう

記事タイトル上にある
「夜遊び研究所
研究報告書
Report No. SETOKANNAAVDEBUT / 2025719
FANZA動画
研究完了」

これらのメタ情報は削除してください。

参考サイト↓
https://avreview24.com/

現状
https://www.takayamalog.com/
では黒ベースの配色になっていますが、フレンドリー、ポップさ、健全さのバランスも重要です。

ライトモード、ダークモードは閲覧者の環境に合わせるしくみでお願いします

ありがとうございます、表示希望道理になりました。

今、markdown形式の記事が適用されてないようです。
調整お願いします

＠/Users/nakayamamasayuki/Documents/GitHub/takayamalog/docs/tem_img/screenshot 2025-07-20 12.34.16.jpg

---

＠/Users/nakayamamasayuki/Documents/GitHub/takayamalog/docs/tem_img/screenshot 2025-07-20 12.37.05.jpg
TOPページ

デバッグ用につけていた項目
「✅ 静的版: 3 latest, 3 popular, 3 categories」
を削除

「⚠️ 18歳未満の方は閲覧できません」
を削除
お願いします

---

一覧ページに表示するアイキャッチ画像
記事ページ内に表示させる画像を調整します。

根本的な提案ですが、
画像はWEBレンタルサーバーlolipopを契約していて
imgディレクトリに画像を配置しておき

運用ブログでは以下のようにそのURLを呼ぶかたちで運用しています。
https://masa86.com/posts/20250712/

![alt text](https://mn86.tonkotsu.jp/img/2025/07/001.jpg).

＠/Users/nakayamamasayuki/Documents/GitHub/takayamalog/docs/tem_img/screenshot 2025-07-20 12.44.25.jpg

つまりlolipopを時前の画像CDNとして使っています。

当高山サイトでもこの運用を適用したいと考えています。
アドバイスお願いします

あと、ついでに
他のブログでもこのlolipopを画像CDNとして使いまわしているので、
csv
画像の
ファイル名,ディレクトリ,呼び出しURL,利用先,メモ

などを記載して管理するCSVを用意しておこうかと考えています。
アドバイスお願いします

---

@/Users/nakayamamasayuki/Documents/GitHub/takayamalog/docs/image_management.csv
ありがとうございます、項目を調整しました。
たしかに、ベースURLと格納ディレクトリ、ファイル名を入力するかたちで、呼び出しURLがカラムに自動的に組み合わさるのは便利ですね。
調整お願いします

https://mn86.tonkotsu.jp/img/ takayamalog/fanza/2025/07/

https://mn86.tonkotsu.jp/img/takayamalog/fanza/2025/07/kanna01.jpg
https://mn86.tonkotsu.jp/img/takayamalog/fanza/2025/07/kanna02.jpg
https://mn86.tonkotsu.jp/img/takayamalog/fanza/2025/07/kanna03.jpg

![alt text](https://mn86.tonkotsu.jp/img/takayamalog/fanza/2025/07/kanna01.jpg).

@/Users/nakayamamasayuki/Documents/GitHub/takayamalog/docs/tem_img/screenshot 2025-07-20 13.20.00.jpg
軽微なことですので後回しにしてもいいんですが、
＠/Users/nakayamamasayuki/Documents/GitHub/takayamalog/content/articles

に記事を追加する仕組みになっていますが、
これを
＠/Users/nakayamamasayuki/Documents/GitHub/takayamalog/content/articles/fanza
の中に格納しようとすると、記事が認識されないようです。

長期的にはsupabase管理導入すれば、どこに格納しててもある程度やりやすいと思うのですが、
MD記事ファイルを今のところ半分人力で管理しようとすると心理的には階層管理したくなりますね。
このあたりアドバイスあったら教えてほしいです

ではファイル名が重複しないような、バックエンド（自分がわかればいいだけ）のこれまた、CSVでテーブル的なメモを書いておこうと思います。
カラムが多くなると、それ自体を管理するのに疲れてしまうwordpress状態になってしまいそうなので、ミニマムにしようとは思います。
アドバイスあったらお願いします

＠/Users/nakayamamasayuki/Documents/GitHub/takayamalog/content/articles/fanza/seto-kanna-av-debut.md

に画像を適用しようとしていますが、読み込めてないようです。
教えてほしいです

ありがとうございます、アイキャッチ画像が表示されました。

記事ページ内にも画像配置こころみていますが表示できません。
教えてほしいです

＠/Users/nakayamamasayuki/Documents/GitHub/takayamalog/content/articles/fanza/seto-kanna-av-debut.md

本文中に埋め込んだデバッグ用の「テスト」の文言も表示されないところをみると
読み込みができてないですかね？

BuildError@http://localhost:3001/_next/static/chunks/%5Broot-of-the-server%5D\_\_e2c08166._.js:17395:41
react-stack-bottom-frame@http://localhost:3001/_next/static/chunks/node_modules_react-dom_82bb97c6._.js:13596:24
renderWithHooks@http://localhost:3001/_next/static/chunks/node_modules_react-dom_82bb97c6._.js:3560:42
updateFunctionComponent@http://localhost:3001/_next/static/chunks/node_modules_react-dom_82bb97c6._.js:5317:21
beginWork@http://localhost:3001/_next/static/chunks/node_modules_react-dom_82bb97c6._.js:5916:24
runWithFiberInDEV@http://localhost:3001/_next/static/chunks/node_modules_react-dom_82bb97c6._.js:1335:131
performUnitOfWork@http://localhost:3001/_next/static/chunks/node_modules_react-dom_82bb97c6._.js:7988:97
workLoopSync@http://localhost:3001/_next/static/chunks/node_modules_react-dom_82bb97c6._.js:7880:57
renderRootSync@http://localhost:3001/_next/static/chunks/node_modules_react-dom_82bb97c6._.js:7863:13
performWorkOnRoot@http://localhost:3001/_next/static/chunks/node_modules_react-dom_82bb97c6._.js:7602:212
performWorkOnRootViaSchedulerTask@http://localhost:3001/_next/static/chunks/node_modules_react-dom_82bb97c6._.js:8566:26
performWorkUntilDeadline@http://localhost:3001/_next/static/chunks/node_modules_a51498a5._.js:1119:72

＠/Users/nakayamamasayuki/Documents/GitHub/takayamalog/docs/tem_img/screenshot 2025-07-20 13.52.42.jpg

ありがとうございます、ばっちり表示確認できました。

次ですが、
https://www.takayamalog.com/category/fanza

ここにfanza記事を表示させようと思います。

更新し、確認してみましたが
キャッシュでしょうかね
表示されないようです。
＠/Users/nakayamamasayuki/Documents/GitHub/takayamalog/docs/tem_img/screenshot 2025-07-20 13.57.14.jpg

nakayamamasayuki@nakayamamasayukinoMacBook-Air takayamalog % npm run dev

> takayamalog@0.1.0 dev
> next dev --turbopack

⚠ Port 3000 is in use, using available port 3001 instead.
▲ Next.js 15.3.5 (Turbopack)

- Local: http://localhost:3001
- Network: http://192.168.0.194:3001
- Environments: .env.local

✓ Starting...
✓ Compiled middleware in 158ms
✓ Ready in 952ms
○ Compiling /category/[slug] ...
✓ Compiled /category/[slug] in 1177ms
GET /category/fanza 200 in 1625ms
✓ Compiled /favicon.ico in 230ms
GET /favicon.ico?favicon.45db1c09.ico 200 in 507ms
GET /favicon.ico?favicon.45db1c09.ico 200 in 510ms

slugの設定はできているようですかね？
しかしまだ表示されていないです。
ほかに確認する部分あれば教えてほしいです

---

＠/Users/nakayamamasayuki/Documents/GitHub/takayamalog/docs/tem_img/screenshot 2025-07-20 14.02.26.jpg

ありがとうございます、表示でました。

では続いてこのcategory/fanzaページです
上部
🎬
FANZA動画レビューの枠

「研究報告数
1
FANZA動画の詳細レビューと評価。新作から人気作品まで幅広く分析します。

1
総研究報告
0
総閲覧数
0
Premium研究」
を削除

「⚠️ このカテゴリーは18歳未満の方の閲覧を禁止しています。成人向けコンテンツが含まれています。」
を削除
お願いします

ありがとうございます、
＠/Users/nakayamamasayuki/Documents/GitHub/takayamalog/docs/tem_img/screenshot 2025-07-20 14.06.31.jpg
このcategory/fanzaページでも

右側のサイドメニューを表示するようにお願いします

すべてのページにおいて
サイドメニューを表示しておこうと思います。
共通で常に表示できるようにできますかね

テスト

test


All checks have passed
3 successful checks

CI / test (push) Successful in 55s
Details

Deploy to Vercel / deploy (push) Successful in 51s
Details

Vercel - Deployment has completed
Details




***


カテゴリをひとつ増やして記事を追加しました。
＠/Users/nakayamamasayuki/Documents/GitHub/takayamalog/content/articles/fanzavr/fanzavr001.md

「FANZA_VRレビュー」

category/research


＠/Users/nakayamamasayuki/Documents/GitHub/takayamalog/docs/tem_img/screenshot 2025-07-20 14.46.45.jpg
TOPページの

「業界研究　トレンド分析」
とカードレイアウトの部分と
「FANZA_VRレビュー」を入れ替えるかたちで表示させようと思います



キャッシュでしょうかね
http://localhost:3001/category/fanzavr
ローカル表示されません


＠/Users/nakayamamasayuki/Documents/GitHub/takayamalog/docs/tem_img/screenshot 2025-07-20 14.53.50.jpg

404で表示されないというのは、
htmlページが用意できてないということでしょうか？

先ほど手動で
＠/Users/nakayamamasayuki/Documents/GitHub/takayamalog/content/articles/fanzavr/fanzavr001.md
を作成しただけです


OKばっちり表示されました。
ありがとうございます。
ではここまでの作業報告書の作成をお願いします