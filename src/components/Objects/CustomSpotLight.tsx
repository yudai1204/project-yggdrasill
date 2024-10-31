import { SpotLight } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef } from "react";

type Props = {
  targetPos?: THREE.Vector3;
  position?: THREE.Vector3;
};
export const CustomSpotLight = (props: Props) => {
  const {
    position = new THREE.Vector3(1, 20, 2),
    targetPos = new THREE.Vector3(0, 0, 0),
  } = props;

  const light = useRef<THREE.SpotLight>(null);

  useEffect(() => {
    if (light.current) {
      light.current.position.copy(position);
      light.current.target.position.copy(targetPos);
      light.current.target.updateMatrixWorld();
    }
  }, [position, targetPos]);

  return (
    <SpotLight
      color={"#777777"}
      opacity={0.5}
      ref={light}
      position={[1, 20, 2]}
      distance={1000}
      angle={40}
      attenuation={5}
      anglePower={5} // Diffuse-cone anglePower (default: 5)
    ></SpotLight>
  );
};
