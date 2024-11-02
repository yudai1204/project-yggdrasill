import { Box } from "@chakra-ui/react";
import { WaitingAnimation } from "@/components/WaitingAnimation";

export const WaitingDevice = () => {
  return (
    <Box>
      <Box
        zIndex={1000}
        position="absolute"
        backgroundColor="#FFFa"
        borderRadius={40}
        boxShadow={"0 0 10px 0px #FFF"}
        left="50%"
        top="50%"
        transform="translate(-50%, -50%)"
      >
        <img
          src="/QR_180017.svg"
          alt="QR"
          style={{ width: "min(75vw, 75vh)" }}
        />
      </Box>
      {/* <WaitingAnimation /> */}
    </Box>
  );
};
