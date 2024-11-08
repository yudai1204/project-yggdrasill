import { Box } from "@chakra-ui/react";
import { P5Canvas } from "./P5Canvas";
import { ThreeCanvas } from "./ThreeCanvas";
import "@fontsource/kaisei-opti";
import "@fontsource/zen-kaku-gothic-new/300.css";
import { CameraOptions } from "@/types/camera";
import { defaultCameraOptions } from "@/util/constants";
import type { UserType } from "@/types/calibrate";
import { Time } from "@/types/metaData";
import { useEffect, useMemo, useState } from "react";

// ジョウロモードの時はメインのアニメーション(Basic)を停止し、透明にする
// 現在のUnixTimeがanimationStartFromより後になったら、透明を解除してアニメーションを開始する
// ジョウロ待機中の画面はBasicとは別に作成し、不必要になったらコンポーネントをアンマウントする

type Props = {
  isDebug: boolean;
  logo?: boolean;
  cameraOptions?: CameraOptions;
  isJoroMode: boolean;
  animationStartFrom: number; // UnixTime
  currentUser: UserType | null;
  noAnimation?: boolean;
  timeValue?: Time | null;
  doEffect?: boolean;
  isUser?: boolean;
  noWeather?: boolean;
  noFlowers?: boolean;
};
export const AnimationBase = (props: Props) => {
  const {
    logo = false,
    isDebug,
    cameraOptions = defaultCameraOptions,
    isJoroMode = false,
    animationStartFrom,
    currentUser,
    noAnimation = false,
    timeValue = null,
    doEffect = false,
    isUser,
    noWeather,
    noFlowers,
  } = props;

  // const [filter, setFilter] = useState<string>("none");

  // useEffect(() => {
  //   if (isUser) {
  //     return;
  //   }

  //   let timeout;

  //   // deviceの時
  //   if (noWeather) {
  //     timeout = setTimeout(() => {
  //       setFilter("sepia(100%)");
  //     });
  //   } else {
  //     // screenの時
  //     setFilter("sepia(100%)");
  //   }
  // }, [isUser, noWeather, noFlowers]);

  return (
    <>
      <Box width="100%" height="100svh">
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          // filter={filter}
        >
          <ThreeCanvas
            currentUser={currentUser}
            isDebug={isDebug}
            cameraOptions={cameraOptions}
            isJoroMode={isJoroMode}
            animationStartFrom={animationStartFrom}
            noAnimation={noAnimation}
            timeValue={timeValue}
            doEffect={doEffect}
            isUser={isUser}
            noWeather={noWeather}
            noFlowers={noFlowers}
          />
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
