import { useToast } from "@chakra-ui/react";
import type {
  DeviceType,
  ManagerType,
  ScreenType,
  UserType,
} from "@/types/calibrate";
import { sendJson } from "@/util/util";
import { v4 as uuidv4 } from "uuid";

type Props = {
  wsRef: React.MutableRefObject<WebSocket | null>;
  managerBodyRef: React.MutableRefObject<ManagerType | null>;
  setConnectingStatus: React.Dispatch<React.SetStateAction<string>>;
  shouldReconnect: React.MutableRefObject<boolean>;
  reconnectTimeout: React.MutableRefObject<NodeJS.Timeout | null>;
  setDevices: React.Dispatch<React.SetStateAction<DeviceType[]>>;
  setScreens: React.Dispatch<React.SetStateAction<ScreenType[]>>;
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
  setMode: React.Dispatch<React.SetStateAction<"Calibration" | "Operation">>;
  setDisplayDebugger: React.Dispatch<React.SetStateAction<boolean>>;
  setScreenSize: React.Dispatch<
    React.SetStateAction<{ width: number; height: number } | null>
  >;
  setConnectingCount: React.Dispatch<React.SetStateAction<number>>;
  toast: ReturnType<typeof useToast>;
};

export const connectWebSocket = (props: Props) => {
  const {
    wsRef,
    managerBodyRef,
    setConnectingStatus,
    shouldReconnect,
    reconnectTimeout,
    setDevices,
    setScreens,
    setUsers,
    setMode,
    setDisplayDebugger,
    setScreenSize,
    setConnectingCount,
    toast,
  } = props;

  wsRef.current = new WebSocket(
    process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3210"
  );

  wsRef.current.onopen = () => {
    if (!wsRef.current) return;
    setConnectingStatus("Connected");
    console.log("WebSocket connected");

    // 初回・再接続時 接続処理
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const manager: ManagerType = {
        type: "manager",
        uuid: uuidv4(),
        screens: [],
        devices: [],
      };
      sendJson(wsRef.current, manager, "init");
      managerBodyRef.current = manager;
      sendJson(wsRef.current, {}, "getCurrentSettings");
    }
  };

  wsRef.current.onmessage = (e) => {
    console.log("Message received: ", e.data);
    const data = JSON.parse(e.data);
    if (data.head.type === "getAllData") {
      managerBodyRef.current = data.body;
      setDevices([...data.body.devices]);
      setScreens([...data.body.screens]);
      setUsers([...data.body.users]);
      setConnectingCount((prev) => {
        if (prev > data.body.connectingCount) {
          toast({
            title: "接続が切断されました",
            description: "接続数: " + data.body.connectingCount,
            status: "warning",
            duration: 1500,
            isClosable: true,
          });
        } else if (prev < data.body.connectingCount) {
          toast({
            title: "新しい接続が確立されました",
            description: "接続数: " + data.body.connectingCount,
            status: "success",
            duration: 1500,
            isClosable: true,
          });
        } else {
          toast({
            title: "デバイス情報が変更されました",
            status: "success",
            duration: 1500,
            isClosable: true,
          });
        }
        return data.body.connectingCount;
      });
    } else if (data.head.type === "getCurrentSettings") {
      setMode(data.body.mode);
      setDisplayDebugger(data.body.debug);
      setScreenSize(data.body.screen);
      toast({
        title: "設定を更新しました",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    } else if (data.head.type === "setMode") {
      setMode(data.body.mode);
      toast({
        title: `${data.body.mode}に切り替えました`,
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    } else if (data.head.type === "setDebug") {
      setDisplayDebugger(data.body.debug);
      toast({
        title: `デバッグ表示: ${data.body.debug ? "ON" : "OFF"}`,
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    } else if (data.head.type === "setMainScreen") {
      setScreenSize(data.body);
      toast({
        title: "スクリーンサイズを更新しました",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    } else {
      toast({
        title: "不明なメッセージ",
        description: data.head.type,
        status: "info",
        duration: 1500,
        isClosable: true,
      });
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
