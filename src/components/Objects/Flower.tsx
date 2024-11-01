import { useEffect, useRef } from "react";
import { Gltf, useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import type { FlowerType } from "@/types/metaData";
import { ANIMATION_SPEED } from "@/util/constants";

const makeGradation = (
  shader: THREE.WebGLProgramParametersWithUniforms,
  color1: THREE.Color,
  color2: THREE.Color
) => {
  shader.uniforms.color1 = { value: color1 };
  shader.uniforms.color2 = { value: color2 };

  shader.vertexShader = `
    varying vec2 vUv;
    ${shader.vertexShader}
  `.replace(
    `#include <uv_vertex>`,
    `#include <uv_vertex>
    vUv = uv;`
  );

  shader.fragmentShader = `
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 vUv;
    ${shader.fragmentShader}
  `.replace(
    `#include <dithering_fragment>`,
    `#include <dithering_fragment>
    vec4 gradientColor = vec4(mix(color1, color2, vUv.y), 1.0);
    gl_FragColor = gradientColor * gl_FragColor;`
  );
};

const animationSpeed = 0.5 * (1 + ANIMATION_SPEED);
const animationSpeedOnNoAnimation = 1.8;

type Props = {
  colors?: [THREE.Color, THREE.Color];
  flowerType?: FlowerType;
  noAnimation?: boolean;
};

export const CherryBlossom = (props: Props) => {
  const { colors, noAnimation } = props;
  const { scene, animations } = useGLTF("/gltf/flowers/cherryBlossom.gltf");
  const mixer = new THREE.AnimationMixer(scene);
  // マテリアルの色を変更
  scene.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) {
      const mesh = object as THREE.Mesh;
      // meshの名前を取得
      // console.log(object.name);
      if (colors && object.name === "平面009") {
        const material = new THREE.MeshStandardMaterial({
          transparent: true,
          opacity: 0.85,
        });
        material.onBeforeCompile = (shader) => {
          if (colors) makeGradation(shader, colors[0], colors[1]);
        };
        mesh.material = material;
      }
    }
  });

  // アニメーションを追加
  animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopOnce, 0); // ループを1度だけに設定
    action.clampWhenFinished = true; // 最後のフレームで止める
    action.timeScale = noAnimation
      ? animationSpeedOnNoAnimation
      : animationSpeed; // アニメーション速度を1にする
    action.play();
  });

  // フレームごとにアニメーションを更新
  useFrame((state, delta) => {
    mixer.update(delta);
  });

  return (
    <Gltf
      src="/gltf/flowers/cherryBlossom.gltf"
      scale={1}
      castShadow
      receiveShadow
    />
  );
};

// GLTF型の独自定義
type GLTFResult = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

type GlbFlowerProps = {
  colors?: [THREE.Color, THREE.Color];
  noAnimation?: boolean;
  name: string;
  scale: number;
};
const GlbFlower = (props: GlbFlowerProps) => {
  const { colors, noAnimation, name, scale } = props;
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(
    `/gltf/flowers/${name}`
  ) as unknown as GLTFResult;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    Object.values(actions).forEach((action) => {
      if (noAnimation) {
        action!.reset();
        return;
      }
      action!.loop = THREE.LoopOnce; // ループを一度だけに設定
      action!.clampWhenFinished = true; // アニメーションが終了したらそのままにする
      action!.timeScale = noAnimation
        ? animationSpeedOnNoAnimation
        : animationSpeed; // アニメーションの速度を設定（適宜調整）
      action?.play();
    });

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        // console.log(child.name);
        const mesh = child as THREE.Mesh;
        if (colors && mesh.name.includes("平面")) {
          const material = new THREE.MeshStandardMaterial({
            transparent: true, // 透明度を設定
            opacity: 0.85, // 透明度の値を設定
          });
          material.onBeforeCompile = (shader) => {
            if (colors) makeGradation(shader, colors[0], colors[1]);
          };
          mesh.material = material;
        }
        // 影を計算させる
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        //範囲外でも描画する
        mesh.frustumCulled = false;
      }
    });
  }, [actions, scene, colors, noAnimation]);

  return <primitive ref={group} object={scene} />;
};

export const Hibiscus = (props: Props) => {
  const { colors, noAnimation } = props;
  return (
    <GlbFlower
      colors={colors}
      noAnimation={noAnimation}
      name="hibiscus.glb"
      scale={2}
    />
  );
};

export const Asaago = (props: Props) => {
  const { colors, noAnimation } = props;
  return (
    <GlbFlower
      colors={colors}
      noAnimation={noAnimation}
      name="asaago.glb"
      scale={2}
    />
  );
};

export const Gerbera = (props: Props) => {
  const { colors, noAnimation } = props;
  return (
    <GlbFlower
      colors={colors}
      noAnimation={noAnimation}
      name="gerbera.glb"
      scale={2}
    />
  );
};

export const Sunflower = (props: Props) => {
  const { colors, noAnimation } = props;
  return (
    <GlbFlower
      colors={colors}
      noAnimation={noAnimation}
      name="sunflower.glb"
      scale={2}
    />
  );
};

export const Momiji = (props: Props) => {
  const { colors, noAnimation } = props;
  return (
    <GlbFlower
      colors={colors}
      noAnimation={noAnimation}
      name="momiji_leaf.glb"
      scale={2}
    />
  );
};

export const Flower = (props: Props) => {
  // const colors = [new THREE.Color(0xff69b4), new THREE.Color(0xffffff)] as [
  //   THREE.Color,
  //   THREE.Color,
  // ];

  const { flowerType = "CherryBlossom", colors, noAnimation = false } = props;

  if (flowerType === "CherryBlossom") {
    return <CherryBlossom colors={colors} noAnimation={noAnimation} />;
  } else if (flowerType === "Hibiscus") {
    return <Hibiscus colors={colors} noAnimation={noAnimation} />;
  } else if (flowerType === "Sunflower") {
    return <Sunflower colors={colors} noAnimation={noAnimation} />;
  } else if (flowerType === "Asaago") {
    return <Asaago colors={colors} noAnimation={noAnimation} />;
  } else if (flowerType === "Gerbera") {
    return <Gerbera colors={colors} noAnimation={noAnimation} />;
  } else if (flowerType === "Momiji") {
    return <Momiji colors={colors} noAnimation={noAnimation} />;
  }

  return <Hibiscus colors={colors} />;
};
