# 📮 郵便番号検索アプリ

郵便番号を入力すると、対応する住所（都道府県・市区町村・町域）を表示するWebアプリです。

🔗 **公開ページ**: https://ke-kasamatsu.github.io/post-address/

## 機能

- 郵便番号から住所をリアルタイム検索
- ハイフンあり・なし、どちらの形式でも対応（例：`100-0001` / `1000001`）
- 入力中にハイフンを自動挿入
- Enterキーでも検索可能

## 使い方

1. 入力欄に郵便番号を入力（7桁）
2. 「検索」ボタンを押すか Enter キーを押す
3. 都道府県・市区町村・町域が表示される

## 技術構成

| ファイル | 役割 |
|---|---|
| `index.html` | マークアップ |
| `style.css` | スタイリング |
| `script.js` | 検索ロジック |

## 使用API

[zipcloud 郵便番号検索API](https://zipcloud.ibsnet.co.jp/doc/api)

```
GET https://zipcloud.ibsnet.co.jp/api/search?zipcode={7桁の郵便番号}
```

## ライセンス

MIT
