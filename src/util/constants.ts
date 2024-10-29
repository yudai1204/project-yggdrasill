import type { CameraOptions } from "@/types/camera";

export const FOV = 45; // 視野角
export const NEAR = 0.1; // 最小距離
export const FAR = 1000; // 最大距離
export const CAMERA_POSITION: [number, number, number] = [0, 5, 100]; // カメラ位置
export const CAMERA_ROTATION: [number, number, number] = [-Math.PI / 6, 0, 0]; // カメラ回転

export const defaultCameraOptions: CameraOptions = {
  options: {
    position: CAMERA_POSITION,
    rotation: CAMERA_ROTATION,
    far: FAR,
    fov: FOV,
    near: NEAR,
  },
};
