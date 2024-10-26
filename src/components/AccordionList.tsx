import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Table,
  Tbody,
  Td,
  Tr,
  TableContainer,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { getColor, dispNum } from "@/util/util";

type ItemsProps = {
  items: any[];
};
export const AccordionList = (props: ItemsProps) => {
  const { items } = props;
  if (!items || items.length === 0) {
    return <p>No items</p>;
  }
  return (
    <Accordion>
      {items.map((item, idx) => (
        <AccordionItem key={item.uuid}>
          <h2>
            <AccordionButton>
              <Box
                as="span"
                flex="1"
                textAlign="left"
                color={
                  !item?.position || item.isConnected ? "green.500" : "red.500"
                }
              >
                {idx}: {item.uuid} :{" "}
                {!item?.position || item.isConnected
                  ? "Connected"
                  : "Disconnected"}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <TableContainer>
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Td>Size</Td>
                    <Td>
                      {item.size.width} x {item.size.height}
                    </Td>
                  </Tr>
                  {item?.position && (
                    <>
                      <Tr>
                        <Td>Position</Td>
                        <Td>
                          {dispNum(item.position.x)}, {dispNum(item.position.y)}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Zoom</Td>
                        <Td>x{dispNum(item.zoom)}</Td>
                      </Tr>
                      <Tr>
                        <Td>Rotation</Td>
                        <Td>{item.rotation} deg</Td>
                      </Tr>
                      <Tr>
                        <Td>Color</Td>
                        <Td>
                          <Box
                            backgroundColor={getColor(idx)[0]}
                            border={`2px solid ${getColor(idx)[1]}`}
                            color="#fff"
                          >
                            {getColor(idx).join(", ")}
                          </Box>
                        </Td>
                      </Tr>
                    </>
                  )}
                  <Tr>
                    <Td>ConnectedAt</Td>
                    <Td>
                      {format(
                        new Date(item.connectedAt),
                        "yyyy-MM-dd HH:mm:ss"
                      )}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
