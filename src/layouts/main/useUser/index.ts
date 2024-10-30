import type { DeviceType, ScreenType, UserType } from "@/types/calibrate";
import { sendJson, calculateTimeOffset } from "@/util/util";
import { getScreenSize } from "@/util/util";
import { v4 as uuidv4 } from "uuid";
import parser from "ua-parser-js";
import type { GptAnalysis } from "@/types/metaData";

const initUserDevice = (
  gptAnalysis: GptAnalysis,
  answers: (string | undefined)[]
) => {
  const screenSize = getScreenSize();
  const ua = parser(navigator.userAgent);
  const userDevice: UserType = {
    connectedAt: 0,
    timeOffset: {
      value: 0,
      serverTime: 0,
      begin: new Date().getTime(),
    },
    type: "user",
    uuid: uuidv4(),
    size: screenSize,
    rawSize: screenSize,
    rotation: 0,
    position: {
      x: 0,
      y: 0,
    },
    zoom: 1,
    ua: {
      browser: `${ua.browser?.name}, ${ua.browser?.version}`,
      device: ua.device?.type,
      engine: ua.engine?.name,
      os: ua.os?.name,
    },
    metadata: {
      gptAnalysis,
      answers: answers,
    },
    ready: false,
  };
  return userDevice;
};

type Props = {
  wsRef: React.MutableRefObject<WebSocket | null>;
  userBodyRef: React.MutableRefObject<UserType | null>;
  setConnectingStatus: React.Dispatch<React.SetStateAction<string>>;
  setUserBody: React.Dispatch<React.SetStateAction<UserType | null>>;
  shouldReconnect: React.MutableRefObject<boolean>;
  reconnectTimeout: React.MutableRefObject<NodeJS.Timeout | null>;
  setScreenSize: React.Dispatch<
    React.SetStateAction<{ width: number; height: number } | null>
  >;
  setQRZoom: React.Dispatch<React.SetStateAction<number>>;
  answers: (string | undefined)[];
  gptAnalysis: GptAnalysis;
  setAnimationCount: React.Dispatch<React.SetStateAction<number>>;
};

export const connectWebSocket = (props: Props) => {
  const {
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
  } = props;
  wsRef.current = new WebSocket(
    process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3210"
  );

  wsRef.current.onopen = () => {
    if (!wsRef.current) return;
    setConnectingStatus("Connected");
    console.log("WebSocket connected");

    // 初回接続処理
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      if (userBodyRef.current === null) {
        const userDevice = initUserDevice(gptAnalysis, answers);
        sendJson(wsRef.current, userDevice, "init");
        userBodyRef.current = userDevice;
        setUserBody(userBodyRef.current);
        sendJson(wsRef.current, {}, "getCurrentSettings");
      } else {
        sendJson(wsRef.current, userBodyRef.current, "reconnect");
        sendJson(wsRef.current, {}, "getCurrentSettings");
      }
    }
  };

  wsRef.current.onmessage = (e) => {
    console.log("Message received: ", e.data);
    const data = JSON.parse(e.data);
    if (data.head.type === "init") {
      userBodyRef.current = {
        ...data.body,
        timeOffset: {
          ...data.body.timeOffset,
          value: calculateTimeOffset(data.body.timeOffset),
        },
      };
      setUserBody(userBodyRef.current);
      console.log("init done");
    } else if (data.head.type === "setMainScreen") {
      setScreenSize(data.body);
    } else if (data.head.type === "getCurrentSettings") {
      setScreenSize(data.body.screen);
    } else if (data.head.type === "qrRead") {
      setQRZoom(data.body.zoom);
    } else if (data.head.type === "joro_status") {
      setAnimationCount((prev) => prev + 1);
    }
  };

  wsRef.current.onclose = () => {
    setConnectingStatus("Disconnected");
    console.log("WebSocket disconnected");

    // 自動再接続のための処理
    if (shouldReconnect.current) {
      setConnectingStatus("Reconnecting...");
      console.log("Attempting to reconnect in 1 seconds...");
      reconnectTimeout.current = setTimeout(() => {
        connectWebSocket(props);
      }, 1000); // 1秒後に再接続
    }
  };

  wsRef.current.onerror = (err) => {
    console.error("WebSocket error: ", err);
    wsRef.current?.close();
  };
};
