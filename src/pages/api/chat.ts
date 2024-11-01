import { COLORS_LENGTH } from "@/util/constants";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (req.body.key !== "magic") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const prompt = req.body.prompt;

  console.log("prompt", prompt);

  if (!prompt) {
    return res.status(400).json({ error: "Missing Body" });
  }
  const language = req.body.language ?? "英語";

  const openai = new OpenAI({
    apiKey: process.env.NEXT_OPENAI_API_KEY,
  });

  // レスポンスフォーマット
  // GptAnalysisの型
  const responseFormat = z.object({
    userName: z.string(),
    season: z.enum(["Spring", "Summer", "Autumn", "Winter"]),
    location: z.enum([
      "MagicalWonderland",
      "Game",
      "City",
      "VastLand",
      "CountryTown",
      "Forest",
      "Beach",
      "Moon",
      "UnderTheSea",
      "BaldMountain",
    ]),
    time: z.enum(["Noon", "Evening", "Night"]),
    weather: z.enum(["VerySunny", "Sunny", "Rainy", "Cloudy", "Snowy"]),
    flowerName: z.string(),
    flowerColor: z.array(
      z.string().refine((color) => /^#[0-9A-Fa-f]{6}$/.test(color), {
        message: "Invalid color format",
      })
    ),
    flowerSize: z.enum(["small", "medium", "large"]),
    flowerType: z.enum([
      "Hibiscus",
      "CherryBlossom",
      "Sunflower",
      "Asaago",
      "Gerbera",
      "Momiji",
    ]),
    treeType: z.enum(["broadleaf", "conifer"]), // 紅葉樹・針葉樹
    treeHeight: z.enum(["small", "large"]),
    treeTexture: z.enum(["realistic", "cartoon", "pixel"]),
    treeAge: z.enum(["young", "old", "ancient"]),
  });

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini", // モデル
      response_format: zodResponseFormat(responseFormat, "originalFlower"), // レスポンスフォーマット
      messages: [
        {
          role: "system",
          content: `メディアアートとして、ユーザごとにオリジナルの木と花をアニメーションで表示します。入力されたアンケートの結果から、ユーザに適した情報を教えてください。flowerColorは、#000000 〜 #FFFFFF の範囲で、${COLORS_LENGTH}個以上指定してください。なお、flowerNameは${language}で指定してください。`,
        },
        { role: "user", content: prompt },
      ],
    });

    const response = completion.choices[0].message.parsed;

    console.log("response", response);

    return res.status(200).json({ response });
  } catch (error) {
    console.error("ERROR OCURED", error);
    return res
      .status(500)
      .json({ error: "An error occurred while proxying the request" });
  }
};

export default handler;
