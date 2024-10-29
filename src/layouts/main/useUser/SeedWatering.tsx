import { StrictMode } from "react";
import { Canvas } from "@react-three/fiber";

import * as THREE from "three";
import { CameraOptions } from "@/types/camera";
import { Seed } from "@/components/Objects/Seed";

// メイン
type Props = {};
export const SeedWatering = () => {
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
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={10} castShadow />
          <mesh
            castShadow
            receiveShadow
            position={[0, -1, 0]}
            scale={1.8}
            rotation={[0, -Math.PI / 5, 0]}
          >
            <Seed />
          </mesh>
        </Canvas>
      </StrictMode>
    </div>
  );
};
