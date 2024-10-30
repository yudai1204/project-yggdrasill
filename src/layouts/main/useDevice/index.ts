import type { DeviceType, ScreenType, UserType } from "@/types/calibrate";
import { sendJson, getScreenSize, calculateTimeOffset } from "@/util/util";
import { v4 as uuidv4 } from "uuid";

const initDevice = () => {
  const screenSize = getScreenSize();
  const device: DeviceType = {
    connectedAt: 0,
    timeOffset: {
      value: 0,
      serverTime: 0,
      begin: new Date().getTime(),
    },
    type: "device",
    uuid: uuidv4(),
    size: screenSize,
    rawSize: screenSize,
    rotation: 0,
    position: {
      x: 0,
      y: 0,
    },
    zoom: 1,
    isConnected: false,
  };
  return device;
};

type Props = {
  wsRef: React.MutableRefObject<WebSocket | null>;
  deviceBodyRef: React.MutableRefObject<DeviceType | null>;
  setConnectingStatus: React.Dispatch<React.SetStateAction<string>>;
  setDeviceNum: React.Dispatch<React.SetStateAction<number | null>>;
  setDeviceBody: React.Dispatch<React.SetStateAction<DeviceType | null>>;
  shouldReconnect: React.MutableRefObject<boolean>;
  reconnectTimeout: React.MutableRefObject<NodeJS.Timeout | null>;
  setMode: React.Dispatch<React.SetStateAction<"Calibration" | "Operation">>;
  setIsDebug: React.Dispatch<React.SetStateAction<boolean>>;
  setScreenSize: React.Dispatch<
    React.SetStateAction<{ width: number; height: number } | null>
  >;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  setIsJoroMode: React.Dispatch<React.SetStateAction<boolean>>;
  setAnimationStartFrom: React.Dispatch<React.SetStateAction<number>>;
};

export const connectWebSocket = (props: Props) => {
  const {
    wsRef,
    deviceBodyRef,
    setConnectingStatus,
    setDeviceNum,
    setDeviceBody,
    shouldReconnect,
    reconnectTimeout,
    setMode,
    setIsDebug,
    setScreenSize,
    setCurrentUser,
    setIsJoroMode,
    setAnimationStartFrom,
  } = props;
  wsRef.current = new WebSocket(
    process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3210"
  );

  wsRef.current.onopen = () => {
    if (!wsRef.current) return;
    setConnectingStatus("Connected");
    console.log("WebSocket connected");

    // 初回接続処理
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      if (deviceBodyRef.current === null) {
        const device = initDevice();
        sendJson(wsRef.current, device, "init");
        deviceBodyRef.current = device;
        setDeviceBody(deviceBodyRef.current);
        sendJson(wsRef.current, {}, "getCurrentSettings");
      } else {
        sendJson(wsRef.current, deviceBodyRef.current, "reconnect");
        sendJson(wsRef.current, {}, "getCurrentSettings");
      }
    }
  };

  wsRef.current.onmessage = (e) => {
    console.log("Message received: ", e.data);
    const data = JSON.parse(e.data);
    if (data.head.type === "init") {
      deviceBodyRef.current = {
        ...data.body,
        timeOffset: {
          ...data.body.timeOffset,
          value: calculateTimeOffset(data.body.timeOffset),
        },
      };
      setDeviceBody(deviceBodyRef.current);
      setDeviceNum(data.head.index);
      console.log("init done");
    } else if (data.head.type === "devices_update") {
      if (deviceBodyRef.current) {
        deviceBodyRef.current = data.body as DeviceType;
        setDeviceNum(data.head.index);
        setDeviceBody(deviceBodyRef.current);
      }
    } else if (data.head.type === "setMainScreen") {
      setScreenSize(data.body);
    } else if (data.head.type === "setMode") {
      setMode(data.body.mode);
    } else if (data.head.type === "setDebug") {
      setIsDebug(data.body.debug);
    } else if (data.head.type === "getCurrentSettings") {
      setMode(data.body.mode);
      setIsDebug(data.body.debug);
      setScreenSize(data.body.screen);
    } else if (data.head.type === "user_ready") {
      setCurrentUser(data.body.user);
      setIsJoroMode(true);
    } else if (data.head.type === "animation_start") {
      setAnimationStartFrom(data.body.animationStartFrom);
      setIsJoroMode(false);
    } else if (data.head.type === "reset_to_waiting") {
      setCurrentUser(null);
      setIsJoroMode(false);
      setAnimationStartFrom(new Date().getTime() + 1000 * 60 * 60 * 24);
    }
  };

  wsRef.current.onclose = () => {
    setConnectingStatus("Disconnected");
    console.log("WebSocket disconnected");

    // 自動再接続のための処理
    if (shouldReconnect.current) {
      setConnectingStatus("Reconnecting...");
      console.log("Attempting to reconnect in 1 seconds...");
      reconnectTimeout.current = setTimeout(() => {
        connectWebSocket(props);
      }, 1000); // 1秒後に再接続
    }
  };

  wsRef.current.onerror = (err) => {
    console.error("WebSocket error: ", err);
    wsRef.current?.close();
  };
};
