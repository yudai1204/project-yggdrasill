import { StrictMode, useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
} from "@react-three/postprocessing";

import * as THREE from "three";
import { FreeFlower } from "@/components/Objects/Form/FreeFlower";
import { Heading, Box } from "@chakra-ui/react";
import "@fontsource/kaisei-opti";
import { AnimatedText } from "./AnimatedText";

// メイン
export const FormBlooming = () => {
  const bokehRef = useRef(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const [letterFadeIn, setLetterFadeIn] = useState<boolean>(false);
  const [flowerFadeIn, setFlowerFadeIn] = useState<boolean>(false);

  useEffect(() => {
    let startTime = Date.now();
    const animateBokeh = async () => {
      const elapsed = (Date.now() - startTime) / 2000;
      if (bokehRef.current) {
        // @ts-ignore
        bokehRef.current!.bokehScale = THREE.MathUtils.lerp(12, 2, elapsed);
        // @ts-ignore
        bokehRef.current!.focusDistance = THREE.MathUtils.lerp(
          5,
          0.02,
          elapsed
        );
      }
      if (lightRef.current) {
        lightRef.current.intensity = THREE.MathUtils.lerp(2, 10, elapsed);
      }
      if (elapsed < 1) {
        requestAnimationFrame(animateBokeh);
      }
    };

    animateBokeh();

    const ltimer = setTimeout(() => {
      setLetterFadeIn(true);
    }, 500);
    const ftimer = setTimeout(() => {
      setFlowerFadeIn(true);
    }, 1000);

    return () => {
      clearTimeout(ltimer);
      clearTimeout(ftimer);
    };
  }, []);

  return (
    <>
      <Box w="100%" mt="5">
        <Heading
          as="h2"
          size="xl"
          marginBottom="1"
          fontFamily="Kaisei Opti"
          fontWeight="bold"
          letterSpacing="0.04em"
        >
          <AnimatedText text="魔法の花を咲かせよう" randomize />
        </Heading>
        <Heading
          as="h3"
          size="sm"
          fontFamily="Kaisei Opti"
          fontWeight="bold"
          letterSpacing="0.04em"
          textAlign="center"
          opacity={letterFadeIn ? 1 : 0}
          transition="opacity 1s ease-in"
        >
          Let the Magic Flower Bloom
        </Heading>
      </Box>
      <div
        style={{
          zIndex: 1,
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <StrictMode>
          <Canvas
            flat
            shadows
            gl={{
              alpha: true,
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              // outputEncoding: THREE.sRGBEncoding,
            }}
            style={{
              opacity: flowerFadeIn ? 1 : 0,
              transition: "opacity 1s ease-in",
            }}
          >
            <ambientLight intensity={1} />
            <directionalLight
              ref={lightRef}
              position={[20, 20, 12]}
              intensity={2}
              castShadow
              color={"#ff9060"}
            />
            <mesh
              castShadow
              receiveShadow
              position={[0, -2, 0]}
              scale={3.2}
              rotation={[Math.PI / 6, (Math.PI * 3) / 5, -Math.PI / 6]}
            >
              <FreeFlower idx={1} />
            </mesh>

            <EffectComposer>
              <Bloom
                intensity={0.5} // ブルームの強度を調整
                luminanceThreshold={0.2} // 明るさの閾値
                luminanceSmoothing={0.1} // 明るさのスムージング
              />
              <DepthOfField
                ref={bokehRef}
                focusDistance={0.02} // ピントの距離
                focalLength={0.03} // フォーカルレングス（焦点距離）
                bokehScale={3} // ボケの強度
              />
            </EffectComposer>
          </Canvas>
        </StrictMode>
      </div>
    </>
  );
};
