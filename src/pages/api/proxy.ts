import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const phpApiUrl = "http://shibalab.com/yggdrasil-api/";
  if (req.method === "GET") {
    // GETリクエスト：uuidをクエリパラメータとして渡す
    const { uuid } = req.query;

    if (!uuid) {
      res.status(400).json({ error: "UUID parameter is required" });
      return;
    }

    try {
      const response = await fetch(`${phpApiUrl}?uuid=${uuid}`);
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data from PHP API" });
    }
  } else if (req.method === "POST") {
    // POSTリクエスト：リクエストボディをそのままPHP APIに送信
    console.log("POST REQUEST", req.body);
    try {
      const response = await fetch(
        "https://shibalab.com/yggdrasil-api/post.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req.body),
        }
      );

      const data = await response.json();
      console.log("POST RESPONSE", data);
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to post data to PHP API" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
