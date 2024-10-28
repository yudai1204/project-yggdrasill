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
  userName: "侑大",
  season: "Summer",
  location: "Moon",
  time: "Noon",
  weather: "Sunny",
  flowerName: "Lunar Blossom",
  flowerColor: ["#FFD700", "#FF69B4", "#FF4500"],
  flowerSize: "large",
  treeType: "broadleaf",
  treeHeight: "large",
  treeTexture: "realistic",
  treeAge: "ancient",
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
          {device === "user" && (
            <User gptAnalysis={sampleGptAnalysis} answers={[]} />
          )}
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
