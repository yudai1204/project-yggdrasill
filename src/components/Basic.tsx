import { useEffect, useRef } from "react";
import { Perf } from "r3f-perf";
import {
  OrbitControls,
  PerspectiveCamera,
  OrthographicCamera,
} from "@react-three/drei";

import * as THREE from "three";
import { Flower } from "./Objects/Flower";
import { Tree } from "./Objects/Tree";
import { CameraOptions } from "@/types/camera";

// 基本
type Props = {
  isDebug: boolean;
  cameraOptions: CameraOptions;
};
export const Basic = (props: Props) => {
  const { isDebug, cameraOptions } = props;
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useEffect(() => {
    if (cameraRef.current && cameraOptions.viewOffset) {
      const { fullWidth, fullHeight, offsetX, offsetY, width, height } =
        cameraOptions.viewOffset;
      cameraRef.current.setViewOffset(
        fullWidth,
        fullHeight,
        offsetX,
        offsetY,
        width,
        height
      );
    }
    return () => cameraRef.current?.clearViewOffset();
  }, [cameraOptions.viewOffset]);

  return (
    <>
      {/* コントロール */}
      {/* <OrbitControls makeDefault /> */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        {...cameraOptions.options}
      />

      {/* パフォーマンスモニター */}
      {isDebug && <Perf position="top-left" />}

      {/* 環境光 */}
      <ambientLight intensity={0.5} />

      {/* 平行光 */}
      <directionalLight
        position={[5, 10, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <group position={[0, -1, 0]}>
        {/* 地面 */}
        <mesh receiveShadow rotation-x={-Math.PI * 0.5} scale={1}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#204f0f" />
        </mesh>

        {/* 3Dモデル */}
        <mesh
          castShadow
          position={[2, 10, 2]}
          scale={0.4}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}
        >
          <Flower />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          position={[0, 0, 0]}
          scale={13}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <Tree />
        </mesh>
      </group>
    </>
  );
};
