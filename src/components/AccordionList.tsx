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
import { DeviceType, ScreenType, UserType } from "@/types/calibrate";
import { questionSummary } from "@/layouts/form/questions";

type ItemsProps = {
  items: (UserType | ScreenType | DeviceType)[];
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
                  item?.type !== "device" || item.isConnected
                    ? "green.500"
                    : "red.500"
                }
              >
                {idx}: {item.uuid} :{" "}
                {item?.type !== "device" || item.isConnected
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
                  {item.type !== "screen" && (
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
                  {item.type === "user" && item.ua && (
                    <>
                      <Tr>
                        <Td>Browser</Td>
                        <Td>{item.ua.browser}</Td>
                      </Tr>
                      <Tr>
                        <Td>Device</Td>
                        <Td>{item.ua.device}</Td>
                      </Tr>
                      <Tr>
                        <Td>Engine</Td>
                        <Td>{item.ua.engine}</Td>
                      </Tr>
                      <Tr>
                        <Td>OS</Td>
                        <Td>{item.ua.os}</Td>
                      </Tr>
                    </>
                  )}
                  {item.type === "user" && item.ip && (
                    <Tr>
                      <Td>IP</Td>
                      <Td>{item.ip}</Td>
                    </Tr>
                  )}
                  {item.type === "user" && item.metadata && (
                    <>
                      <Tr>
                        <Td>GPT Analysis</Td>
                        <Td>
                          {Object.entries(item.metadata.gptAnalysis).map(
                            ([key, value]: [string, string | string[]]) =>
                              typeof value === "string" ? (
                                <Box key={key}>
                                  {key}: {value}
                                </Box>
                              ) : (
                                <Box key={key}>
                                  {key}:{" "}
                                  <Box display="flex">
                                    {value.map((v) => (
                                      <Box
                                        key={v}
                                        bgColor={v}
                                        color="#fff"
                                        fontWeight="bold"
                                        style={{
                                          WebkitTextStroke: "1px black",
                                        }}
                                      >
                                        {v}
                                      </Box>
                                    ))}
                                  </Box>
                                </Box>
                              )
                          )}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Answers</Td>
                        <Td>
                          {item.metadata.answers.map((answer, idx) => (
                            <Box key={idx}>
                              {questionSummary.jp[idx]}: {answer}
                            </Box>
                          ))}
                        </Td>
                      </Tr>
                    </>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
