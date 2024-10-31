import type { CameraOptions } from "@/types/camera";
import { Vector3, Euler } from "@react-three/fiber";

type FlowerPositions = {
  position: Vector3;
  rotation: Euler;
}[];

export const FOV = 45; // 視野角
export const NEAR = 0.1; // 最小距離
export const FAR = 1000; // 最大距離
export const CAMERA_POSITION: [number, number, number] = [0, 10, 50]; // 最終的なカメラ位置
export const FIRST_CAMERA_POSITION: [number, number, number] = [0, 15, 600]; // 初期カメラ位置
export const CAMERA_ROTATION: [number, number, number] = [-Math.PI / 6, 0, 0]; // カメラ回転

export const ANIMATION_SPEED = 4; // アニメーションのスピード

export const FLOWER_POSITIONS: {
  [key: string]: FlowerPositions;
} = {
  // 広葉樹
  broadleaf: [{ position: [2, 10, 2], rotation: [0, 0, 0] }],
  // 針葉樹
  conifer: [
    { position: [4, 4, 2], rotation: [0, 0, 0] },
    { position: [6, 5, 2], rotation: [0, 0, 0] },
  ],
};

export const defaultCameraOptions: CameraOptions = {
  options: {
    position: FIRST_CAMERA_POSITION,
    rotation: CAMERA_ROTATION,
    far: FAR,
    fov: FOV,
    near: NEAR,
  },
};
