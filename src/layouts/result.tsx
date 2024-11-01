import {
  Box,
  useColorMode,
  CircularProgress,
  Card,
  Text,
  Button,
  Icon,
  Stack,
} from "@chakra-ui/react";
import { AnimationBase } from "@/components/AnimationBase";
import type { GptAnalysis } from "@/types/metaData";
import { UserType } from "@/types/calibrate";
import { useState, useEffect } from "react";
import { SNSButtons } from "@/components/SnsButtons";
import "@fontsource/kaisei-opti";
import "@fontsource/charmonman";
import { ResultCard } from "@/components/ResultCard";
import { initUserDevice } from "./main/useUser";
import { BsTwitterX } from "react-icons/bs";
import { rmvCaptl } from "@/util/util";

type Props = {
  answers: (string | undefined)[];
  gptAnalysis: GptAnalysis | null;
  shareUrl: string;
  isShared?: boolean;
};
export const Result = (props: Props) => {
  const { answers, gptAnalysis, shareUrl, isShared = false } = props;
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
          {!isShared ? (
            <>
              <Box zIndex={1} pos="absolute" bottom={16} left={2} right={2}>
                <ResultCard currentUser={currentUser} language={language} />
              </Box>
              <Box zIndex={1} pos="absolute" bottom={2} left={2} right={2}>
                <SNSButtons
                  url={shareUrl}
                  language={language}
                  flowerName={`Magical ${rmvCaptl(currentUser.metadata.gptAnalysis.flowerType, false)}`}
                />
              </Box>
            </>
          ) : (
            <>
              <Box zIndex={1} pos="absolute" bottom={16} left={2} right={2}>
                <ResultCard currentUser={currentUser} language={language} />
              </Box>
              <Stack
                zIndex={1}
                pos="absolute"
                bottom={2}
                left={2}
                right={2}
                spacing={2}
                direction="row"
                justify="center"
              >
                <Card
                  as={Button}
                  w="full"
                  h={12}
                  backdropFilter="blur(4px)"
                  backgroundColor="#2D3748CC"
                  justifyContent="center"
                  alignItems="center"
                  display="flex"
                  flexDirection="row"
                  onClick={() => window.open("http://shibalab.com")}
                >
                  <Text fontFamily="Kaisei Opti" textAlign="center">
                    ShibaLab at 教室棟404教室
                  </Text>
                </Card>
                <Card
                  as={Button}
                  w={12}
                  h={12}
                  borderRadius="full"
                  rel="noopener"
                  onClick={() => window.open("http://x.com/shiba_lab")}
                  color="white"
                  py={2}
                >
                  <Icon as={BsTwitterX} />
                </Card>
                <Card
                  as={Button}
                  w={12}
                  h={12}
                  borderRadius="full"
                  rel="noopener"
                  onClick={() => window.open("http://shibaurasai.jp")}
                  color="white"
                  padding={2}
                >
                  <img src="/shibafes_logo.svg" alt="芝浦祭" />
                </Card>
              </Stack>
            </>
          )}
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
