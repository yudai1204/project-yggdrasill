import { StrictMode } from "react";
import { Canvas } from "@react-three/fiber";

import * as THREE from "three";
import { Basic } from "./Basic";
import { CameraOptions } from "@/types/camera";
import type { UserType } from "@/types/calibrate";
import { Time as TimeType } from "@/types/metaData";

type Props = {
  currentUser: UserType | null;
  isDebug: boolean;
  cameraOptions: CameraOptions;
  isJoroMode: boolean;
  animationStartFrom: number;
  noAnimation: boolean;
  timeValue: TimeType | null;
  doEffect?: boolean;
  isUser?: boolean;
  noWeather?: boolean;
  noFlowers?: boolean;
};

export const ThreeCanvas = (props: Props) => {
  const {
    isDebug,
    cameraOptions,
    currentUser,
    isJoroMode,
    animationStartFrom,
    noAnimation,
    timeValue,
    doEffect,
    isUser,
    noWeather,
    noFlowers,
  } = props;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <StrictMode>
        <Canvas
          dpr={isUser ? 0.3 : [0.5, 1.5]}
          flat
          shadows
          gl={{
            alpha: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            // outputEncoding: THREE.sRGBEncoding,
          }}
        >
          <Basic
            isDebug={isDebug}
            cameraOptions={cameraOptions}
            animationStartFrom={
              animationStartFrom - (currentUser?.timeOffset.value ?? 0)
            }
            currentUser={currentUser}
            noAnimation={noAnimation}
            timeValue={timeValue}
            noWeather={noWeather}
            noFlowers={noFlowers}
          />
          {/* {doEffect && (
          <EffectComposer>
            色調整の例: 色相と彩度
            <HueSaturation hue={1} saturation={0.8} />
            明度とコントラスト
            <BrightnessContrast brightness={0.05} contrast={0.5} />
          </EffectComposer>
          )} */}
        </Canvas>
      </StrictMode>
    </div>
  );
};
