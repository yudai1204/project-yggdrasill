import { Box, Select, Button, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { StartCalibration } from "./start";
import { Screen } from "./screen";
import { Device } from "./device";
export default function Calibration() {
  const [device, setDevice] = useState<string>("screen");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const connect = () => {
    setIsConnected(true);
  };

  return (
    <>
      {isConnected ? (
        <>
          {device === "screen" && <Screen />}
          {device === "device" && <Device />}
        </>
      ) : (
        <StartCalibration
          device={device}
          setDevice={setDevice}
          connect={connect}
        />
      )}
    </>
  );
}
