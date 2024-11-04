import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { MeshStandardMaterial } from "three";

export const UnderTheSea = () => {
  const { scene } = useGLTF(
    "/gltf/stage/under_the_sea/low_poly_sea_life_challenge.glb"
  );

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
      position={[6, 0, -70]}
      scale={0.8}
      rotation={[0, (Math.PI * 85) / 8, 0]}
    >
      <primitive object={scene} />
    </mesh>
  );
};
