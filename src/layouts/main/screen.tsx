import { Box, Button } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { CalibrationBox } from "@/components/CalibrationBox";
import type { DeviceType, ScreenType } from "@/types/calibrate";
import { sendJson } from "@/util/util";
import { connectWebSocket } from "./useScreen";

export const Screen = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const screenBodyRef = useRef<ScreenType | null>(null);
  const shouldReconnect = useRef<boolean>(true);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const [connectingStatus, setConnectingStatus] =
    useState<string>("Connecting...");

  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [screenNum, setScreenNum] = useState<number | null>(null);

  // WebSocket接続の開始とクリーンアップ
  useEffect(() => {
    connectWebSocket({
      wsRef,
      screenBodyRef,
      setConnectingStatus,
      setDevices,
      shouldReconnect,
      reconnectTimeout,
      setScreenNum,
    });

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
    <Box
      w="100%"
      h="100svh"
      position="relative"
      overflow="hidden"
      padding="60px 40px"
    >
      <h1>Screen: {screenNum}</h1>
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
                idxNum={idx}
              />
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
