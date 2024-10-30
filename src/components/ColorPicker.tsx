import {
  SliderPicker,
  CirclePicker,
  type ColorChangeHandler,
} from "react-color";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Center,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Button,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { getNearestColor } from "@/util/util";

type Props = {
  onChange: (color: string) => void;
  onClickOk?: () => void;
};
export const ColorPicker = (props: Props) => {
  const { onChange, onClickOk = () => {} } = props;
  const [color, setColor] = useState<string>("#fe5060");
  const [colorName, setColorName] = useState<string | null>(null);
  const [textColor, setTextColor] = useState<string>("#000000");

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // set random color on first render
    const randomColor =
      `#${(Math.floor(Math.random() * 128) + 128).toString(16).padStart(2, "0")}` +
      `${(Math.floor(Math.random() * 128) + 128).toString(16).padStart(2, "0")}` +
      `${(Math.floor(Math.random() * 128) + 128).toString(16).padStart(2, "0")}`;
    setColor(randomColor);
    setColorName(getNearestColor(randomColor)?.name || "");
  }, []);

  useEffect(() => {
    onChange(color);
  }, [color]);

  const handleChange: ColorChangeHandler = (color, event) => {
    setTextColor(color.hsl.l > 0.55 ? "#000" : "#fff");
    setColor(color.hex);
    setColorName(getNearestColor(color.hex)?.name || "");
  };
  return (
    <>
      <Popover variant="picker">
        <PopoverTrigger>
          <Button
            aria-label={color}
            background={color}
            height="64px"
            width="256px"
            padding={0}
            minWidth="unset"
            borderRadius={3}
            _hover={{ background: color, opacity: 0.8 }}
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow bg={color} />
          <PopoverCloseButton color="white" ref={closeButtonRef} />
          <PopoverHeader
            height="100px"
            backgroundColor={color}
            color={textColor}
            borderTopLeftRadius={5}
            borderTopRightRadius={5}
          >
            <VStack height="100%" justifyContent="center">
              <Box fontWeight="bold" fontSize="120%">
                {colorName}
              </Box>
              <Box>{color}</Box>
            </VStack>
          </PopoverHeader>
          <PopoverBody>
            <Box>
              <Center mt={6}>
                <CirclePicker onChange={handleChange} color={color} />
              </Center>

              <Box mt={6}>
                <SliderPicker onChange={handleChange} color={color} />
              </Box>

              <Box mt={6} mb={1}>
                <Button
                  onClick={() => {
                    closeButtonRef.current?.click();
                    onClickOk();
                  }}
                  width="100%"
                >
                  OK
                </Button>
              </Box>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
