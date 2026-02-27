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
  scene1: { offsetX: 0, offsetY: 0, subtextColor: "#f97316" },
  scene2: { offsetX: 0, offsetY: 0, subtextColor: "#f97316" },
};
// ============================================

// ============================================
// SCENE DURATIONS — matched to clip lengths
// aff 1a.mp4 = 18s × 30fps = 540 frames
// aff 2a.mp4 =  9s × 30fps = 270 frames
// ============================================
const SCENE1_DURATION = 540;
const SCENE2_DURATION = 270;
// ============================================

const INTRO_DURATION = 90;
const OUTRO_DURATION = 90;

const SCENES = {
  intro:  { start: 0,                                        duration: INTRO_DURATION },
  scene1: { start: INTRO_DURATION,                           duration: SCENE1_DURATION },
  scene2: { start: INTRO_DURATION + SCENE1_DURATION,         duration: SCENE2_DURATION },
  outro:  { start: INTRO_DURATION + SCENE1_DURATION + SCENE2_DURATION, duration: OUTRO_DURATION },
};

export const AFFILIATE_PROMO_DURATION =
  INTRO_DURATION + SCENE1_DURATION + SCENE2_DURATION + OUTRO_DURATION;
export const AFFILIATE_PROMO_FPS = 30;

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

export const AffiliatePromo: React.FC = () => {
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

      {/* SCENE 1: aff 1.mp4 */}
      <Sequence from={SCENES.scene1.start} durationInFrames={SCENES.scene1.duration}>
        <AbsoluteFill>
          <MobilePhoneWrapper>
            <PhoneShowcase
              videoSrc="aff 1a.mp4"
              startFrame={0}
              duration={SCENES.scene1.duration}
              showHand={false}
              tapFrame={9999}
              cursorEntryDirection="bottom"
              enterAnimation="slideUp"
              exitAnimation="none"
            />
          </MobilePhoneWrapper>
          <SceneText
            headline="Become an Affiliate"
            subtext="Earn rewards by growing the Brackify community."
            startFrame={5}
            duration={SCENES.scene1.duration - 5}
            position="bottom"
            highlightWords={["Affiliate"]}
            offsetX={TEXT_CONFIG.scene1.offsetX}
            offsetY={TEXT_CONFIG.scene1.offsetY}
            subtextColor={TEXT_CONFIG.scene1.subtextColor}
            textAnimation="bouncyGravity"
            subtextAnimation="bounceUp"
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 2: aff 2.mp4 */}
      <Sequence from={SCENES.scene2.start} durationInFrames={SCENES.scene2.duration}>
        <AbsoluteFill>
          <MobilePhoneWrapper>
            <PhoneShowcase
              videoSrc="aff 2a.mp4"
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
            headline="Track Your Earnings"
            subtext="Real-time dashboard for referrals and commissions."
            startFrame={5}
            duration={SCENES.scene2.duration - 5}
            position="bottom"
            highlightWords={["Track", "Earnings"]}
            offsetX={TEXT_CONFIG.scene2.offsetX}
            offsetY={TEXT_CONFIG.scene2.offsetY}
            subtextColor={TEXT_CONFIG.scene2.subtextColor}
            textAnimation="slideReveal"
            subtextAnimation="waveReveal"
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

export default AffiliatePromo;
