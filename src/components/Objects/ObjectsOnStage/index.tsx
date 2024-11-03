import { StageDecoration } from "@/types/metaData";
import { SnowMan } from "./SnowMan";

type Props = {
  decorationObject: StageDecoration | undefined;
};
export const ObjectsOnStage = (props: Props) => {
  const { decorationObject } = props;
  return <>{decorationObject === "SnowMan" && <SnowMan />}</>;
};
