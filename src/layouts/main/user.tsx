import { Box, Button } from "@chakra-ui/react";
import { use, useEffect, useRef, useState } from "react";
import type { DeviceType, ScreenType, UserType } from "@/types/calibrate";
import { connectWebSocket } from "./useUser";
import { useWindowSize } from "@/util/hooks";
import { sendJson } from "@/util/util";
import { QRCodeSVG } from "qrcode.react";

export const User = () => {
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
  const [displayQR, setDisplayQR] = useState<boolean>(false);

  const windowSize = useWindowSize(windowRef);

  // resize時の挙動
  useEffect(() => {
    if (userBodyRef.current) {
      userBodyRef.current.size = windowSize;
      setUserBody({ ...userBodyRef.current });
      sendJson(wsRef.current, userBodyRef.current, "user_update");
    }
  }, [windowSize]);

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
      ref={windowRef}
    >
      <Button
        onClick={() => setDisplayQR(!displayQR)}
        position="absolute"
        top={0}
        left={0}
      >
        Toggle QR
      </Button>
      <Box
        display={displayQR ? "flex" : "none"}
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="100%"
      >
        <QRCodeSVG
          style={{ width: "100%", height: "auto" }}
          value={userBody?.uuid ?? ""}
          marginSize={4}
          bgColor="#eee"
          fgColor="#000"
          size={400}
        />
      </Box>
    </Box>
  );
};
