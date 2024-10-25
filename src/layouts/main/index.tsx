import { Box, Select, Button, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { StartCalibration } from "./start";
import { Screen } from "./screen";
import { Device } from "./device";
import { Manager } from "./manager";
export default function Main() {
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
          {device === "manager" && <Manager />}
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
