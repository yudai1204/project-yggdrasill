import type { UserType } from "@/types/calibrate";
import { GptAnalysis } from "@/types/metaData";

export const saveToLocalStorage = async (user: UserType) => {
  if (!user.metadata) {
    console.error("metadata is not found");
    return;
  }
  const answerString = JSON.stringify(user.metadata.answers);
  const GptAnalysisString = JSON.stringify(user.metadata.gptAnalysis);
  const uuid = user.uuid;
  localStorage.setItem("answers", answerString);
  localStorage.setItem("gptAnalysis", GptAnalysisString);
  localStorage.setItem("uuid", uuid);

  // URLも/resultに変更
  const url = new URL(window.location.href);
  url.pathname = "/result";
  window.history.pushState({}, "", url.toString());

  // 最後にAPIを叩いてDBに保存

  type PostBody = {
    uuid: string;
    is_dev: boolean;
    answers: string[];
    gpt_result: GptAnalysis;
  };

  const endpoint = "/api/proxy";

  const postBody: PostBody = {
    uuid: user.uuid,
    is_dev: process.env.NODE_ENV === "development",
    answers: user.metadata.answers.map((a) => a ?? "undefined"),
    gpt_result: user.metadata.gptAnalysis,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postBody),
    });

    if (!response.ok) {
      console.error("Failed to post data to PHP API");
    } else {
      console.log("Successfully posted data to PHP API", response);
    }
  } catch (error) {
    console.error("Failed to post data to PHP API", error);
  }
};
