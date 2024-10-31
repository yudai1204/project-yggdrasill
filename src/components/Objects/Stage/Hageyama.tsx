import React from "react";
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three-stdlib";

export const FBXModel = () => {
  const fbx = useLoader(FBXLoader, "/gltf/stage/hageyama/tor_cut.fbx");
  return <primitive object={fbx} />;
};
