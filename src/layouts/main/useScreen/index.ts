import type { DeviceType, ScreenType } from "@/types/calibrate";
import { sendJson } from "@/util/util";
import { getScreenSize } from "@/util/util";

const initScreen = () => {
  const screenSize = getScreenSize();
  const screen: ScreenType = {
    connectedAt: 0,
    type: "screen",
    uuid: crypto.randomUUID(),
    size: screenSize,
    devices: [],
  };
  return screen;
};

type Props = {
  wsRef: React.MutableRefObject<WebSocket | null>;
  screenBodyRef: React.MutableRefObject<ScreenType | null>;
  setConnectingStatus: React.Dispatch<React.SetStateAction<string>>;
  setDevices: React.Dispatch<React.SetStateAction<DeviceType[]>>;
  shouldReconnect: React.MutableRefObject<boolean>;
  reconnectTimeout: React.MutableRefObject<NodeJS.Timeout | null>;
  setScreenNum: React.Dispatch<React.SetStateAction<number | null>>;
  setMode: React.Dispatch<React.SetStateAction<"Calibration" | "Operation">>;
};

export const connectWebSocket = (props: Props) => {
  const {
    wsRef,
    screenBodyRef,
    setConnectingStatus,
    setDevices,
    shouldReconnect,
    reconnectTimeout,
    setScreenNum,
    setMode,
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
      if (screenBodyRef.current === null) {
        const screen = initScreen();
        sendJson(wsRef.current, screen, "init");
        screenBodyRef.current = screen;
      } else {
        sendJson(wsRef.current, screenBodyRef.current, "reconnect");
      }
    }
  };

  wsRef.current.onmessage = (e) => {
    console.log("Message received: ", e.data);
    const data = JSON.parse(e.data);
    if (data.head.type === "init") {
      screenBodyRef.current = data.body;
      setDevices([...(screenBodyRef.current?.devices ?? [])]);
      setScreenNum(data.head.index);
      console.log("init done");
    } else if (data.head.type === "devices_update") {
      console.log("devices_update");
      if (screenBodyRef.current?.devices) {
        screenBodyRef.current.devices = data.body as DeviceType[];
        setDevices([...screenBodyRef.current.devices]);
        setScreenNum(data.head.index);
      }
    } else if (data.head.type === "setMode") {
      setMode(data.body.mode);
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
