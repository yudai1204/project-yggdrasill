import { Box } from "@chakra-ui/react";
import { P5Canvas } from "./P5Canvas";
import { ThreeCanvas } from "./ThreeCanvas";
import "@fontsource/kaisei-opti";
import "@fontsource/zen-kaku-gothic-new/300.css";
import { CameraOptions } from "@/types/camera";
import { defaultCameraOptions } from "@/util/constants";

type Props = {
  isDebug: boolean;
  logo?: boolean;
  cameraOptions?: CameraOptions;
};
export const AnimationBase = (props: Props) => {
  const { logo = false, isDebug, cameraOptions = defaultCameraOptions } = props;
  return (
    <>
      <Box width="100%" height="100lvh">
        <Box position="absolute" top="0" left="0" width="100%" height="100%">
          <P5Canvas />
        </Box>
        <Box position="absolute" top="0" left="0" width="100%" height="100%">
          <ThreeCanvas isDebug={isDebug} cameraOptions={cameraOptions} />
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
