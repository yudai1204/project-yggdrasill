import { Gltf, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Tree = () => {
  const { scene, animations } = useGLTF("/gltf/treeMesh.gltf");
  const mixer = new THREE.AnimationMixer(scene);

  // アニメーションを追加
  animations.forEach((clip) => {
    mixer.clipAction(clip).play();
  });

  // フレームごとにアニメーションを更新
  useFrame((state, delta) => {
    mixer.update(delta);
  });

  return (
    <Gltf src="/gltf/treeMesh.gltf" scale={1} castShadow receiveShadow />
    // <mesh scale={0.02}>
    //   <primitive object={scene} />
    // </mesh>
  );
};
