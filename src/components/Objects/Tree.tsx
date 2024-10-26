import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import {
  Group,
  TextureLoader,
  MeshStandardMaterial,
  RepeatWrapping,
} from "three";
import * as THREE from "three";

// GLTF型の独自定義
type GLTFResult = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

interface ModelProps {
  url: string;
  textureUrl: string;
}

const Model: React.FC<ModelProps> = ({ url, textureUrl }) => {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(url) as unknown as GLTFResult;
  const { actions } = useAnimations(animations, group);

  const texture = useLoader(TextureLoader, textureUrl);

  useEffect(() => {
    Object.values(actions).forEach((action) => {
      action!.loop = THREE.LoopOnce; // ループを一度だけに設定
      action!.clampWhenFinished = true; // アニメーションが終了したらそのままにする
      action!.timeScale = 2.5; // アニメーションの速度を設定（適宜調整）
      action?.play();
    });

    // テクスチャの繰り返し設定
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(4, 4); // 4x4の繰り返しに設定（適宜調整）

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material instanceof MeshStandardMaterial) {
          mesh.material.map = texture;
          mesh.material.needsUpdate = true;
        }
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [actions, scene, texture]);

  return <primitive ref={group} object={scene} />;
};

export const Tree = () => {
  return (
    <>
      <Model
        url="/gltf/tree_grow_curve.glb"
        textureUrl="/textures/minecraft.png"
      />
    </>
  );
};
