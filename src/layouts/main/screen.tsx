import { Box } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import type { DeviceType, ScreenType } from "@/types/calibrate";
import { connectWebSocket } from "./useScreen";
import { ScreenCalibration } from "./useScreen/ScreenCalibration";
import { useWindowSize } from "@/util/hooks";
import { sendJson } from "@/util/util";
import { ScreenAnimation } from "./useScreen/ScreenAnimation";

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

  const windowSize = useWindowSize(windowRef);

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
      h="100lvh"
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
        />
      )}
      {mode === "Operation" && (
        <ScreenAnimation isDebug={isDebug} devices={devices} />
      )}
    </Box>
  );
};