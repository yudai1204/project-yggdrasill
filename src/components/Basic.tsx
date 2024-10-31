import { useEffect, useMemo, useRef } from "react";
import { Perf } from "r3f-perf";
import { PerspectiveCamera, Text, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CAMERA_POSITION,
  CAMERA_ROTATION,
  FLOWER_POSITIONS,
  defaultCameraOptions,
} from "@/util/constants";
import * as THREE from "three";
import { Flower } from "./Objects/Flower";
import { Tree } from "./Objects/Tree";
import { CameraOptions } from "@/types/camera";
import { useState } from "react";
import type { UserType } from "@/types/calibrate";
import { Weather } from "./Objects/Weather";
import { Stage } from "./Objects/Stage";

// 基本
type Props = {
  isDebug: boolean;
  cameraOptions: CameraOptions;
  animationStartFrom: number;
  currentUser: UserType | null;
  noAnimation: boolean;
};
export const Basic = (props: Props) => {
  const {
    isDebug,
    cameraOptions,
    animationStartFrom,
    currentUser,
    noAnimation,
  } = props;
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const [doAnimation, setDoAnimation] = useState<boolean>(false);
  const [animationState, setAnimationState] = useState<{
    z: boolean;
    y: boolean;
    r: boolean;
  }>({
    z: false,
    y: false,
    r: false,
  });

  const analysis = useMemo(
    () => currentUser?.metadata?.gptAnalysis,
    [currentUser]
  );

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
      if (!animationState.z) {
        if (cameraRef.current.position.z > CAMERA_POSITION[2]) {
          cameraRef.current.position.z -=
            (cameraRef.current.position.z - CAMERA_POSITION[2] * 1.1) * 0.03;
        } else {
          cameraRef.current.position.z = CAMERA_POSITION[2];
          setAnimationState((prev) => ({ ...prev, z: true }));
        }
      }

      if (!animationState.y) {
        if (cameraRef.current.position.y < CAMERA_POSITION[1]) {
          cameraRef.current.position.y +=
            (defaultCameraOptions.options.position[1] -
              cameraRef.current.position.y) *
            0.04;
        } else {
          cameraRef.current.position.y = CAMERA_POSITION[1];
          setAnimationState((prev) => ({ ...prev, y: true }));
        }
      }

      // [0, 0 , 0]; デフォルトカメラ回転
      if (!animationState.r) {
        if (cameraRef.current.rotation.x < -Math.PI / 8) {
          cameraRef.current.rotation.x +=
            0 - cameraRef.current.rotation.x * 0.02;
        } else if (cameraRef.current.rotation.x < 0) {
          cameraRef.current.rotation.x += 0.003;
        } else {
          cameraRef.current.rotation.x = 0;
          setAnimationState((prev) => ({ ...prev, r: true }));
        }
      }
    }
  });

  return (
    <>
      {/* コントロール */}
      {isDebug && <OrbitControls />}
      {noAnimation && (
        <OrbitControls
          target={[0, 11.4, 0]}
          enablePan={false}
          maxDistance={60}
          minDistance={10}
          maxAzimuthAngle={Math.PI / 6}
          minAzimuthAngle={-Math.PI / 6}
          maxPolarAngle={(Math.PI * 5) / 8}
          minPolarAngle={Math.PI / 3}
        />
      )}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        {...(noAnimation
          ? {
              ...defaultCameraOptions.options,
              position: CAMERA_POSITION,
              rotation: [0, 0, 0],
            }
          : cameraOptions.options)}
      />

      {/* パフォーマンスモニター */}
      {isDebug && <Perf position="top-left" />}
      {analysis && (
        <group position={[0, 0, 0]}>
          {/* 天気 */}
          <Weather
            doAnimation={doAnimation}
            weather={analysis.weather}
            time={analysis.location === "Moon" ? "Night" : analysis.time}
          />
          {/* テキスト */}
          <Text
            font={
              analysis.treeTexture === "pixel"
                ? "/fonts/DotGothic16-Regular.ttf"
                : analysis.treeTexture === "realistic"
                  ? "/fonts/ZenKakuGothicNew-Regular.ttf"
                  : "/fonts/ZenMaruGothicNew-Regular.ttf"
            }
            fontSize={1}
            color="orange"
            position={[0, 2, 10]}
            anchorX="center" // テキストのX軸方向の基準位置
            anchorY="middle" // テキストのY軸方向の基準位置
            castShadow
            receiveShadow
          >
            {analysis.userName}の木
          </Text>

          {/* 花 */}
          <group>
            {FLOWER_POSITIONS[analysis.treeType].map((pos, index) => (
              <group
                key={index}
                position={pos.position}
                rotation={pos.rotation}
              >
                <mesh
                  rotation={[0, -Math.PI / 2, -Math.PI / 2]}
                  castShadow
                  scale={0.4}
                >
                  <Flower
                    flowerType={analysis.flowerType}
                    noAnimation={noAnimation}
                    colors={[
                      new THREE.Color(
                        currentUser?.metadata?.answers?.[0] ??
                          analysis.flowerColor[1]
                      ),
                      new THREE.Color(analysis.flowerColor[0]),
                    ]}
                  />
                </mesh>
              </group>
            ))}
          </group>
          {/* 木 */}
          <mesh
            position={[0, -0.1, 0]}
            scale={10}
            rotation={[0, -Math.PI / 2, 0]}
            receiveShadow
          >
            <Tree
              noAnimation={noAnimation}
              doAnimation={doAnimation}
              type={analysis.treeType}
            />
          </mesh>
          {/* 背景 */}
          <Stage
            location={analysis.location}
            season={analysis.season}
            treeTexture={analysis.treeTexture}
          />
        </group>
      )}
    </>
  );
};
