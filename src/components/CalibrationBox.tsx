import React, { useEffect, useState } from "react";
import { useInteractJS } from "../util/hooks";
import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Input,
  Checkbox,
} from "@chakra-ui/react";

type Position = {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
  rotate: number;
};

type Props = {
  position: Position;
  setPosition: (position: Position) => void;
  children?: React.ReactNode;
  onDragEnd: () => void;
};

export const CalibrationBox = (props: Props) => {
  const { position, setPosition, children, onDragEnd } = props;

  const interact = useInteractJS(
    {
      width: position.width,
      height: position.height,
    },
    () => {
      onDragEnd();
    }
  );

  useEffect(() => {
    setPosition({
      ...position,
      zoom: interact.position.width / position.width,
      x: interact.position.x,
      y: interact.position.y,
    });
  }, [interact.position]);

  useEffect(() => {
    interact.updatePosition({
      width: position.width * position.zoom,
      height: position.height * position.zoom,
      x: position.x,
      y: position.y,
    });
    setPosition({
      ...position,
      zoom: position.zoom,
    });
  }, [position.width, position.height]);

  const [isDisplaySupporter, setIsDisplaySupporter] = useState<boolean>(false);

  return (
    <Box>
      {/* <Button onClick={() => interact.enable()}>有効化</Button>
      <Button onClick={() => interact.disable()}>無効化</Button> */}
      {isDisplaySupporter && (
        <>
          <Box
            position="absolute"
            top={interact.position.y - 300}
            left={interact.position.x}
            h={interact.position.height + 600}
            w={interact.position.width}
            borderRight="2px solid #A9D0F5"
            borderLeft="2px solid #A9D0F5"
            transform={`rotate(${position.rotate}deg)`}
            zIndex={1}
          />
          <Box
            position="absolute"
            top={interact.position.y}
            left={interact.position.x - 300}
            h={interact.position.height}
            w={interact.position.width + 600}
            borderTop="2px solid #A9D0F5"
            borderBottom="2px solid #A9D0F5"
            transform={`rotate(${position.rotate}deg)`}
            zIndex={1}
          />
        </>
      )}
      <Box
        ref={interact.ref}
        style={{
          ...interact.style,
          border: "2px solid #A9D0F5",
          backgroundColor: "#0489B1",
        }}
        transform={`rotate(${position.rotate}deg)`}
        userSelect="none"
        overflow="hidden"
        zIndex={100}
      >
        <Box>{children}</Box>
        <Box>
          pos: {position.x}, {position.y}
        </Box>
        <Box>zoom: {position.zoom}</Box>
        <Box>
          width: {position.width}, height: {position.height}
        </Box>
        <Box>
          rawWidth: {interact.position.width}, rawHeight:{" "}
          {interact.position.height}
        </Box>
      </Box>
      <Box
        style={{
          ...interact.style,
          height: "fit-content",
          width: "200px",
        }}
        opacity={0.8}
        transform={`translate3D(${interact.position.width / 2 - 100}px, ${interact.position.height / 2 + 30}px,0)`}
        zIndex={100}
      >
        <Slider
          defaultValue={0}
          min={0}
          max={360}
          step={0.5}
          onChange={(value) => setPosition({ ...position, rotate: value })}
          onChangeEnd={() => onDragEnd()}
          w={200}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        rotate:
        <Input
          type="number"
          size="sm"
          w={100}
          backgroundColor="black"
          value={position.rotate}
          onChange={(e) => {
            setPosition({ ...position, rotate: Number(e.target.value) });
          }}
          onBlur={() => onDragEnd()}
        />
        <Checkbox onChange={(e) => setIsDisplaySupporter(e.target.checked)}>
          サポーター表示
        </Checkbox>
      </Box>
    </Box>
  );
};
