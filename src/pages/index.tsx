import { Box } from "@chakra-ui/react";
import { P5Canvas } from "../components/P5Canvas";
import { ThreeCanvas } from "../components/ThreeCanvas";
import "@fontsource/kaisei-opti";
import "@fontsource/zen-kaku-gothic-new/300.css";

export default function Home() {
  return (
    <Box width="100%" height="100svh" overflow="hidden" position="relative">
      <title>Project Yggdrasill</title>
      <Box width="100%" height="100vh">
        <Box position="absolute" top="0" left="0" width="100%" height="100%">
          <P5Canvas />
        </Box>
        <Box position="absolute" top="0" left="0" width="100%" height="100%">
          <ThreeCanvas />
        </Box>
      </Box>
      <Box position="absolute" bottom={3} right={1} p={4}>
        <img src="/logo.png" alt="logo" style={{ opacity: 0.4 }} width={80} />
      </Box>
    </Box>
  );
}
