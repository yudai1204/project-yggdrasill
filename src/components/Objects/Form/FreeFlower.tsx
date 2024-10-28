import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Group } from "three";
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
      action!.loop = THREE.LoopOnce; // ループを一度だけに設定
      action!.clampWhenFinished = true; // アニメーションが終了したらそのままにする
      action!.timeScale = 0.9; // アニメーションの速度を設定（適宜調整）
      action!.time = action!.getClip().duration / 2; // アニメーションを半分から開始
      action?.play();
    });
  }, [actions]);

  return <primitive ref={group} object={scene} />;
};

const models = [
  "blooming_hibiscus_time-lapse_animation.glb",
  "blue_flower_animated.glb",
  "simple_flower_loop.glb",
];

type Props = {
  modelName?: string;
  idx?: number;
};

export const FreeFlower = (props: Props) => {
  const { modelName, idx = 0 } = props;
  return (
    <>
      <Model url={`/gltf/flowers/${modelName || models[idx]}`} />
    </>
  );
};
