import { Box } from "@chakra-ui/react";
import { P5Canvas } from "./P5Canvas";
import { ThreeCanvas } from "./ThreeCanvas";
import "@fontsource/kaisei-opti";
import "@fontsource/zen-kaku-gothic-new/300.css";

type Props = {
  isDebug: boolean;
  logo?: boolean;
};
export const AnimationBase = (props: Props) => {
  const { logo = false, isDebug } = props;
  return (
    <>
      <Box width="100%" height="100svh">
        <Box position="absolute" top="0" left="0" width="100%" height="100%">
          <P5Canvas />
        </Box>
        <Box position="absolute" top="0" left="0" width="100%" height="100%">
          <ThreeCanvas isDebug={isDebug} />
        </Box>
      </Box>
      {logo && (
        <Box position="absolute" bottom={3} right={1} p={4}>
          <img src="/logo.png" alt="logo" style={{ opacity: 0.4 }} width={80} />
        </Box>
      )}
    </>
  );
};
