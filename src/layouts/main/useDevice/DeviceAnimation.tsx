import { Heading, Box } from "@chakra-ui/react";
import { AnimationBase } from "@/components/AnimationBase";
import { DeviceType, ScreenType, UserType } from "@/types/calibrate";
import { useState, useMemo, useEffect } from "react";
import { defaultCameraOptions } from "@/util/constants";

import React, { memo } from "react";

const MemoizedAnimationBase = memo(AnimationBase, (prevProps, nextProps) => {
  // receiveJoroStatusの変更を無視する
  return (
    prevProps.noWeather === nextProps.noWeather &&
    prevProps.isDebug === nextProps.isDebug &&
    prevProps.doEffect === nextProps.doEffect &&
    prevProps.isJoroMode === nextProps.isJoroMode &&
    prevProps.animationStartFrom === nextProps.animationStartFrom &&
    prevProps.currentUser === nextProps.currentUser &&
    // @ts-ignore
    prevProps.cameraOptions.viewOffset === nextProps.cameraOptions.viewOffset
  );
});

type Props = {
  isDebug: boolean;
  deviceNum: number | null;
  deviceBody: DeviceType | null;
  screenSize: { width: number; height: number } | null;
  isJoroMode: boolean;
  animationStartFrom: number; // UnixTime
  currentUser: UserType | null;
};

export const DeviceAnimation = (props: Props) => {
  const {
    isDebug,
    deviceNum,
    deviceBody,
    screenSize,
    isJoroMode,
    animationStartFrom,
    currentUser,
  } = props;

  const [hoge, setHoge] = useState<number>(0);

  // なぜか再レンダリングが走らないと座標計算に致命的なずが生じる
  useEffect(() => {
    setHoge(0);
    const interval = setInterval(() => {
      setHoge((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [isJoroMode, animationStartFrom, currentUser]);

  // 高さから視野角を計算
  const viewOffset = useMemo(() => {
    if (!screenSize || !deviceBody?.size.width) {
      return undefined;
    }
    return {
      fullWidth: screenSize?.width,
      fullHeight: screenSize?.height,
      offsetX: deviceBody?.position.x,
      offsetY: deviceBody?.position.y,
      width: deviceBody?.rawSize.width,
      height: deviceBody?.rawSize.height,
      // width:  deviceBody?.size.width * deviceBody?.zoom,
      // height: deviceBody?.size.height * deviceBody?.zoom,
    };
  }, [deviceBody, screenSize, hoge]);

  return (
    <Box w="100%" h="100%" filter="sepia(0.8)">
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
      {
        <MemoizedAnimationBase
          noWeather={true}
          isDebug={isDebug}
          doEffect={true}
          isJoroMode={isJoroMode}
          animationStartFrom={animationStartFrom}
          currentUser={currentUser}
          cameraOptions={{
            ...defaultCameraOptions,
            viewOffset,
          }}
        />
      }
    </Box>
  );
};
