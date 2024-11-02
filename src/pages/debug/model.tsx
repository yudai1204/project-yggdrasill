import { StrictMode } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import {
  Group,
  TextureLoader,
  RepeatWrapping,
  MeshStandardMaterial,
} from "three";
import * as THREE from "three";
import { SeedWatering } from "@/layouts/main/useUser/SeedWatering";
import { Box } from "@chakra-ui/react";

// メイン
type Props = {};
const Modeling = () => {
  return (
    <Box w="100%" h="100svh">
      <SeedWatering animationCount={0} />
    </Box>
  );
};

export default Modeling;
