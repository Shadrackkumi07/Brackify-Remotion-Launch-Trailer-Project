import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { PhoneShowcase } from "./PhoneShowcase";
import { FilmGrain, Vignette } from "./FilmGrain";
import { LogoIntro } from "../LogoIntro";
import { Outro } from "../Outro";

const PHONE_SCALE = 2.2;
const PHONE_X_OFFSET = 1;
const PHONE_Y_OFFSET = -35;

const INTRO_DURATION = 90;
const SCENE_DURATION = 1683;
const OUTRO_DURATION = 90;

const SCENES = {
  intro: { start: 0, duration: INTRO_DURATION },
  main: { start: INTRO_DURATION, duration: SCENE_DURATION },
  outro: {
    start: INTRO_DURATION + SCENE_DURATION,
    duration: OUTRO_DURATION,
  },
};

export const PROFILE_STATS_DURATION =
  INTRO_DURATION + SCENE_DURATION + OUTRO_DURATION;
export const PROFILE_STATS_FPS = 30;

const MobilePhoneWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: `translateX(${PHONE_X_OFFSET}px) translateY(${PHONE_Y_OFFSET}px) scale(${PHONE_SCALE})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
};

export const ProfileStats: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #0f0805 50%, #0a0a0a 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(249, 115, 22, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.5,
        }}
      />

      <Sequence from={SCENES.intro.start} durationInFrames={SCENES.intro.duration}>
        <LogoIntro />
      </Sequence>

      <Sequence from={SCENES.main.start} durationInFrames={SCENES.main.duration}>
        <AbsoluteFill>
          <MobilePhoneWrapper>
            <PhoneShowcase
              videoSrc="FindLocal and stats/stats.mp4"
              startFrame={0}
              duration={SCENES.main.duration}
              showHand={false}
              tapFrame={9999}
              cursorEntryDirection="bottom"
              enterAnimation="slideUp"
              exitAnimation="none"
            />
          </MobilePhoneWrapper>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={SCENES.outro.start} durationInFrames={SCENES.outro.duration}>
        <Outro />
      </Sequence>

      <FilmGrain intensity={0.03} />
      <Vignette intensity={0.4} />
    </AbsoluteFill>
  );
};

export default ProfileStats;