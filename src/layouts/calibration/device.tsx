import { Button } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

// TODO
// 1. 初期化
// 2. 再接続時の処理
// 3. デバイスが接続された時に一覧表示をする

interface DeviceType {
  type: "user" | "device";
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

interface ScreenType {
  type: "screen";
  uuid: string;
  size: {
    width: number;
    height: number;
  };
  devices: DeviceType[];
}

const getScreenSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

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

const sendJson = (ws: WebSocket, data: any, type: string) => {
  ws.send(
    JSON.stringify({
      head: {
        type,
      },
      body: data,
    })
  );
};

export const Device = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const shouldReconnect = useRef<boolean>(true);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const [connectingStatus, setConnectingStatus] =
    useState<string>("Connecting...");
  const deviceBodyRef = useRef<DeviceType | null>(null);
  const [deviceNum, setDeviceNum] = useState<number | null>(null);
  const [deviceBody, setDeviceBody] = useState<DeviceType | null>(null);

  // WebSocketを接続する関数
  const connectWebSocket = () => {
    wsRef.current = new WebSocket("ws://localhost:3210");

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
          connectWebSocket();
        }, 1000); // 1秒後に再接続
      }
    };

    wsRef.current.onerror = (err) => {
      console.error("WebSocket error: ", err);
      wsRef.current?.close();
    };
  };

  // WebSocket接続の開始とクリーンアップ
  useEffect(() => {
    connectWebSocket();

    return () => {
      // コンポーネントのアンマウント時に手動でWebSocketを閉じる
      // shouldReconnect.current = false;
      // clearTimeout(reconnectTimeout.current ?? undefined);
      // if (wsRef.current) {
      //   wsRef.current.close();
      // }
    };
  }, []);

  return (
    <div>
      <h1>Device</h1>
      <h2>Status: {connectingStatus}</h2>
      {deviceBodyRef.current && deviceBody && (
        <>
          <h3>Device Information</h3>
          <p style={{ fontWeight: "bold" }}>Device Number: {deviceNum}</p>
          <p>Device UUID: {deviceBodyRef.current.uuid}</p>
          <p>
            Device Size: {deviceBodyRef.current.size.width}x
            {deviceBodyRef.current.size.height}
          </p>
          <p>Device Rotation: {deviceBodyRef.current.rotation}</p>
          <p>
            Device Position: {deviceBodyRef.current.position.x},{" "}
            {deviceBodyRef.current.position.y}
          </p>
          <p>Device Zoom: {deviceBodyRef.current.zoom}</p>
        </>
      )}
      <Button onClick={() => wsRef.current?.send("Hello from Screen")}>
        HELLO
      </Button>
    </div>
  );
};
