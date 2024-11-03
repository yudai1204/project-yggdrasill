import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Heading,
  Image,
  Icon,
  keyframes,
  Text,
} from "@chakra-ui/react";
import type { SpPos } from "@/types/calibrate";
import { useEffect } from "react";
import { WaitingAnimation } from "@/components/WaitingAnimation";

type Props = {
  spPos: SpPos;
  logo?: boolean;
};
export const WaitingScreen = (props: Props) => {
  const { spPos, logo = false } = props;

  const fadeAnimation = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.2;  }
`;

  const fadeOutExpandAnimation = keyframes`
  0%{
    opacity: 0;
    box-shadow: 0 0 0px 0px currentColor, inset 0 0 0px 0px currentColor;
  }
  20%{
    opacity: 0.8;
    box-shadow: 0 0 10px 0px currentColor, inset 0 0 10px 0px currentColor;
  }
  100%{
    opacity: 0;
    box-shadow: 0 0 40px 100px currentColor, inset 0 0 10px 0px currentColor;
  }
  `;

  const fadeInAnimation = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
  `;

  return (
    <Box animation={`${fadeInAnimation} 4s ease-in`}>
      <Box>
        <Card
          borderRadius="2vw"
          position="absolute"
          top="50%"
          left="50%"
          w="84%"
          p={4}
          transform="translate(-50%, -50%)"
          boxShadow="0 0 10px 0px #0006"
          zIndex={1000}
          backgroundColor="#2D374888"
          backdropFilter="blur(10px)"
        >
          <CardHeader
            textAlign="center"
            fontSize="2.2vw"
            fontFamily="Kaisei Opti"
            pb={0}
          >
            体験の流れ
          </CardHeader>
          <CardBody>
            <Grid templateColumns="1fr 1fr 1fr" gap={2}>
              <Box textAlign="center">
                <Text fontFamily="Kaisei Opti" fontSize="1.8vw">
                  1
                </Text>
                <Text fontFamily="Kaisei Opti" fontSize="1.2vw">
                  QRからあなたの好みを教えてください
                </Text>
                <Text fontFamily="Kaisei Opti" fontSize=".8vw">
                  Tell us your preferences from the QR code above.
                </Text>
                <Box opacity={0.6} w="50%" mx="auto" mt={5}>
                  <Image src="/1.svg" alt="1" />
                </Box>
              </Box>
              <Box textAlign="center">
                <Text fontFamily="Kaisei Opti" fontSize="1.8vw">
                  2
                </Text>
                <Text fontFamily="Kaisei Opti" fontSize="1.1vw">
                  作品にスマートフォンを置いてください
                </Text>
                <Text fontFamily="Kaisei Opti" fontSize=".8vw">
                  Place your smartphone on the artwork.
                </Text>
                <Box opacity={0.6} w="50%" mx="auto" mt={3}>
                  <Image src="/2.svg" alt="2" />
                </Box>
              </Box>
              <Box textAlign="center">
                <Text fontFamily="Kaisei Opti" fontSize="1.8vw">
                  3
                </Text>
                <Text fontFamily="Kaisei Opti" fontSize="1.2vw">
                  魔法のじょうろで種を育てよう！
                </Text>
                <Text fontFamily="Kaisei Opti" fontSize=".8vw">
                  Grow the seed with the magic watering can.
                </Text>
                <Box opacity={0.6} w="50%" mx="auto" mt={4}>
                  <Image src="/3.svg" alt="3" />
                </Box>
              </Box>
            </Grid>
          </CardBody>
        </Card>
      </Box>
      <Box
        position="absolute"
        bottom={spPos.height + 50}
        left="50%"
        transform={`translate(-50%, ${spPos.translateY}px)`}
        animation={`${fadeAnimation} 4s ease-in-out infinite`}
        zIndex={1000}
      >
        <Heading
          textAlign="center"
          fontSize="24px"
          mt="20px"
          fontFamily="Kaisei Opti"
          textShadow="0 0 10px #000"
        >
          ここにスマートフォンを置いてください
        </Heading>
        <Heading
          textAlign="center"
          fontSize="16px"
          mt="12px"
          fontFamily="Kaisei Opti"
          textShadow="0 0 10px #000"
        >
          Put your smartphone here.
        </Heading>
      </Box>
      <Box
        position="absolute"
        bottom={5}
        left={`calc(50% - ${spPos.width / 2}px)`}
        transform={`translate(${spPos.translateX}px, ${spPos.translateY}px)`}
        borderRadius={10}
        color="#fff"
        boxShadow={"0 0 10px 0px currentColor, inset 0 0 10px 0px currentColor"}
        width={spPos.width}
        height={spPos.height}
        textAlign="center"
        pt={2}
        zIndex={1000}
        backgroundColor="#1A202C66"
        backdropFilter="blur(10px)"
        animation={`${fadeOutExpandAnimation} 4s ease-in-out infinite`}
      ></Box>

      <Box
        zIndex={1000}
        position="absolute"
        top={350}
        backgroundColor="#FFFa"
        borderRadius={40}
        boxShadow={"0 0 10px 0px #FFF"}
        left="50%"
        transform="translateX(10%)"
      >
        <img src="/QR_180017.svg" alt="QR" style={{ width: "min(25vw)" }} />
      </Box>
      <Box position="absolute" w="100%" h="100svh" top="0" left="0">
        <WaitingAnimation />
      </Box>
      {logo && (
        <Box position="absolute" bottom={3} right={1} p={4}>
          <img src="/logo.png" alt="logo" style={{ opacity: 0.4 }} width={80} />
        </Box>
      )}
    </Box>
  );
};
