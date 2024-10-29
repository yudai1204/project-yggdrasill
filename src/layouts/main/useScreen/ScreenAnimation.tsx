import { AnimationBase } from "@/components/AnimationBase";
import { Box, Heading } from "@chakra-ui/react";
import { DeviceType, UserType } from "@/types/calibrate";

import "@fontsource/kaisei-opti";

type Props = {
  isDebug: boolean;
  devices: DeviceType[];
  isJoroMode: boolean;
  animationStartFrom: number; // UnixTime
  currentUser: UserType | null;
};
export const ScreenAnimation = (props: Props) => {
  const { isDebug, devices, isJoroMode, animationStartFrom, currentUser } =
    props;
  return (
    <>
      <AnimationBase
        isDebug={isDebug}
        logo
        isJoroMode={isJoroMode}
        animationStartFrom={animationStartFrom}
        currentUser={currentUser}
      />
      {isJoroMode && (
        <Heading
          position="absolute"
          textAlign="center"
          top="20%"
          left="50%"
          transform="translateX(-50%)"
          zIndex={10000}
          color={"#fff"}
          fontFamily="Kaisei Opti"
        >
          魔法のジョウロで種に水をあげよう
        </Heading>
      )}
      {isDebug &&
        devices.map((device, idx) => {
          if (device.isConnected) {
            return (
              <Box
                key={device.uuid}
                position="absolute"
                top={device.position.y}
                left={device.position.x}
                width={device.size.width * device.zoom}
                height={device.size.height * device.zoom}
                transform={`rotate(${device.rotation}deg)`}
                border="2px solid #fff"
                color="#fff"
                opacity={0.4}
                fontSize={device.size.width * device.zoom * 0.3}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {idx}
              </Box>
            );
          }
        })}
    </>
  );
};
