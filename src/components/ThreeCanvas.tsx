import { StrictMode } from "react";
import { Canvas } from "@react-three/fiber";

import * as THREE from "three";
import { Basic } from "./Basic";
import { CameraOptions } from "@/types/camera";
import type { UserType } from "@/types/calibrate";

type Props = {
  currentUser: UserType | null;
  isDebug: boolean;
  cameraOptions: CameraOptions;
  isJoroMode: boolean;
  animationStartFrom: number;
  noAnimation: boolean;
};

export const ThreeCanvas = (props: Props) => {
  const {
    isDebug,
    cameraOptions,
    currentUser,
    isJoroMode,
    animationStartFrom,
    noAnimation,
  } = props;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <StrictMode>
        <Canvas
          dpr={[0.5, 1.5]}
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
          />
        </Canvas>
      </StrictMode>
    </div>
  );
};
