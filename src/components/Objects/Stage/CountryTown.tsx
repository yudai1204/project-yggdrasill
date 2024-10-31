import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

export const CountryTown = () => {
  const { scene } = useGLTF(
    "/gltf/stage/country_town/countryside_cottage_03.glb"
  );

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as any).isMesh) {
        child.castShadow = false;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <mesh
      position={[20, -30, -30]}
      scale={10}
      rotation={[0, (Math.PI / 8) * 3, 0]}
    >
      <primitive object={scene} />
    </mesh>
  );
};

export const SnowCountryTown = () => {
  const { scene } = useGLTF("/gltf/stage/country_town/winter_country_town.glb");

  useEffect(() => {
    scene.traverse((child) => {
      child.castShadow = false;
      child.receiveShadow = true;
    });
  }, [scene]);

  return (
    <mesh
      position={[-18, 2, -45]}
      scale={8}
      rotation={[0, (Math.PI / 8) * 2, 0]}
    >
      <primitive object={scene} />
    </mesh>
  );
};
