import { AnimationBase } from "@/components/AnimationBase";
import { Box, Heading } from "@chakra-ui/react";
import { DeviceType, SpPos, UserType } from "@/types/calibrate";
import "@fontsource/kaisei-opti";
import { JoroModeAnimation } from "./JoroModeAnimation";
import React, { memo } from "react";

const MemoizedAnimationBase = memo(AnimationBase, (prevProps, nextProps) => {
  return (
    prevProps.isDebug === nextProps.isDebug &&
    prevProps.isJoroMode === nextProps.isJoroMode &&
    prevProps.animationStartFrom === nextProps.animationStartFrom &&
    prevProps.currentUser === nextProps.currentUser
  );
});

type Props = {
  isDebug: boolean;
  devices: DeviceType[];
  isJoroMode: boolean;
  animationStartFrom: number; // UnixTime
  currentUser: UserType | null;
  spPos: SpPos;
  receiveJoroStatus: number;
};
export const ScreenAnimation = (props: Props) => {
  const {
    isDebug,
    devices,
    isJoroMode,
    animationStartFrom,
    currentUser,
    spPos,
    receiveJoroStatus,
  } = props;

  return (
    <>
      <Box
        width="100%"
        height="100%"
        opacity={isJoroMode ? 0 : 1}
        transition="opacity .5s 1.5s ease-in-out"
      >
        <MemoizedAnimationBase
          isDebug={isDebug}
          logo
          isJoroMode={isJoroMode}
          animationStartFrom={animationStartFrom}
          currentUser={currentUser}
        />
      </Box>
      {isJoroMode && (
        <JoroModeAnimation
          spPos={spPos}
          receiveJoroStatus={receiveJoroStatus}
        />
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
