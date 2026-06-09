# photograph/ — 個別記事と雛形

写真記事の HTML はこのフォルダにまとめる。一覧（`../photograph.html`）と TOP は
ここにあるページを fetch して自動反映する。

## 雛形

| ファイル | レイアウト | 用途 |
|----------|-----------|------|
| `templateA.html` | Single（見出し → 写真＋本文縦積み） | 長めのキャプション・一枚絵向け |
| `templateB.html` | Split（写真左・テキスト右） | 2カラムの読みやすい構成 |

- **templateA** = 旧 Pattern 1（`photograph-003.html` 相当）
- **templateB** = 旧 Pattern 2（`photograph-002.html` 相当）

## 新規記事の追加手順

1. `templateA.html` または `templateB.html` をコピー
2. `NNN.html` にリネーム（3桁ゼロ埋め。例: `004.html`）
3. `<title>` / OGP / 見出し / 本文を書き換え
4. `data-photo-file="NNN_01_place_YYYY_MMDD.jpg"` を実ファイル名に合わせる
5. 画像を `../images/photograph/` に配置
6. `../photograph.html` の `#idxList` に行を1つ追加（`data-photo="NNN"`）

ビルド作業は不要。保存してリロードすれば一覧・TOP も追従する。
