import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Cloud,
  Sky,
  Points,
  PointMaterial,
  Stars,
  SpotLight,
} from "@react-three/drei";
import * as THREE from "three";
import type { Time, Weather as WeatherType } from "@/types/metaData";
// import { CustomSpotLight } from "./CustomSpotLight";

const Rain = () => {
  const ref = useRef<THREE.LineSegments>(null);
  const numParticles = 500;
  const particles = new Float32Array(numParticles * 6);

  const lineLength = 1.5;

  // ランダムな位置に雨粒を配置
  for (let i = 0; i < particles.length; i += 6) {
    particles[i] = (Math.random() - 0.5) * 70; // X座標
    particles[i + 1] = Math.random() * 30; // Y座標
    particles[i + 2] = Math.random() * 50; // Z座標
    particles[i + 3] = particles[i];
    particles[i + 4] = particles[i + 1] - lineLength; // Y座標（終点）
    particles[i + 5] = particles[i + 2]; // Z座標（終点）
  }

  useFrame((state, delta) => {
    let needsUpdate = false; // 更新が必要かどうかを追跡

    if (ref.current?.geometry.attributes.position) {
      for (let i = 0; i < particles.length; i += 6) {
        particles[i + 1] -= 20 * delta; // Y方向に降らせる速度調整
        particles[i + 4] -= 20 * delta; // 終点もY方向に降らせる速度調整

        // 下まで来た雨粒をリセット
        if (particles[i + 1] < -3) {
          particles[i + 1] = 30;
          particles[i + 4] = 30 - lineLength;
          needsUpdate = true; // 更新が必要
        }
      }

      if (needsUpdate) {
        // 変更を反映
        ref.current.geometry.attributes.position.needsUpdate = true;
        state.invalidate(); // 必要なときだけ再レンダリング
      }
    }
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={numParticles * 2} // 始点と終点で2倍
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#999" // 雨粒の色
        transparent={true}
        opacity={0.6} // 雨の透明度
      />
    </lineSegments>
  );
};

const Snow = () => {
  const ref = useRef<THREE.Points>(null);

  const numParticles = 1500;
  const particles = new Float32Array(numParticles * 3);

  // ランダムな位置に粒を配置
  for (let i = 0; i < particles.length; i += 3) {
    particles[i] = (Math.random() - 0.5) * 70; // X座標
    particles[i + 1] = Math.random() * 35; // Y座標
    particles[i + 2] = Math.random() * 50; // Z座標
  }

  useFrame((state, delta) => {
    let needsUpdate = false; // 更新が必要かどうかを追跡

    // ref.currentとgeometry、positionが存在するか確認
    if (ref.current && ref.current.geometry.attributes.position) {
      for (let i = 0; i < particles.length; i += 3) {
        particles[i + 1] -= delta * 3.3; // Y方向に降らせる速度調整

        particles[i] +=
          Math.sin(state.clock.getElapsedTime() + i) * delta * 0.5;

        // 下まで来た粒をリセット
        if (particles[i + 1] < -3) {
          particles[i + 1] = 35;
          needsUpdate = true; // 更新が必要
        }
      }

      if (needsUpdate) {
        // 更新フラグを立てて変更を反映
        ref.current.geometry.attributes.position.needsUpdate = true;
        state.invalidate(); // 必要なときだけ再レンダリング
      }
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position" // 明示的にpositionをgeometryに追加
          count={numParticles}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12} // 雨粒のサイズを調整
        color="#CCCCCC" // 雨粒の色を設定
        sizeAttenuation={true} // カメラから遠いほど小さくなる
        transparent={true}
        opacity={0.6}
        depthWrite={false} // 深度の描画順序
        blending={THREE.AdditiveBlending} // ブレンドモードを加算ブレンド
      />
    </points>
  );
};

interface WeatherSceneProps {
  weather: WeatherType;
  time: Time;
}
function WeatherScene({ weather, time }: WeatherSceneProps) {
  const isDaytime = time === "Noon";
  const isEvening = time === "Evening";
  const isNight = time === "Night";

  const ambientColor = isDaytime
    ? "#ffffff"
    : isEvening
      ? "#ffa07a"
      : "#222244";
  const directionalColor = isEvening ? "#ffcc00" : "#ffffff";

  return (
    <>
      <Sky
        turbidity={weather === "Rainy" ? 30 : 8}
        rayleigh={weather === "Rainy" ? 0.3 : 0.8}
        sunPosition={
          isDaytime
            ? [100, 20, 100]
            : isEvening
              ? [100, 2, 100]
              : [100, -10, 100]
        }
        distance={4500}
        inclination={isDaytime ? 0 : isEvening ? 0.5 : 0.9}
        azimuth={0.25}
      />
      {isNight && (
        <>
          <Stars
            radius={100} // 星の点滅(拡大)度合い
            depth={50} // 星の深さ
            count={1000} // 星の数
            factor={4} // 星の大きさ
            saturation={9} // 星の彩度
            speed={5} // 点滅のスピード
          />
          <Stars
            radius={110} // 星の点滅(拡大)度合い
            depth={50} // 星の深さ
            count={1000} // 星の数
            factor={4} // 星の大きさ
            saturation={9} // 星の彩度
            speed={2} // 点滅のスピード
          />
          <Stars
            radius={100} // 星の点滅(拡大)度合い
            depth={50} // 星の深さ
            count={1000} // 星の数
            factor={4} // 星の大きさ
            saturation={1} // 星の彩度
            speed={3} // 点滅のスピード
          />
          {/* <CustomSpotLight
            position={new THREE.Vector3(3, 5, 0)}
            targetPos={new THREE.Vector3(0, 1, -0.8)}
          /> */}
        </>
      )}
      <ambientLight color={ambientColor} intensity={isNight ? 1 : 0.8} />
      <directionalLight
        castShadow
        color={directionalColor}
        position={[10, 10, 5]}
        intensity={isNight ? 0.8 : 1.5}
        shadow-mapSize-width={128}
        shadow-mapSize-height={128}
        shadow-camera-far={100}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={20}
        shadow-camera-bottom={-10}
      />

      {weather === "Rainy" && (
        <>
          <Cloud
            position={[40, 120, -50]}
            scale={[15, 15, 15]}
            color={"#777777"}
            opacity={0.5}
            growth={10}
            speed={0.05}
          />
          <Cloud
            speed={0.05}
            position={[-40, 120, -50]}
            scale={[15, 15, 15]}
            color={"#777777"}
            opacity={0.5}
            growth={10}
          />
          <Rain />
        </>
      )}
      {(weather === "Snowy" || weather === "Cloudy") && (
        <>
          <Cloud
            position={[40, 80, -50]}
            scale={[8, 8, 8]}
            color={"#CCCCCC"}
            opacity={0.5}
            growth={10}
            speed={0.02}
          />
          <Cloud
            speed={0.02}
            position={[-40, 80, -50]}
            scale={[8, 8, 8]}
            color={"#CCCCCC"}
            opacity={0.5}
            growth={10}
          />
        </>
      )}
      {weather === "Snowy" && <Snow />}
    </>
  );
}

type Props = {
  weather: WeatherType;
  time: Time;
  doAnimation: boolean;
};
export const Weather = (props: Props) => {
  const { weather, time, doAnimation } = props;

  return (
    <mesh>
      <WeatherScene weather={weather} time={time} />
    </mesh>
  );
};
