import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

export const SnowMan = () => {
  const { scene } = useGLTF("/gltf/snowman.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as any).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <mesh
      position={[2, 0, 1]}
      scale={7}
      rotation={[-Math.PI / 8, (Math.PI * 10) / 8, -Math.PI / 8]}
    >
      <primitive object={scene} />
    </mesh>
  );
};
