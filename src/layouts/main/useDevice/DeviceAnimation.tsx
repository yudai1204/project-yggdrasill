import { Heading, Box } from "@chakra-ui/react";
import { AnimationBase } from "@/components/AnimationBase";
import { DeviceType, ScreenType } from "@/types/calibrate";
import { FOV } from "@/util/constants";

type Props = {
  isDebug: boolean;
  deviceNum: number | null;
  deviceBody: DeviceType | null;
  screenSize: { width: number; height: number } | null;
};

export const DeviceAnimation = (props: Props) => {
  const { isDebug, deviceNum, deviceBody, screenSize } = props;

  const fovRatio =
    (deviceBody?.size.height ?? 1920) / (screenSize?.height ?? 1920);

  return (
    <>
      {isDebug && (
        <Heading
          fontSize="30vw"
          fontWeight="400"
          position="absolute"
          top="50%"
          left="50%"
          zIndex="1"
          transform="translate(-50%, -50%)"
          opacity="0.5"
        >
          {deviceNum}
        </Heading>
      )}
      <AnimationBase
        isDebug={isDebug}
        cameraOptions={{
          position: [0, 15, 50],
          rotation: [0, 0, 0],
          far: 100,
          fov: FOV * fovRatio,
          near: 0.01,
        }}
      />
    </>
  );
};
