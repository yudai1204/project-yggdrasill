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
    Object.values(actions).forEach((action) => action?.play());
  }, [actions]);

  return <primitive ref={group} object={scene} />;
};

export const Seed = () => {
  return (
    <>
      <Model url="/gltf/germination_of_seed.glb" />
    </>
  );
};
