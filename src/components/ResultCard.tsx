import { useState } from "react";
import {
  Box,
  Card,
  CardBody,
  Collapse,
  Heading,
  Icon,
  IconButton,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { IoIosArrowDown } from "react-icons/io";
import type { UserType } from "@/types/calibrate";
import { getNearestColor } from "@/util/util";
import type { GptAnalysis } from "@/types/metaData";

const rmvCaptl = (str: string, toLower = true) => {
  if (toLower) {
    return str.replace(/([A-Z])/g, " $1").toLowerCase();
  }
  return str.replace(/([A-Z])/g, " $1");
};

type Props = {
  currentUser: UserType | null;
  language: "ja" | "en";
};

export const ResultCard = (props: Props) => {
  const { currentUser, language } = props;
  const [hideCard, setHideCard] = useState<boolean>(true);
  const analysis = currentUser?.metadata?.gptAnalysis as GptAnalysis;

  return (
    <Card w="100%" backdropFilter="blur(4px)" backgroundColor="#2D3748CC">
      <CardBody py={3}>
        <Heading
          size="sm"
          textAlign="center"
          mb={1}
          fontFamily="Kaisei Opti"
          onClick={() => setHideCard(!hideCard)}
          position="relative"
        >
          {analysis.userName}
          {language === "ja" ? "の" : "'s "}
          Magical
          {rmvCaptl(analysis.flowerType, false)}
          <IconButton
            aria-label="expand"
            icon={<Icon as={IoIosArrowDown} />}
            size="xs"
            variant="text"
            pos="absolute"
            right={2}
            top="50%"
            transition="transform 0.3s"
            transform={
              hideCard
                ? "translateY(-50%) rotate(180deg)"
                : "translateY(-50%) rotate(0deg)"
            }
          />
        </Heading>
        <Collapse
          in={!hideCard}
          animateOpacity
          transition={{ enter: { duration: 0.4 }, exit: { duration: 0.4 } }}
        >
          <Stack divider={<StackDivider />} spacing="4" mt={2}>
            <Box>
              <Heading size="xs" fontFamily="Kaisei Opti" textAlign="center">
                {language === "ja" ? "魔法の呪文" : "Magic Spell"}
              </Heading>
              <Text
                pt="2"
                fontSize="sm"
                fontFamily="Charmonman"
                textTransform="lowercase"
                textAlign="center"
              >
                {rmvCaptl(
                  `${analysis.season}, at ${analysis.location}, in the ${analysis.time}, ${analysis.weather}, ${analysis.flowerSize} size, ${analysis.treeAge} ${analysis.treeType} ${analysis.treeHeight} tree, ${analysis.treeTexture}.`
                )}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" fontFamily="Kaisei Opti" textAlign="center">
                あなたが選んだ色
              </Heading>
              <Text
                pt="2"
                fontSize="sm"
                fontFamily="Charmonman"
                textAlign="center"
              >
                <Box
                  as="span"
                  display="inline-block"
                  bgColor={currentUser?.metadata?.answers[0]}
                  color="#FFFFFF"
                  px={2}
                  py={0.5}
                  rounded="md"
                  mixBlendMode="difference"
                >
                  {
                    getNearestColor(
                      currentUser?.metadata?.answers[0] ?? "#000000"
                    )?.name
                  }
                </Box>
              </Text>
            </Box>
            <Box>
              <Heading size="xs" fontFamily="Kaisei Opti" textAlign="center">
                {language === "ja"
                  ? "この世界の花"
                  : "The flower that suits you in this world"}
              </Heading>
              <Text
                pt="2"
                fontSize="xs"
                fontFamily="Kaisei Opti"
                textAlign="center"
              >
                {language === "ja"
                  ? `魔法のない世界で最も近い花は${analysis.flowerName}です。`
                  : `In a world without magic, the flower you created is most similar to ${analysis.flowerName}.`}
              </Text>
            </Box>
          </Stack>
        </Collapse>
      </CardBody>
    </Card>
  );
};
