import { Box, Button } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { CalibrationBox } from "@/components/CalibrationBox";

// TODO
// 1. 初期化
//   - screenのサイズが必要そう
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

const initScreen = () => {
  const screenSize = getScreenSize();
  const screen: ScreenType = {
    type: "screen",
    uuid: crypto.randomUUID(),
    size: screenSize,
    devices: [],
  };
  return screen;
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

export const Screen = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const shouldReconnect = useRef<boolean>(true);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const [connectingStatus, setConnectingStatus] =
    useState<string>("Connecting...");
  const screenBodyRef = useRef<ScreenType | null>(null);

  const [devices, setDevices] = useState<DeviceType[]>([]);

  // WebSocketを接続する関数
  const connectWebSocket = () => {
    wsRef.current = new WebSocket("ws://localhost:3210");

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
        console.log("init done");
      } else if (data.head.type === "devices_update") {
        console.log("devices_update");
        if (screenBodyRef.current?.devices) {
          screenBodyRef.current.devices = data.body as DeviceType[];
          setDevices([...screenBodyRef.current.devices]);
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
    <Box w="100%" h="100svh" position="relative" overflow="hidden">
      <h1>Screen</h1>
      <h2>Status: {connectingStatus}</h2>
      {screenBodyRef.current && (
        <>
          <h3>Connected Devices</h3>
          {devices &&
            screenBodyRef.current.devices.map(
              (device, idx) =>
                device.isConnected && (
                  <div key={device.uuid}>
                    <p>
                      {idx} : UUID: {device.uuid}
                    </p>
                  </div>
                )
            )}
        </>
      )}
      {devices &&
        screenBodyRef.current?.devices.map((device, idx) => {
          if (device.isConnected) {
            const position = {
              width: device.size.width,
              height: device.size.height,
              rotate: device.rotation,
              zoom: device.zoom,
              x: device.position.x,
              y: device.position.y,
            };
            const setPosition = (newPosition: typeof position) => {
              setDevices((prev) => {
                const target = prev.find((d) => d.uuid === device.uuid);
                if (target) {
                  target.size.width = newPosition.width;
                  target.size.height = newPosition.height;
                  target.rotation = newPosition.rotate;
                  target.position.x = newPosition.x;
                  target.position.y = newPosition.y;
                  target.zoom = newPosition.zoom;
                }
                screenBodyRef.current!.devices = prev;
                return [...prev];
              });
            };
            return (
              <CalibrationBox
                key={device.uuid}
                position={position}
                setPosition={setPosition}
                onDragEnd={() => {
                  if (screenBodyRef.current) {
                    sendJson(
                      wsRef.current!,
                      screenBodyRef.current,
                      "devices_update"
                    );
                  }
                }}
              >
                {idx}
              </CalibrationBox>
            );
          }
        })}
      <Button
        position="absolute"
        top={0}
        left={0}
        zIndex={100}
        onClick={() => {
          sendJson(wsRef.current!, screenBodyRef.current, "get_devices");
        }}
      >
        Refresh
      </Button>
    </Box>
  );
};
