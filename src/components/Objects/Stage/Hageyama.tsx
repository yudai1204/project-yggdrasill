import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { MeshStandardMaterial } from "three";

export const Hageyama = () => {
  const { scene } = useGLTF("/gltf/stage/hageyama/hageyama.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as any).isMesh) {
        (child as any).material = new MeshStandardMaterial({
          color: (child as any).material.color,
          map: (child as any).material.map,
        });
        child.castShadow = false;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <mesh
      position={[5, 16, -21.5]}
      scale={0.4}
      rotation={[0, (Math.PI / 8) * 2, 0]}
    >
      <primitive object={scene} />
    </mesh>
  );
};

export const SnowHageyama = () => {
  const { scene } = useGLTF("/gltf/stage/hageyama/snow_mountain.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as any).isMesh) {
        (child as any).material = new MeshStandardMaterial({
          color: (child as any).material.color,
          map: (child as any).material.map,
        });
        child.castShadow = false;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <mesh
      position={[20, -4, -60]}
      scale={1.5}
      rotation={[0, (Math.PI / 8) * 3, 0]}
    >
      <primitive object={scene} />
    </mesh>
  );
};
