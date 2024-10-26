import type { DeviceType, ManagerType, ScreenType } from "@/types/calibrate";
import { sendJson } from "@/util/util";

type Props = {
  wsRef: React.MutableRefObject<WebSocket | null>;
  managerBodyRef: React.MutableRefObject<ManagerType | null>;
  setConnectingStatus: React.Dispatch<React.SetStateAction<string>>;
  shouldReconnect: React.MutableRefObject<boolean>;
  reconnectTimeout: React.MutableRefObject<NodeJS.Timeout | null>;
  setDevices: React.Dispatch<React.SetStateAction<DeviceType[]>>;
  setScreens: React.Dispatch<React.SetStateAction<ScreenType[]>>;
};

export const connectWebSocket = (props: Props) => {
  const {
    wsRef,
    managerBodyRef,
    setConnectingStatus,
    shouldReconnect,
    reconnectTimeout,
    setDevices,
    setScreens,
  } = props;

  wsRef.current = new WebSocket(
    process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3210"
  );

  wsRef.current.onopen = () => {
    if (!wsRef.current) return;
    setConnectingStatus("Connected");
    console.log("WebSocket connected");

    // 初回・再接続時 接続処理
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const manager: ManagerType = {
        type: "manager",
        uuid: crypto.randomUUID(),
        screens: [],
        devices: [],
      };
      sendJson(wsRef.current, manager, "init");
      managerBodyRef.current = manager;
    }
  };

  wsRef.current.onmessage = (e) => {
    console.log("Message received: ", e.data);
    const data = JSON.parse(e.data);
    if (data.head.type === "getAllData") {
      managerBodyRef.current = data.body;
      setDevices([...data.body.devices]);
      setScreens([...data.body.screens]);
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
