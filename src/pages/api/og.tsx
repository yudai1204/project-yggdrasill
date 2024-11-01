import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const hasTitle = searchParams.has("title");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "Magical Sunflower";
    const hasSubtitle = searchParams.has("subtitle");
    const subtitle = hasSubtitle
      ? searchParams.get("subtitle")?.slice(0, 100)
      : "私が咲かせた花は";

    const origin =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://yggdrasill.shibalab.com";

    const font = await fetch(
      new URL(origin + "/fonts/KaiseiOpti-Bold.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            backgroundImage: "url(https://yggdrasill.shibalab.com/og.png)",
            backgroundColor: "#000000",
            backgroundSize: "100% 100%",
            height: "100%",
            width: "100%",
            display: "flex",
            textAlign: "left",
            alignItems: "flex-start",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
          }}
        >
          <div
            style={{
              transform: "translateY(-60px)",
              width: "100%",
              fontSize: 40,
              fontStyle: "normal",
              fontWeight: "bold",
              color: "#FFFFFF",
              textShadow: "#222222 1px 0 10px",
              padding: "0 120px",
              lineHeight: 1.3,
              fontFamily: "MyCustomFont",
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              width: "100%",
              fontSize: 80,
              fontStyle: "normal",
              fontWeight: "bold",
              color: "#FFFFFF",
              textShadow: "#222222 1px 0 10px",
              padding: "0 150px",
              transform: "translateY(-60px)",
              lineHeight: 1.3,
              marginBottom: "30px",
              wordWrap: "break-word",
              fontFamily: "MyCustomFont",
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "MyCustomFont",
            data: font,
            style: "normal",
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
