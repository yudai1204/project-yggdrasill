import { useState, useEffect } from "react";
import { Box, useColorMode } from "@chakra-ui/react";
import { FormBody } from "./FormBody";
import { FormBlooming } from "./FormBlooming";
import { questions } from "./questions";
import type { GptAnalysis } from "@/types/metaData";
import { User } from "../main/user";

export const Form = () => {
  const [isInputMode, setIsInputMode] = useState<boolean>(false);
  const [displayFlower, setDisplayFlower] = useState<boolean>(true);

  const [gptAnalysis, setGptAnalysis] = useState<GptAnalysis | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [answers, setAnswers] = useState<(string | undefined)[]>(
    Array(questions.en.length).fill(undefined)
  );
  const [language, setLanguage] = useState<"en" | "jp">("jp");

  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInputMode(true);
    }, 5000);

    const flowerTimer = setTimeout(() => {
      setDisplayFlower(false);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(flowerTimer);
    };
  }, []);

  useEffect(() => {
    if (colorMode === "light") {
      toggleColorMode();
    }
  }, [colorMode, toggleColorMode]);

  const submitAnswers = async () => {
    setIsLoading(true);
    const answerString = questions.en.reduce((acc, key, index) => {
      const answer = answers[index] || "未回答";
      return acc + `${key}: ${answer}\n`;
    }, "");

    console.log(answerString);

    try {
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "eyJhbGciOHiJIUzI1NiasInR5ckpXVCJ9.eyJ1vc2VyFIjoiYQisOjE2MzQwNjYwNzJ9",
          prompt: answerString,
          language: language === "jp" ? "日本語" : "English",
        }),
      });
      const chatData = await chatResponse.json();
      if (chatData.error) {
        throw new Error(chatData.error);
      }
      console.log(chatData);
      setGptAnalysis(chatData.response);
    } catch (error) {
      console.error("ERROR", error);
      alert(
        "An error occurred while submitting your answers.\n回答を送信中にエラーが発生しました。"
      );
    }
  };

  return (
    <>
      {gptAnalysis ? (
        <User gptAnalysis={gptAnalysis} answers={answers} />
      ) : (
        <Box
          w="100%"
          h="100svh"
          margin="auto"
          padding="5"
          boxShadow="lg"
          position="relative"
          fontFamily={"Zen Maru Gothic"}
        >
          {displayFlower && <FormBlooming />}
          <FormBody
            submitAnswers={submitAnswers}
            isLoading={isLoading}
            setAnswers={setAnswers}
            answers={answers}
            setLanguage={setLanguage}
            language={language}
            opacity={isInputMode ? 1 : 0}
          />
        </Box>
      )}
    </>
  );
};
