import { Result } from "@/layouts/result";
import type { GptAnalysis } from "@/types/metaData";
import { useEffect, useState } from "react";

const ResultPage = () => {
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
          shareUrl={`https://yggdrasill.shibalab.com/share?uuid=${uuid}`}
        />
      )}
    </>
  );
};

export default ResultPage;
