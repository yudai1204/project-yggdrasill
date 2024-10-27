import { Box } from "@chakra-ui/react";
import { User } from "@/layouts/main/user";

export default function Home() {
  return (
    <Box
      bgColor="#1A202C"
      color="#DCDDDD"
      w="100%"
      h="100lvh"
      overflow="hidden"
    >
      <User />
    </Box>
  );
}
