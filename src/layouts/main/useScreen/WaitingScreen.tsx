import { Box, Heading, keyframes } from "@chakra-ui/react";
import type { SpPos } from "@/types/calibrate";
import { useEffect } from "react";
import { WaitingAnimation } from "@/components/WaitingAnimation";

type Props = {
  spPos: SpPos;
};
export const WaitingScreen = (props: Props) => {
  const { spPos } = props;

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

  return (
    <Box>
      <Box
        position="absolute"
        bottom={spPos.height + 20}
        left="50%"
        transform="translate(-50%, -50%)"
        animation={`${fadeAnimation} 4s ease-in-out infinite`}
        zIndex={1000}
      >
        <Heading
          textAlign="center"
          fontSize="16px"
          mt="20px"
          fontFamily="Kaisei Opti"
          textShadow="0 0 10px #000"
        >
          スマートフォンを置いてください
        </Heading>
        <Heading
          textAlign="center"
          fontSize="12px"
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
        top={50}
        backgroundColor="#FFFa"
        borderRadius={40}
        boxShadow={"0 0 10px 0px #FFF"}
        left="50%"
        transform="translateX(-50%)"
      >
        <img
          src="/QR_180017.svg"
          alt="QR"
          style={{ width: "min(50vw, 40vh)" }}
        />
      </Box>
      <WaitingAnimation />
      <Box position="absolute" bottom={3} right={1} p={4}>
        <img src="/logo.png" alt="logo" style={{ opacity: 0.4 }} width={80} />
      </Box>
    </Box>
  );
};
