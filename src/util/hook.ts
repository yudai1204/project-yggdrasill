import { useRef, useEffect, useState, CSSProperties } from "react";
import interact from "interactjs";

type Partial<T> = {
  [P in keyof T]?: T[P];
};

const initPosition = {
  width: 100,
  height: 100,
  x: 0,
  y: 0,
};

/**
 * HTML要素を動かせるようにする
 * 返り値で所得できるrefと、styleをそれぞれ対象となるHTML要素の
 * refとstyleに指定することで、そのHTML要素のリサイズと移動が可能になる
 * @param position HTML要素の初期座標と大きさ、指定されない場合はinitPositionで指定された値になる
 */
export function useInteractJS(
  position: Partial<typeof initPosition> = initPosition,
  onDragEnd: () => void
) {
  const [_position, setPosition] = useState({
    ...initPosition,
    ...position,
  });
  const [isEnabled, setEnable] = useState(true);

  const interactRef = useRef(null);
  let { x, y, width, height } = _position;

  const enable = () => {
    if (interactRef?.current) {
      interact(interactRef?.current as unknown as HTMLElement)
        .draggable({
          inertia: false,
        })
        .resizable({
          // resize from all edges and corners
          edges: { left: true, right: true, bottom: true, top: true },
          preserveAspectRatio: true,
          inertia: false,
          modifiers: [
            interact.modifiers.aspectRatio({
              ratio: "preserve",
            }),
          ],
        })
        .on("dragmove", (event) => {
          setPosition((prev) => ({
            width: prev.width,
            height: prev.height,
            x: prev.x + event.dx,
            y: prev.y + event.dy,
          }));
        })
        .on("dragend", () => {
          onDragEnd();
        })
        .on("resizemove", (event) => {
          width = event.rect.width;
          height = event.rect.height;
          setPosition((prev) => ({
            x: prev.x + event.deltaRect.left,
            y: prev.y + event.deltaRect.top,
            width,
            height,
          }));
        })
        .on("resizeend", () => {
          onDragEnd();
        });
    }
  };

  const disable = () => {
    if (interactRef?.current) {
      interact(interactRef?.current as unknown as HTMLElement).unset();
    }
  };

  useEffect(() => {
    if (isEnabled) {
      enable();
    } else {
      disable();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled]);

  useEffect(() => {
    return disable;
  }, []);

  return {
    ref: interactRef,
    style: {
      top: _position.y + "px",
      left: _position.x + "px",
      width: _position.width + "px",
      height: _position.height + "px",
      position: "absolute" as CSSProperties["position"],
    },
    position: _position,
    updatePosition: setPosition,
    isEnabled,
    enable: () => setEnable(true),
    disable: () => setEnable(false),
  };
}
