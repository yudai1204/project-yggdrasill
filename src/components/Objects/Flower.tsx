import { useEffect, useRef } from "react";
import { Gltf, useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import type { FlowerType } from "@/types/metaData";
import { ANIMATION_SPEED } from "@/util/constants";

type Props = {
  colors?: [THREE.Color, THREE.Color];
  flowerType?: FlowerType;
};

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

export const CherryBlossom = (props: Props) => {
  const { colors } = props;
  const { scene, animations } = useGLTF("/gltf/flowers/cherryBlossom.gltf");
  const mixer = new THREE.AnimationMixer(scene);
  // マテリアルの色を変更
  scene.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) {
      const mesh = object as THREE.Mesh;
      // meshの名前を取得
      // console.log(object.name);
      if (colors && object.name === "平面009") {
        const material = new THREE.MeshStandardMaterial();
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
    action.timeScale = ANIMATION_SPEED; // アニメーション速度を1にする
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

export const Hibiscus = (props: Props) => {
  const { colors } = props;
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(
    "/gltf/flowers/haibisukasu.glb"
  ) as unknown as GLTFResult;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    Object.values(actions).forEach((action) => {
      action!.loop = THREE.LoopOnce; // ループを一度だけに設定
      action!.clampWhenFinished = true; // アニメーションが終了したらそのままにする
      action!.timeScale = ANIMATION_SPEED; // アニメーションの速度を設定（適宜調整）
      action?.play();
    });

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        // console.log(child.name);
        const mesh = child as THREE.Mesh;
        if (colors && mesh.name.includes("平面")) {
          const material = new THREE.MeshStandardMaterial();
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
  }, [actions, scene]);

  return (
    <mesh scale={2}>
      <primitive ref={group} object={scene} />
    </mesh>
  );
};

export const Sunflower = (props: Props) => {
  const { colors } = props;
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(
    "/gltf/flowers/sunflower.glb"
  ) as unknown as GLTFResult;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    Object.values(actions).forEach((action) => {
      action!.loop = THREE.LoopOnce; // ループを一度だけに設定
      action!.clampWhenFinished = true; // アニメーションが終了したらそのままにする
      action!.timeScale = ANIMATION_SPEED; // アニメーションの速度を設定（適宜調整）
      action?.play();
    });

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        // console.log(child.name);
        const mesh = child as THREE.Mesh;
        if (colors && mesh.name.includes("平面")) {
          const material = new THREE.MeshStandardMaterial();
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
  }, [actions, scene]);

  return <primitive ref={group} object={scene} />;
};

export const Flower = (props: Props) => {
  // const colors = [new THREE.Color(0xff69b4), new THREE.Color(0xffffff)] as [
  //   THREE.Color,
  //   THREE.Color,
  // ];

  const { flowerType = "CherryBlossom", colors } = props;

  if (flowerType === "CherryBlossom") {
    return <CherryBlossom colors={colors} />;
  } else if (flowerType === "Hibiscus") {
    return <Hibiscus colors={colors} />;
  } else if (flowerType === "Sunflower") {
    return <Sunflower colors={colors} />;
  }

  return <Hibiscus colors={colors} />;
};
