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
import type { TreeType } from "@/types/metaData";
import { ANIMATION_SPEED } from "@/util/constants";

// GLTF型の独自定義
type GLTFResult = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

interface ModelProps {
  url: string;
  textureUrl: string;
  doAnimation: boolean;
}

const Model: React.FC<ModelProps> = ({ url, textureUrl, doAnimation }) => {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(url) as unknown as GLTFResult;
  const { actions } = useAnimations(animations, group);

  const texture = useLoader(TextureLoader, textureUrl);

  useEffect(() => {
    Object.values(actions).forEach((action) => {
      action!.loop = THREE.LoopOnce; // ループを一度だけに設定
      action!.clampWhenFinished = true; // アニメーションが終了したらそのままにする
      action!.timeScale = ANIMATION_SPEED; // アニメーションの速度を設定（適宜調整）
      if (doAnimation) {
        action?.play();
        // doAnimationがtrueのとき、透明度を元に戻す
        scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material instanceof MeshStandardMaterial) {
              mesh.material.transparent = false;
              mesh.material.opacity = 1;
              mesh.material.needsUpdate = true;
            }
          }
        });
      } else {
        // doAnimationがfalseのとき、全体を透明にする
        scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material instanceof MeshStandardMaterial) {
              mesh.material.transparent = true;
              mesh.material.opacity = 0;
              mesh.material.needsUpdate = true;
            }
          }
        });
      }
    });

    // テクスチャの繰り返し設定
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(4, 4); // 4x4の繰り返しに設定（適宜調整）

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material instanceof MeshStandardMaterial) {
          mesh.material.color = new THREE.Color(0xb5997f); // 暗めの色に設定
          mesh.material.map = texture;
          mesh.material.needsUpdate = true;
          mesh.material.envMapIntensity = 0; // 環境光の影響を減らす
          mesh.material.roughness = 1.8; // 表面を粗くして光の反射を抑える
          mesh.material.metalness = 0.1; // 金属感を減らす
        }
        // 影を計算させる
        mesh.castShadow = doAnimation;
        // mesh.receiveShadow = doAnimation;
        //範囲外でも描画する
        mesh.frustumCulled = false;
      }
    });
  }, [actions, scene, texture, doAnimation]);

  return <primitive ref={group} object={scene} />;
};

type Props = {
  doAnimation?: boolean;
  type?: TreeType;
};
export const Tree = (props: Props) => {
  const { doAnimation = true, type = "conifer" } = props;
  // const type = "conifer";
  // const type = "deciduous";

  return (
    <mesh scale={type === "conifer" ? 1.2 : 1}>
      <Model
        url={
          type === "conifer"
            ? "/gltf/mominoki_tree.glb"
            : "/gltf/tree_grow2.glb"
        }
        textureUrl="/textures/tree_texture_normal.jpg"
        doAnimation={doAnimation}
      />
    </mesh>
  );
};
