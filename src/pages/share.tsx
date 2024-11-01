import { Result } from "@/layouts/result";
import type { GptAnalysis } from "@/types/metaData";
import { useEffect, useState } from "react";

const ResultPage = () => {
  const initialAnalysis: GptAnalysis = {
    userName: "undefined",
    season: "Summer",
    location: "BaldMountain",
    time: "Noon",
    weather: "Sunny",
    flowerName: "undefined",
    flowerColor: ["#673ab7", "#d81b60", "#ffeb3b"],
    flowerSize: "medium",
    flowerType: "CherryBlossom",
    treeType: "conifer",
    treeHeight: "large",
    treeTexture: "realistic",
    treeAge: "ancient",
  };
  const initialAnswers: string[] = ["#000000"];

  const [uuid, setUuid] = useState<string | null | undefined>(null);
  const [gptAnalysis, setGptAnalysis] = useState<GptAnalysis | null>(null);
  const [answers, setAnswers] = useState<string[]>(initialAnswers);

  // URL queryからUUIDを取得し、APIを叩いてデータを取得
  useEffect(() => {
    const url = new URL(window.location.href);
    const hasUuid = url.searchParams.has("uuid");
    if (!hasUuid) {
      setUuid(undefined);
      return;
    }
    const uuid = url.searchParams.get("uuid");
    setUuid(uuid);
    fetch(`/api/proxy?uuid=${uuid}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        setGptAnalysis(JSON.parse(data.gpt_result));
        setAnswers(JSON.parse(data.answers));
      });
  }, [setUuid]);

  return (
    <>
      <title>Project Yggdrasil - ShibaLab</title>
      {uuid === undefined ? (
        <div>Error: UUID not found</div>
      ) : (
        <Result
          gptAnalysis={gptAnalysis}
          answers={answers}
          isShared
          shareUrl={`https://yggdrasil.shibalab.com/share?uuid=${uuid}`}
        />
      )}
    </>
  );
};

export default ResultPage;
