import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Cloud, Sky, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { Time, Weather as WeatherType } from "@/types/metaData";

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
    if (ref.current?.geometry.attributes.position) {
      for (let i = 0; i < particles.length; i += 6) {
        particles[i + 1] -= 20 * delta; // Y方向に降らせる速度調整
        particles[i + 4] -= 20 * delta; // 終点もY方向に降らせる速度調整

        // 下まで来た雨粒をリセット
        if (particles[i + 1] < -3) {
          particles[i + 1] = 30;
          particles[i + 4] = 30 - lineLength;
        }
      }
      // 変更を反映
      ref.current.geometry.attributes.position.needsUpdate = true;
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
    // ref.currentとgeometry、positionが存在するか確認
    if (ref.current && ref.current.geometry.attributes.position) {
      for (let i = 0; i < particles.length; i += 3) {
        particles[i + 1] -= delta * 3.3; // Y方向に降らせる速度調整

        particles[i] +=
          Math.sin(state.clock.getElapsedTime() + i) * delta * 0.5;

        // 下まで来た粒をリセット
        if (particles[i + 1] < -3) {
          particles[i + 1] = 35;
        }
      }
      // 更新フラグを立てて変更を反映
      ref.current.geometry.attributes.position.needsUpdate = true;
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
        sunPosition={[100, 20, 100]}
        distance={450000}
        inclination={isDaytime ? 0 : isEvening ? 0.5 : 0.8}
        azimuth={0.25}
      />
      <ambientLight color={ambientColor} intensity={isNight ? 1 : 0.8} />
      <directionalLight
        castShadow
        color={directionalColor}
        position={[10, 10, 5]}
        intensity={isNight ? 0.8 : 1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={150}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />

      {weather === "Cloudy" && (
        <>
          <Cloud position={[-10, 10, -10]} />
          <Cloud position={[10, 20, -15]} />
        </>
      )}
      {weather === "Rainy" && <Rain />}
      {weather === "Snowy" && <Snow />}
    </>
  );
}

type Props = {
  weather: WeatherType;
  time: Time;
};
export const Weather = (props: Props) => {
  const { weather, time } = props;

  return <WeatherScene weather={weather} time={time} />;
};
