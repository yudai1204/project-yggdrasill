export type CameraOptions = {
  options: {
    position: [number, number, number];
    rotation: [number, number, number];
    far: number;
    fov: number;
    near: number;
  };
  viewOffset?: {
    fullWidth: number;
    fullHeight: number;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
  };
};
