import { Box, Button } from "@chakra-ui/react";
import { CalibrationBox } from "@/components/CalibrationBox";
import { sendJson } from "@/util/util";
import type { DeviceType, ScreenType } from "@/types/calibrate";

type Props = {
  screenNum: number | null;
  connectingStatus: string;
  devices: DeviceType[];
  screenBodyRef: React.MutableRefObject<ScreenType | null>;
  wsRef: React.MutableRefObject<WebSocket | null>;
  setDevices: React.Dispatch<React.SetStateAction<DeviceType[]>>;
};
export const ScreenCalibration = (props: Props) => {
  const {
    screenNum,
    connectingStatus,
    devices,
    screenBodyRef,
    wsRef,
    setDevices,
  } = props;
  return (
    <>
      {/* User Pos */}
      <Box
        position="absolute"
        bottom={1}
        left="50%"
        transform="translateX(-50%)"
        backgroundColor="#070"
        width="80px"
        height="170px"
        textAlign="center"
        pt={2}
      >
        USER
      </Box>
      <h1>Screen: {screenNum}</h1>
      <h2>Status: {connectingStatus}</h2>
      {screenBodyRef.current && (
        <>
          <h3>Connected Devices</h3>
          {devices &&
            screenBodyRef.current.devices.map(
              (device, idx) =>
                device.isConnected && (
                  <div key={device.uuid}>
                    <p>
                      {idx} : UUID: {device.uuid}
                    </p>
                  </div>
                )
            )}
        </>
      )}
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

      <Button
        position="absolute"
        top={0}
        left={0}
        zIndex={100}
        onClick={() => {
          sendJson(wsRef.current!, screenBodyRef.current, "get_devices");
        }}
      >
        Refresh
      </Button>
    </>
  );
};
