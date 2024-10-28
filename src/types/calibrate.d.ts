import type { GptAnalysis } from "./metaData";

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
  ua?: {
    browser: string | undefined;
    device: string | undefined;
    engine: string | undefined;
    os: string | undefined;
  };
  ip?: string;
  metadata?: {
    gptAnalysis: GptAnalysis;
    answers: (string | undefined)[];
  };
}

export interface ManagerType {
  type: "manager";
  uuid: string;
  screens: ScreenType[];
  devices: DeviceType[];
}

export interface SpPos {
  translateX: number;
  translateY: number;
  width: number;
  height: number;
}

export type QrReaderType = {
  type: "qrReader";
  uuid: string;
  value: string;
  size: number;
  coordinates: { x: number; y: number }[];
};
