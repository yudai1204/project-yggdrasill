import { useState } from "react";
import { StartCalibration } from "./start";
import { Screen } from "./screen";
import { Device } from "./device";
import { Manager } from "./manager";
import { User } from "./user";
import { Box } from "@chakra-ui/react";
import QrScanner from "./qrReader";
import type { GptAnalysis } from "@/types/metaData";

const sampleGptAnalysis: GptAnalysis = {
  flowerColor: ["#FF69B4", "#FF1493", "#C71585"],
  flowerName: "シクラメン",
  season: "Winter",
  userName: "yudai",
};
export default function Main() {
  const [device, setDevice] = useState<string>("screen");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const connect = () => {
    setIsConnected(true);
  };

  return (
    <Box
      bgColor="#1A202C"
      color="#DCDDDD"
      w="100%"
      h="100lvh"
      overflow="hidden"
    >
      {isConnected ? (
        <>
          {device === "screen" && <Screen />}
          {device === "device" && <Device />}
          {device === "manager" && <Manager />}
          {device === "user" && <User gptAnalysis={sampleGptAnalysis} />}
          {device === "qrReader" && <QrScanner />}
        </>
      ) : (
        <StartCalibration
          device={device}
          setDevice={setDevice}
          connect={connect}
        />
      )}
    </Box>
  );
}
