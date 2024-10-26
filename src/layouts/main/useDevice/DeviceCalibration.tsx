import { Button } from "@chakra-ui/react";
import type { DeviceType } from "@/types/calibrate";

type Props = {
  connectingStatus: string;
  deviceBodyRef: React.MutableRefObject<DeviceType | null>;
  deviceNum: number | null;
  deviceBody: DeviceType | null;
  resetPos: () => void;
};
export const DeviceCalibration = (props: Props) => {
  const { connectingStatus, deviceBodyRef, deviceNum, deviceBody, resetPos } =
    props;
  return (
    <>
      <h1>Device</h1>
      <h2>Status: {connectingStatus}</h2>
      {deviceBodyRef.current && deviceBody && (
        <>
          <h3>Device Information</h3>
          <p style={{ fontWeight: "bold" }}>Device Number: {deviceNum}</p>
          <p>Device UUID: {deviceBodyRef.current.uuid}</p>
          <p>
            Device Size: {deviceBodyRef.current.size.width}x
            {deviceBodyRef.current.size.height}
          </p>
          <p>Device Rotation: {deviceBodyRef.current.rotation}</p>
          <p>
            Device Position: {deviceBodyRef.current.position.x},{" "}
            {deviceBodyRef.current.position.y}
          </p>
          <p>Device Zoom: {deviceBodyRef.current.zoom}</p>
          <p>Connected At: {deviceBodyRef.current.connectedAt}</p>
        </>
      )}
      <Button onClick={resetPos}>Reset Position</Button>
    </>
  );
};
