import type { DeviceType, ScreenType } from "@/types/calibrate";
import { sendJson } from "@/util/util";
import { getScreenSize } from "@/util/util";

const initDevice = () => {
  const screenSize = getScreenSize();
  const device: DeviceType = {
    type: "device",
    uuid: crypto.randomUUID(),
    size: screenSize,
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
      } else {
        sendJson(wsRef.current, deviceBodyRef.current, "reconnect");
      }
    }
  };

  wsRef.current.onmessage = (e) => {
    console.log("Message received: ", e.data);
    const data = JSON.parse(e.data);
    if (data.head.type === "init") {
      console.log("init done");
      deviceBodyRef.current = data.body;
      setDeviceBody(deviceBodyRef.current);
      setDeviceNum(data.head.index);
    } else if (data.head.type === "devices_update") {
      if (deviceBodyRef.current) {
        deviceBodyRef.current = data.body as DeviceType;
        setDeviceNum(data.head.index);
        setDeviceBody(deviceBodyRef.current);
      }
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
