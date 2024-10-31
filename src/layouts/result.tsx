import { Box, useColorMode } from "@chakra-ui/react";
import { AnimationBase } from "@/components/AnimationBase";
import type { UserType } from "@/types/calibrate";
import { useState, useEffect } from "react";
import { SNSButtons } from "@/components/SnsButtons";
import "@fontsource/kaisei-opti";
import "@fontsource/charmonman";
import { ResultCard } from "@/components/ResultCard";

type Props = {
  currentUser: UserType;
};
export const Result = (props: Props) => {
  const { currentUser } = props;
  const [language, setLanguage] = useState<"ja" | "en">("ja");

  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === "light") {
      toggleColorMode();
    }
  }, [colorMode, toggleColorMode]);

  return (
    <Box w="100%" h="100svh" pos="relative">
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
    </Box>
  );
};
