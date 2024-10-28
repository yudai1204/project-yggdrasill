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
  time: "Noon" | "Evening" | "Night";
  weather: "VerySunny" | "Sunny" | "Rainy" | "Cloudy" | "Snowy";
  flowerName: string;
  flowerColor: string[];
  flowerSize: "small" | "medium" | "large";
  treeType: "broadleaf" | "conifer"; // 紅葉樹・針葉樹
  treeHeight: "small" | "large";
  treeTexture: "realistic" | "cartoon" | "pixel";
  treeAge: "young" | "old" | "ancient";
}
