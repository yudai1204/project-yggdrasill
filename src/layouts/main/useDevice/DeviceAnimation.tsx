import { Heading, Box } from "@chakra-ui/react";
import { AnimationBase } from "@/components/AnimationBase";
import { DeviceType, ScreenType, UserType } from "@/types/calibrate";
import { useState, useMemo, useEffect } from "react";
import { defaultCameraOptions } from "@/util/constants";

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
    setTimeout(() => {
      setHoge((prev) => prev + 1);
    }, 100);
    setTimeout(() => {
      setHoge((prev) => prev + 1);
    }, 500);
    setTimeout(() => {
      setHoge((prev) => prev + 1);
    }, 1000);
    setTimeout(() => {
      setHoge((prev) => prev + 1);
    }, 5000);
  }, [isJoroMode, animationStartFrom]);

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
      {
        <AnimationBase
          isDebug={isDebug}
          isJoroMode={isJoroMode}
          animationStartFrom={animationStartFrom}
          currentUser={currentUser}
          cameraOptions={{
            ...defaultCameraOptions,
            viewOffset,
          }}
        />
      }
    </>
  );
};
