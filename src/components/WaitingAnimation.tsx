import { StrictMode } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import {
  Group,
  TextureLoader,
  RepeatWrapping,
  MeshStandardMaterial,
} from "three";
import * as THREE from "three";

// GLTF型の独自定義
type GLTFResult = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

interface ModelProps {
  url: string;
}

const Model: React.FC<ModelProps> = ({ url }) => {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(url) as unknown as GLTFResult; // 型アサーションでGLTFResultとして扱う
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // 全てのアニメーションを同時に再生

    Object.values(actions).forEach((action) => {
      // action!.loop = THREE.LoopOnce; // ループを一度だけに設定
      // action!.clampWhenFinished = true; // アニメーションが終了したらそのままにする
      action!.timeScale = 0.5; // アニメーションの速度を設定（適宜調整）

      action?.play();
    });
  }, [actions]);

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      //範囲外でも描画する
      mesh.frustumCulled = false;
    }
  });

  return <primitive ref={group} object={scene} />;
};

// メイン
type Props = {};
export const WaitingAnimation = () => {
  return (
    <div style={{ width: "100%", height: "100vh", opacity: 0.3 }}>
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
          <ambientLight intensity={5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <OrbitControls makeDefault />
          <mesh
            position={[0, 0, 0]}
            scale={0.3}
            rotation={[0, -Math.PI / 5, 0]}
          >
            <Model url="/gltf/flowers/simple_flower_loop.glb" />
          </mesh>
        </Canvas>
      </StrictMode>
    </div>
  );
};
