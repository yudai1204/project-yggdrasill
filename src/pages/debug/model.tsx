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

// GLTF型の独自定義
type GLTFResult = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

interface ModelProps {
  url: string;
  textureUrl: string;
}

const Model: React.FC<ModelProps> = ({ url, textureUrl }) => {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(url) as unknown as GLTFResult; // 型アサーションでGLTFResultとして扱う
  const { actions } = useAnimations(animations, group);

  const texture = useLoader(TextureLoader, textureUrl);

  useEffect(() => {
    // 全てのアニメーションを同時に再生
    // Object.values(actions).forEach((action) => action?.play());
  }, [actions]);

  // テクスチャの繰り返し設定
  // texture.wrapS = RepeatWrapping;
  // texture.wrapT = RepeatWrapping;
  // texture.repeat.set(4, 4); // 4x4の繰り返しに設定（適宜調整）

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.material instanceof MeshStandardMaterial) {
        mesh.material.map = texture;
        mesh.material.needsUpdate = true;
      }
      // 影を計算させる
      // mesh.castShadow = true;
      // mesh.receiveShadow = true;
      //範囲外でも描画する
      mesh.frustumCulled = false;
    }
  });

  return <primitive ref={group} object={scene} />;
};

// メイン
type Props = {};
const Modeling = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
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
        >
          <ambientLight intensity={5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <OrbitControls makeDefault />
          <mesh
            position={[0, -1, 0]}
            scale={20}
            rotation={[0, -Math.PI / 5, 0]}
          >
            <Model
              url="/gltf/momiji_leaf.glb"
              textureUrl="/textures/momiji.png"
            />
          </mesh>
        </Canvas>
      </StrictMode>
    </div>
  );
};

export default Modeling;
