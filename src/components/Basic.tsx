import { useEffect, useRef } from "react";
import { Perf } from "r3f-perf";
import {
  OrbitControls,
  PerspectiveCamera,
  OrthographicCamera,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import * as THREE from "three";
import { Flower } from "./Objects/Flower";
import { Tree } from "./Objects/Tree";
import { CameraOptions } from "@/types/camera";
import { useState } from "react";

// 基本
type Props = {
  isDebug: boolean;
  cameraOptions: CameraOptions;
  animationStartFrom: number;
};
export const Basic = (props: Props) => {
  const { isDebug, cameraOptions, animationStartFrom } = props;
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const [doAnimation, setDoAnimation] = useState<boolean>(false);

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

  useEffect(() => {
    const now = new Date().getTime();
    // もしすでにアニメーション開始時刻を過ぎていたら、すぐにアニメーションを開始する
    // 本当はズレている分を考慮する必要があるが、今回は簡略化
    if (now >= animationStartFrom) {
      setDoAnimation(true);
    } else {
      // まだアニメーション開始時刻が来ていない場合は、アニメーション開始時刻まで待機する
      const timer = setTimeout(() => {
        setDoAnimation(true);
      }, animationStartFrom - now);
      return () => clearTimeout(timer);
    }
  }, [animationStartFrom]);

  // カメラアニメーション
  useFrame(() => {
    if (doAnimation && cameraRef.current) {
      // [0, 15, 50]; デフォルトカメラ位置
      if (cameraRef.current.position.z > 50) {
        cameraRef.current.position.z -=
          (cameraRef.current.position.z - 45) * 0.03;
      } else {
        cameraRef.current.position.z = 50;
      }
      if (cameraRef.current.position.y < 15) {
        cameraRef.current.position.y +=
          (16 - cameraRef.current.position.y) * 0.04;
      } else {
        cameraRef.current.position.y = 15;
      }
      // [0, 0 , 0]; デフォルトカメラ回転
      if (cameraRef.current.rotation.x < -Math.PI / 8) {
        cameraRef.current.rotation.x += 0 - cameraRef.current.rotation.x * 0.02;
      } else if (cameraRef.current.rotation.x < 0) {
        cameraRef.current.rotation.x += 0.003;
      } else {
        cameraRef.current.rotation.x = 0;
      }
    }
  });

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
          <Tree doAnimation={doAnimation} />
        </mesh>
      </group>
    </>
  );
};
