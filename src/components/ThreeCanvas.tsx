import { StrictMode } from "react";
import { Canvas } from "@react-three/fiber";

import * as THREE from "three";
import { Basic } from "./Basic";

// メイン
type Props = {
  isDebug: boolean;
};
export const ThreeCanvas = (props: Props) => {
  const { isDebug } = props;
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
          camera={{
            fov: 45, // 視野角
            near: 0.1, // 最小距離
            far: 100, // 最大距離
            position: [0, 0, 4], // カメラ位置
          }}
        >
          <Basic isDebug={isDebug} />
        </Canvas>
      </StrictMode>
    </div>
  );
};
