import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
  Easing,
} from "remotion";
import { LiquidGlassNotifications } from "./LiquidGlassNotifications";
import { AIBotChat } from "./AIBotChat";
import { FilmGrain, Vignette } from "./FilmGrain";

// Scene timing (total ~25 seconds = 750 frames @ 30fps)
const SCENES = {
  notifications: { start: 0, duration: 360 },  // 12 seconds for notifications
  transition: { start: 340, duration: 40 },     // Overlap transition
  aiChat: { start: 360, duration: 390 },        // 13 seconds for AI chat
};

// Liquid glass transition effect
const LiquidTransition: React.FC<{
  progress: number;
  frame: number;
}> = ({ progress, frame }) => {
  // Multiple liquid blobs morphing
  const blobScale = interpolate(progress, [0, 0.5, 1], [0, 1.5, 3]);
  const blobOpacity = interpolate(progress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      {/* Central liquid blob */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 400,
          height: 400,
          transform: `translate(-50%, -50%) scale(${blobScale})`,
          background: `radial-gradient(
            circle,
            rgba(249, 115, 22, 0.8) 0%,
            rgba(249, 115, 22, 0.4) 30%,
            rgba(34, 197, 94, 0.2) 60%,
            transparent 80%
          )`,
          borderRadius: "50%",
          filter: "blur(60px)",
          opacity: blobOpacity,
        }}
      />

      {/* Secondary blobs */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2 + frame * 0.02;
        const distance = 200 * progress;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const delay = i * 0.1;
        const blobProgress = Math.max(0, progress - delay);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 150,
              height: 150,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${blobProgress * 2})`,
              background: `radial-gradient(
                circle,
                rgba(${i % 2 ? "249, 115, 22" : "34, 197, 94"}, 0.6) 0%,
                transparent 70%
              )`,
              borderRadius: "50%",
              filter: "blur(40px)",
              opacity: blobOpacity * 0.7,
            }}
          />
        );
      })}

      {/* Glass refraction lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            ${90 + frame * 2}deg,
            transparent 45%,
            rgba(255, 255, 255, ${0.1 * blobOpacity}) 50%,
            transparent 55%
          )`,
        }}
      />
    </AbsoluteFill>
  );
};

// Scene wrapper with entrance/exit animations
const SceneWrapper: React.FC<{
  children: React.ReactNode;
  entrance: number;
  exit: number;
  startFrame: number;
  duration: number;
}> = ({ children, entrance, exit, startFrame, duration }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  const entranceProgress = interpolate(
    localFrame,
    [0, entrance],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.2, 1) }
  );

  const exitProgress = interpolate(
    localFrame,
    [duration - exit, duration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.2, 1) }
  );

  const opacity = entranceProgress * (1 - exitProgress);
  const scale = interpolate(entranceProgress, [0, 1], [0.95, 1]) * 
                interpolate(exitProgress, [0, 1], [1, 0.95]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Main showcase composition
export const LiquidGlassShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  // Calculate transition progress
  const transitionProgress = interpolate(
    frame,
    [SCENES.transition.start, SCENES.transition.start + SCENES.transition.duration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 30% 30%, rgba(249, 115, 22, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 70%, rgba(34, 197, 94, 0.05) 0%, transparent 50%),
            #0a0a0a
          `,
        }}
      />

      {/* Notifications Scene */}
      <Sequence from={SCENES.notifications.start} durationInFrames={SCENES.notifications.duration}>
        <SceneWrapper
          entrance={30}
          exit={20}
          startFrame={SCENES.notifications.start}
          duration={SCENES.notifications.duration}
        >
          <LiquidGlassNotifications />
        </SceneWrapper>
      </Sequence>

      {/* Liquid Transition Effect */}
      {transitionProgress > 0 && transitionProgress < 1 && (
        <LiquidTransition progress={transitionProgress} frame={frame} />
      )}

      {/* AI Chat Scene */}
      <Sequence from={SCENES.aiChat.start} durationInFrames={SCENES.aiChat.duration}>
        <SceneWrapper
          entrance={30}
          exit={20}
          startFrame={SCENES.aiChat.start}
          duration={SCENES.aiChat.duration}
        >
          <AIBotChat />
        </SceneWrapper>
      </Sequence>

      {/* Global overlays */}
      <FilmGrain intensity={0.02} />
      <Vignette intensity={0.35} />
    </AbsoluteFill>
  );
};

export default LiquidGlassShowcase;
