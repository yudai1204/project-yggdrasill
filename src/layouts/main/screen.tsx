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
import { USER_POS_X, USER_POS_Y } from "@/util/constants";

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

  const [screenWidth, setScreenWidth] = useState<number>(90);
  const [translateX, setTranslateX] = useState<number>(0);

  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const [spPos, setSpPos] = useState<SpPos>({
    translateX: USER_POS_X,
    translateY: USER_POS_Y,
    width: 84,
    height: 170,
  });

  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isJoroMode, setIsJoroMode] = useState<boolean>(false);
  const [animationStartFrom, setAnimationStartFrom] = useState<number>(
    new Date().getTime() + 1000 * 60 * 60 * 24
  );

  const [receiveJoroStatus, setReceiveJoroStatus] = useState<number>(0);

  const windowSize = useWindowSize(windowRef, 300, screenWidth);
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
      setReceiveJoroStatus,
    });

    // screenWidthとtranslateXをlocalStorageから取得
    const savedScreenWidth = localStorage.getItem("screenWidth");
    const savedTranslateX = localStorage.getItem("translateX");
    setTimeout(() => {
      if (savedScreenWidth) {
        setScreenWidth(parseInt(savedScreenWidth, 10));
      }
      if (savedTranslateX) {
        setTranslateX(parseInt(savedTranslateX, 10));
      }
    }, 500);

    return () => {
      // コンポーネントのアンマウント時に手動でWebSocketを閉じる
      // shouldReconnect.current = false;
      // clearTimeout(reconnectTimeout.current ?? undefined);
      // if (wsRef.current) {
      //   wsRef.current.close();
      // }
    };
  }, []);

  // screenWidthとtranslateXをlocalStorageに保存
  useEffect(() => {
    localStorage.setItem("screenWidth", screenWidth.toString());
    localStorage.setItem("translateX", translateX.toString());
  }, [screenWidth, translateX]);

  // animation終了からしばらく後に待機モードに戻す
  useEffect(() => {
    setIsWaiting(false);
    const timeout = setTimeout(
      () => {
        setIsWaiting(true);
        setReceiveJoroStatus(0);
      },
      animationStartFrom - new Date().getTime() + 1000 * 20
    );
    return () => clearTimeout(timeout);
  }, [animationStartFrom]);

  // じょうろモードのまま3分経過したら解除して待機モードに戻す
  useEffect(() => {
    if (isJoroMode) {
      const timeout = setTimeout(
        () => {
          setIsJoroMode(false);
          setCurrentUser(null);
          setReceiveJoroStatus(0);
          setAnimationStartFrom(new Date().getTime() + 1000 * 60 * 60 * 24);
          setSpPos((prev) => ({ ...prev, width: 84, height: 170 }));
        },
        1000 * 60 * 3
      );
      return () => clearTimeout(timeout);
    }
  }, [isJoroMode]);

  return (
    <Box
      w={`${screenWidth}%`}
      h="100svh"
      position="relative"
      overflow="hidden"
      padding="60px 40px"
      ref={windowRef}
      border={mode === "Calibration" ? "1px solid #FFFFFF" : "none"}
      boxShadow={`0 0 500px 1000px #000000`}
      transform={`translateX(${translateX}px)`}
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
          screenWidth={screenWidth}
          setScreenWidth={setScreenWidth}
          translateX={translateX}
          setTranslateX={setTranslateX}
        />
      )}

      {mode === "Operation" && (
        <>
          {!currentUser ? (
            <WaitingScreen spPos={spPos} logo />
          ) : (
            <Box w="100%" h="100%">
              <ScreenAnimation
                isDebug={isDebug}
                devices={devices}
                isJoroMode={isJoroMode}
                currentUser={currentUser}
                animationStartFrom={animationStartFrom}
                spPos={spPos}
                receiveJoroStatus={receiveJoroStatus}
              />
              {isWaiting && (
                <Box zIndex={999999999999}>
                  <WaitingScreen spPos={spPos} />
                </Box>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
