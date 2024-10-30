import { Box, useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import type {
  UserType,
  DeviceType,
  ScreenType,
  SpPos,
} from "@/types/calibrate";
import { connectWebSocket } from "./useScreen";
import { ScreenCalibration } from "./useScreen/ScreenCalibration";
import { useWindowSize, useNetworkStatus } from "@/util/hooks";
import { sendJson } from "@/util/util";
import { ScreenAnimation } from "./useScreen/ScreenAnimation";
import { WaitingScreen } from "./useScreen/WaitingScreen";

export const Screen = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const screenBodyRef = useRef<ScreenType | null>(null);
  const shouldReconnect = useRef<boolean>(true);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const windowRef = useRef<HTMLDivElement | null>(null);

  const [connectingStatus, setConnectingStatus] =
    useState<string>("Connecting...");

  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [screenNum, setScreenNum] = useState<number | null>(null);
  const [mode, setMode] = useState<"Calibration" | "Operation">("Calibration");
  const [isDebug, setIsDebug] = useState<boolean>(false);

  const [spPos, setSpPos] = useState<SpPos>({
    translateX: 0,
    translateY: 0,
    width: 84,
    height: 170,
  });

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

  // resize時の挙動
  useEffect(() => {
    if (screenBodyRef.current) {
      screenBodyRef.current.size = windowSize;
      sendJson(wsRef.current, screenBodyRef.current, "screens_update");
    }
  }, [windowSize]);

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
      setMode,
      setIsDebug,
      setSpPos,
      setCurrentUser,
      setIsJoroMode,
      setAnimationStartFrom,
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
        <ScreenCalibration
          setDevices={setDevices}
          wsRef={wsRef}
          screenBodyRef={screenBodyRef}
          connectingStatus={connectingStatus}
          devices={devices}
          screenNum={screenNum}
          spPos={spPos}
        />
      )}
      {mode === "Operation" && (
        <>
          {!currentUser ? (
            <WaitingScreen spPos={spPos} />
          ) : (
            <ScreenAnimation
              isDebug={isDebug}
              devices={devices}
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
