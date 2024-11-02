import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import {
  Box,
  Heading,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import type { QrReaderType } from "@/types/calibrate";
import { sendJson } from "@/util/util";

// 倍率
// 数字を大きくすると、screenに表示されるスマホサイズが小さくなる

const initQRReader = () => {
  const qrReader: QrReaderType = {
    type: "qrReader",
    uuid: uuidv4(),
    value: "",
    size: 200,
    coordinates: [],
  };
  return qrReader;
};

const calculateDistance = (point1: Point, point2: Point): number => {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
};

type Point = {
  x: number;
  y: number;
};

type Corners = {
  topRight: Point;
  topLeft: Point;
  bottomRight: Point;
  bottomLeft: Point;
};

const QrScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const qrReaderBody = useRef<QrReaderType | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const [qrData, setQrData] = useState<string>("");
  const [corners, setCorners] = useState<Corners | null>(null);
  const [connectingStatus, setConnectingStatus] =
    useState<string>("Connecting...");
  const [uuid, setUuid] = useState<string>("None");

  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const [zoomConstant, setZoomConstant] = useState<number>(100);

  useEffect(() => {
    // const startVideo = async () => {
    //   try {
    //     const stream = await navigator.mediaDevices.getUserMedia({
    //       video: { facingMode: "environment" },
    //     });
    //     if (videoRef.current) {
    //       videoRef.current.srcObject = stream;
    //     }
    //   } catch (error) {
    //     console.error("Error accessing the camera", error);
    //   }
    // };

    const connectWebSocket = async () => {
      wsRef.current = new WebSocket(
        process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3210"
      );

      wsRef.current.onopen = () => {
        setConnectingStatus("Connected");

        // 接続処理
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const qrReader = initQRReader();
          sendJson(wsRef.current, qrReader, "init");
          setUuid(qrReader.uuid);
          qrReaderBody.current = qrReader;
        }
      };

      wsRef.current.onclose = () => {
        setConnectingStatus("Disconnected");
        console.log("WebSocket disconnected");

        setConnectingStatus("Reconnecting...");
        console.log("Attempting to reconnect in 1 seconds...");
        reconnectTimeout.current = setTimeout(() => {
          connectWebSocket();
        }, 1000); // 1秒後に再接続
      };

      wsRef.current.onerror = (err) => {
        console.error("WebSocket error: ", err);
        wsRef.current?.close();
      };
    };
    const fetchVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setVideoDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Error fetching video devices", error);
      }
    };

    fetchVideoDevices();
    connectWebSocket();
  }, []);

  useEffect(() => {
    const startVideo = async () => {
      if (!selectedDeviceId) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: selectedDeviceId },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera", error);
      }
    };

    startVideo();
  }, [selectedDeviceId]);

  const scanQRCode = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;

      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
      qrCode?.location;

      if (qrCode) {
        setQrData(qrCode.data);
        const newCorners = {
          topRight: qrCode.location.topRightCorner,
          topLeft: qrCode.location.topLeftCorner,
          bottomRight: qrCode.location.bottomRightCorner,
          bottomLeft: qrCode.location.bottomLeftCorner,
        };
        setCorners(newCorners);

        if (wsRef.current && qrReaderBody.current) {
          const width = calculateDistance(
            newCorners.topLeft,
            newCorners.topRight
          );
          const height = calculateDistance(
            newCorners.topLeft,
            newCorners.bottomLeft
          );

          // QRコードのサイズを計算
          // /50を変更することで適宜調整
          const size = (height * zoomConstant) / 2000;
          sendJson(
            wsRef.current,
            {
              ...qrReaderBody.current,
              value: qrCode.data,
              coordinates: qrCode.location,
              size,
            },
            "qrData"
          );
        }

        // QRコードの四隅を描画
        context.beginPath();
        context.moveTo(
          qrCode.location.topLeftCorner.x,
          qrCode.location.topLeftCorner.y
        );
        context.lineTo(
          qrCode.location.topRightCorner.x,
          qrCode.location.topRightCorner.y
        );
        context.lineTo(
          qrCode.location.bottomRightCorner.x,
          qrCode.location.bottomRightCorner.y
        );
        context.lineTo(
          qrCode.location.bottomLeftCorner.x,
          qrCode.location.bottomLeftCorner.y
        );
        context.closePath();
        context.strokeStyle = "green";
        context.lineWidth = 2;
        context.stroke();
      } else {
        setQrData("");
        setCorners(null);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(scanQRCode, 500); // 500
    return () => clearInterval(interval);
  }, [zoomConstant]);

  return (
    <Box>
      <Heading as="h1" size="lg">
        QR Code Scanner
      </Heading>
      <Box my={3}>
        カメラを選択:
        <select
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          value={selectedDeviceId || ""}
        >
          {videoDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </select>
      </Box>
      <Box my={3}>
        ZOOM倍率: (大きくするとスマホも大きくなる)
        <NumberInput
          w={32}
          value={zoomConstant}
          onChange={(value) =>
            setZoomConstant(parseInt(value) <= 0 ? 1 : parseInt(value))
          }
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Box>
      <Box width={1280} bg="gray.200" position="relative">
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            position: "absolute",
            top: 0,
            left: 0,
            width: 1280,
            height: "auto",
          }}
        ></canvas>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            display: "block",
            width: 1280,
            height: "auto",
            opacity: 0,
          }}
        ></video>
      </Box>
      <p style={{ color: connectingStatus === "Connected" ? "#2a4" : "#a24" }}>
        Status: {connectingStatus}
      </p>
      <p>UUID: {uuid}</p>
      {!qrData && <p>QRコードが見つかりません</p>}
      {qrData && <p>QRコードデータ: {qrData}</p>}
      {corners && (
        <div>
          <h4>QRコード四隅の座標:</h4>
          <p>Top Left: {`(${corners.topLeft.x}, ${corners.topLeft.y})`}</p>
          <p>Top Right: {`(${corners.topRight.x}, ${corners.topRight.y})`}</p>
          <p>
            Bottom Left: {`(${corners.bottomLeft.x}, ${corners.bottomLeft.y})`}
          </p>
          <p>
            Bottom Right:{" "}
            {`(${corners.bottomRight.x}, ${corners.bottomRight.y})`}
          </p>
        </div>
      )}
    </Box>
  );
};

export default QrScanner;
