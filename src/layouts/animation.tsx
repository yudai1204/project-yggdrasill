import { Box } from "@chakra-ui/react";
import { AnimationBase } from "@/components/AnimationBase";
export default function Animation() {
  return (
    <Box width="100%" height="100lvh" overflow="hidden" position="relative">
      <AnimationBase logo isDebug />
    </Box>
  );
}
