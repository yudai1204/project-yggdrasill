# 芝浦祭2024 - Project Yggdrasil

![CD9D8A96-EB99-4D4B-8B4A-810A7517A20D_1_105_c](https://github.com/user-attachments/assets/ed040058-d69a-45c4-9677-4a69ed06d40b)

https://www.youtube.com/watch?v=74FTShiPke8

芝浦祭2024で発表を行った「Let the Magic Flower Bloom」のフロントエンド部分のレポジトリ。

- [Backend(WebSocket + DB)](https://github.com/yudai1204/project-yggdrasill-backend)
- [ジョウロ](https://github.com/yudai1204/project-yggdrasill-python)


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
