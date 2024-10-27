import { StrictMode } from "react";
import { Canvas } from "@react-three/fiber";

import * as THREE from "three";
import { Basic } from "./Basic";
import { CameraOptions } from "@/types/camera";

// メイン
type Props = {
  isDebug: boolean;
  cameraOptions: CameraOptions;
};
export const ThreeCanvas = (props: Props) => {
  const { isDebug, cameraOptions } = props;
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <StrictMode>
        <Canvas
          flat
          shadows
          gl={{
            alpha: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            // outputEncoding: THREE.sRGBEncoding,
          }}
        >
          <Basic isDebug={isDebug} cameraOptions={cameraOptions} />
        </Canvas>
      </StrictMode>
    </div>
  );
};
