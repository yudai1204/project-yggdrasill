import colorNameList from "color-name-list";
import nearestColor from "nearest-color";

export const getScreenSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export const sendJson = (ws: WebSocket | null, data: any, type: string) => {
  if (!ws) {
    console.error("WebSocket is not connected! Data not sent.", type, data);
    return;
  }
  ws.send(
    JSON.stringify({
      head: {
        type,
      },
      body: data,
    })
  );
};

export const dispNum = (num: number) => {
  if (num === null) return "null";
  if (num === undefined) return "undefined";
  if (isNaN(num)) return "NaN";
  if (num === 0) return "0";
  if (num < 1 && num > -1) return num.toFixed(2);
  return num.toFixed(1);
};

export const getColor = (num: number) => {
  const colors = [
    ["#036785", "#a9d0f5"],
    ["#3b0385", "#dda9f5"],
    ["#850333", "#f5a9b2"],
    ["#856f03", "#eff5a9"],
    ["#038507", "#a9f5be"],
    ["#034085", "#f5e4a9"],
    ["#620385", "#abf5a9"],
    ["#85030c", "#a9e8f5"],
    ["#748503", "#c5a9f5"],
    ["#03852e", "#f5a9ca"],
  ];
  return colors[num % colors.length];
};

export const calculateTimeOffset = (timeOffset: {
  value: number;
  begin: number;
  serverTime: number;
}) => {
  return (
    new Date().getTime() / 2 - timeOffset.serverTime + timeOffset.begin / 2
  );
};

export const getNearestColor = (hex: string) => {
  const colors = colorNameList.reduce(
    (o, { name, hex }) => Object.assign(o, { [name]: hex }),
    {}
  );
  const nearest = nearestColor.from(colors);
  return nearest(hex);
};

export const generateTintColors = (
  hex: string,
  numberOfTints: number
): string[] => {
  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    );
  };

  const [r, g, b] = hexToRgb(hex);
  const tints = [];

  for (let i = 1; i <= numberOfTints; i++) {
    const factor = (0.9 * i) / (numberOfTints + 1);
    const newR = Math.round(r + (255 - r) * factor);
    const newG = Math.round(g + (255 - g) * factor);
    const newB = Math.round(b + (255 - b) * factor);
    tints.push(rgbToHex(newR, newG, newB));
  }

  return tints;
};

export const rmvCaptl = (str: string | undefined, toLower = true) => {
  if (!str) return "NO REPLACER";
  if (toLower) {
    return str.replace(/([A-Z])/g, " $1").toLowerCase();
  }
  return str.replace(/([A-Z])/g, " $1");
};
