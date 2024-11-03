import { Heading, Box } from "@chakra-ui/react";
import { AnimationBase } from "@/components/AnimationBase";
import { UserType } from "@/types/calibrate";
import { useState, useMemo, useEffect } from "react";
import { defaultCameraOptions } from "@/util/constants";

type Props = {
  userBody: UserType | null;
  screenSize: { width: number; height: number } | null;
  animationStartFrom: number; // UnixTime
};

export const UserAnimation = (props: Props) => {
  const { userBody, screenSize, animationStartFrom } = props;

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
  }, [animationStartFrom]);

  // 高さから視野角を計算
  const viewOffset = useMemo(() => {
    if (!screenSize || !userBody?.size.width) {
      return undefined;
    }
    return {
      fullWidth: screenSize?.width,
      fullHeight: screenSize?.height,
      offsetX: userBody?.position.x,
      offsetY: userBody?.position.y,
      width: userBody?.rawSize.width,
      height: userBody?.rawSize.height,
      // width:  deviceBody?.size.width * deviceBody?.zoom,
      // height: deviceBody?.size.height * deviceBody?.zoom,
    };
  }, [userBody, screenSize, hoge]);

  return (
    <>
      <AnimationBase
        isDebug={false}
        isJoroMode={false}
        animationStartFrom={animationStartFrom}
        currentUser={userBody}
        isUser={true}
        cameraOptions={{
          ...defaultCameraOptions,
          viewOffset,
        }}
      />
    </>
  );
};
