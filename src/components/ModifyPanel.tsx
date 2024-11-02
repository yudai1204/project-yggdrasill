import { Box, VStack, Card, CardBody, Button } from "@chakra-ui/react";
import { useState } from "react";
import type { Time } from "@/types/metaData";

type Props = {
  setTimeValue: React.Dispatch<React.SetStateAction<Time | null>>;
  timeValue: Time | null;
};
export const ModifyPanel = (props: Props) => {
  const { setTimeValue, timeValue } = props;
  return (
    <Box>
      {/* <Card w={32} backdropFilter="blur(4px)" backgroundColor="#2D3748CC"> */}
      {/* <CardBody py={3}> */}
      <VStack spacing="0" borderWidth="1px" borderRadius="md" overflow="hidden">
        <Button
          variant={timeValue === "Noon" ? "solid" : "outlined"}
          width="full"
          colorScheme={timeValue === "Noon" ? "teal" : "gray"}
          onClick={() => setTimeValue("Noon")}
          borderRadius="0"
          _first={{ borderTopRadius: "md" }}
        >
          Noon
        </Button>
        <Button
          variant={timeValue === "Evening" ? "solid" : "outlined"}
          width="full"
          colorScheme={timeValue === "Evening" ? "teal" : "gray"}
          onClick={() => setTimeValue("Evening")}
          borderRadius="0"
        >
          Evening
        </Button>
        <Button
          variant={timeValue === "Night" ? "solid" : "outlined"}
          width="full"
          colorScheme={timeValue === "Night" ? "teal" : "gray"}
          onClick={() => setTimeValue("Night")}
          borderRadius="0"
          _last={{ borderBottomRadius: "md" }}
        >
          Night
        </Button>
      </VStack>
      {/* </CardBody> */}
      {/* </Card> */}
    </Box>
  );
};
