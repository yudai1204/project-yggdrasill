import { AnimationBase } from "@/components/AnimationBase";
import type { UserType } from "@/types/calibrate";
import { Time } from "@/types/metaData";
import { useEffect, useMemo, useState } from "react";

const App = () => {
  const duser: UserType = useMemo(
    () => ({
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
          season: "Summer",
          location: "BaldMountain",
          time: "Evening",
          weather: "Sunny",
          flowerName: "桜",
          flowerColor: ["#673ab7", "#d81b60", "#ffeb3b"],
          flowerSize: "medium",
          flowerType: "Sunflower",
          treeType: "broadleaf",
          treeHeight: "large",
          treeTexture: "realistic",
          treeAge: "ancient",
        },
        answers: [
          "#673ab7",
          "侑大",
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
    }),
    []
  );

  const [currentUser, setCurrentUser] = useState<UserType>(duser);

  const times: Time[] = ["Noon", "Evening", "Night"];

  let timeIndex = 0;

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentUser({
  //       ...duser,
  //       // @ts-ignore
  //       metadata: {
  //         ...duser.metadata,
  //         gptAnalysis: {
  //           // @ts-ignore
  //           ...duser.metadata.gptAnalysis,
  //           time: times[timeIndex++ % 3],
  //         },
  //       },
  //     });
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: "100vh",
          zIndex: -1,
        }}
      >
        <AnimationBase
          isDebug={false}
          isJoroMode={false}
          animationStartFrom={0}
          currentUser={currentUser}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          color: "white",
          backgroundColor: "red",
          padding: "10px",
        }}
      >
        X-, Y+
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          color: "white",
          backgroundColor: "red",
          padding: "10px",
        }}
      >
        X+
      </div>
      <div
        style={{
          position: "absolute",
          top: "calc(100vh - 45px)",
          left: 0,
          color: "white",
          backgroundColor: "red",
          padding: "10px",
        }}
      >
        Y-
      </div>
      <div
        style={{
          position: "absolute",
          top: "calc(100vh - 45px)",
          right: 0,
          color: "white",
          backgroundColor: "red",
          padding: "10px",
        }}
      >
        X+, Y-
      </div>
    </div>
  );
};

export default App;
