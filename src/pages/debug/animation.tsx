import { AnimationBase } from "@/components/AnimationBase";
import type { UserType } from "@/types/calibrate";

const currentUser: UserType = {
  connectedAt: 1730302409787,
  timeOffset: {
    value: 6,
    serverTime: 1730302409787,
    begin: 1730302409785,
  },
  type: "user",
  uuid: "7e3d8a44-47bf-4c3d-bc0a-f7a902149fbe",
  size: {
    width: 375,
    height: 667,
  },
  rawSize: {
    width: 375,
    height: 667,
  },
  rotation: 0,
  position: {
    x: 94.1432911282657,
    y: 1043.0430676402839,
  },
  zoom: 1.0659024473159162,
  ua: {
    browser: "Mobile Safari, 16.6",
    device: "mobile",
    engine: "WebKit",
    os: "iOS",
  },
  metadata: {
    gptAnalysis: {
      userName: "aaa",
      season: "Spring",
      location: "MagicalWonderland",
      time: "Noon",
      weather: "Sunny",
      flowerName: "桜",
      flowerColor: ["#673ab7", "#d81b60", "#ffeb3b"],
      flowerSize: "medium",
      treeType: "conifer",
      treeHeight: "large",
      treeTexture: "realistic",
      treeAge: "ancient",
    },
    answers: [
      "#673ab7",
      "aaa",
      "魚",
      "春",
      "おとぎの国",
      "散歩",
      "霧に包まれた山",
      "お風呂に入っている時",
      "宇宙旅行",
    ],
  },
  ready: true,
  ip: "::1",
};

const App = () => {
  return (
    <>
      <AnimationBase
        isDebug={true}
        isJoroMode={false}
        animationStartFrom={0}
        currentUser={currentUser}
      />
    </>
  );
};

export default App;
