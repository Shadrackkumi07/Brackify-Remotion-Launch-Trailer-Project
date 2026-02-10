import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Img,
  staticFile,
} from "remotion";
import { PhoneShowcase } from "./PhoneShowcase";
import { SceneText, FeatureList } from "./SceneText";
import { FilmGrain, Vignette } from "./FilmGrain";
import { PhoneNotifications } from "./PhoneNotifications";
import { PhoneAIChat } from "./PhoneAIChat";
import { AskAITransition } from "./AskAITransition";
import { LogoIntro } from "../LogoIntro";
import { Outro } from "../Outro";

// Scene timing configuration (42 seconds = 1260 frames @ 30fps)
// Includes ASK AI click transition before AI Chat
const SCENES = {
  intro: { start: 0, duration: 90 },              // 3s - Logo + tagline
  discover: { start: 90, duration: 110 },         // 3.7s - Event discovery
  bracket: { start: 200, duration: 110 },         // 3.7s - Bracket system
  notifications: { start: 310, duration: 150 },   // 5s - Liquid Glass Notifications
  integrate: { start: 460, duration: 110 },       // 3.7s - Start.gg + Challonge
  automate: { start: 570, duration: 110 },        // 3.7s - Automation/Bots
  askAI: { start: 680, duration: 60 },            // 2s - ASK AI click transition
  aiChat: { start: 740, duration: 150 },          // 5s - AI Bot Chat
  community: { start: 890, duration: 90 },        // 3s - Community + Customize
  alerts: { start: 980, duration: 90 },           // 3s - Smart Alerts
  news: { start: 1070, duration: 100 },           // 3.3s - News
  outro: { start: 1170, duration: 90 },           // 3s - CTA
};

// Intro scene with logo
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.8 },
  });

  const taglineOpacity = spring({
    frame: frame - 25,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const glowPulse = Math.sin(frame * 0.1) * 0.3 + 0.7;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0f00 50%, #0a0a0a 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          background: `radial-gradient(circle, rgba(249, 115, 22, ${0.2 * glowPulse}) 0%, transparent 60%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          marginBottom: 40,
        }}
      >
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 300,
            height: "auto",
            filter: "drop-shadow(0 0 40px rgba(249, 115, 22, 0.5))",
          }}
        />
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${interpolate(taglineOpacity, [0, 1], [30, 0])}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            color: "#ffffff",
            letterSpacing: "-0.02em",
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
          }}
        >
          The Next Generation of
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            fontFamily: "'Inter', sans-serif",
            background: "linear-gradient(135deg, #f97316 0%, #22c55e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
            marginTop: 8,
          }}
        >
          Tournament Management
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Outro scene with CTA
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const badgeEntrance = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0f00 50%, #0a0a0a 100%)",
      }}
    >
      {/* Animated background gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)`,
          transform: `scale(${1 + Math.sin(frame * 0.05) * 0.1})`,
        }}
      />

      {/* Logo */}
      <Img
        src={staticFile("logo.png")}
        style={{
          width: 220,
          height: "auto",
          marginBottom: 30,
          opacity: entrance,
          transform: `scale(${entrance})`,
          filter: "drop-shadow(0 0 30px rgba(249, 115, 22, 0.4))",
        }}
      />

      {/* CTA Text */}
      <div
        style={{
          textAlign: "center",
          opacity: entrance,
          transform: `translateY(${interpolate(entrance, [0, 1], [40, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            color: "#ffffff",
            marginBottom: 8,
          }}
        >
          Everything Competitive is Finally Here
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            background: "linear-gradient(135deg, #f97316 0%, #22c55e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          brackify.gg
        </div>
      </div>

      {/* App store badges */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginTop: 40,
          opacity: badgeEntrance,
          transform: `translateY(${interpolate(badgeEntrance, [0, 1], [30, 0])}px)`,
        }}
      >
        <Img
          src={staticFile("ios.png")}
          style={{
            height: 50,
            width: "auto",
            filter: "drop-shadow(0 4px 15px rgba(0,0,0,0.3))",
          }}
        />
        <Img
          src={staticFile("android.png")}
          style={{
            height: 50,
            width: "auto",
            filter: "drop-shadow(0 4px 15px rgba(0,0,0,0.3))",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// Main composition
export const BrackifyLaunch: React.FC = () => {
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

      {/* SCENE 1:Bracket System */}
      <Sequence from={SCENES.discover.start} durationInFrames={SCENES.discover.duration}>
        <AbsoluteFill>
          <PhoneShowcase
            videoSrc="1.mp4"
            startFrame={0}
            duration={SCENES.discover.duration}
            showHand={true}
            tapPosition={{ x: 50, y: 60 }}
            tapFrame={40}
            cursorEntryDirection="bottomRight"
            enterAnimation="slideUp"
            exitAnimation="slideLeft"
          />
          <SceneText
            headline="Advanced Bracket System"
            subtext="Predictions, live standings, and a powerful admin panel at your fingertips."
            startFrame={5}
            duration={SCENES.discover.duration - 5}
            position="left"
            highlightWords={["Advanced", "Bracket"]}
            textAnimation="bouncyGravity"
            subtextAnimation="bounceUp"
          />
          <FeatureList
            features={[
              { icon: "", iconImage: "predictions.png", text: "Live Predictions" },
              { icon: "", iconImage: "bot.png", text: "Platform Bot Integration" },
              { icon: "", iconImage: "customization.png", text: "Advanced Seamless Customization" },
            ]}
            startFrame={15}
            position="right"
            listAnimation="cascade"
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 2: Find Events Instantly */}
      <Sequence from={SCENES.bracket.start} durationInFrames={SCENES.bracket.duration}>
        <AbsoluteFill>
          <PhoneShowcase
            videoSrc="2.mp4"
            startFrame={0}
            duration={SCENES.bracket.duration}
            showHand={true}
            tapPosition={{ x: 45, y: 55 }}
            tapFrame={35}
            swipeDirection="up"
            swipeFrame={70}
            cursorEntryDirection="bottomLeft"
            enterAnimation="slideRight"
            exitAnimation="slideUp"
          />
          <SceneText
            headline="One Unified Tournament Journey"
            subtext="Native Start.gg and Challonge integration lets you find, register, and play without switching platforms."
            startFrame={5}
            duration={SCENES.bracket.duration - 5}
            position="right"
            highlightWords={["One", "Unified"]}
            textAnimation="slideReveal"
            subtextAnimation="waveReveal"
          />
          <FeatureList
            features={[
              { icon: "", iconImage: "startgg.png", text: "Start.gg Events" },
              { icon: "", iconImage: "challonge.svg", text: "Personal Challonge Events" },
              { icon: "", iconImage: "app logo.png", text: "Brackify Native Events" },
            ]}
            startFrame={15}
            position="left"
            listAnimation="wave"
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 3: Liquid Glass Notifications */}
      <Sequence from={SCENES.notifications.start} durationInFrames={SCENES.notifications.duration}>
        <AbsoluteFill>
          <PhoneShowcase
            startFrame={0}
            duration={SCENES.notifications.duration}
            showHand={true}
            tapPosition={{ x: 50, y: 40 }}
            tapFrame={60}
            swipeDirection="down"
            swipeFrame={100}
            cursorEntryDirection="topRight"
            enterAnimation="scaleUp"
            exitAnimation="rotateOut"
          >
            <PhoneNotifications />
          </PhoneShowcase>
          <SceneText
            headline="Never Miss a Moment"
            subtext="Smart notifications keep you updated on tournaments, brackets, and community activity."
            startFrame={5}
            duration={SCENES.notifications.duration - 5}
            position="left"
            highlightWords={["Never", "Miss"]}
            textAnimation="blurRotate"
            subtextAnimation="blurFade"
          />
          <FeatureList
            features={[
              { icon: "📱", text: "Cross Platform Alerts" },
              { icon: "🏆", text: "Live Brackets & Follow Alerts" },
              { icon: "👥", text: "Community Alerts" },
            ]}
            startFrame={15}
            position="right"
            listAnimation="pop"
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 4: Integration */}
      <Sequence from={SCENES.integrate.start} durationInFrames={SCENES.integrate.duration}>
        <AbsoluteFill>
          <PhoneShowcase
            videoSrc="3.mp4"
            startFrame={0}
            duration={SCENES.integrate.duration}
            showHand={true}
            tapPosition={{ x: 50, y: 65 }}
            tapFrame={45}
            cursorEntryDirection="right"
            enterAnimation="rotateIn"
            exitAnimation="slideRight"
          />
          <SceneText
            headline="Promote. Follow. Compete."
            subtext="A community feed where organizers post events and fans interact in real time."
            startFrame={5}
            duration={SCENES.integrate.duration - 5}
            position="left"
            highlightWords={["Promote", "Compete"]}
            textAnimation="composeScale"
            subtextAnimation="scaleIn"
          />
          <FeatureList
            features={[
              { icon: "", iconImage: "share.png", text: "Share & Promote Events" },
              { icon: "", iconImage: "love.png", text: "Engage with Users" },
              { icon: "", iconImage: "good-vibes.png", text: "Keep The Vibes Going" },
            ]}
            startFrame={15}
            position="right"
            listAnimation="slide"
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 5: Automation */}
      <Sequence from={SCENES.automate.start} durationInFrames={SCENES.automate.duration}>
        <AbsoluteFill>
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
          <SceneText
            headline="Build Your Legacy"
            subtext="Showcase your wins, display earned trophies, and let your profile tell your competitive story."
            startFrame={5}
            duration={SCENES.automate.duration - 5}
            position="right"
            highlightWords={["Build", "Legacy"]}
            textAnimation="bouncyGravity"
            subtextAnimation="bounceUp"
          />
          <FeatureList
            features={[
              { icon: "🏅", text: "Progression & Unlockable Badges" },
              { icon: "🔁", text: "Switch Between Start.gg & Challonge Profiles" },
              { icon: "🎨", text: "Custom Avatars, Frames, Backgrounds & Badges" },
            ]}
            startFrame={15}
            position="left"
            listAnimation="cascade"
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
          <PhoneShowcase
            startFrame={0}
            duration={SCENES.aiChat.duration}
            showHand={true}
            tapPosition={{ x: 70, y: 85 }}
            tapFrame={50}
            cursorEntryDirection="bottomLeft"
            enterAnimation="flipIn"
            exitAnimation="slideLeft"
          >
            <PhoneAIChat />
          </PhoneShowcase>
          <SceneText
            headline="Intelligent Tournament Automation"
            subtext="AI driven insights paired with powerful bots to automate brackets and real time Twitch and Discord announcements."
            startFrame={5}
            duration={SCENES.aiChat.duration - 5}
            position="right"
            highlightWords={["Intelligent", "Automation"]}
            textAnimation="blurRotate"
            subtextAnimation="waveReveal"
          />
          <FeatureList
            features={[
              { icon: "🤖", text: "AI Tournament Assistance" },
              { icon: "⚡", text: "Automated Announcements" },
              { icon: "🔗", text: "Twitch & Discord Bots" },
            ]}
            startFrame={15}
            position="left"
            listAnimation="wave"
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 7: Player Discovery & Following */}
      <Sequence from={SCENES.community.start} durationInFrames={SCENES.community.duration}>
        <AbsoluteFill>
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
          <SceneText
            headline="Discover & Follow Players"
            subtext="Search players across platforms, follow your favorites, and track their competitive journey with advanced stats."
            startFrame={5}
            duration={SCENES.community.duration - 5}
            position="left"
            highlightWords={["Discover", "Follow"]}
            textAnimation="slideReveal"
            subtextAnimation="blurFade"
          />
          <FeatureList
            features={[
              { icon: "", iconImage: "search.png", text: "Search Players Across Platforms" },
              { icon: "", iconImage: "followers.png", text: "Follow Players", animated: true },
              { icon: "", iconImage: "analytics.png", text: "View Advanced Analysis" },
            ]}
            startFrame={15}
            position="right"
            listAnimation="pop"
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 8: Brackify Media */}
      <Sequence from={SCENES.alerts.start} durationInFrames={SCENES.alerts.duration}>
        <AbsoluteFill>
          <PhoneShowcase
            videoSrc="7.mp4"
            startFrame={0}
            duration={SCENES.alerts.duration}
            showHand={true}
            tapPosition={{ x: 50, y: 50 }}
            tapFrame={20}
            cursorEntryDirection="bottomRight"
            enterAnimation="rotateIn"
            exitAnimation="slideUp"
          />
          <SceneText
            headline="Brackify Media Hub"
            subtext="The hottest FGC clips, highlights, and VODs — all curated and ready to watch."
            startFrame={5}
            duration={SCENES.alerts.duration - 5}
            position="right"
            highlightWords={["Media", "Hub"]}
            textAnimation="composeScale"
            subtextAnimation="scaleIn"
          />
          <FeatureList
            features={[
              { icon: "", iconImage: "twitch.png", text: "Trending Hottest Clips" },
              { icon: "", iconImage: "twitch.png", text: "Full Match VODs" },
              { icon: "", iconImage: "twitch.png", text: "Tournament Highlights" },
            ]}
            startFrame={15}
            position="left"
            listAnimation="stagger"
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 9: News */}
      <Sequence from={SCENES.news.start} durationInFrames={SCENES.news.duration}>
        <AbsoluteFill>
          <PhoneShowcase
            videoSrc="8.mp4"
            startFrame={0}
            duration={SCENES.news.duration}
            showHand={true}
            tapPosition={{ x: 50, y: 55 }}
            tapFrame={35}
            cursorEntryDirection="bottom"
            enterAnimation="slideUp"
            exitAnimation="scaleDown"
          />
          <SceneText
            headline="Stay In The Loop"
            subtext="Real-time FGC news, patch notes, and community highlights — all in one place."
            startFrame={5}
            duration={SCENES.news.duration - 5}
            position="left"
            highlightWords={["Stay", "Loop"]}
            textAnimation="bouncyGravity"
            subtextAnimation="bounceUp"
          />
          <FeatureList
            features={[
              { icon: "", iconImage: "news.png", text: "Patch Notes & Updates" },
              { icon: "", iconImage: "news.png", text: "Trusted FGC Sources" },
              { icon: "", iconImage: "news.png", text: "Live Updates On The Go" },
            ]}
            startFrame={15}
            position="right"
            listAnimation="cascade"
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
          top: 40,
          right: 40,
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: frame > 90 && frame < SCENES.outro.start ? 0.7 : 0,
          transition: "opacity 0.3s",
        }}
      >
        <Img
          src={staticFile("logo.png")}
          style={{ width: 40, height: "auto" }}
        />
      </div>
    </AbsoluteFill>
  );
};

export default BrackifyLaunch;
