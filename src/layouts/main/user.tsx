import { Box, Button, useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { UserType } from "@/types/calibrate";
import { connectWebSocket } from "./useUser";
import { useWindowSize, useNetworkStatus } from "@/util/hooks";
import { sendJson } from "@/util/util";
import { UserQR } from "./useUser/UserQR";
import { SeedWatering } from "./useUser/SeedWatering";
import type { GptAnalysis } from "@/types/metaData";
import { UserAnimation } from "./useUser/UserAnimation";
import { ViewResult } from "./useUser/ViewResult";
import { saveToLocalStorage } from "./useUser/saveToLocalStorage";
import { ANIMATION_WAIT, USER_POS_X, USER_POS_Y } from "@/util/constants";

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
  const [isJoroMode, setIsJoroMode] = useState<boolean>(false);
  const [displayEndButton, setDisplayEndButton] = useState<boolean>(false);

  const [touchCount, setTouchCount] = useState<number>(0);

  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  const [displaySeed, setDisplaySeed] = useState<boolean>(true);

  const windowSize = useWindowSize(windowRef);
  const toast = useToast();
  const isOnline = useNetworkStatus();

  const onClickResultButton = useCallback(() => {
    setDisplayStep(2);
    if (userBody?.uuid) {
      const url = new URL(window.location.href);
      url.pathname = `/share/${userBody.uuid}`;
      window.history.pushState({}, "", url.toString());
    }
  }, [userBody]);

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
        x:
          screenSize.width / 2 -
          (userBodyRef.current.size.width * qrZoom) / 2 +
          USER_POS_X,
        y:
          screenSize.height -
          userBodyRef.current.size.height * qrZoom -
          20 +
          USER_POS_Y,
      };
      setUserBody({ ...userBodyRef.current });
    }
  }, [screenSize, qrZoom]);

  // アニメーション開始時刻の決定と、LocalStorageへの保存
  useEffect(() => {
    if (displayStep === 1 && animationCount > 0) {
      setAdjustedAnimationCount((prev) => prev + 1);
      if (adjustedAnimationCount === 3 || adjustedAnimationCount === 15) {
        if (userBodyRef.current) {
          userBodyRef.current = {
            ...userBodyRef.current,
            animationStartFrom: new Date().getTime() + ANIMATION_WAIT - 500,
          };
          setUserBody({ ...userBodyRef.current });
          sendJson(wsRef.current, userBodyRef.current, "animation_start");
          setIsJoroMode(false);
          saveToLocalStorage(userBodyRef.current);
          setTimeout(() => setDisplaySeed(false), 3000);
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

  // 常に画面をONにする  Screen Wake Lock API
  useEffect(() => {
    const handleVisibilityChange = async () => {
      try {
        const wl = await navigator.wakeLock.request("screen");
        setWakeLock(wl);
        console.log("%cScreen Wake Lock is active", "color: blue");
      } catch (err) {
        console.error(err);
      }
    };

    handleVisibilityChange();

    // document.addEventListener("visibilitychange", handleVisibilityChange);

    // return () => {
    //   document.removeEventListener("visibilitychange", handleVisibilityChange);
    // };
  }, []);

  // アニメーションが終わったら再接続を行わなくする
  useEffect(() => {
    if (userBody?.animationStartFrom === undefined) return;
    const timeout = setTimeout(
      () => {
        shouldReconnect.current = false;
        setDisplayEndButton(true);
        wakeLock?.release();
        console.log("%cScreen Wake Lock is released", "color: blue");
        setWakeLock(null);
        setTimeout(() => {
          onClickResultButton();
        }, 30 * 1000);
      },
      userBody.animationStartFrom - new Date().getTime() + 10000
    );

    return () => {
      clearTimeout(timeout);
    };
  }, [userBody?.animationStartFrom]);

  return (
    <Box
      w="100%"
      h="100svh"
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
              setIsJoroMode(true);
              sendJson(wsRef.current, userBodyRef.current, "user_ready");
            }
          }}
        />
      )}
      {displayStep === 1 && (
        <Box position="absolute" top={0} left={0} w="100%" h="100%">
          {displaySeed && (
            <SeedWatering animationCount={adjustedAnimationCount} />
          )}
          <Box
            w="100%"
            h="100%"
            opacity={isJoroMode ? 0 : 1}
            transition="all 2s 1s"
            onTouchStart={(e) => {
              if (adjustedAnimationCount >= 3) return;
              setTouchCount((prev) => prev + 1);
              setAnimationCount((prev) =>
                Math.max(prev, Math.floor(touchCount / 10))
              );
              const div = document.createElement("div");
              div.style.position = "fixed";
              div.style.top = `${e.touches[0].clientY}px`;
              div.style.left = `${e.touches[0].clientX}px`;
              div.style.width = "50px";
              div.style.height = "50px";
              div.style.color = "#FFF7";
              div.style.boxShadow =
                "0 0 10px 0px currentColor, inset 0 0 10px 0px currentColor";
              div.style.zIndex = "1000000";
              div.style.borderRadius = "50%";
              div.style.transform = "translate(-50%, -50%)";
              div.style.opacity = "1";
              div.style.transition = "all 0.2s";

              document.body.appendChild(div);
              setTimeout(() => {
                div.style.opacity = "0";
                div.style.width = "120px";
                div.style.height = "120px";
                setTimeout(() => {
                  document.body.removeChild(div);
                }, 200);
              }, 50);
            }}
          >
            <UserAnimation
              userBody={userBody}
              screenSize={screenSize}
              animationStartFrom={
                userBody?.animationStartFrom ??
                new Date().getTime() + 1000 * 60 * 60 * 24
              }
            />
          </Box>
          {displayEndButton && (
            <Box
              position="absolute"
              bottom={2}
              left={2}
              right={2}
              textAlign="center"
              zIndex={1000000}
            >
              <Button onClick={onClickResultButton} size="lg">
                {navigator.language.includes("ja")
                  ? "結果を見る"
                  : "View Result"}
              </Button>
            </Box>
          )}
        </Box>
      )}
      {displayStep === 2 && <ViewResult currentUser={userBody} />}
    </Box>
  );
};
