export interface DeviceType {
  type: "device";
  connectedAt: number;
  uuid: string;
  size: {
    width: number;
    height: number;
  };
  rawSize: {
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

export interface UserType {
  type: "user";
  uuid: string;
  connectedAt: number;
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
}

export interface ManagerType {
  type: "manager";
  uuid: string;
  screens: ScreenType[];
  devices: DeviceType[];
}
