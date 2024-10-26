import {
  Box,
  Button,
  Heading,
  ButtonGroup,
  Switch,
  FormControl,
  FormLabel,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import type { DeviceType, ScreenType, ManagerType } from "@/types/calibrate";
import { sendJson } from "@/util/util";
import { connectWebSocket } from "./useManager";
import { AccordionList } from "@/components/AccordionList";

export const Manager = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const managerBodyRef = useRef<ManagerType | null>(null);
  const shouldReconnect = useRef<boolean>(true);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const [connectingStatus, setConnectingStatus] =
    useState<string>("Connecting...");
  const [screens, setScreens] = useState<ScreenType[]>([]);
  const [devices, setDevices] = useState<DeviceType[]>([]);

  const [mode, setMode] = useState<"Calibration" | "Operation">("Calibration");
  const [displayDebugger, setDisplayDebugger] = useState<boolean>(false);

  const toggleDisplayDebugger = (e: React.ChangeEvent<HTMLInputElement>) => {
    sendJson(wsRef.current, { debug: e.target.checked }, "setDebug");
  };

  const toggleMode = () => {
    sendJson(
      wsRef.current,
      { mode: mode === "Calibration" ? "Operation" : "Calibration" },
      "setMode"
    );
  };

  const getAllData = () => {
    sendJson(wsRef.current, managerBodyRef.current, "getAllData");
    sendJson(wsRef.current, {}, "getCurrentSettings");
  };

  // WebSocket接続の開始とクリーンアップ
  useEffect(() => {
    connectWebSocket({
      wsRef,
      managerBodyRef,
      setConnectingStatus,
      shouldReconnect,
      reconnectTimeout,
      setScreens,
      setDevices,
      setMode,
      setDisplayDebugger,
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
    <Box>
      <Heading as="h1" size="lg">
        Manager
      </Heading>
      <Heading as="h2" size="md">
        Status: {connectingStatus}
      </Heading>
      <Heading as="h2" size="md">
        Mode: {mode}
      </Heading>

      <ButtonGroup>
        <Button onClick={getAllData}>Refresh</Button>
        <Button onClick={toggleMode}>Toggle Mode</Button>
      </ButtonGroup>

      <FormControl display="flex" alignItems="center">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          px={2}
          py={1}
        >
          <FormLabel htmlFor="display-debugger" display="block" m={0}>
            Display Debugger:
          </FormLabel>
          <Switch
            id="display-debugger"
            display="block"
            isChecked={displayDebugger}
            onChange={toggleDisplayDebugger}
          />
        </Stack>
        {displayDebugger ? "ON" : "OFF"}
      </FormControl>

      <Box mt={4} pt={4} borderTop="1px solid #777">
        <Heading as="h3" size="md">
          All Devices: {devices?.length}
        </Heading>
        <Heading as="h4" size="sm">
          Connected : {devices?.filter((device) => device.isConnected).length}
        </Heading>
        {devices && (
          <>
            <AccordionList items={devices} />
          </>
        )}
        <Heading as="h3" size="md">
          Connected Screens: {screens?.length}
        </Heading>
        {screens && (
          <>
            <AccordionList items={screens} />
          </>
        )}
      </Box>
    </Box>
  );
};
