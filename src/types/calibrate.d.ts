export interface DeviceType {
  type: "user" | "device";
  connectedAt: number;
  uuid: string;
  size: {
    width: number;
    height: number;
  };
  rotation: number;
  position: {
    x: number;
    y: number;
  };
  zoom: number;
  isConnected: boolean;
}

export interface ScreenType {
  type: "screen";
  connectedAt: number;
  uuid: string;
  size: {
    width: number;
    height: number;
  };
  devices: DeviceType[];
}

export interface ManagerType {
  screens: ScreenType[];
  devices: DeviceType[];
}
