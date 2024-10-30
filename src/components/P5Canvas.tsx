import dynamic from "next/dynamic";
import p5Types from "p5";
import { useRef } from "react";

const Sketch = dynamic(import("react-p5"), {
  loading: () => <></>,
  ssr: false,
});

type Flower = {
  x: number;
  y: number;
  r: number;
  type: number;
  rotateDirection: 1 | -1;
};

type Props = {
  colors: string[];
};
export const P5Canvas = (props: Props) => {
  const flowersRef = useRef<Flower[]>([]);
  const { colors: hex } = props;

  const hexToRgb = (hexes: string[]) => {
    return hexes.map((hex) => {
      // 先頭の#を削除
      hex = hex.replace(/^#/, "");
      // 3桁のhexを6桁に変換
      if (hex.length === 3) {
        hex = hex
          .split("")
          .map((char) => char + char)
          .join("");
      }
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return { r, g, b };
    });
  };

  const colors = hexToRgb(hex);

  // const preload = (p5: p5Types) => {};

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    p5.angleMode(p5.DEGREES);
    p5.frameRate(12);

    const flowers: Flower[] = [];
    for (let i = 0; i < 6; i++) {
      flowers.push({
        x: p5.random(p5.width),
        y: p5.random(p5.height),
        r: p5.random(20, 70),
        type: p5.floor(p5.random(1, 4)),
        rotateDirection: p5.random() > 0.5 ? 1 : -1,
      });
    }
    // 近すぎる花を削除
    for (let i = 0; i < flowers.length; i++) {
      for (let j = i + 1; j < flowers.length; j++) {
        if (
          p5.dist(flowers[i].x, flowers[i].y, flowers[j].x, flowers[j].y) < 150
        ) {
          flowers.splice(j, 1);
          j--;
        }
      }
    }
    flowersRef.current = flowers;
  };

  const draw = (p5: p5Types) => {
    p5.noStroke();
    p5.clear();
    for (const flower of flowersRef.current ?? []) {
      for (const j in colors) {
        const color = colors[j];
        p5.fill(color.r, color.g, color.b);
        drawFlower(
          flower.x,
          flower.y,
          flower.r - Number(j) * flower.r * 0.2,
          flower.type,
          flower.rotateDirection
        );
      }
    }

    function drawFlower(
      ox: number,
      oy: number,
      r: number,
      type: number,
      rotateDirection: 1 | -1
    ) {
      if (type === 1) {
        drawFlower1(ox, oy, r, rotateDirection);
      } else if (type === 2) {
        drawFlower2(ox, oy, r, rotateDirection);
      } else if (type === 3) {
        drawFlower3(ox, oy, r, rotateDirection);
      }
    }

    // 花1
    function drawFlower1(ox: number, oy: number, r: number, rd: 1 | -1) {
      p5.push();
      p5.translate(ox, oy);
      p5.rotate((rd * p5.frameCount) % 360);

      p5.beginShape();
      for (let theta = 0; theta < 360; theta++) {
        let R = r * p5.abs(p5.sin(theta * 4)) + r / 2;
        let x = R * p5.cos(theta);
        let y = R * p5.sin(theta);

        p5.curveVertex(x, y);
      }
      p5.endShape(p5.CLOSE);

      p5.pop();
    }

    // 花2
    function drawFlower2(ox: number, oy: number, or: number, rd: 1 | -1) {
      let petalNum = 5; // 花びらの数

      p5.push();
      p5.translate(ox, oy);
      p5.rotate((rd * p5.frameCount + 90) % 360);

      p5.beginShape();
      for (let theta = 0; theta < 360; theta++) {
        let A = (petalNum / 180) * theta;
        let md = p5.floor(A) % 2;
        let r = p5.pow(-1, md) * (A - p5.floor(A)) + md;
        let R = r + 2 * calcH(r);

        let x = or * R * p5.cos(theta);
        let y = or * R * p5.sin(theta);

        p5.vertex(x, y);
      }
      p5.endShape(p5.CLOSE);

      p5.pop();
    }

    // 花3
    function drawFlower3(ox: number, oy: number, or: number, rd: 1 | -1) {
      p5.push();
      p5.translate(ox, oy);
      p5.rotate((rd * p5.frameCount) % 360);

      p5.beginShape();
      for (let theta = 0; theta < 360; theta++) {
        let A = (p5.sin(theta * 5) + p5.cos(theta * 10)) / 2.0;
        let B = A * 0.5 + 1.0;
        let R = or * B;

        let x = R * p5.sin(theta + 90);
        let y = R * p5.cos(theta + 90);

        p5.vertex(x, y);
      }
      p5.endShape(p5.CLOSE);

      p5.pop();
    }

    function calcH(x: number) {
      if (x < 0.8) {
        return 0;
      } else {
        return 0.8 - x;
      }
    }
  };

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  return (
    <Sketch
      // preload={preload as any}
      setup={setup as any}
      draw={draw as any}
      windowResized={windowResized as any}
    />
  );
};
