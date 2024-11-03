import { Box, Button, Heading, keyframes } from "@chakra-ui/react";
import type { UserType } from "@/types/calibrate";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useState } from "react";
import "@fontsource/kaisei-opti";

type Props = {
  connectingStatus: string;
  userBody: UserType | null;
  qrZoom: number;
  onReady: () => void;
};

export const UserQR = (props: Props) => {
  const { connectingStatus, userBody, qrZoom, onReady } = props;
  const [opacity, setOpacity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onReadyPush = useCallback(() => {
    setIsLoading(true);
    setOpacity(0);
    setTimeout(() => {
      onReady();
    }, 500);
  }, [onReady]);

  useEffect(() => {
    if (connectingStatus !== "Connected" || qrZoom === 0) {
      return;
    }

    const timer = setTimeout(() => {
      onReadyPush();
    }, 2500);

    return () => clearTimeout(timer);
  }, [connectingStatus, qrZoom, onReadyPush]);

  const opacityAnimation = keyframes`
  0%, 100% { opacity: 1; }
  90% { opacity: 0.3; }
  `;

  return (
    <Box
      display="block"
      justifyContent="center"
      alignItems="center"
      width="100%"
      transition="opacity 0.5s 0.1s"
      opacity={opacity}
    >
      <Box>
        <Heading
          textAlign="center"
          fontSize="18px"
          mt="20px"
          fontFamily="Kaisei Opti"
        >
          スマートフォンを定位置に置いてください
        </Heading>
        <Heading
          textAlign="center"
          fontSize="14px"
          mt="12px"
          fontFamily="Kaisei Opti"
        >
          Put your smartphone in the correct position.
        </Heading>
      </Box>
      <Box animation={`${opacityAnimation} 12s ease-in-out infinite`}>
        <QRCodeSVG
          style={{
            width: "min(42svh, 100vw)",
            height: "auto",
            maxHeight: "70%",
            margin: "40px auto",
          }}
          value={userBody?.uuid ?? ""}
          marginSize={4}
          bgColor="#FFF"
          fgColor="#000"
          size={400}
        />
      </Box>
      <Button
        size="lg"
        display={
          connectingStatus !== "Connected" || qrZoom === 0 ? "none" : "flex"
        }
        mx="auto"
        w="80%"
        bgColor="#458"
        fontSize="24px"
        height="100px"
        _hover={{ bgColor: "#536", boxShadow: "0 0 10px #5368" }}
        _active={{ bgColor: "#528" }}
        transition="opacity 0.3s, background-color 0.2s"
        opacity={connectingStatus !== "Connected" || qrZoom === 0 ? 0 : 1}
        isLoading={isLoading}
        onClick={onReadyPush}
      >
        準備完了！
      </Button>
    </Box>
  );
};
