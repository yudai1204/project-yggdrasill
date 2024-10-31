import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

export const Moon = () => {
  const { scene } = useGLTF(
    "/gltf/stage/moon/space_exploration_wlp_series_8.glb"
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
      position={[25, -1, -30]}
      scale={8}
      rotation={[(Math.PI / 16) * -3, (Math.PI / 8) * 5, -Math.PI / -16]}
    >
      <primitive object={scene} />
    </mesh>
  );
};

export const RealMoon = () => {
  const { scene } = useGLTF("/gltf/stage/moon/real_moon.glb");

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
      position={[0, 3, -28]}
      scale={0.012}
      rotation={[(Math.PI / 16) * 0, (Math.PI / 8) * 0, (-Math.PI / 16) * 0]}
    >
      <primitive object={scene} />
    </mesh>
  );
};
