import { useState, useEffect } from "react";
import { Box, useColorMode } from "@chakra-ui/react";
import { FormBody } from "./FormBody";
import { FormBlooming } from "./FormBlooming";
import { questionSummary } from "./questions";
import type { GptAnalysis } from "@/types/metaData";
import { User } from "../main/user";

export const Form = () => {
  const [isInputMode, setIsInputMode] = useState<boolean>(false);
  const [displayFlower, setDisplayFlower] = useState<boolean>(true);

  const [gptAnalysis, setGptAnalysis] = useState<GptAnalysis | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [answers, setAnswers] = useState<(string | undefined)[]>(
    Array(5).fill(undefined)
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
    const answerObject = questionSummary.en.reduce(
      (acc: Record<string, any>, key, index) => {
        acc[key.toLowerCase().replace(/\s+/g, "_")] = answers[index];
        return acc;
      },
      {}
    );

    try {
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: answerObject }),
      });
      const chatData = await chatResponse.json();
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
        <User gptAnalysis={gptAnalysis} />
      ) : (
        <Box
          w="100%"
          h="100svh"
          margin="auto"
          padding="5"
          borderWidth="1px"
          borderRadius="md"
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
