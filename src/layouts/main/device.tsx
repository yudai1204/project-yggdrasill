import { Box, position, useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import type {
  DeviceType,
  ScreenType,
  UserType,
  SavedDevicePositon,
} from "@/types/calibrate";
import { connectWebSocket } from "./useDevice";
import { useWindowSize, useNetworkStatus } from "@/util/hooks";
import { sendJson } from "@/util/util";
import { DeviceCalibration } from "./useDevice/DeviceCalibration";
import { DeviceAnimation } from "./useDevice/DeviceAnimation";
import { WaitingDevice } from "./useDevice/WaitingDevice";

export const Device = () => {
  const windowRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const deviceBodyRef = useRef<DeviceType | null>(null);

  const shouldReconnect = useRef<boolean>(true);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const [connectingStatus, setConnectingStatus] =
    useState<string>("Connecting...");
  const [deviceNum, setDeviceNum] = useState<number | null>(null);
  const [deviceBody, setDeviceBody] = useState<DeviceType | null>(null);
  const [screenSize, setScreenSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [mode, setMode] = useState<"Calibration" | "Operation">("Calibration");
  const [isDebug, setIsDebug] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isJoroMode, setIsJoroMode] = useState<boolean>(false);
  const [animationStartFrom, setAnimationStartFrom] = useState<number>(
    new Date().getTime() + 1000 * 60 * 60 * 24
  );

  const windowSize = useWindowSize(windowRef);
  const toast = useToast();
  const isOnline = useNetworkStatus();

  useEffect(() => {
    if (wsRef.current && toast) {
      toast({
        title: isOnline ? "Network Connected" : "Network Error",
        status: isOnline ? "success" : "error",
        duration: isOnline ? 2000 : 5000,
      });
    }
  }, [isOnline, wsRef.current, toast]);

  const postUpdateDevice = (newDevice: DeviceType) => {
    deviceBodyRef.current = newDevice;
    setDeviceBody({ ...deviceBodyRef.current });
    sendJson(wsRef.current, deviceBodyRef.current, "devices_update");
    const lastDevicePosition: SavedDevicePositon = {
      position: newDevice.position,
      zoom: newDevice.zoom,
    };
    localStorage.setItem("devicePosition", JSON.stringify(lastDevicePosition));
  };

  // resize時の挙動
  useEffect(() => {
    if (deviceBodyRef.current) {
      postUpdateDevice({
        ...deviceBodyRef.current,
        size: windowSize,
      });
    }
  }, [windowSize]);

  // デバイスの位置をリセット
  const resetPos = () => {
    if (deviceBodyRef.current) {
      postUpdateDevice({
        ...deviceBodyRef.current,
        position: { x: 0, y: 0 },
        rotation: 0,
      });
    }
  };

  // WebSocket接続の開始とクリーンアップ
  useEffect(() => {
    const lastDevicePosition = localStorage.getItem("devicePosition");
    const initialDevicePosition: SavedDevicePositon = lastDevicePosition
      ? JSON.parse(lastDevicePosition)
      : {
          position: { x: 0, y: 0 },
          zoom: 1,
        };

    connectWebSocket({
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
      initialDevicePosition,
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
      ref={windowRef}
    >
      {mode === "Calibration" && (
        <DeviceCalibration
          resetPos={resetPos}
          deviceBodyRef={deviceBodyRef}
          connectingStatus={connectingStatus}
          deviceNum={deviceNum}
          deviceBody={deviceBody}
        />
      )}
      {mode === "Operation" && (
        <>
          {!currentUser ? (
            <WaitingDevice />
          ) : (
            <DeviceAnimation
              screenSize={screenSize}
              isDebug={isDebug}
              deviceNum={deviceNum}
              deviceBody={deviceBody}
              isJoroMode={isJoroMode}
              currentUser={currentUser}
              animationStartFrom={animationStartFrom}
            />
          )}
        </>
      )}
    </Box>
  );
};
