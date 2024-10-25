import { useEffect, useState } from "react";
import _ from "lodash";

// Windowがリサイズされたときに、そのサイズを返す
// 0.3秒の遅延があるが、リサイズ時に何度も関数が呼ばれるのを防ぐため

export const useWindowSize = (
  windowRef: React.RefObject<HTMLDivElement>,
  delay: number = 300
) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const handleWindowResize = _.debounce(() => {
    if (!windowRef.current) return;
    const { width, height } = windowRef.current.getBoundingClientRect();
    setWindowSize({ width, height });
  }, delay);

  useEffect(() => {
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return windowSize;
};
