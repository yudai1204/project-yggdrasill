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

  // localStorageからデータを取得
  // useMemoだとServerでも実行されてしまうため、useEffectを使用
  const [gptAnalysis, setGptAnalysis] = useState<GptAnalysis | null>(null);
  const [answers, setAnswers] = useState<string[]>(initialAnswers);
  const [uuid, setUuid] = useState<string>("");

  useEffect(() => {
    const storedGptAnalysis = localStorage.getItem("gptAnalysis");
    if (storedGptAnalysis) {
      setGptAnalysis(JSON.parse(storedGptAnalysis));
    } else {
      setGptAnalysis(initialAnalysis);
    }

    const storedAnswers = localStorage.getItem("answers");
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }

    const storedUuid = localStorage.getItem("uuid");
    if (storedUuid) {
      setUuid(storedUuid);
    }
  }, []);

  return (
    <>
      <title>Project Yggdrasil - ShibaLab</title>
      <Result
        gptAnalysis={gptAnalysis}
        answers={answers}
        shareUrl={`https://yggdrasill.shibalab.com/share?uuid=${uuid}`}
      />
    </>
  );
};

export default ResultPage;
