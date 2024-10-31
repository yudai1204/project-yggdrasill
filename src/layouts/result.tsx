import { Box, useColorMode, CircularProgress } from "@chakra-ui/react";
import { AnimationBase } from "@/components/AnimationBase";
import type { GptAnalysis } from "@/types/metaData";
import { UserType } from "@/types/calibrate";
import { useState, useEffect } from "react";
import { SNSButtons } from "@/components/SnsButtons";
import "@fontsource/kaisei-opti";
import "@fontsource/charmonman";
import { ResultCard } from "@/components/ResultCard";
import { initUserDevice } from "./main/useUser";

type Props = {
  answers: (string | undefined)[];
  gptAnalysis: GptAnalysis | null;
};
export const Result = (props: Props) => {
  const { answers, gptAnalysis } = props;
  const [language, setLanguage] = useState<"ja" | "en">("ja");
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === "light") {
      toggleColorMode();
    }
  }, [colorMode, toggleColorMode]);

  useEffect(() => {
    // switch language
    const browserLang = navigator.language;
    if (browserLang === "ja" || browserLang === "ja-JP") {
      setLanguage("ja");
    } else {
      setLanguage("en");
    }
    if (gptAnalysis == null) return;
    // generate user
    const user = initUserDevice(gptAnalysis, answers);
    user.ready = true;
    setCurrentUser(user);
  }, [gptAnalysis, answers]);

  return (
    <Box w="100%" h="100svh" pos="relative">
      {currentUser?.metadata?.gptAnalysis ? (
        <>
          <Box zIndex={1} pos="absolute" bottom={16} left={2} right={2}>
            <ResultCard currentUser={currentUser} language={language} />
          </Box>
          <Box zIndex={1} pos="absolute" bottom={2} left={2} right={2}>
            <SNSButtons url="https://yggdrasil.shibalab.com" />
          </Box>
          <AnimationBase
            isDebug={false}
            isJoroMode={false}
            animationStartFrom={0}
            noAnimation
            currentUser={currentUser}
          />
        </>
      ) : (
        <Box
          w="100%"
          h="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress isIndeterminate color="green.300" />
        </Box>
      )}
    </Box>
  );
};
