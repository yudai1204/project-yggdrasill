import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { MeshStandardMaterial } from "three";

export const VastLand = () => {
  const { scene } = useGLTF("/gltf/stage/wafuu/the_vast_land.glb");

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
      position={[140, 0, -280]}
      scale={400}
      rotation={[0, (Math.PI / 8) * 3.9, 0]}
    >
      <primitive object={scene} />
    </mesh>
  );
};
