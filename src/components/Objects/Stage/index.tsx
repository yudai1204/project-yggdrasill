import { Hageyama, SnowHageyama } from "./Hageyama";
import { CountryTown, SnowCountryTown } from "./CountryTown";
import type { Location, Season, TreeTexture } from "@/types/metaData";
import { VastLand } from "./VastLand";
import { Moon, RealMoon } from "./Moon";
import { UnderTheSea } from "./UnderTheSea";

type Props = {
  location: Location;
  season: Season;
  treeTexture: TreeTexture;
};

export const Stage = (props: Props) => {
  const { location, season, treeTexture } = props;
  switch (location) {
    case "MagicalWonderland":
    case "Game":
    case "City":
    case "VastLand":
      return <VastLand />;
    case "CountryTown":
      if (season === "Winter") {
        return <SnowCountryTown />;
      } else {
        return <CountryTown />;
      }
    case "Forest":
    case "Beach":
    case "Moon":
      if (treeTexture === "realistic") {
        return <RealMoon />;
      }
      return <Moon />;
    case "UnderTheSea":
      return <UnderTheSea />;
    case "BaldMountain":
      if (season === "Winter") {
        return <SnowHageyama />;
      } else {
        return <Hageyama />;
      }
    default:
      return <></>;
  }
};
