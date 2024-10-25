import { Button } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import type { DeviceType } from "@/types/calibrate";
import { connectWebSocket } from "./useDevice";

export const Device = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const shouldReconnect = useRef<boolean>(true);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const [connectingStatus, setConnectingStatus] =
    useState<string>("Connecting...");
  const deviceBodyRef = useRef<DeviceType | null>(null);
  const [deviceNum, setDeviceNum] = useState<number | null>(null);
  const [deviceBody, setDeviceBody] = useState<DeviceType | null>(null);

  // WebSocket接続の開始とクリーンアップ
  useEffect(() => {
    connectWebSocket({
      wsRef,
      deviceBodyRef,
      setConnectingStatus,
      setDeviceNum,
      setDeviceBody,
      shouldReconnect,
      reconnectTimeout,
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
