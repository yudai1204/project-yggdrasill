import dynamic from "next/dynamic";
import p5Types from "p5";
import { useRef } from "react";
import type { TreeMetaData, FlowerMetaData } from "../types/metaData";

const Sketch = dynamic(import("react-p5"), {
  loading: () => <></>,
  ssr: false,
});

// interface Tree extends TreeMetaData {
//   flowers: Flower[];
// }

// class Yggdrasill implements Tree {
//   name: string;
//   uuid: string;
//   createdAt: string;
//   growthStartedAt: string;
//   treeType: string;
//   flowerTypes: FlowerMetaData[];

//   constructor() {
//     this.name = "Yggdrasill";
//     this.uuid = "yggdrasill";
//     this.createdAt = new Date().toISOString();
//     this.growthStartedAt = new Date().toISOString();
//     this.treeType = "Yggdrasill";
//     this.flowerTypes = [];
//   }
// }

export const P5Canvas = () => {
  let vid;

  const preload = (p5: p5Types) => {};
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    const windowSize = Math.sqrt(
      p5.windowHeight * p5.windowHeight + p5.windowWidth * p5.windowWidth
    );

    p5.createCanvas(windowSize, windowSize).parent(canvasParentRef);
    p5.noStroke();

    p5.rectMode(p5.CENTER);

    vid = p5.createVideo("/tree.mp4");
    vid.elt.muted = true;
    vid.loop();
  };

  const draw = (p5: p5Types) => {
    p5.background(0, 0, 0);
  };

  const windowResized = (p5: p5Types) => {
    const windowSize = Math.sqrt(
      p5.windowHeight * p5.windowHeight + p5.windowWidth * p5.windowWidth
    );
    p5.resizeCanvas(windowSize, windowSize);
  };

  return (
    <Sketch
      preload={preload as any}
      setup={setup as any}
      draw={draw as any}
      windowResized={windowResized as any}
    />
  );
};
