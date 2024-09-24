import { useRef } from "react";
import { Perf } from "r3f-perf";
import { OrbitControls, useHelper, PerspectiveCamera } from "@react-three/drei";

import * as THREE from "three";
import { Flower } from "./Objects/Flower";
import { Tree } from "./Objects/Tree";

// 基本
export const Basic = () => {
  const directionalLight = useRef<THREE.DirectionalLight>(null);
  const boxRef = useRef<THREE.Mesh>(null);

  // ダイレクト光のヘルパー（デバッグ用）
  useHelper(
    directionalLight as React.MutableRefObject<THREE.DirectionalLight>,
    THREE.DirectionalLightHelper,
    1,
    "red"
  );

  // useFrame((state, delta) => {
  //   // 経過時間
  //   const time = state.clock.elapsedTime;
  //   if (boxRef.current) {
  //     // X移動
  //     boxRef.current.position.x = Math.sin(time) + 1.5;
  //     // Y回転
  //     boxRef.current.rotation.y += delta;
  //   }
  // });

  return (
    <>
      {/* コントロール */}
      {/* <OrbitControls makeDefault /> */}
      <PerspectiveCamera
        makeDefault
        position={[0, 3, 16]}
        rotation={[Math.PI / 24, 0, 0]}
      />

      {/* パフォーマンスモニター */}
      <Perf position="top-left" />

      {/* 背景 */}
      {/* <color args={["transparent"]} attach="background" /> */}

      {/* 環境光 */}
      <ambientLight intensity={0.5} />

      {/* 平行光 */}
      <directionalLight
        castShadow
        ref={directionalLight}
        position={[10, 10, 0]}
        intensity={0.5}
        shadow-mapSize={[1024, 1024]}
      />

      <group position={[0, -1, 0]}>
        {/* 球体 */}
        {/* <mesh castShadow position={[-1, 0.6, 0]} scale={0.6}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh> */}

        {/* 箱 */}
        {/* <mesh castShadow position={[1, 0.5, 0]} ref={boxRef}>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh> */}

        {/* 平面 */}
        <mesh receiveShadow rotation-x={-Math.PI * 0.5} scale={10}>
          <planeGeometry />
          <meshStandardMaterial color="lightseagreen" />
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
          position={[0, 0, 0]}
          scale={1}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <Tree />
        </mesh>
      </group>
    </>
  );
};
