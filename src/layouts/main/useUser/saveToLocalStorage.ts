import type { UserType } from "@/types/calibrate";

export const saveToLocalStorage = (user: UserType) => {
  if (!user.metadata) {
    console.error("metadata is not found");
    return;
  }
  const answerString = JSON.stringify(user.metadata.answers);
  const GptAnalysisString = JSON.stringify(user.metadata.gptAnalysis);
  localStorage.setItem("answers", answerString);
  localStorage.setItem("gptAnalysis", GptAnalysisString);

  // URLも/resultに変更
  const url = new URL(window.location.href);
  url.pathname = "/result";
  window.history.pushState({}, "", url.toString());
};
