import { Box, Select, Button, VStack } from "@chakra-ui/react";

type Props = {
  setDevice: (device: string) => void;
  device: string;
  connect: () => void;
};
export const StartCalibration = ({ setDevice, device, connect }: Props) => {
  return (
    <Box maxW={400} mx="auto" mt={20}>
      <VStack spacing={4}>
        <Box>このデバイスを何として扱うか選択してください。</Box>
        <Select onChange={(e) => setDevice(e.target.value)} value={device}>
          <option value="screen">スクリーン</option>
          <option value="manager">管理画面</option>
          <option value="device">マスク(タブレット端末)</option>
          <option value="user">ユーザ端末</option>
        </Select>
        <Button onClick={connect}>接続開始</Button>
      </VStack>
    </Box>
  );
};
