# sender_to_mastodon
Toot your tweet that contains specify hashtag(#g2mstdn) to Mastodon.

特定のハッシュタグ(#g2mstdn)を含むツイートの内容をMastodonにトゥートします。

## 実行準備

1. start.js 内の下記を書き換え
 * TWITTER_APP_CONSUMER_KEY: Twitterで作成したこのアプリ用のConsumer Key.
 * TWITTER_APP_CONSUMER_SECRET: Twitterで作成したこのアプリ用のConsumer Key Secret.
 * TWITTER_APP_ACCESS_TOKEN_KEY: TwitterアカウントのAccess Token Key.
 * TWITTER_APP_ACCESS_TOKEN_SECRET: TwitterアカウントのAccess Token Secret.
 * MASTODON_INSTANCE_URI: MastodonインスタンスのURI (例: https://pawoo.net/)
 * MASTODON_ACCESS_TOKEN: MastodonアカウントのAccess Token.
1. 関連ライブラリ取得
```
$ npm install
```

## 実行

```
$ npm start
```

## 動作確認

Twitterで「#g2mstdn」というハッシュタグをつけてツイートしたあと、このツールを実行し、その内容がMastodonにトゥーとされていれば成功です。

## 対処必要な事項

* 同じツイートが何回もトゥート対象にならないような制御
* ツイートに添付されている画像ファイルのダウンロードファイルを削除
* 元ツイートの削除機能

## License

MIT License.