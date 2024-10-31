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
        {process.env.NODE_ENV === "development" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              color: "white",
              backgroundColor: "red",
              // 三角形に
              padding: "2px 2px 22px 36px",
              clipPath: "polygon(0 0, 100% 0, 100% 100%)",
            }}
          >
            DEV
          </div>
        )}
        <NextScript />
      </body>
    </Html>
  );
}
