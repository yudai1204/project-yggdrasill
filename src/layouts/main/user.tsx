import { Box } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import type { UserType } from "@/types/calibrate";
import { connectWebSocket } from "./useUser";
import { useWindowSize } from "@/util/hooks";
import { sendJson } from "@/util/util";
import { UserQR } from "./useUser/UserQR";
import { SeedWatering } from "./useUser/SeedWatering";
import type { GptAnalysis } from "@/types/metaData";

type Props = {
  gptAnalysis: GptAnalysis;
  answers: (string | undefined)[];
};
export const User = (props: Props) => {
  const { gptAnalysis, answers } = props;

  console.log(gptAnalysis);

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
      setQRZoom,
      answers,
      gptAnalysis,
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
          }}
        />
      )}
      {displayStep === 1 && (
        <Box position="absolute" top={0} left={0} w="100%" h="100%">
          <SeedWatering />
        </Box>
      )}
    </Box>
  );
};
