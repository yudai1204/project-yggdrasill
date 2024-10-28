import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <style>{`
        html{
          background-color: #1A202C;
        }
        `}</style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
