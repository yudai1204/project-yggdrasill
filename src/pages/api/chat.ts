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

  const prompt = req.body.prompt;

  console.log("prompt", prompt);

  if (!prompt) {
    return res.status(400).json({ error: "Missing Body" });
  }

  const openai = new OpenAI({
    apiKey: process.env.NEXT_OPENAI_API_KEY,
  });

  // レスポンスフォーマット
  const responseFormat = z.object({
    userName: z.string(),
    season: z.enum(["Spring", "Summer", "Autumn", "Winter"]),
    flowerName: z.string(),
    flowerColor: z.array(
      z.string().refine((color) => /^#[0-9A-Fa-f]{6}$/.test(color), {
        message: "Invalid color format",
      })
    ),
  });

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini", // モデル
      response_format: zodResponseFormat(responseFormat, "originalFlower"), // レスポンスフォーマット
      messages: [
        {
          role: "system",
          content:
            "ユーザアンケートの結果から、ユーザに適した季節と花の名前、提案できる複数の花の色(カラーコード)を教えてください。",
        },
        { role: "user", content: JSON.stringify(prompt) },
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
