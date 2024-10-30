import { Box, useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import type { UserType } from "@/types/calibrate";
import { connectWebSocket } from "./useUser";
import { useWindowSize, useNetworkStatus } from "@/util/hooks";
import { sendJson } from "@/util/util";
import { UserQR } from "./useUser/UserQR";
import { SeedWatering } from "./useUser/SeedWatering";
import type { GptAnalysis } from "@/types/metaData";
import { UserAnimation } from "./useUser/UserAnimation";

type Props = {
  gptAnalysis: GptAnalysis;
  answers: (string | undefined)[];
};
export const User = (props: Props) => {
  const { gptAnalysis, answers } = props;

  const windowRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const userBodyRef = useRef<UserType | null>(null);

  const shouldReconnect = useRef<boolean>(true);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const [connectingStatus, setConnectingStatus] =
    useState<string>("Connecting...");
  const [userBody, setUserBody] = useState<UserType | null>(null);
  const [screenSize, setScreenSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [qrZoom, setQRZoom] = useState<number>(0);
  const [displayStep, setDisplayStep] = useState<number>(0);
  const [animationCount, setAnimationCount] = useState<number>(0);
  const [adjustedAnimationCount, setAdjustedAnimationCount] =
    useState<number>(0);

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
    if (userBodyRef.current) {
      userBodyRef.current.size = windowSize;
      setUserBody({ ...userBodyRef.current });
      sendJson(wsRef.current, userBodyRef.current, "user_update");
    }
  }, [windowSize]);

  // x,yポジションの設定
  useEffect(() => {
    if (userBodyRef.current && screenSize) {
      userBodyRef.current.position = {
        x: screenSize.width / 2 - (userBodyRef.current.size.width * qrZoom) / 2,
        y: screenSize.height - userBodyRef.current.size.height * qrZoom - 20,
      };
      setUserBody({ ...userBodyRef.current });
    }
  }, [screenSize, qrZoom]);

  useEffect(() => {
    if (displayStep === 1 && animationCount > 0) {
      setAdjustedAnimationCount((prev) => prev + 1);
      if (animationCount === 3) {
        if (userBodyRef.current) {
          userBodyRef.current = {
            ...userBodyRef.current,
            animationStartFrom: new Date().getTime() + 3000,
          };
          setUserBody({ ...userBodyRef.current });
          sendJson(wsRef.current, userBodyRef.current, "animation_start");
        }
      }
    }
  }, [animationCount, displayStep, userBodyRef]);

  // WebSocket接続の開始とクリーンアップ
  useEffect(() => {
    connectWebSocket({
      wsRef,
      userBodyRef,
      setConnectingStatus,
      setUserBody,
      shouldReconnect,
      reconnectTimeout,
      setScreenSize,
      setQRZoom,
      answers,
      gptAnalysis,
      setAnimationCount,
    });

    // 30分で再接続を行わなくする
    const timeout = setTimeout(() => {
      shouldReconnect.current = false;
    }, 30 * 60000);

    return () => {
      clearTimeout(timeout);
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
      h="100lvh"
      position="relative"
      overflow="hidden"
      ref={windowRef}
    >
      <Box position="absolute" bottom={2} right={3} color="#666">
        {connectingStatus}
      </Box>
      {displayStep === 0 && (
        <UserQR
          userBody={userBody}
          qrZoom={qrZoom}
          connectingStatus={connectingStatus}
          onReady={() => {
            setDisplayStep(1);
            if (userBodyRef.current) {
              userBodyRef.current = {
                ...userBodyRef.current,
                zoom: qrZoom,
                ready: true,
              };
              setUserBody({ ...userBodyRef.current });
              sendJson(wsRef.current, userBodyRef.current, "user_ready");
            }
          }}
        />
      )}
      {displayStep === 1 && (
        <Box position="absolute" top={0} left={0} w="100%" h="100%">
          <SeedWatering animationCount={adjustedAnimationCount} />
          <UserAnimation
            userBody={userBody}
            screenSize={screenSize}
            animationStartFrom={
              userBody?.animationStartFrom ??
              new Date().getTime() + 1000 * 60 * 60 * 24
            }
            currentUser={userBody}
          />
        </Box>
      )}
    </Box>
  );
};
