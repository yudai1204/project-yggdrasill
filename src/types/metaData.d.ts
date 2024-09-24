export interface FlowerMetaData {
  name: string;
  uuid: string;
  createdAt: string;
  growthStartedAt: string;
  flowerType: string;
  color: string[];
}

export interface TreeMetaData {
  name: string;
  uuid: string;
  createdAt: string;
  growthStartedAt: string;
  treeType: string;
  flowerTypes: FlowerMetaData[];
}
