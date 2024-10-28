import { useState, useEffect } from "react";
import { Box, useColorMode } from "@chakra-ui/react";
import { FormBody } from "./FormBody";
import { FormBlooming } from "./FormBlooming";

export const Form = () => {
  const [isInputMode, setIsInputMode] = useState<boolean>(false);
  const [displayFlower, setDisplayFlower] = useState<boolean>(true);

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

  const submitAnswers = () => {
    setIsLoading(true);
  };

  return (
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
  );
};
