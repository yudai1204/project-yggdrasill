import React, { useRef, useEffect, StrictMode, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { Group } from "three";

// GLTF型の独自定義
type GLTFResult = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

interface ModelProps {
  url: string;
  doAnimation: boolean;
}
const Model = ({ url, doAnimation }: ModelProps) => {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(url) as unknown as GLTFResult; // 型アサーションでGLTFResultとして扱う
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    console.log("doAnimation", doAnimation);
    Object.values(actions).forEach((action) => {
      action!.loop = THREE.LoopOnce; // ループを一度だけに設定
      action!.clampWhenFinished = true; // アニメーションが終了したらそのままにする
      if (action?.time === 0) {
        const duration = action!.getClip().duration;
        action!.time = (duration * 2) / 7; // 開始時刻を調整（モデルの問題）
      }
      action!.timeScale = doAnimation ? 0.8 : 0;
      action?.play();
    });
  }, [actions, doAnimation]);

  return <primitive ref={group} object={scene} />;
};

// メイン
type Props = {
  animationCount: number;
};

export const SeedWatering = (props: Props) => {
  const { animationCount } = props;
  const [doAnimation, setDoAnimation] = useState<boolean>(false);

  useEffect(() => {
    if (animationCount === 0) return;
    setDoAnimation(true);

    const timeout = setTimeout(() => {
      if (animationCount < 3) {
        setDoAnimation(false);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [animationCount]);

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
            <Model
              url="/gltf/germination_of_seed.glb"
              doAnimation={doAnimation}
            />
          </mesh>
        </Canvas>
      </StrictMode>
    </div>
  );
};
