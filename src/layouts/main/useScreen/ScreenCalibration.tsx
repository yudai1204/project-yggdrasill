import {
  Box,
  Button,
  ButtonGroup,
  NumberInput,
  Stack,
  Text,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { CalibrationBox } from "@/components/CalibrationBox";
import { sendJson } from "@/util/util";
import type { DeviceType, ScreenType, SpPos } from "@/types/calibrate";

type Props = {
  screenNum: number | null;
  connectingStatus: string;
  devices: DeviceType[];
  screenBodyRef: React.MutableRefObject<ScreenType | null>;
  wsRef: React.MutableRefObject<WebSocket | null>;
  setDevices: React.Dispatch<React.SetStateAction<DeviceType[]>>;
  spPos: SpPos;
  screenWidth: number;
  setScreenWidth: React.Dispatch<React.SetStateAction<number>>;
  translateX: number;
  setTranslateX: React.Dispatch<React.SetStateAction<number>>;
};
export const ScreenCalibration = (props: Props) => {
  const {
    screenNum,
    connectingStatus,
    devices,
    screenBodyRef,
    wsRef,
    setDevices,
    spPos,
    screenWidth,
    setScreenWidth,
    translateX,
    setTranslateX,
  } = props;
  return (
    <>
      {/* User Pos */}
      <Box
        position="absolute"
        bottom={5}
        left={`calc(50% - ${spPos.width / 2}px)`}
        transform={`translate(${spPos.translateX}px, ${spPos.translateY}px)`}
        backgroundColor="#070"
        width={spPos.width}
        height={spPos.height}
        textAlign="center"
        pt={2}
      >
        USER
      </Box>
      <Box mt={20}>
        <h1>Screen: {screenNum}</h1>
        <h2>Status: {connectingStatus}</h2>
      </Box>

      {devices &&
        screenBodyRef.current?.devices.map((device, idx) => {
          if (device.isConnected) {
            const position = {
              width: device.size.width,
              height: device.size.height,
              rotate: device.rotation,
              zoom: device.zoom,
              x: device.position.x,
              y: device.position.y,
              rawWidth: device.rawSize.width,
              rawHeight: device.rawSize.height,
            };
            const setPosition = (newPosition: typeof position) => {
              setDevices((prev) => {
                const target = prev.find((d) => d.uuid === device.uuid);
                if (target) {
                  target.size.width = newPosition.width;
                  target.size.height = newPosition.height;
                  target.rotation = newPosition.rotate;
                  target.position.x = newPosition.x;
                  target.position.y = newPosition.y;
                  target.zoom = newPosition.zoom;
                  target.rawSize.width = newPosition.rawWidth;
                  target.rawSize.height = newPosition.rawHeight;
                }
                screenBodyRef.current!.devices = prev;
                return [...prev];
              });
            };
            return (
              <CalibrationBox
                key={device.uuid}
                position={position}
                setPosition={setPosition}
                onDragEnd={() => {
                  if (screenBodyRef.current) {
                    sendJson(
                      wsRef.current!,
                      screenBodyRef.current,
                      "devices_update"
                    );
                  }
                }}
                idxNum={idx}
              />
            );
          }
        })}

      <Box position="absolute" top={0} left={0} zIndex={100} width="100%" p={4}>
        <ButtonGroup mb={1}>
          <Button
            onClick={() => {
              sendJson(wsRef.current!, screenBodyRef.current, "get_devices");
            }}
          >
            Refresh
          </Button>
          <Button
            onClick={() => {
              sendJson(wsRef.current!, screenBodyRef.current, "setMainScreen");
            }}
          >
            スクリーンサイズを同期
          </Button>
        </ButtonGroup>
        <Stack direction="row" display="flex" gap={8} mt={4}>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Text fontSize="sm">Width: </Text>
            <NumberInput
              value={screenWidth}
              onChange={(value) => {
                setScreenWidth(Number(value));
              }}
              w="100px"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="sm">%</Text>
          </Stack>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Text fontSize="sm">TranslateX: </Text>
            <NumberInput
              w="100px"
              value={translateX}
              onChange={(value) => {
                setTranslateX(Number(value));
              }}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="sm">px</Text>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};
