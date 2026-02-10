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
import { PhoneNotifications } from "./PhoneNotifications";
import { PhoneAIChat } from "./PhoneAIChat";
import { AskAITransition } from "./AskAITransition";
import { LogoIntro } from "../LogoIntro";
import { Outro } from "../Outro";

// ============================================
// MOBILE ADJUSTMENT VARIABLES - CHANGE THESE
// ============================================
const PHONE_SCALE = 2.2;      // Scale multiplier (1 = normal, 1.5 = 50% bigger, etc.)
const PHONE_X_OFFSET = 1;     // Horizontal offset in pixels (negative = left, positive = right)
const PHONE_Y_OFFSET = -35;     // Vertical offset in pixels (negative = up, positive = down)

// ============================================
// TEXT POSITION & COLOR PER SCENE - CHANGE THESE
// offsetX: negative = left, positive = right
// offsetY: negative = up, positive = down
// subtextColor: any CSS color value
// ============================================
const TEXT_CONFIG = {
  scene1: { offsetX: 0, offsetY: 0, subtextColor: "#ffffff" },
  scene2: { offsetX: 0, offsetY: 0, subtextColor: "#11ee09" },
  scene3: { offsetX: 0, offsetY: 0, subtextColor: "#ffffff" },
  scene4: { offsetX: 0, offsetY: 0, subtextColor: "#ffffff" },
  scene5: { offsetX: 0, offsetY: 0, subtextColor: "#ffffff" },
  scene6: { offsetX: 0, offsetY: 0, subtextColor: "#ffffff" },
  scene7: { offsetX: 0, offsetY: 0, subtextColor: "#11ee09" },
  scene8: { offsetX: 0, offsetY: 0, subtextColor: "#ffffff" }, 
  scene9: { offsetX: 0, offsetY: 0, subtextColor: "#11ee09" },
};
// ============================================

// Scene timing configuration (42 seconds = 1260 frames @ 30fps)
// Includes ASK AI click transition before AI Chat
const SCENES = {
  intro: { start: 0, duration: 90 },
  discover: { start: 90, duration: 110 },
  bracket: { start: 200, duration: 110 },
  notifications: { start: 310, duration: 150 },
  integrate: { start: 460, duration: 110 },
  automate: { start: 570, duration: 110 },
  askAI: { start: 680, duration: 60 },
  aiChat: { start: 740, duration: 150 },
  community: { start: 890, duration: 90 },
  alerts: { start: 980, duration: 90 },
  news: { start: 1070, duration: 100 },
  outro: { start: 1170, duration: 90 },
};

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

// Main Mobile composition
export const BrackifyLaunchMobile: React.FC = () => {
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

      {/* SCENE 1: Bracket System */}
      <Sequence from={SCENES.discover.start} durationInFrames={SCENES.discover.duration}>
        <AbsoluteFill>
          <MobilePhoneWrapper>
            <PhoneShowcase
              videoSrc="1.mp4"
              startFrame={0}
              duration={SCENES.discover.duration}
              showHand={true}
              tapPosition={{ x: 50, y: 60 }}
              tapFrame={50}
              cursorEntryDirection="bottomRight"
              enterAnimation="slideUp"
              exitAnimation="slideLeft"
              enableTapSound={true}
            />
          </MobilePhoneWrapper>
          <SceneText
            headline="Advanced Bracket System"
            subtext="Predictions, live standings, and a powerful admin panel at your fingertips."
            startFrame={5}
            duration={SCENES.discover.duration - 5}
            position="bottom"
            highlightWords={["Advanced", "Bracket"]}
            offsetX={TEXT_CONFIG.scene1.offsetX}
            offsetY={TEXT_CONFIG.scene1.offsetY}
            subtextColor={TEXT_CONFIG.scene1.subtextColor}
            textAnimation="bouncyGravity"
            subtextAnimation="bounceUp"
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 2: Find Events Instantly */}
      <Sequence from={SCENES.bracket.start} durationInFrames={SCENES.bracket.duration}>
        <AbsoluteFill>
          <MobilePhoneWrapper>
            <PhoneShowcase
              videoSrc="2.mp4"
              startFrame={0}
              duration={SCENES.bracket.duration}
              showHand={true}
              tapPosition={{ x: 45, y: 55 }}
              tapFrame={100}
              swipeDirection="up"
              swipeFrame={70}
              cursorEntryDirection="bottomLeft"
              enterAnimation="slideRight"
              exitAnimation="slideUp"
            />
          </MobilePhoneWrapper>
          <SceneText
            headline="One Unified Tournament Journey"
            subtext="Native Start.gg and Challonge integration."
            startFrame={5}
            duration={SCENES.bracket.duration - 5}
            position="bottom"
            highlightWords={["One", "Unified", "Journey"]}
            offsetX={TEXT_CONFIG.scene2.offsetX}
            offsetY={TEXT_CONFIG.scene2.offsetY}
            subtextColor={TEXT_CONFIG.scene2.subtextColor}            textAnimation="slideReveal"
            subtextAnimation="waveReveal"          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 3: Liquid Glass Notifications */}
      <Sequence from={SCENES.notifications.start} durationInFrames={SCENES.notifications.duration}>
        <AbsoluteFill>
          <MobilePhoneWrapper>
            <PhoneShowcase
              startFrame={0}
              duration={SCENES.notifications.duration}
              showHand={false}
              tapPosition={{ x: 50, y: 40 }}
              tapFrame={60}
              swipeDirection="down"
              swipeFrame={100}
              cursorEntryDirection="topRight"
              enterAnimation="scaleUp"
              exitAnimation="rotateOut"
              enableSwipeSound={false}
            >
              <PhoneNotifications />
            </PhoneShowcase>
          </MobilePhoneWrapper>
          <SceneText
            headline="Never Miss a Moment"
            subtext="Smart notifications keep you updated."
            startFrame={5}
            duration={SCENES.notifications.duration - 5}
            position="bottom"
            highlightWords={["Never", "Miss"]}
            offsetX={TEXT_CONFIG.scene3.offsetX}
            offsetY={TEXT_CONFIG.scene3.offsetY}
            subtextColor={TEXT_CONFIG.scene3.subtextColor}
            textAnimation="blurRotate"
            subtextAnimation="blurFade"
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 4: Integration */}
      <Sequence from={SCENES.integrate.start} durationInFrames={SCENES.integrate.duration}>
        <AbsoluteFill>
          <MobilePhoneWrapper>
            <PhoneShowcase
              videoSrc="3.mp4"
              startFrame={0}
              duration={SCENES.integrate.duration}
              showHand={false}
              tapPosition={{ x: 50, y: 65 }}
              tapFrame={100}
              cursorEntryDirection="right"
              enterAnimation="rotateIn"
              exitAnimation="slideRight"
            />
          </MobilePhoneWrapper>
          <SceneText
            headline="Promote. Follow. Compete."
            subtext="A community feed where everyone connects."
            startFrame={5}
            duration={SCENES.integrate.duration - 5}
            position="bottom"
            highlightWords={["Promote", "Compete"]}
            offsetX={TEXT_CONFIG.scene4.offsetX}
            offsetY={TEXT_CONFIG.scene4.offsetY}
            subtextColor={TEXT_CONFIG.scene4.subtextColor}
            textAnimation="composeScale"
            subtextAnimation="scaleIn"
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 5: Automation */}
      <Sequence from={SCENES.automate.start} durationInFrames={SCENES.automate.duration}>
        <AbsoluteFill>
          <MobilePhoneWrapper>
            <PhoneShowcase
              videoSrc="4.mp4"
              startFrame={0}
              duration={SCENES.automate.duration}
              showHand={true}
              tapPosition={{ x: 55, y: 50 }}
              tapFrame={30}
              cursorEntryDirection="bottom"
              enterAnimation="slideLeft"
              exitAnimation="slideDown"
            />
          </MobilePhoneWrapper>
          <SceneText
            headline="Build Your Legacy"
            subtext="Showcase your wins and earned trophies."
            startFrame={5}
            duration={SCENES.automate.duration - 5}
            position="bottom"
            highlightWords={["Build", "Legacy"]}
            offsetX={TEXT_CONFIG.scene5.offsetX}
            offsetY={TEXT_CONFIG.scene5.offsetY}
            subtextColor={TEXT_CONFIG.scene5.subtextColor}
            textAnimation="bouncyGravity"
            subtextAnimation="bounceUp"
          />
        </AbsoluteFill>
      </Sequence>

      {/* ASK AI Click Transition */}
      <Sequence from={SCENES.askAI.start} durationInFrames={SCENES.askAI.duration}>
        <AskAITransition duration={SCENES.askAI.duration} />
      </Sequence>

      {/* SCENE 6: AI Bot Chat */}
      <Sequence from={SCENES.aiChat.start} durationInFrames={SCENES.aiChat.duration}>
        <AbsoluteFill>
          <MobilePhoneWrapper>
            <PhoneShowcase
              startFrame={0}
              duration={SCENES.aiChat.duration}
              showHand={false}
              tapPosition={{ x: 70, y: 85 }}
              tapFrame={150}
              cursorEntryDirection="bottomLeft"
              enterAnimation="flipIn"
              exitAnimation="slideLeft"
              enableTapSound={false}
            >
              <PhoneAIChat />
            </PhoneShowcase>
          </MobilePhoneWrapper>
          <SceneText
            headline="Intelligent Automation"
            subtext="AI insights with powerful Discord & Twitch Annoucement bots."
            startFrame={5}
            duration={SCENES.aiChat.duration - 5}
            position="bottom"
            highlightWords={["Intelligent", "Automation"]}
            offsetX={TEXT_CONFIG.scene6.offsetX}
            offsetY={TEXT_CONFIG.scene6.offsetY}
            subtextColor={TEXT_CONFIG.scene6.subtextColor}
            textAnimation="blurRotate"
            subtextAnimation="waveReveal"
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 7: Player Discovery & Following */}
      <Sequence from={SCENES.community.start} durationInFrames={SCENES.community.duration}>
        <AbsoluteFill>
          <MobilePhoneWrapper>
            <PhoneShowcase
              videoSrc="5.mp4"
              startFrame={0}
              duration={SCENES.community.duration}
              showHand={true}
              tapPosition={{ x: 50, y: 45 }}
              tapFrame={40}
              cursorEntryDirection="topLeft"
              enterAnimation="slideDown"
              exitAnimation="rotateOut"
            />
          </MobilePhoneWrapper>
          <SceneText
            headline="Discover & Follow Players"
            subtext="Track your favorite players' journeys."
            startFrame={5}
            duration={SCENES.community.duration - 5}
            position="bottom"
            highlightWords={["Discover", "Follow"]}
            offsetX={TEXT_CONFIG.scene7.offsetX}
            offsetY={TEXT_CONFIG.scene7.offsetY}
            subtextColor={TEXT_CONFIG.scene7.subtextColor}
            textAnimation="slideReveal"
            subtextAnimation="blurFade"
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 8: Brackify Media */}
      <Sequence from={SCENES.alerts.start} durationInFrames={SCENES.alerts.duration}>
        <AbsoluteFill>
          <MobilePhoneWrapper>
            <PhoneShowcase
              videoSrc="7.mp4"
              startFrame={0}
              duration={SCENES.alerts.duration}
              showHand={true}
              tapPosition={{ x: 50, y: 50 }}
              tapFrame={40}
              cursorEntryDirection="bottomRight"
              enterAnimation="rotateIn"
              exitAnimation="slideUp"
            />
          </MobilePhoneWrapper>
          <SceneText
            headline="Brackify Media Hub"
            subtext="The hottest FGC clips, highlights, and VODs."
            startFrame={5}
            duration={SCENES.alerts.duration - 5}
            position="bottom"
            highlightWords={["Media", "Hub"]}
            offsetX={TEXT_CONFIG.scene8.offsetX}
            offsetY={TEXT_CONFIG.scene8.offsetY}
            subtextColor={TEXT_CONFIG.scene8.subtextColor}
            textAnimation="composeScale"
            subtextAnimation="scaleIn"
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 9: News */}
      <Sequence from={SCENES.news.start} durationInFrames={SCENES.news.duration}>
        <AbsoluteFill>
          <MobilePhoneWrapper>
            <PhoneShowcase
              videoSrc="8.mp4"
              startFrame={0}
              duration={SCENES.news.duration}
              showHand={false}
              tapPosition={{ x: 50, y: 55 }}
              tapFrame={200} 
              cursorEntryDirection="bottom"
              enterAnimation="slideUp"
              exitAnimation="scaleDown"
            />
          </MobilePhoneWrapper>
          <SceneText
            headline="Stay In The Loop"
            subtext="Real-time FGC news and patch notes."
            startFrame={5}
            duration={SCENES.news.duration - 5}
            position="bottom"
            highlightWords={["Stay", "Loop"]}
            offsetX={TEXT_CONFIG.scene9.offsetX}
            offsetY={TEXT_CONFIG.scene9.offsetY}
            subtextColor={TEXT_CONFIG.scene9.subtextColor}
            textAnimation="bouncyGravity"
            subtextAnimation="bounceUp"
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
          opacity: frame > 90 && frame < SCENES.outro.start ? 0.7 : 0,
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

export default BrackifyLaunchMobile;
