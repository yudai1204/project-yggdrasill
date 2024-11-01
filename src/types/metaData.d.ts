export type Weather = "VerySunny" | "Sunny" | "Rainy" | "Cloudy" | "Snowy";
export type Time = "Noon" | "Evening" | "Night";
export type TreeType = "broadleaf" | "conifer"; // 紅葉樹・針葉樹
export type Location =
  | "MagicalWonderland"
  | "Game"
  | "City"
  | "VastLand"
  | "CountryTown"
  | "Forest"
  | "Beach"
  | "Moon"
  | "UnderTheSea"
  | "BaldMountain";
export type Season = "Spring" | "Summer" | "Autumn" | "Winter";
export type TreeTexture = "realistic" | "cartoon" | "pixel";
export type FlowerType =
  | "Hibiscus"
  | "CherryBlossom"
  | "Sunflower"
  | "Asaago"
  | "Gerbera"
  | "Momiji";

export interface GptAnalysis {
  userName: string;
  season: SetStateAction;
  location: Location;
  time: Time;
  weather: Weather;
  flowerName: string;
  flowerColor: string[];
  flowerSize: "small" | "medium" | "large";
  flowerType: FlowerType;
  treeType: TreeType;
  treeHeight: "small" | "large";
  treeTexture: TreeTexture;
  treeAge: "young" | "old" | "ancient";
}
