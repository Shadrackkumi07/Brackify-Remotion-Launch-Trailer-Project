import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  Sequence,
  Img,
  staticFile,
} from "remotion";
import { PhoneShowcase } from "./PhoneShowcase";
import { SceneText } from "./SceneText";
import { FilmGrain, Vignette } from "./FilmGrain";
import { LogoIntro } from "../LogoIntro";
import { Outro } from "../Outro";

// ============================================
// MOBILE ADJUSTMENT VARIABLES - CHANGE THESE
// ============================================
const PHONE_SCALE = 2.2;      // Scale multiplier (1 = normal, 1.5 = 50% bigger, etc.)
const PHONE_X_OFFSET = 1;     // Horizontal offset in pixels (negative = left, positive = right)
const PHONE_Y_OFFSET = -35;   // Vertical offset in pixels (negative = up, positive = down)

// ============================================
// TEXT POSITION & COLOR PER SCENE - CHANGE THESE
// offsetX: negative = left, positive = right
// offsetY: negative = up, positive = down
// subtextColor: any CSS color value
// ============================================
const TEXT_CONFIG = {
  scene1a: { offsetX: 0, offsetY: 0, subtextColor: "#7289da" },
  scene1b: { offsetX: 0, offsetY: 0, subtextColor: "#7289da" },
  scene2:  { offsetX: 0, offsetY: 0, subtextColor: "#7289da" },
};

// Scene 1 text segment split points (local frames within scene 1)
// SS:FF timecodes: 3:00–10:16 = creating tournament, 10:17–18:29 = discord connect
const SCENE1_PART_A_DURATION = 227; // frames 0–226  (global 3:00–10:16)
const SCENE1_PART_B_START    = 227; // frame 227     (global 10:17)
const SCENE1_PART_B_DURATION = 253; // frames 227–479 (global 10:17–18:29)
// ============================================

// ============================================
// SCENE DURATIONS - ADJUST TO MATCH YOUR CLIP LENGTHS
// Formula: duration (seconds) × fps (30) = frames
// e.g. 8 seconds = 240 frames, 10 seconds = 300 frames
// ============================================
const SCENE1_DURATION = 480; // 16 seconds × 30fps — matches "join 1.mp4"
const SCENE2_DURATION = 420; // 14 seconds × 30fps — matches "join 2.mp4"
// ============================================

const INTRO_DURATION = 90;
const OUTRO_DURATION = 90;

const SCENES = {
  intro:  { start: 0,                                        duration: INTRO_DURATION },
  scene1: { start: INTRO_DURATION,                           duration: SCENE1_DURATION },
  scene2: { start: INTRO_DURATION + SCENE1_DURATION,         duration: SCENE2_DURATION },
  outro:  { start: INTRO_DURATION + SCENE1_DURATION + SCENE2_DURATION, duration: OUTRO_DURATION },
};

export const DISCORD_JOIN_PROMO_DURATION =
  INTRO_DURATION + SCENE1_DURATION + SCENE2_DURATION + OUTRO_DURATION;
export const DISCORD_JOIN_PROMO_FPS = 30;

// Wrapper component to apply mobile scaling and positioning
const MobilePhoneWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

export const DiscordJoinPromo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #0f0805 50%, #0a0a0a 100%)",
      }}
    >
      {/* Background grid pattern */}
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

      {/* INTRO */}
      <Sequence from={SCENES.intro.start} durationInFrames={SCENES.intro.duration}>
        <LogoIntro />
      </Sequence>

      {/* SCENE 1: join 1.mp4 — video plays full duration, text swaps mid-scene */}
      <Sequence from={SCENES.scene1.start} durationInFrames={SCENES.scene1.duration}>
        <AbsoluteFill>
          <MobilePhoneWrapper>
            <PhoneShowcase
              videoSrc="join 1.mp4"
              startFrame={0}
              duration={SCENES.scene1.duration}
              showHand={false}
              tapFrame={9999}
              cursorEntryDirection="bottom"
              enterAnimation="slideUp"
              exitAnimation="none"
            />
          </MobilePhoneWrapper>

          {/* PART A: 3:00 – 10:16 — Creating a tournament */}
          <Sequence from={0} durationInFrames={SCENE1_PART_A_DURATION}>
            <SceneText
              headline="Create Your Tournament"
              subtext="Set up brackets, rules, and formats in seconds."
              startFrame={5}
              duration={SCENE1_PART_A_DURATION - 5}
              position="bottom"
              highlightWords={["Create", "Tournament"]}
              offsetX={TEXT_CONFIG.scene1a.offsetX}
              offsetY={TEXT_CONFIG.scene1a.offsetY}
              subtextColor={TEXT_CONFIG.scene1a.subtextColor}
              textAnimation="bouncyGravity"
              subtextAnimation="bounceUp"
            />
          </Sequence>

          {/* PART B: 10:17 – 18:29 — Connect Discord & create event */}
          <Sequence from={SCENE1_PART_B_START} durationInFrames={SCENE1_PART_B_DURATION}>
            <SceneText
              headline="Connect Discord & Go Live"
              subtext="Link your server, create the event, and auto-announce."
              startFrame={5}
              duration={SCENE1_PART_B_DURATION - 5}
              position="bottom"
              highlightWords={["Connect", "Discord"]}
              offsetX={TEXT_CONFIG.scene1b.offsetX}
              offsetY={TEXT_CONFIG.scene1b.offsetY}
              subtextColor={TEXT_CONFIG.scene1b.subtextColor}
              textAnimation="slideReveal"
              subtextAnimation="waveReveal"
            />
          </Sequence>
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 2: join 2.mp4 — 19:00–32:29 — Discord verify & tournament registration */}
      <Sequence from={SCENES.scene2.start} durationInFrames={SCENES.scene2.duration}>
        <AbsoluteFill>
          <MobilePhoneWrapper>
            <PhoneShowcase
              videoSrc="join 2.mp4"
              startFrame={0}
              duration={SCENES.scene2.duration}
              showHand={false}
              tapFrame={9999}
              cursorEntryDirection="right"
              enterAnimation="slideRight"
              exitAnimation="none"
            />
          </MobilePhoneWrapper>
          <SceneText
            headline="Verify & Register in One Tap"
            subtext="Discord verification unlocks seamless tournament sign-up."
            startFrame={5}
            duration={SCENES.scene2.duration - 5}
            position="bottom"
            highlightWords={["Verify", "Register"]}
            offsetX={TEXT_CONFIG.scene2.offsetX}
            offsetY={TEXT_CONFIG.scene2.offsetY}
            subtextColor={TEXT_CONFIG.scene2.subtextColor}
            textAnimation="blurRotate"
            subtextAnimation="blurFade"
          />
        </AbsoluteFill>
      </Sequence>

      {/* OUTRO */}
      <Sequence from={SCENES.outro.start} durationInFrames={SCENES.outro.duration}>
        <Outro />
      </Sequence>

      {/* Global overlays */}
      <FilmGrain intensity={0.03} />
      <Vignette intensity={0.4} />

      {/* Corner accent */}
      <div
        style={{
          position: "absolute",
          top: 30,
          right: 30,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: frame > SCENES.intro.duration && frame < SCENES.outro.start ? 0.7 : 0,
          transition: "opacity 0.3s",
        }}
      >
        <Img
          src={staticFile("logo.png")}
          style={{ width: 32, height: "auto" }}
        />
      </div>
    </AbsoluteFill>
  );
};

export default DiscordJoinPromo;
