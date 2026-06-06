# Neutral Frame — 開発引き継ぎドキュメント

このドキュメントは、`neutralframe.net` というポートフォリオ／写真日記サイトを、
Cursor など AI 支援の開発環境で継続運用・拡張するための設計書です。
**このファイルを最初に読めばサイト全体の思想・構造・ルールが把握できる** ことを
目的としています。

---

## 1. プロジェクト概要

| 項目 | 内容 |
|------|------|
| サイト名 | Neutral Frame |
| 表記 | `Neutral Frame`（2語、大文字は先頭のみ） |
| ドメイン | neutralframe.net |
| 言語 | 日本語メイン（英字は装飾・記号として併用） |
| 目的 | ① Web構築スキルの実践 ② 自己紹介・趣味の発信 ③ 転職時のポートフォリオ |
| 運用方針 | WordPress等のCMSは不使用。静的HTMLをAIと協調して都度追加・編集 |
| デプロイ想定 | Netlify / Cloudflare Pages / GitHub Pages などの静的ホスティング |

---

## 2. デザインコンセプト

### キーワード
**エディトリアルミニマリズム**

- 無印良品・原研哉的な編集デザイン（「なにもないが、すべてがある」）
- 北欧系ミニマル雑誌の空気感
- **余白そのものをデザインする**
- カード型のブログ的レイアウトは採用しない
- 紙の書物・帳簿・目次のような静けさ

### トーン
- 多くを語らない。一文・一枚・一行。
- 装飾を足すより、引く方向で迷う。
- インタラクションは最小（ページ遷移の280msフェードと、写真ホバーのみ）。

### やらないこと
- カード並べ型のブログレイアウト
- ドロップシャドウ、角丸を効かせた装飾
- 鮮やかなアクセントカラー
- ホバーでの浮き上がり・拡大
- 絵文字・アイコン的装飾（無印/原研哉的な世界観に反する）

---

## 3. ファイル構成

```
/
├── index.html                         # TOP
├── photograph.html                    # PHOTOGRAPH インデックス（目次）
├── photograph-003.html                # 個別記事（Pattern 1: Single）
├── photograph-002.html                # 個別記事（Pattern 2: Split）
├── photograph-001.html                # 個別記事（Pattern 2: Split）
├── about.html                         # ABOUT（プロフィール・機材）
├── lab.html                           # LAB（AI協調制作・自動化などの実験記録）
├── essay.html                         # ESSAY（外部 note.com への導線）
├── assets/
│   ├── styles.css                     # 全ページ共通CSS（唯一のスタイル定義）
│   ├── top-slideshow.js               # TOP のクロスフェードスライドショー（詳細ページを都度 fetch）
│   └── photograph-page.js             # 個別記事で data-photo-file からメタ展開
├── images/
│   ├── README.md
│   └── photograph/                    # ★サイト全体で共有する唯一の画像プール
│       ├── README.md                  # 命名規則・運用
│       ├── 003_01_tokyo_2026_0417.jpg
│       ├── 002_01_tokyo_2025_1110.jpg
│       ├── 001_01_aomori_2026_0322.jpg
│       └── ...
└── README.md                          # このファイル
```

ビルドスクリプトやマニフェストファイルは**持たない**。
詳細ページ（`photograph-NNN.html`）だけがソースの正。
一覧（`photograph.html`）と TOP（`index.html`）は、ページを開いた瞬間に
詳細ページを fetch して、そこから動的にタイトル・画像・日付を取り出す。

### 命名規則

- ページ：`photograph-NNN.html`（NNN は記事No. 3桁ゼロ埋め）
- 写真：`images/photograph/NNN_FF_place_YYYY_MMDD.jpg`
  - `NNN`: 3桁の記事番号（`photograph-NNN.html` と一致）
  - `FF`: 同ページ内の写真番号（`01`〜`99`、2桁ゼロ埋め）
  - `place`: 半角英字小文字（表示時に大文字化）
  - `YYYY_MMDD`: 撮影年月日（ハイフンではなく `_` 区切り）
- クラス：`kebab-case`、目的別プレフィックス（`nf-` = 全体、`idx-` = INDEX、`art-` = 個別記事、`p1-/p2-` = 記事パターン、`about-` / `lab-` / `note-` = 各ページ固有）

### 画像プールと参照関係

写真の置き場所は **`images/photograph/` ただ 1 つ**。

- **個別記事**（`photograph-NNN.html`）は自分が使う写真のファイル名を
  `data-photo-file="NNN_FF_place_YYYY_MMDD.jpg"` として直接書く。
  ヘッダ・キャプションのメタ（FIG / 日付 / 地名）はそのファイル名を
  パースして自動展開される（`assets/photograph-page.js`）。
- **TOP**（`index.html`）は `photograph.html` を fetch して実在記事 NNN を
  洗い出し、各詳細ページから `data-photo-file` を読み出して、`_01_` の
  代表写真を昇順にクロスフェードで巡回する（`assets/top-slideshow.js`）。
- **PHOTOGRAPH インデックス**（`photograph.html`）も同様に、行ごとに
  `photograph-NNN.html` を fetch し、その中の JA / EN タイトルと
  `data-photo-file` からタイトル・地名・日付・サムネを埋める。
  - 行のレイアウトは PC / SP 共通で、No・タイトル・英語サブ・日付をタイトル列に縦積み、サムネを行の右端に 4:3 でインライン配置する。
  - PC（>720px）：通常は透明で、行ホバー／フォーカスでフェードイン表示。
  - SP（≤720px）：ホバーが存在しないため、常時表示。
  - サムネの高さは行のテキスト内容高さに揃え、幅は `aspect-ratio: 4/3` で自動算出。
  - 詳細ページが存在しない（404）行は JS で `display: none` される。画像が無い行はサムネ無しで出る（noimage は使わない）。

ビルド作業は不要。**詳細ページの HTML を保存した時点で、一覧と TOP も次のリロードで自動的に追従する**。

---

## 4. デザインシステム

### 4.1 カラー

すべて `assets/styles.css` 冒頭の CSS 変数で定義。
**新たな色を導入してはならない。** 拡張は既存トークンの不透明度違いで行う。

| Token | Value | 用途 |
|-------|-------|------|
| `--paper` | `#f4f4f2` | 全ページのベース背景（paper gray） |
| `--paper-deep` | `#ebe8e2` | セクション扉、画像ローディング時のプレースホルダ |
| `--ink` | `#111111` | 本文・ロゴ・見出し |
| `--ink-85` | `rgba(17,17,17,0.85)` | 本文・長文 |
| `--ink-70` | `rgba(17,17,17,0.70)` | 補助テキスト |
| `--ink-55` | `rgba(17,17,17,0.55)` | ラベル・メタ・欧文キャプション |
| `--ink-40` | `rgba(17,17,17,0.40)` | 非アクティブな要素 |
| `--ink-20` | `rgba(17,17,17,0.20)` | 強めの罫線（セクション区切り） |
| `--ink-12` | `rgba(17,17,17,0.12)` | 弱い罫線（リストの行間罫線） |

写真はすべて `filter: grayscale(100%) contrast(1.02)` を適用（モノクロ表示）。

### 4.2 タイポグラフィ

| 変数 | ファミリ | 用途 |
|------|---------|------|
| `--font-en` | `'Oswald', Impact, 'Arial Narrow', sans-serif` | 英字全般、ロゴ、見出し、数字、ラベル |
| `--font-ja` | `'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif` | 日本語本文・見出し |

- Oswald のウェイト：300 / 400 / 500 / 600 / 700（Google Fonts 経由）
- Noto Sans JP のウェイト：300 / 400 / 500 / 700

#### タイポグラフィの基本ルール

- **ロゴ／大見出し**：Oswald 700、`letter-spacing: -0.018em`、`line-height: 0.88`
- **ラベル・メタ情報（欧文）**：Oswald 400、`font-size: 10–11px`、`letter-spacing: 0.22em – 0.32em`（強めのトラッキング）
- **英字見出しの末尾**：`.` をグレー（`rgba(17,17,17,0.3)`）で打つ慣用 → `<span class="dot">.</span>`
- **日本語本文**：Noto Sans JP 400、`font-size: 14–14.5px`、`line-height: 2.1–2.2`（ゆったり）
- **日本語の見出し／ラベル**：字間を `letter-spacing: 0.12em – 0.42em` で空ける（「静 物 記」のような組み）
- **太字を濫用しない**：記事本文の `<strong>` は原則使わない

### 4.3 レイアウト

- 外側余白：デスクトップ 48px、タブレット 40px、SP 22px
- 記事本文の最大幅：`max-width: 68ch`（読みやすさ）
- グリッド：CSS Grid 主体
- 罫線は `1px solid var(--ink-12)` または `var(--ink-20)` の二択のみ

### 4.4 写真

- 比率：**4:3 横長** が基本（`aspect-ratio: 4/3`）
- 処理：モノクロ＋コントラスト微増（`filter: grayscale(100%) contrast(1.02)`）
- キャプションは Oswald 10–11px、強めトラッキング
- 写真不在の状態も「デザイン」として成立させる（noimage画像は使わない）

### 4.5 紙テクスチャ

- `.nf-paper` クラス（`position: absolute; inset: 0`）
- `opacity: 0.055`、SVG `<feTurbulence>` でノイズ生成
- **TOP とセクション扉（Lab, Note等の入口）にのみ配置**。記事本文・一覧には乗せない（メリハリ重視）

### 4.6 モーション

- ページ遷移：`@keyframes nf-fadein` で 280ms フェードインのみ
- リンクホバー：`opacity: 0.55` への遷移（180ms）
- PHOTOGRAPH インデックスのホバー写真：`.idx-hover-photo` が 220ms でフェード＋12pxスライド
- **それ以外のアニメーションは追加しない**

---

## 5. ページ仕様

### 5.1 共通要素

#### ヘッダー (`.nf-bar`)
- 左：サイトロゴ (`Neutral Frame.`) → `index.html` へのリンク（TOPでは別構成）
- 右：現在地を示すラベル（例：`INDEX / PHOTOGRAPH`）

#### フッター (`.nf-nav`)
- 左：そのページ固有の補助情報（例：`INDEX · 001 — 003`）
- 右：グローバルナビ（PHOTOGRAPH / ESSAY / LAB / ABOUT）
- 現在ページは `class="current"` を付与（色が濃くなる）

### 5.2 `index.html` — TOP

- 単独レイアウト。**768px 以上**は左に 4:3 写真＋キャプション、右に極太ロゴ・短いブランド説明文（2カラム）
- **767px 以下**は写真→ロゴの単列（スマートフォン）
- `.nf-paper` が乗る（紙感）
- 左の写真枠は `images/photograph/` 内の各記事の代表写真（`_01_`）をクロスフェードで巡回する。画像切替と同じタイミングでキャプション（`FIG. NNN` / `PLACE — YYYY.MM`）も更新される
- 静止時間 6.5 秒 + フェード 4.4 秒（1 サイクル ≒ 約 10 秒）。`prefers-reduced-motion: reduce` では瞬時切替にフォールバック

### 5.3 `photograph.html` — PHOTOGRAPH インデックス

- 見出しの大きな数字（`.idx-count`）＝実在する `photograph-NNN.html` の**最大 NNN**。ナビ下部の `#idxRange` ＝同じ集合の**最小〜最大 NNN**。JSが自動反映（記事 0 件なら `000` / `INDEX · —`）
- `.idx-list` 内の `.idx-row` として各記事を列挙（各行に `data-photo="NNN"`）
- **ランタイムで詳細ページから取得して自動表示**：
  - 各行に対し `photograph-NNN.html` を fetch して実在確認する
  - **404 / 取得失敗の行** → `display: none` で隠す
  - **取得成功した行** → 以下を詳細ページから抽出して差し替える
    - `.idx-title` ← `.art-title-ja` / `.p2-title-ja` のテキスト
    - `.idx-sub`   ← `.art-title-en` / `.p2-title-en` のテキスト ＋ ` — ` ＋ `PLACE`（`data-photo-file` の地名）
    - `.idx-date`  ← `data-photo-file` の `YYYY.MM.DD`
    - href         ← `photograph-NNN.html`（HTML は `href="#"` のままでよい）
  - HTML に書いてある値は、取得前の初期表示フォールバックとして使う
- **行内のサムネイル**（`images/photograph/` の共通プールから解決）：
  - PC（>720px）：行ホバー / focus でフェードイン
  - SP（≤720px）：常時表示
  - 該当画像が無い行はサムネなしで出る（noimage / 破損画像は出さない）
- 記事を追加するときは `<a class="idx-row" data-photo="NNN" href="#"><div class="idx-no">NNN</div>...</a>` を1つ増やすだけ。`photograph-NNN.html` を追加・保存した瞬間に、一覧も TOP も追従する（ビルド／コマンド操作は不要）

### 5.4 `photograph-NNN.html` — 個別記事

2種類のレイアウトパターンを使い分け：

#### Pattern 1: Single (`photograph-003.html` が雛形)
- 和文タイトル（主・大）→ 英字サブ（小・斜体）→ 4:3 写真 → 2カラム（左：メタ情報 / 右：本文テキストエリア）
- 本文は複数段落可。`<p>` で段落区切り、段落間マージンは自動で開く
- 写真下部にも余白を確保

#### Pattern 2: Split (`photograph-002.html` が雛形)
- 左：4:3 写真 / 右：**横書き**テキストエリア
- 和文タイトル（主・大）→ 英字サブ（小・斜体）→ 本文（横書き、段落分け可）
- `<strong>` など装飾は使わない

記事追加の手順（ビルドは不要）：
1. 雛形（003 か 002）をコピーして `photograph-NNN.html` にリネーム
2. ファイル名・タイトル・本文を書き換える
3. 写真を `images/photograph/NNN_FF_place_YYYY_MMDD.jpg` として置く
4. 詳細ページの `data-photo-file="NNN_FF_place_YYYY_MMDD.jpg"` を今置いた写真のファイル名に合わせる
5. `photograph.html` に `<a class="idx-row" data-photo="NNN" href="#">…</a>` を1行追加

→ 保存すれば、一覧ページ（`photograph.html`）も TOP（`index.html`）もブラウザをリロードした瞬間に自動更新される。

### ローカル確認時の注意

このサイトは「詳細ページを取りに行って表示を組み立てる」仕組みのため、
ブラウザの `fetch()` が使える状態で開く必要がある。

- **サーバに上げた状態** → そのまま動く（Netlify / Cloudflare Pages / 通常のレンタルサーバ）
- **ローカルで確認する場合**
  - ✅ **Safari で `file://` から開く** → そのまま動く（macOS 標準）
  - ✅ Cursor の Simple Browser / Live Preview 等で開く → 動く
  - ❌ Chrome / Firefox で `file://` から開く → セキュリティ制限で詳細ページの取得が拒否され、一覧・TOPとも空の表示になる

Safari で開くのが一番手数が少ない。

### 5.5 `about.html` — ABOUT

- 左：`About.` 大見出し＋一文の自己紹介＋連絡先
- 右：`.about-row` による機材等の記号的列挙（ラベル＋値＋補助和文）
- 多くを語らないトーン。行を増やすならスペック系情報に限定

### 5.6 `lab.html` — LAB

- AI協調制作・n8n自動化・Web実験などの記録
- `.lab-list` 内の `.lab-row`：No. / カテゴリ（WEB / AUTOMATION / AI / NOTE 等）/ タイトル＋英題 / 日付
- 個別エントリに遷移するより、まず一覧で見せる方針（個別ページは必要に応じて追加）

### 5.7 `essay.html` — ESSAY

- 左：ESSAY. 見出しと説明文
- 右：外部 note.com（https://note.com/heix3）への導線リンク（新規タブ）
- 本サイトに書かない種類の文章（まとまった長文・エッセイ）はすべて note 側

---

## 6. レスポンシブ

3ブレイクポイントで設計：

| 幅 | 対象 | 主な挙動 |
|-----|------|---------|
| **〜767px** | スマートフォン | TOPは単列（写真→ロゴ）。フッターは画面下端に寄せる |
| **768px〜1024px** | タブレット・狭いPCウィンドウ | TOPは2カラム（PCと同じ構成）。INDEX等はタブレット向け余白調整 |
| **1025px〜** | PC（広いウィンドウ） | 同上。設計上のフルレイアウト |

モバイルファーストではなく、**すべてのデバイスで同等の体験** を目指す。

---

## 7. 拡張・編集のレシピ

### 7.1 新しい写真記事を追加

1. `photograph-003.html`（Single）か `photograph-002.html`（Split）を複製
2. ファイル名を `photograph-004.html` のように変更
3. 先頭の `<title>` を更新（ヘッダ右のメタは現仕様では非表示）
4. タイトル（英字・和文）・本文を差し替え
5. 写真を `images/photograph/022_01_place_YYYY_MMDD.jpg` として配置
6. `<figure>` / `.p2-photo` の `data-photo-prefix` を `022_01` に更新。ヘッダ・キャプションのメタは画像ファイル名から自動展開される
7. ルートで `scripts/build-photograph-manifest.sh` を実行してマニフェストを再生成
8. `photograph.html` の `.idx-list` 冒頭に `.idx-row` を 1 件追加（`data-photo="022"` を忘れない）
9. `.idx-count` の総数を更新

### 7.2 既存記事の写真を差し替え

- `images/photograph/NNN_FF_*.jpg` を同じ prefix（`NNN_FF_`）で上書き／差し替えする
- 差し替え後は `scripts/build-photograph-manifest.sh` を 1 回実行
- 詳細ページ・TOPスライドショー・インデックスすべてに同じ画像が反映される

### 7.3 LAB 項目を追加

- `lab.html` の `.lab-list` 内に `.lab-row` を1件追加
- カテゴリは `WEB / STATIC` / `AUTOMATION` / `AI / PROMPT` / `NOTE` などから選ぶ

### 7.4 やってはいけないこと

- Tailwind や他の CSS フレームワークを導入しない（`assets/styles.css` 単独で完結）
- 新しい色トークンを追加しない（既存の `--ink-xx` を組み合わせる）
- `<script>` を濫用しない（現状、JS は PHOTOGRAPH のホバー写真のみ）
- フォントを増やさない（Oswald と Noto Sans JP の2種以外は使わない）
- 絵文字・アイコンフォントを使わない
- カード型UIへ回帰しない

---

## 8. 技術メモ

### フォント読み込み
各HTMLの `<head>` で Google Fonts を直接読み込み：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
```

将来セルフホストに切り替える場合は、`assets/fonts/` を作って `@font-face` を styles.css に定義。

### 写真プレースホルダ
写真未投入の状態でも、`.top-photo` のグラデ背景が 4:3 の枠として残るため、レイアウトは崩れない。実写は `images/photograph/` に命名規則通りのファイル名で置き、`scripts/build-photograph-manifest.sh` を実行すれば、HTML を触らずに表示へ切り替わる（`data-photo-prefix` だけ正しければよい）。

### Hover Reveal のJS
`photograph.html` 末尾に閉じ込めてある。ロジック概要：

```
1. 各 .idx-row から data-photo と data-meta を取得
2. mouseenter/focus で assets/photos/<no>.jpg を new Image() 相当で読み込み
3. onload → フロート表示、onerror → 何もしない（cache[no] = 'miss'）
4. mouseleave/blur で非表示
5. 一度 miss した記事は以降再試行しない（無駄なリクエストを避ける）
```

---

## 9. AI運用の心得（Cursor等で編集するAI向け）

- **このMDを最初に読むこと**。ユーザーの指示が曖昧な場合、本書の「やらないこと」「デザインシステム」に照らして判断する。
- **既存の見た目を壊さない**。変更は最小差分で。特に紙感・余白・タイポの静けさを優先。
- **HTMLは手書き** を保つ。テンプレートエンジンや JS フレームワーク化の提案は、ユーザーが明示的に求めない限り出さない。
- **デザイン判断に迷ったら "削ぐ" 方向** を選ぶ。追加する前に、同じことを既存要素で表現できないか考える。
- 新ページを作るときは既存ページ（同系統のもの）を複製して差分編集する。ゼロから書き起こさない。
- ファイル改修時は、必ずこのMDの "ファイル構成" "ページ仕様" セクションも追従更新する。

---

## 10. ブランドボイス参考

TOPに掲げた一文：

> 削ぎ落としても、残るもの。

サイト全体のコピーはこのテンションで統一。
「〜してください」「〜をチェック」「最新記事はこちら！」のようなWeb的呼びかけは使わない。
一人称の日記的・観察的な短文を基本とする。

---

_last updated: 2026.04（画像プールを `images/photograph/` に一本化、TOPスライドショー仕様を追記）_
