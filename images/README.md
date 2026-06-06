# images/

サイトで表示する画像ファイルを格納するフォルダ。
サイト全体で **1 つの画像プール** を共有する設計。

## サブフォルダ

- `images/photograph/` — すべての写真記事（`photograph-XXX.html`）が参照する画像。
  - TOPページ（`index.html`）のスライドショーも同じフォルダを参照する（各記事の代表写真を巡回）。
  - 詳しい命名規則と自動展開の仕様は `images/photograph/README.md` を参照。

## 設計の原則

- 写真の置き場所は `images/photograph/` のみ。TOP 専用の別フォルダは設けない。
- どの写真がどのページから使われるかは、各 `photograph-NNN.html` の
  `data-photo-file="NNN_FF_place_YYYY_MMDD.jpg"` 属性で宣言する。
  命名規則に合致しないファイルはそのまま「記事から参照されていない画像」として扱われる。
- **ビルド作業は不要**。画像を追加・差し替えたら、対応する `photograph-NNN.html` の
  `data-photo-file` を新しいファイル名に書き換えて保存するだけで、一覧ページも TOP も
  リロード後に追従する。
