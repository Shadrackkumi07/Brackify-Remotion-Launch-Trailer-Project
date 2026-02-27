import { Composition, staticFile } from "remotion";
import { Scene, myCompSchema } from "./Scene";
import { getMediaMetadata } from "./helpers/get-media-metadata";
import {
  BRACKIFY_NOVA_DURATION,
  BRACKIFY_NOVA_FPS,
  BrackifyLaunchNova,
  BrackifyLaunchNovaMobile,
} from "./components/BrackifyLaunchNova";

// Welcome to the Remotion Three Starter Kit!
// Two compositions have been created, showing how to use
// the `ThreeCanvas` component and the `useVideoTexture` hook.

// You can play around with the example or delete everything inside the canvas.

// Remotion Docs:
// https://remotion.dev/docs

// @remotion/three Docs:
// https://remotion.dev/docs/three

// React Three Fiber Docs:
// https://docs.pmnd.rs/react-three-fiber/getting-started/introduction

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Scene"
        component={Scene}
        fps={30}
        durationInFrames={300}
        width={1280}
        height={720}
        schema={myCompSchema}
        defaultProps={{
          deviceType: "phone",
          phoneColor: "rgba(110, 152, 191, 0.00)" as const,
          baseScale: 1,
          mediaMetadata: null,
          videoSrc: null,
        }}
        calculateMetadata={async ({ props }) => {
          const videoSrc =
            props.deviceType === "phone"
              ? staticFile("phone.mp4")
              : staticFile("tablet.mp4");

          const mediaMetadata = await getMediaMetadata(videoSrc);

          return {
            props: {
              ...props,
              mediaMetadata,
              videoSrc,
            },
          };
        }}
      />
      <Composition
        id="BrackifyLaunchNova"
        component={BrackifyLaunchNova}
        durationInFrames={BRACKIFY_NOVA_DURATION}
        fps={BRACKIFY_NOVA_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="BrackifyLaunchNovaMobile"
        component={BrackifyLaunchNovaMobile}
        durationInFrames={BRACKIFY_NOVA_DURATION}
        fps={BRACKIFY_NOVA_FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
