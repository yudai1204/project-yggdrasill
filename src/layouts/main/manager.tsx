import {
  Box,
  Button,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import type { DeviceType, ScreenType, ManagerType } from "@/types/calibrate";
import { dispNum, getColor, sendJson } from "@/util/util";
import { connectWebSocket } from "./useManager";
import { format } from "date-fns";

type ItemsProps = {
  items: any[];
};
const Items = (props: ItemsProps) => {
  const { items } = props;
  if (!items || items.length === 0) {
    return <p>No items</p>;
  }
  return (
    <Accordion>
      {items.map((item, idx) => (
        <AccordionItem key={item.uuid}>
          <h2>
            <AccordionButton>
              <Box
                as="span"
                flex="1"
                textAlign="left"
                color={
                  !item?.position || item.isConnected ? "green.500" : "red.500"
                }
              >
                {idx}: {item.uuid} :{" "}
                {!item?.position || item.isConnected
                  ? "Connected"
                  : "Disconnected"}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <TableContainer>
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Td>Size</Td>
                    <Td>
                      {item.size.width} x {item.size.height}
                    </Td>
                  </Tr>
                  {item?.position && (
                    <>
                      <Tr>
                        <Td>Position</Td>
                        <Td>
                          {dispNum(item.position.x)}, {dispNum(item.position.y)}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Zoom</Td>
                        <Td>x{dispNum(item.zoom)}</Td>
                      </Tr>
                      <Tr>
                        <Td>Rotation</Td>
                        <Td>{item.rotation} deg</Td>
                      </Tr>
                      <Tr>
                        <Td>Color</Td>
                        <Td>
                          <Box
                            backgroundColor={getColor(idx)[0]}
                            border={`2px solid ${getColor(idx)[1]}`}
                            color="#fff"
                          >
                            {getColor(idx).join(", ")}
                          </Box>
                        </Td>
                      </Tr>
                    </>
                  )}
                  <Tr>
                    <Td>ConnectedAt</Td>
                    <Td>
                      {format(
                        new Date(item.connectedAt),
                        "yyyy-MM-dd HH:mm:ss"
                      )}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export const Manager = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const managerBodyRef = useRef<ManagerType | null>(null);
  const shouldReconnect = useRef<boolean>(true);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const [connectingStatus, setConnectingStatus] =
    useState<string>("Connecting...");
  const [screens, setScreens] = useState<ScreenType[]>([]);
  const [devices, setDevices] = useState<DeviceType[]>([]);

  const getAllData = () => {
    sendJson(wsRef.current, managerBodyRef.current, "getAllData");
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
      <h1>Manager</h1>
      <h2>Status: {connectingStatus}</h2>
      <Button onClick={getAllData}>Refresh</Button>
      <Heading as="h3" size="md">
        All Devices: {devices?.length}
      </Heading>
      {devices && (
        <>
          <Items items={devices} />
        </>
      )}
      <Heading as="h3" size="md">
        Connected Devices:{" "}
        {devices?.filter((device) => device.isConnected).length}
      </Heading>
      {devices && (
        <>
          <Items items={devices.filter((device) => device.isConnected)} />
        </>
      )}
      <Heading as="h3" size="md">
        Connected Screens: {screens?.length}
      </Heading>
      {screens && (
        <>
          <Items items={screens} />
        </>
      )}
    </Box>
  );
};
