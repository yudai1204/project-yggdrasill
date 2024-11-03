import { Heading, Box, Image, keyframes } from "@chakra-ui/react";
import { AnimatedText } from "@/components/AnimatedText";
import { useEffect, useState } from "react";
import { SpPos } from "@/types/calibrate";

type Props = {
  spPos: SpPos;
  receiveJoroStatus: number;
};
export const JoroModeAnimation = (props: Props) => {
  const { spPos, receiveJoroStatus } = props;
  const [displayAnimatedText, setDisplayAnimatedText] = useState(false);
  const [displayWateringEffect, setDisplayWateringEffect] = useState(false);
  const [displayJoro, setDisplayJoro] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setDisplayAnimatedText(true);
    }, 2500);
  }, []);

  useEffect(() => {
    setDisplayWateringEffect(true);
    const timeout = setTimeout(() => {
      setDisplayWateringEffect(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [receiveJoroStatus]);

  const joroWrapperAnimation = keyframes`
  0%{
    opacity: 0;
    transform: rotate(-30deg);
  }
  20%{
    opacity: 1;
    transform: rotate(-30deg);
  }
  40%{
    transform: rotate(0deg);
  }
  80%{
    transform: rotate(0deg);
    opacity: 1;
  }
  92%,100%{
    transform: rotate(0deg);
    opacity: 0;
  }
  `;

  const joroWaterAnimation = keyframes`
  0%{
    opacity: 0;
  }
  50%{
    opacity: 0;
  }
  60%{
    opacity: 1;
  }
  80%{
    opacity: 1;
  }
  92%,100%{
    opacity: 0;
  }
  `;

  const fadeOutExpandAnimation = keyframes`
  0%{
    opacity: 1;
    box-shadow: 0 0 0px 0px currentColor, inset 0 0 0px 0px currentColor;
  }
  100%{
    opacity: 0;
    box-shadow: 0 0 40px 100px currentColor, inset 0 0 10px 0px currentColor;
  }
  `;

  return (
    <>
      <Box
        w="50%"
        mx="auto"
        h="fit-content"
        position="absolute"
        bottom={5}
        left="50%"
        transform={`translate(-90%, ${spPos.translateY - 250}px)`}
        opacity={displayJoro ? 0.7 : 0}
        transition="opacity 1s"
      >
        <Box
          position="relative"
          w="100%"
          h="0"
          pt="55%"
          animation={`${joroWrapperAnimation} 7s ease-in-out infinite`}
        >
          <Image
            position="absolute"
            top={0}
            left={0}
            right={0}
            src="/joro.svg"
            alt="じょうろ本体"
          />
          <Image
            position="absolute"
            opacity={0}
            top={0}
            left={0}
            right={0}
            src="/joro_water.svg"
            alt="じょうろの水"
            animation={`${joroWaterAnimation} 7s ease-in-out infinite`}
          />
        </Box>
      </Box>

      {displayWateringEffect && (
        <Box
          position="absolute"
          bottom={5}
          left={`calc(50% - ${spPos.width / 2}px)`}
          transform={`translate(${spPos.translateX}px, ${spPos.translateY}px)`}
          borderRadius={10}
          color="#87dada"
          boxShadow={
            "0 0 10px 0px currentColor, inset 0 0 10px 0px currentColor"
          }
          width={spPos.width}
          height={spPos.height}
          textAlign="center"
          pt={2}
          zIndex={1000}
          backgroundColor="#1A202C66"
          backdropFilter="blur(10px)"
          animation={`${fadeOutExpandAnimation} 1s ease-in-out forwards`}
        ></Box>
      )}
      {displayAnimatedText && (
        <>
          <Heading
            position="absolute"
            textAlign="center"
            top="10%"
            left="50%"
            transform="translateX(-50%)"
            zIndex={10000}
            color={"#fff"}
            fontFamily="Kaisei Opti"
            w={"100%"}
          >
            <Heading
              as="h2"
              size="2xl"
              marginBottom="1"
              fontFamily="Kaisei Opti"
              fontWeight="bold"
              letterSpacing="0.04em"
            >
              <AnimatedText
                text="魔法のジョウロで 種に水をあげよう"
                speed={0.66}
              />
            </Heading>
            <Heading
              as="h3"
              size="lg"
              marginTop={6}
              fontFamily="Kaisei Opti"
              fontWeight="bold"
              letterSpacing="0.03em"
            >
              <AnimatedText
                text="Water the seeds with the Magic Watering Can."
                speed={1.5}
              />
            </Heading>
          </Heading>
        </>
      )}
    </>
  );
};
