import { AnimationBase } from "@/components/AnimationBase";
import { Box } from "@chakra-ui/react";
import { DeviceType } from "@/types/calibrate";

type Props = {
  isDebug: boolean;
  devices: DeviceType[];
};
export const ScreenAnimation = (props: Props) => {
  const { isDebug, devices } = props;
  return (
    <>
      <AnimationBase isDebug={isDebug} logo />
      {isDebug &&
        devices.map((device, idx) => {
          if (device.isConnected) {
            return (
              <Box
                key={device.uuid}
                position="absolute"
                top={device.position.y}
                left={device.position.x}
                width={device.size.width * device.zoom}
                height={device.size.height * device.zoom}
                border="2px solid #fff"
                color="#fff"
                opacity={0.4}
                fontSize={device.size.width * device.zoom * 0.3}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {idx}
              </Box>
            );
          }
        })}
    </>
  );
};
