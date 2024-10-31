import { useEffect, useRef } from "react";
import { Perf } from "r3f-perf";
import { PerspectiveCamera, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CAMERA_POSITION,
  CAMERA_ROTATION,
  defaultCameraOptions,
} from "@/util/constants";
import * as THREE from "three";
import { Flower } from "./Objects/Flower";
import { Tree } from "./Objects/Tree";
import { CameraOptions } from "@/types/camera";
import { useState } from "react";
import type { UserType } from "@/types/calibrate";
import { Weather } from "./Objects/Weather";
import { FBXModel } from "./Objects/Stage/Hageyama";

// 基本
type Props = {
  isDebug: boolean;
  cameraOptions: CameraOptions;
  animationStartFrom: number;
  currentUser: UserType | null;
};
export const Basic = (props: Props) => {
  const { isDebug, cameraOptions, animationStartFrom, currentUser } = props;
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
      console.log("start animation now");
      setDoAnimation(true);
    } else {
      console.log("wait for animation start");
      // まだアニメーション開始時刻が来ていない場合は、アニメーション開始時刻まで待機する
      const timer = setTimeout(() => {
        console.log("start animation!!");
        setDoAnimation(true);
      }, animationStartFrom - now);
      return () => clearTimeout(timer);
    }
  }, [animationStartFrom]);

  // カメラアニメーション
  useFrame(() => {
    if (doAnimation && cameraRef.current) {
      // [0, 15, 50]; デフォルトカメラ位置
      if (cameraRef.current.position.z > CAMERA_POSITION[2]) {
        cameraRef.current.position.z -=
          (cameraRef.current.position.z - CAMERA_POSITION[2] * 0.95) * 0.03;
      } else {
        cameraRef.current.position.z = CAMERA_POSITION[2];
      }
      if (cameraRef.current.position.y < CAMERA_POSITION[1]) {
        cameraRef.current.position.y +=
          (defaultCameraOptions.options.position[1] -
            cameraRef.current.position.y) *
          0.04;
      } else {
        cameraRef.current.position.y = CAMERA_POSITION[1];
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

      <group position={[0, -1, 0]}>
        {/* 地面 */}
        <mesh receiveShadow rotation-x={-Math.PI * 0.5} scale={1}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#204f0f" />
        </mesh>

        {/* 天気 */}
        {currentUser?.metadata && (
          <Weather
            doAnimation={doAnimation}
            weather={currentUser.metadata.gptAnalysis.weather}
            time={currentUser.metadata.gptAnalysis.time}
          />
        )}

        {/* テキスト */}
        {currentUser && (
          <Text
            font={
              currentUser.metadata?.gptAnalysis.treeTexture === "pixel"
                ? "/fonts/DotGothic16-Regular.ttf"
                : currentUser.metadata?.gptAnalysis.treeTexture === "realistic"
                  ? "/fonts/ZenKakuGothicNew-Regular.ttf"
                  : "/fonts/ZenMaruGothicNew-Regular.ttf"
            }
            fontSize={1}
            color="orange"
            position={[0, 1, 10]}
            anchorX="center" // テキストのX軸方向の基準位置
            anchorY="middle" // テキストのY軸方向の基準位置
            castShadow
            receiveShadow
          >
            {currentUser.metadata?.gptAnalysis.userName}の木
          </Text>
        )}

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
          position={[0, -0.1, 0]}
          scale={10}
          rotation={[0, -Math.PI / 2, 0]}
          receiveShadow
        >
          <Tree
            doAnimation={doAnimation}
            type={currentUser?.metadata?.gptAnalysis.treeType}
          />
        </mesh>
        {/* <mesh position={[0, 0, 0]} scale={0.1} rotation={[0, 0, 0]}>
          <FBXModel />
        </mesh> */}
      </group>
    </>
  );
};
