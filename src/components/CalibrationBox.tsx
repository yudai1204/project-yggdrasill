import React, { useEffect, useState, useMemo } from "react";
import { useInteractJS } from "../util/hooks";
import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Input,
  Checkbox,
  Grid,
  Heading,
} from "@chakra-ui/react";
import { dispNum, getColor } from "@/util/util";

type Position = {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
  rotate: number;
  rawWidth: number;
  rawHeight: number;
};

type Props = {
  position: Position;
  setPosition: (position: Position) => void;
  children?: React.ReactNode;
  onDragEnd: () => void;
  idxNum: number;
};

export const CalibrationBox = (props: Props) => {
  const { position, setPosition, children, onDragEnd, idxNum } = props;

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
      rawWidth: interact.position.width,
      rawHeight: interact.position.height,
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
  }, [position.width, position.height, position.x, position.y]);

  const [isDisplaySupporter, setIsDisplaySupporter] = useState<boolean>(false);

  const colors = useMemo(() => {
    return idxNum ? getColor(idxNum) : ["#036785", "#a9d0f5"];
  }, [idxNum]);

  return (
    <Box opacity={isDisplaySupporter ? 1 : 0.8}>
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
            borderRight={`2px solid ${colors[1]}`}
            borderLeft={`2px solid ${colors[1]}`}
            transform={`rotate(${position.rotate}deg)`}
            zIndex={1}
          />
          <Box
            position="absolute"
            top={interact.position.y}
            left={interact.position.x - 300}
            h={interact.position.height}
            w={interact.position.width + 600}
            borderTop={`2px solid ${colors[1]}`}
            borderBottom={`2px solid ${colors[1]}`}
            transform={`rotate(${position.rotate}deg)`}
            zIndex={1}
          />
        </>
      )}
      <Box
        ref={interact.ref}
        style={{
          ...interact.style,
          border: `2px solid ${colors[1]}`,
          backgroundColor: colors[0],
        }}
        transform={`rotate(${position.rotate}deg)`}
        userSelect="none"
        overflow="hidden"
        zIndex={100}
        padding={2}
      >
        <Box>{children}</Box>

        <Heading as="h3" size="xl" textAlign="center">
          {idxNum}
        </Heading>
        <Grid
          templateColumns="70px 1fr"
          opacity={0.8}
          marginTop={4}
          mx="auto"
          w="fit-content"
          minW="200px"
        >
          <Box>pos:</Box>
          <Box>
            {dispNum(position.x)}, {dispNum(position.y)}
          </Box>
          <Box>zoom:</Box>
          <Box>{dispNum(position.zoom)}</Box>
          <Box>aspect:</Box>
          <Box>
            {dispNum(position.width)} x {dispNum(position.height)}
          </Box>
          <Box>size:</Box>
          <Box>
            {dispNum(interact.position.width)} x{" "}
            {dispNum(interact.position.height)}
          </Box>
        </Grid>
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
