import React, { StrictMode, useMemo, useRef, useEffect } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import { Group } from "three";
import * as THREE from "three";
import { Box, keyframes } from "@chakra-ui/react";
import { SkeletonUtils } from "three-stdlib";

const positions: {
  pos: [number, number, number];
  scale: number;
  rotateSpeed: [number, number, number];
  rotateDirection: number;
}[] = [
  {
    pos: [-19.34789293383783, -4.861661484285953, -14.72147552876553],
    scale: 1.9719026463342213,
    rotateSpeed: [
      0.00847195209625831, 0.0015022984284544538, 0.007202110620182813,
    ],
    rotateDirection: 1,
  },
  {
    pos: [31.75879644930974, 21.212398941652765, -39.078191236646354],
    scale: 1.3457860211555355,
    rotateSpeed: [
      0.002215485870465179, 0.00006313721373230052, 0.008010687773210467,
    ],
    rotateDirection: 1,
  },
  {
    pos: [5.987400808143505, 10.915467313488534, -38.81861643829845],
    scale: 1.989649363968002,
    rotateSpeed: [
      0.004225417072699454, 0.0028730363913149048, 0.004938284586179564,
    ],
    rotateDirection: 1,
  },
  {
    pos: [-5.604019204534552, -17.947758380995957, -32.77347052469637],
    scale: 1.5737088471823406,
    rotateSpeed: [
      0.0010646260961984578, 0.0024115248749520535, 0.0004390909418130384,
    ],
    rotateDirection: 1,
  },
  {
    pos: [43.70080740675826, -12.710020257298304, -42.86611495855172],
    scale: 1.1032698806086962,
    rotateSpeed: [
      0.002396440691501762, 0.000612303613494305, 0.0046652880572205825,
    ],
    rotateDirection: -1,
  },
  {
    pos: [13.850532664118312, 40.87509493448367, -28.32660487888048],
    scale: 2.2170192164429836,
    rotateSpeed: [
      0.009466666633765693, 0.0031224851610095095, 0.0058894052144690965,
    ],
    rotateDirection: 1,
  },
  {
    pos: [31.086272890873886, 28.502068536423224, -59.53499424711254],
    scale: 1.5596190218043127,
    rotateSpeed: [
      0.006426018631339763, 0.004033333381537283, 0.004328511567116522,
    ],
    rotateDirection: 1,
  },
  {
    pos: [-4.02260024872794, -5.455770638766587, -41.98162699170862],
    scale: 2.4663605298562703,
    rotateSpeed: [
      0.008528015006483551, 0.007739966994926444, 0.0007268036107182586,
    ],
    rotateDirection: -1,
  },
];

// GLTF型の独自定義
type GLTFResult = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

interface ModelProps {
  url: string;
  rotateSpeed: [number, number, number];
  rotateDirection: number;
}

const Model: React.FC<ModelProps> = ({ url, rotateSpeed, rotateDirection }) => {
  const group = useRef<Group>(null);
  const { scene: originScene, animations } = useGLTF(
    url
  ) as unknown as GLTFResult; // 型アサーションでGLTFResultとして扱う
  const { actions } = useAnimations(animations, group);

  const scene = useMemo(() => SkeletonUtils.clone(originScene), [originScene]);

  useEffect(() => {
    // 全てのアニメーションを同時に再生

    Object.values(actions).forEach((action) => {
      // action!.loop = THREE.LoopOnce; // ループを一度だけに設定
      // action!.clampWhenFinished = true; // アニメーションが終了したらそのままにする
      action!.timeScale = 0.15; // アニメーションの速度を設定（適宜調整）

      action?.play();
    });
  }, [actions]);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.x += rotateSpeed[0] * rotateDirection;
      group.current.rotation.y += rotateSpeed[1] * rotateDirection;
      group.current.rotation.z += rotateSpeed[2] * rotateDirection;
    }
  });

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      //範囲外でも描画する
      mesh.frustumCulled = false;
    }
  });

  return <primitive ref={group} object={scene} />;
};

const InnerCanvas = () => {
  const groupRef = useRef<Group>(null);

  useFrame((frame) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
      groupRef.current.rotation.x += 0.001;
    }
  });
  return (
    <>
      <ambientLight intensity={5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      {/* <OrbitControls makeDefault /> */}
      <group ref={groupRef}>
        {positions.map((pos, index) => (
          <mesh key={index} position={pos.pos} scale={pos.scale}>
            <Model
              url="/gltf/flowers/simple_flower_loop.glb"
              rotateSpeed={pos.rotateSpeed}
              rotateDirection={pos.rotateDirection}
            />
          </mesh>
        ))}
      </group>
    </>
  );
};

// メイン
type Props = {};
export const WaitingAnimation = () => {
  const windowRef = useRef<HTMLDivElement | null>(null);

  // const initialPositions = useMemo(() => {
  //   if (!windowRef.current) return [];
  //   const positions = [];
  //   for (let i = 0; i < 8; i++) {
  //     positions.push({
  //       pos: [
  //         Math.random() * 100 - 50,
  //         Math.random() * 100 - 50,
  //         Math.random() * 100 - 50,
  //       ] as [number, number, number],
  //       scale: Math.random() * 2 + 0.5,
  //       rotateSpeed: [
  //         Math.random() * 0.01,
  //         Math.random() * 0.01,
  //         Math.random() * 0.01,
  //       ] as [number, number, number],
  //       rotateDirection: Math.random() > 0.5 ? 1 : -1,
  //     });
  //   }
  //   return positions;
  // }, [windowRef]);
  // console.log(initialPositions);

  const fadeAnimation = keyframes`
  0%, 100% { opacity: 0.2; }
  40% { opacity: 1; }
  90% { opacity: 0;}
  `;

  return (
    <Box
      w="100%"
      h="100vh"
      opacity={0.5}
      filter="blur(5px) sepia(40%)"
      ref={windowRef}
      animation={`${fadeAnimation} 8s ease-in-out infinite`}
    >
      <StrictMode>
        <Canvas
          dpr={0.5}
          flat
          shadows
          gl={{
            alpha: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            // outputEncoding: THREE.sRGBEncoding,
          }}
        >
          <InnerCanvas />
        </Canvas>
      </StrictMode>
    </Box>
  );
};
