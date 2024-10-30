import { Box } from "@chakra-ui/react";
import { Form } from "@/layouts/form";
export default function Home() {
  return (
    <Box
      bgColor="#1A202C"
      color="#DCDDDD"
      w="100%"
      h="100lvh"
      overflow="hidden"
    >
      <title>Project Yggdrasil</title>
      <Form />
    </Box>
  );
}
