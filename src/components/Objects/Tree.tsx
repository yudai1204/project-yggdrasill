import { Gltf, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useEffect } from "react";

export const Tree = () => {
  const { scene, animations } = useGLTF("/gltf/tree grow_curve.glb");
  const mixer = useRef(new THREE.AnimationMixer(scene));

  useEffect(() => {
    // アニメーションを追加し、すべてのノードをループ再生
    animations.forEach((clip) => {
      const action = mixer.current.clipAction(clip);
      action.setLoop(THREE.LoopRepeat, Infinity); // ループ再生を設定
      action.play();
    });
  }, [animations, scene]);

  // フレームごとにアニメーションを更新
  useFrame((state, delta) => {
    mixer.current.update(delta);
  });

  return (
    <Gltf src="/gltf/tree grow_curve.glb" scale={1} castShadow receiveShadow />
    // <mesh scale={0.02}>
    //   <primitive object={scene} />
    // </mesh>
  );
};
