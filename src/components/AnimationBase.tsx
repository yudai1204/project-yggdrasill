import { Box } from "@chakra-ui/react";
import { P5Canvas } from "./P5Canvas";
import { ThreeCanvas } from "./ThreeCanvas";
import "@fontsource/kaisei-opti";
import "@fontsource/zen-kaku-gothic-new/300.css";
import { CameraOptions } from "@/types/camera";
import { defaultCameraOptions } from "@/util/constants";
import type { UserType } from "@/types/calibrate";

// ジョウロモードの時はメインのアニメーション(Basic)を停止し、透明にする
// 現在のUnixTimeがanimationStartFromより後になったら、透明を解除してアニメーションを開始する
// ジョウロ待機中の画面はBasicとは別に作成し、不必要になったらコンポーネントをアンマウントする

type Props = {
  isDebug: boolean;
  logo?: boolean;
  cameraOptions?: CameraOptions;
  p5?: boolean;
  isJoroMode: boolean;
  animationStartFrom: number; // UnixTime
  currentUser: UserType | null;
};
export const AnimationBase = (props: Props) => {
  const {
    logo = false,
    isDebug,
    cameraOptions = defaultCameraOptions,
    p5 = false,
    isJoroMode = false,
    animationStartFrom = 0,
    currentUser = null,
  } = props;
  return (
    <>
      <Box width="100%" height="100lvh">
        {p5 && (
          <Box position="absolute" top="0" left="0" width="100%" height="100%">
            <P5Canvas />
          </Box>
        )}
        <Box position="absolute" top="0" left="0" width="100%" height="100%">
          <ThreeCanvas
            isDebug={isDebug}
            cameraOptions={cameraOptions}
            isJoroMode={isJoroMode}
            animationStartFrom={animationStartFrom}
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
