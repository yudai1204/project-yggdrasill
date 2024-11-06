# 芝浦祭2024 - Project Yggdrasil

<iframe width="560" height="315" src="https://www.youtube.com/embed/74FTShiPke8?si=np_XRV1Xk6kKDvYQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

芝浦祭2024で発表を行った「Let the Magic Flower Bloom」のフロントエンド部分のレポジトリ。

[Backend(WebSocket + DB)](https://github.com/yudai1204/project-yggdrasill-backend)
[ジョウロ](https://github.com/yudai1204/project-yggdrasill-python)


## 初回起動

```bash
cp .env.temp .env.local
```

`.env.local`を編集し、Open AIのAPIキーなどを入力してください。

その後は以下で起動できます。

```bash
$ npm install
$ npm run dev
```

## 2回目以降の起動

```bash
$ npm run dev
```
