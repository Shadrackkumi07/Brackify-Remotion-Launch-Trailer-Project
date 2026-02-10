import "./index.css";
import { Composition } from "remotion";
import { BrackifyLaunch } from "./components/BrackifyLaunch";
import { BrackifyLaunchMobile } from "./components/BrackifyLaunchMobile";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main Launch Video - 42 seconds (1920x1080) */}
      <Composition
        id="BrackifyLaunch"
        component={BrackifyLaunch}
        durationInFrames={1260}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Portrait/Mobile version (1080x1920) */}
      <Composition
        id="BrackifyLaunchMobile"
        component={BrackifyLaunchMobile}
        durationInFrames={1260}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
