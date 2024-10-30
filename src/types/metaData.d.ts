export type Weather = "VerySunny" | "Sunny" | "Rainy" | "Cloudy" | "Snowy";
export type Time = "Noon" | "Evening" | "Night";
export type TreeType = "broadleaf" | "conifer"; // 紅葉樹・針葉樹

export interface GptAnalysis {
  userName: string;
  season: "Spring" | "Summer" | "Autumn" | "Winter";
  location:
    | "MagicalWonderland"
    | "Game"
    | "City"
    | "Forest"
    | "Beach"
    | "Moon"
    | "UnderTheSea";
  time: Time;
  weather: Weather;
  flowerName: string;
  flowerColor: string[];
  flowerSize: "small" | "medium" | "large";
  treeType: TreeType;
  treeHeight: "small" | "large";
  treeTexture: "realistic" | "cartoon" | "pixel";
  treeAge: "young" | "old" | "ancient";
}
