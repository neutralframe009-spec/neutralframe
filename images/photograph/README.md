# images/photograph/

`photograph-XXX.html`（個別写真ページ）および TOP（`index.html`）のスライドショーで参照する、サイト全体で共有する唯一の画像プール。

## 命名規則（必須）

```
XXX_FF_place_YYYY_MMDD.jpg
```

| 記号     | 内容                                                        | 例         |
| -------- | ----------------------------------------------------------- | ---------- |
| `XXX`    | 記事番号（3 桁ゼロパディング / 001〜999）                   | `003`      |
| `FF`     | 同ページ内の写真番号（2 桁ゼロパディング / 01〜99）         | `01`       |
| `place`  | 半角英字のみ（小文字で保存、表示時に大文字化）              | `tokyo`    |
| `YYYY`   | 4 桁の年                                                    | `2026`     |
| `MMDD`   | 4 桁の月日（MM=01〜12、DD=01〜31）                          | `0417`     |

### 例

- `003_01_tokyo_2026_0417.jpg`
- `003_02_tokyo_2026_0417.jpg`（同ページ 2 枚目）
- `001_01_aomori_2026_0322.jpg`

この規則に合致しないファイルは、どの記事からも参照されない「未使用画像」として扱われます。

## 画像を追加・差し替えたら

1. `images/photograph/` にファイルを置く
2. 対応する `photograph-NNN.html` の `data-photo-file="..."` を新しいファイル名に書き換える

それだけです。**ビルドコマンドやマニフェスト更新は一切不要**。
ブラウザを再読み込みすれば、個別ページも一覧も TOP もすべて新しい画像とそのメタで更新されます。

## ページ側での指定方法

各詳細ページでは、使う写真のファイル名をそのまま `data-photo-file` に書きます。地名・日付は画像ファイル名から自動展開されます。

```html
<figure id="fig-main" class="p1-figure" data-photo-file="003_01_tokyo_2026_0417.jpg">
  <div class="top-photo"><img alt=""></div>
  <figcaption class="p1-fig-caption">
    <div class="p1-fig-meta">
      FIG. <span data-photo-fig></span><br>
      <span data-photo-date></span><br>
      <span data-photo-place></span>
    </div>
    <div class="p1-body">...</div>
  </figcaption>
</figure>

<script src="assets/photograph-page.js" defer></script>
```

## 自動展開される情報

| 表示箇所                           | 出力例             | 由来                      |
| ---------------------------------- | ------------------ | ------------------------- |
| ヘッダ `N° XXX`                     | `N° 003`          | `XXX`                     |
| ヘッダ `PLACE`                      | `TOKYO`            | `place`（大文字化）       |
| ヘッダ `YYYY.MM.DD`                 | `2026.04.17`       | `YYYY` + `MMDD`           |
| キャプション `FIG. FF`              | `FIG. 01`          | `FF`                      |
| キャプション `MONTH, YEAR`          | `APRIL, 2026`      | `MMDD` の月 + `YYYY`      |

## 推奨スペック

- アスペクト比: 4:3
- 長辺 1600–2000px、sRGB
- JPEG 品質 80 前後
