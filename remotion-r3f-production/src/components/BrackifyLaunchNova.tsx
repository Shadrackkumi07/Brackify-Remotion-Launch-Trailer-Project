/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  BRACKIFY — "NOVA" CINEMATIC LAUNCH                                ║
 * ║  Neo-Noir Dark Mode · Glassmorphic Z-Stacking · Macro Camera       ║
 * ║  Apple/Google tier product launch film                              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";

// ═══════════════════════════════════════════════════════════════════════
// §1  DESIGN SYSTEM — "Neo-Noir Global Illumination"
// ═══════════════════════════════════════════════════════════════════════

type Variant = "desktop" | "mobile";

export const BRACKIFY_NOVA_FPS = 60;
const FPS = BRACKIFY_NOVA_FPS;

// ─── Technical Style Sheet ───────────────────────────────────────────
//
// BASE              Rich navy-black, never pure #000
// SURFACE           Charcoal glass layers with 12-24px blur
// GLOW PALETTE      Neon accents that cast "Global Illumination"
// TYPOGRAPHY        900-weight display / 300-weight wide-tracked body
// BLUR RADII        Card: 24px · Modal: 32px · Backdrop: 48px
// EASING            Snappy fast-in / slow-out  (bezier 0.16,1,0.3,1)
// ─────────────────────────────────────────────────────────────────────

const P = {
  // Environment
  void: "#08090c",
  base: "#121218",
  surface: "#1a1a24",
  surfaceHigh: "#22222e",
  border: "rgba(255,255,255,0.06)",
  borderLit: "rgba(255,255,255,0.12)",

  // Text
  text: "#f0f2f5",
  textSub: "#a0a8b8",
  textMuted: "#5c6478",

  // Glow Palette — "Global Illumination" colors
  neonGreen: "#00e87b",
  electricBlue: "#3d9eff",
  cyberCyan: "#00d4ff",
  plasmaViolet: "#9b6dff",
  solarOrange: "#ff8a3d",
  hotPink: "#ff4d8d",
  white: "#ffffff",

  // Derived glows (translucent for cast-light)
  glowGreen: "rgba(0,232,123,0.35)",
  glowBlue: "rgba(61,158,255,0.30)",
  glowCyan: "rgba(0,212,255,0.30)",
  glowViolet: "rgba(155,109,255,0.28)",
  glowOrange: "rgba(255,138,61,0.30)",
  glowPink: "rgba(255,77,141,0.28)",
};

// "Snappy" easing — Fast-In / Slow-Out (the Apple feel)
const SNAP = Easing.bezier(0.16, 1, 0.3, 1);
const EXPO_OUT = Easing.out(Easing.exp);

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// Spring configs
const SPRING_SNAPPY = { damping: 18, stiffness: 220 };
const SPRING_SMOOTH = { damping: 200 };
const SPRING_BOUNCY = { damping: 12, stiffness: 180 };

// ─── Scene Timing ────────────────────────────────────────────────────

const SCENE_FRAMES = {
  coldOpen: 150,        // 2.5s — dark void → particle ignition
  logoReveal: 180,      // 3.0s — logo + kinetic type
  problem: 210,         // 3.5s — fragmentation visualization
  solutionFlash: 90,    // 1.5s — full-screen "BRACKIFY" flash
  search: 330,          // 5.5s — unified search deep-dive
  brackets: 390,        // 6.5s — bracket engine macro zoom
  crossEvents: 330,     // 5.5s — cross-platform events
  socialFeed: 330,      // 5.5s — social + engagement
  notifications: 300,   // 5.0s — automation pipeline
  mediaNews: 330,       // 5.5s — media & news discovery
  profile: 300,         // 5.0s — personalization
  heroMoment: 360,      // 6.0s — 3D bracket assembly climax
  outro: 270,           // 4.5s — CTA + close
};

const TRANSITION_FRAMES = 18; // 0.3s slide transitions

export const BRACKIFY_NOVA_DURATION =
  Object.values(SCENE_FRAMES).reduce((s, d) => s + d, 0) -
  12 * TRANSITION_FRAMES; // 12 transitions between 13 scenes

// ═══════════════════════════════════════════════════════════════════════
// §2  PRIMITIVES — Reusable visual atoms
// ═══════════════════════════════════════════════════════════════════════

// ─── Glass Surface ───────────────────────────────────────────────────
// Every UI element is a frosted pane with Z-depth

const glass = (opts?: {
  blur?: number;
  opacity?: number;
  border?: string;
  radius?: number;
}): React.CSSProperties => {
  const blur = opts?.blur ?? 24;
  const opacity = opts?.opacity ?? 0.06;
  const border = opts?.border ?? P.border;
  const radius = opts?.radius ?? 20;
  return {
    background: `linear-gradient(145deg, rgba(255,255,255,${opacity + 0.02}) 0%, rgba(255,255,255,${opacity * 0.4}) 100%)`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: `1px solid ${border}`,
    borderRadius: radius,
    boxShadow: `0 24px 64px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,${opacity + 0.04})`,
  };
};

// ─── Neon Glow Emitter ───────────────────────────────────────────────
// Simulates light casting from UI elements onto surrounding surfaces

const GlowEmitter: React.FC<{
  color: string;
  opacity?: number;
  size?: number;
  x?: string;
  y?: string;
  blur?: number;
}> = ({ color, opacity = 0.6, size = 400, x = "50%", y = "50%", blur = 80 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      transform: "translate(-50%, -50%)",
      filter: `blur(${blur}px)`,
      opacity,
      pointerEvents: "none",
    }}
  />
);

// ─── Scan Lines + Noise ──────────────────────────────────────────────
// Subtle film grain for cinematic depth

const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = frame * 7919;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay" }}>
      {/* Horizontal scan lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)",
          opacity: 0.3,
        }}
      />
      {/* Noise texture via CSS (deterministic per frame) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' seed='${seed % 999}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Anamorphic Light Streak ─────────────────────────────────────────
// Horizontal light flare across screen for dramatic transitions

const LightStreak: React.FC<{
  progress: number;
  color?: string;
  y?: string;
}> = ({ progress, color = P.cyberCyan, y = "50%" }) => {
  const width = interpolate(progress, [0, 0.5, 1], [0, 120, 0], clamp);
  const opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0, 0.9, 0.9, 0], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        height: 2,
        transform: "translateY(-50%)",
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: `${interpolate(progress, [0, 1], [-20, 120], clamp)}%`,
          width: `${width}%`,
          height: "100%",
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 30px 8px ${color}60, 0 0 80px 15px ${color}25`,
          transform: "translate(-50%, 0)",
        }}
      />
    </div>
  );
};

// ─── Ambient Environment ─────────────────────────────────────────────
// Deep-space gradient with slow-drifting glow zones

const CinematicBackground: React.FC<{ variant: Variant }> = ({ variant }) => {
  const frame = useCurrentFrame();
  const driftX = Math.sin(frame * 0.004) * 40;
  const driftY = Math.cos(frame * 0.003) * 25;
  const breathe = 0.85 + Math.sin(frame * 0.008) * 0.04;

  return (
    <AbsoluteFill>
      {/* Base gradient — never pure black */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 120% 100% at 50% 40%, ${P.surface} 0%, ${P.base} 50%, ${P.void} 100%)`,
        }}
      />
      {/* Moving ambient glow zones — Global Illumination from behind */}
      <div
        style={{
          position: "absolute",
          inset: -400,
          transform: `translate3d(${driftX}px, ${driftY}px, 0) scale(${breathe})`,
          filter: "blur(100px)",
          background:
            `radial-gradient(ellipse at 18% 30%, ${P.glowGreen} 0%, transparent 42%), ` +
            `radial-gradient(ellipse at 75% 25%, ${P.glowBlue} 0%, transparent 40%), ` +
            `radial-gradient(ellipse at 55% 75%, ${P.glowViolet} 0%, transparent 45%), ` +
            `radial-gradient(ellipse at 30% 65%, ${P.glowOrange} 0%, transparent 38%)`,
          opacity: 0.5,
        }}
      />
      {/* Subtle perspective grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), ` +
            `linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
          backgroundSize: variant === "mobile" ? "54px 54px" : "72px 72px",
          opacity: 0.35,
          perspective: 800,
          transform: `rotateX(${55 + Math.sin(frame * 0.005) * 2}deg)`,
          transformOrigin: "50% 100%",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 70%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 70%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Floating Motes ──────────────────────────────────────────────────
// Dust-like particles for depth (shallow DOF illusion)

const FloatingMotes: React.FC<{ count?: number }> = ({ count = 30 }) => {
  const frame = useCurrentFrame();
  const motes = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (i * 137.508) % 100,
        y: (i * 87.73) % 100,
        z: (i * 53.21) % 3, // depth layer 0-2
        size: 1.5 + (i % 5) * 0.8,
        speed: 0.05 + (i % 7) * 0.02,
        phase: i * 2.1,
      })),
    [count],
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {motes.map((m, i) => {
        const y = (m.y + frame * m.speed) % 108 - 4;
        const x = m.x + Math.sin(frame * 0.01 + m.phase) * 1.5;
        const blur = m.z * 2.5; // deeper = more blur (DOF)
        const opacity = interpolate(
          Math.sin(frame * 0.015 + m.phase),
          [-1, 1],
          [0.06, m.z === 0 ? 0.55 : 0.2],
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: m.size,
              height: m.size,
              borderRadius: "50%",
              backgroundColor: P.white,
              opacity,
              filter: `blur(${blur}px)`,
              boxShadow: `0 0 ${m.size * 3}px rgba(255,255,255,0.4)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Product Screenshot with Cinematic Framing ───────────────────────
// Isometric Z-stacked glass card with macro focus + glow casting

const CinematicScreenshot: React.FC<{
  src: string;
  width?: number;
  rotateY?: number;
  rotateX?: number;
  translateZ?: number;
  enterFrom?: "left" | "right" | "bottom" | "top";
  delay?: number;
  variant: Variant;
  glowColor?: string;
  focusIntensity?: number;
  scale?: number;
}> = ({
  src,
  width = 820,
  rotateY = -8,
  rotateX = 4,
  translateZ = 0,
  enterFrom = "right",
  delay = 0,
  variant,
  glowColor = P.electricBlue,
  focusIntensity = 0,
  scale: customScale,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: SPRING_SNAPPY,
  });

  const float = Math.sin((frame - delay) * 0.02) * 4;

  const dir = {
    left: [-400, 0],
    right: [400, 0],
    bottom: [0, 250],
    top: [0, -250],
  }[enterFrom];

  const tx = interpolate(enter, [0, 1], [dir[0], 0], clamp);
  const ty = interpolate(enter, [0, 1], [dir[1], 0], clamp);
  const s = interpolate(enter, [0, 1], [0.75, customScale ?? 1], clamp);
  const op = interpolate(enter, [0, 1], [0, 1], clamp);

  const mobileAdjust = variant === "mobile" ? 0.78 : 1;

  // Macro focus — shallow DOF blur on the background of the card
  const bgBlur = focusIntensity > 0
    ? `blur(${focusIntensity * 8}px)`
    : undefined;

  return (
    <div
      style={{
        perspective: 1600,
        opacity: op,
        transform: `translate(${tx}px, ${ty + float}px) scale(${s * mobileAdjust})`,
        filter: bgBlur,
      }}
    >
      <div
        style={{
          ...glass({ blur: 28, opacity: 0.04, border: `${glowColor}30`, radius: 16 }),
          padding: 8,
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotateY * enter}deg) rotateX(${rotateX * enter}deg) translateZ(${translateZ * enter}px)`,
          position: "relative",
        }}
      >
        {/* Neon glow cast — light from the screenshot onto the glass */}
        <div
          style={{
            position: "absolute",
            inset: -50,
            background: `radial-gradient(ellipse at 40% 35%, ${glowColor}18, transparent 65%)`,
            filter: "blur(30px)",
            borderRadius: 30,
            zIndex: -1,
          }}
        />
        {/* Bottom edge glow — surface reflection */}
        <div
          style={{
            position: "absolute",
            left: "10%",
            right: "10%",
            bottom: -30,
            height: 60,
            background: `radial-gradient(ellipse, ${glowColor}30, transparent 70%)`,
            filter: "blur(20px)",
            zIndex: -1,
          }}
        />
        {/* Browser chrome — macOS style */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 14px 8px",
            borderBottom: `1px solid rgba(255,255,255,0.04)`,
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div
              key={c}
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: c,
                boxShadow: `0 0 4px ${c}60`,
              }}
            />
          ))}
          <div
            style={{
              flex: 1,
              height: 22,
              borderRadius: 6,
              marginLeft: 20,
              marginRight: 20,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        </div>
        <Img
          src={staticFile(src)}
          style={{
            width,
            height: "auto",
            borderRadius: "0 0 10px 10px",
            display: "block",
          }}
        />
      </div>
    </div>
  );
};

// ─── Kinetic Text System ─────────────────────────────────────────────
// Word-by-word reveal with per-word spring + optional gradient highlight

const KineticText: React.FC<{
  text: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  delay?: number;
  wordDelay?: number;
  highlightWords?: string[];
  highlightColor?: string;
  letterSpacing?: string;
  lineHeight?: number;
  textAlign?: "left" | "center" | "right";
  maxWidth?: number;
}> = ({
  text,
  fontSize = 56,
  fontWeight = 800,
  color = P.text,
  delay = 0,
  wordDelay = 4,
  highlightWords = [],
  highlightColor = P.neonGreen,
  letterSpacing = "-0.03em",
  lineHeight = 1.1,
  textAlign = "left",
  maxWidth,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: `0 ${fontSize * 0.22}px`,
        justifyContent: textAlign === "center" ? "center" : "flex-start",
        maxWidth,
      }}
    >
      {words.map((word, i) => {
        const wordProgress = spring({
          frame: frame - delay - i * wordDelay,
          fps,
          config: SPRING_SNAPPY,
        });

        const isHighlight = highlightWords.some(
          (hw) => word.toLowerCase().replace(/[.,!?]/g, "") === hw.toLowerCase(),
        );

        const y = interpolate(wordProgress, [0, 1], [35, 0], clamp);
        const rotate = interpolate(wordProgress, [0, 1], [6, 0], clamp);

        return (
          <div
            key={i}
            style={{
              fontSize,
              fontWeight,
              color: isHighlight ? highlightColor : color,
              letterSpacing,
              lineHeight,
              opacity: wordProgress,
              transform: `translateY(${y}px) rotate(${rotate}deg)`,
              transformOrigin: "left bottom",
              textShadow: isHighlight
                ? `0 0 40px ${highlightColor}50, 0 4px 20px rgba(0,0,0,0.5)`
                : "0 4px 20px rgba(0,0,0,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            {word}
          </div>
        );
      })}
    </div>
  );
};

// ─── Section Label (tag pill) ────────────────────────────────────────

const SectionLabel: React.FC<{
  text: string;
  color?: string;
  delay?: number;
}> = ({ text, color = P.electricBlue, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: SPRING_SMOOTH,
  });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 18px",
        borderRadius: 999,
        border: `1px solid ${color}40`,
        background: `linear-gradient(135deg, ${color}12, ${color}06)`,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [15, 0], clamp)}px)`,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ─── Subtext ─────────────────────────────────────────────────────────

const Subtext: React.FC<{
  text: string;
  delay?: number;
  fontSize?: number;
  maxWidth?: number;
  textAlign?: "left" | "center";
}> = ({ text, delay = 15, fontSize = 22, maxWidth = 520, textAlign = "left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: SPRING_SMOOTH,
  });

  return (
    <div
      style={{
        fontSize,
        lineHeight: 1.5,
        color: P.textSub,
        fontWeight: 400,
        letterSpacing: "0.01em",
        maxWidth,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [20, 0], clamp)}px)`,
        textAlign,
        marginTop: 12,
      }}
    >
      {text}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// §3  SCENES — 13-Beat Storyboard
// ═══════════════════════════════════════════════════════════════════════

// ─── SCENE 1: Cold Open ──────────────────────────────────────────────
// Void → particle ignition → a single pulse of light

const ColdOpenScene: React.FC<{ variant: Variant; duration: number }> = ({
  duration,
}) => {
  const frame = useCurrentFrame();

  // 0-60: total darkness, then a single point of light appears
  const ignition = interpolate(frame, [50, 90], [0, 1], {
    ...clamp,
    easing: EXPO_OUT,
  });

  // Light expands into shockwave
  const shockwave = interpolate(frame, [70, 130], [0, 1], {
    ...clamp,
    easing: SNAP,
  });

  // Everything fades for logo scene
  const exitFade = interpolate(frame, [duration - 20, duration], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        background: P.void,
        opacity: exitFade,
      }}
    >
      {/* Central ignition point */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Core point */}
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: P.white,
            opacity: ignition,
            boxShadow: `0 0 20px ${P.white}, 0 0 60px ${P.cyberCyan}, 0 0 120px ${P.electricBlue}40`,
            transform: `scale(${interpolate(ignition, [0, 1], [0, 1.2], clamp)})`,
          }}
        />
        {/* Shockwave ring */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: interpolate(shockwave, [0, 1], [0, 1400], clamp),
            height: interpolate(shockwave, [0, 1], [0, 1400], clamp),
            borderRadius: "50%",
            border: `2px solid rgba(0,212,255,${interpolate(shockwave, [0, 0.5, 1], [0, 0.6, 0], clamp)})`,
            boxShadow: `inset 0 0 60px rgba(0,212,255,${interpolate(shockwave, [0, 0.5, 1], [0, 0.15, 0], clamp)})`,
          }}
        />
        {/* Background illumination that lingers */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 900,
            height: 900,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${P.cyberCyan}15 0%, ${P.electricBlue}08 40%, transparent 65%)`,
            opacity: interpolate(frame, [80, 130], [0, 1], clamp),
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Horizontal light streak */}
      <LightStreak
        progress={interpolate(frame, [75, 130], [0, 1], clamp)}
        color={P.cyberCyan}
        y="50%"
      />
    </AbsoluteFill>
  );
};

// ─── SCENE 2: Logo Reveal ────────────────────────────────────────────
// Logo scales up with neon glow, then kinetic "BRACKIFY" letters slam in

const LogoRevealScene: React.FC<{ variant: Variant; duration: number }> = ({
  variant,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isMobile = variant === "mobile";

  // Logo entrance — starts big, settles smaller (scale ramp)
  const logoSpring = spring({
    frame,
    fps,
    config: SPRING_BOUNCY,
  });

  const logoScale = interpolate(logoSpring, [0, 1], [2.5, 1], clamp);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1], clamp);

  // Letters slam in from below with stagger
  const letters = "BRACKIFY".split("");

  // Tagline
  const tagDelay = 50;
  const tagEnter = spring({
    frame: frame - tagDelay,
    fps,
    config: SPRING_SMOOTH,
  });

  // Accent line
  const lineProgress = interpolate(frame, [35, 80], [0, 1], {
    ...clamp,
    easing: SNAP,
  });

  const exitOp = interpolate(frame, [duration - 22, duration], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: exitOp,
      }}
    >
      {/* Background glow from logo */}
      <GlowEmitter color={P.glowGreen} size={700} opacity={0.5 * logoOpacity} />
      <GlowEmitter color={P.glowBlue} size={500} opacity={0.3 * logoOpacity} y="45%" />

      {/* Logo */}
      <Img
        src={staticFile("logo.png")}
        style={{
          width: isMobile ? 160 : 110,
          height: "auto",
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          filter: `drop-shadow(0 0 40px ${P.neonGreen}80) drop-shadow(0 10px 30px rgba(0,0,0,0.6))`,
          marginBottom: 28,
        }}
      />

      {/* Letters */}
      <div style={{ display: "flex", gap: isMobile ? 5 : 3, overflow: "visible" }}>
        {letters.map((letter, i) => {
          const letterSpring = spring({
            frame: frame - 12 - i * 3,
            fps,
            config: SPRING_SNAPPY,
          });

          const y = interpolate(letterSpring, [0, 1], [80, 0], clamp);
          const rotate = interpolate(letterSpring, [0, 1], [15, 0], clamp);
          const scale = interpolate(letterSpring, [0, 1], [0.6, 1], clamp);

          return (
            <div
              key={i}
              style={{
                fontSize: isMobile ? 100 : 82,
                fontWeight: 900,
                letterSpacing: "0.02em",
                color: P.text,
                opacity: letterSpring,
                transform: `translateY(${y}px) rotate(${rotate}deg) scale(${scale})`,
                transformOrigin: "center bottom",
                textShadow: `0 0 40px ${P.cyberCyan}30, 0 8px 30px rgba(0,0,0,0.5)`,
              }}
            >
              {letter}
            </div>
          );
        })}
      </div>

      {/* Accent line */}
      <div
        style={{
          width: interpolate(lineProgress, [0, 1], [0, isMobile ? 500 : 400], clamp),
          height: 2,
          background: `linear-gradient(90deg, transparent, ${P.cyberCyan}, ${P.neonGreen}, transparent)`,
          borderRadius: 999,
          marginTop: 20,
          opacity: lineProgress,
          boxShadow: `0 0 20px ${P.cyberCyan}40`,
        }}
      />

      {/* Tagline */}
      <div
        style={{
          marginTop: 20,
          fontSize: isMobile ? 24 : 20,
          fontWeight: 300,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: P.textSub,
          opacity: tagEnter,
          transform: `translateY(${interpolate(tagEnter, [0, 1], [15, 0], clamp)}px)`,
        }}
      >
        The Competition Platform
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 3: Problem — Fragmentation ────────────────────────────────
// Platforms float apart indicating chaos, then collapse

const ProblemScene: React.FC<{ variant: Variant; duration: number }> = ({
  variant,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isMobile = variant === "mobile";

  const fragments = [
    { label: "start.gg", color: P.electricBlue, x: -340, y: -170, rot: -12 },
    { label: "Challonge", color: P.solarOrange, x: 320, y: -130, rot: 10 },
    { label: "Toornament", color: P.plasmaViolet, x: -280, y: 140, rot: 15 },
    { label: "Battlefy", color: P.hotPink, x: 310, y: 170, rot: -10 },
    { label: "Discord", color: P.cyberCyan, x: -60, y: -250, rot: 6 },
    { label: "Misc Sites", color: P.neonGreen, x: 80, y: 230, rot: -8 },
  ];

  // Disperse outward, then tremor
  const disperse = interpolate(frame, [15, 100], [0, 1], {
    ...clamp,
    easing: SNAP,
  });

  const tremor = frame > 90 ? Math.sin(frame * 0.3) * 3 * interpolate(frame, [90, duration], [1, 0], clamp) : 0;

  return (
    <AbsoluteFill>
      {/* Central headline */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? 130 : "50%",
          left: 0,
          right: 0,
          textAlign: "center",
          transform: isMobile ? "none" : "translateY(-50%)",
          zIndex: 10,
        }}
      >
        <KineticText
          text="Competition is fragmented."
          fontSize={isMobile ? 58 : 52}
          delay={5}
          wordDelay={5}
          highlightWords={["fragmented."]}
          highlightColor={P.solarOrange}
          textAlign="center"
          letterSpacing="-0.02em"
        />
        <Subtext
          text="Players are trapped across a dozen disconnected platforms."
          delay={25}
          textAlign="center"
          maxWidth={600}
        />
      </div>

      {/* Dispersing fragment cards  */}
      {fragments.map((frag, i) => {
        const fragEnter = spring({
          frame: frame - 8 - i * 4,
          fps,
          config: SPRING_SNAPPY,
        });

        const mScale = isMobile ? 0.65 : 1;
        const shake = tremor * (i % 2 === 0 ? 1 : -1);

        return (
          <div
            key={frag.label}
            style={{
              position: "absolute",
              left: "50%",
              top: isMobile ? "58%" : "50%",
              ...glass({ blur: 20, opacity: 0.05, border: `${frag.color}30`, radius: 14 }),
              padding: isMobile ? "12px 18px" : "10px 18px",
              fontSize: isMobile ? 20 : 17,
              color: P.textSub,
              fontWeight: 600,
              transform: `translate(-50%, -50%) translate(${(frag.x * disperse + shake) * mScale}px, ${(frag.y * disperse) * mScale}px) rotate(${frag.rot * disperse}deg) scale(${fragEnter * mScale})`,
              opacity: fragEnter * (1 - disperse * 0.2),
              boxShadow: `0 15px 40px rgba(0,0,0,0.35), 0 0 25px ${frag.color}10`,
            }}
          >
            <span style={{ marginRight: 8, opacity: 0.5 }}>●</span>
            {frag.label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── SCENE 4: Solution Flash ─────────────────────────────────────────
// Full-screen "BRACKIFY" slam — quick dramatic interstitial

const SolutionFlashScene: React.FC<{ variant: Variant; duration: number }> = ({
  variant,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isMobile = variant === "mobile";

  const slam = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 300 },
  });

  const scale = interpolate(slam, [0, 1], [3, 1], clamp);
  const opacity = slam;
  const exit = interpolate(frame, [duration - 12, duration], [1, 0], clamp);

  // Background flash
  const flash = interpolate(frame, [0, 8, 25], [0, 0.15, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        background: P.void,
        opacity: exit,
      }}
    >
      {/* White flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: P.white,
          opacity: flash,
        }}
      />

      {/* Glow behind text */}
      <GlowEmitter color={P.glowCyan} size={800} opacity={0.5 * opacity} />

      <div
        style={{
          fontSize: isMobile ? 140 : 120,
          fontWeight: 900,
          color: P.text,
          letterSpacing: "0.08em",
          opacity,
          transform: `scale(${scale})`,
          textShadow: `0 0 80px ${P.cyberCyan}40, 0 0 160px ${P.electricBlue}20`,
        }}
      >
        BRACKIFY
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// §4  FEATURE SCENES — Macro Focus Product Showcases
// Each scene: headline left, screenshot right, glow casting
// Camera path: Wide → Macro zoom on the UI
// ═══════════════════════════════════════════════════════════════════════

// Template for consistent feature scene layout
const FeatureScene: React.FC<{
  variant: Variant;
  duration: number;
  tag: string;
  tagColor: string;
  headline: string;
  highlightWords?: string[];
  subtext: string;
  screenshotSrc: string;
  glowColor: string;
  enterFrom?: "left" | "right" | "bottom" | "top";
  rotateY?: number;
  rotateX?: number;
  // Optional secondary screenshot for dual-card layouts
  screenshotSrc2?: string;
  // Scale ramp — zooms into screenshot
  enableMacroZoom?: boolean;
  children?: React.ReactNode;
}> = ({
  variant,
  duration,
  tag,
  tagColor,
  headline,
  highlightWords,
  subtext,
  screenshotSrc,
  glowColor,
  enterFrom = "right",
  rotateY = -8,
  rotateX = 4,
  screenshotSrc2,
  enableMacroZoom = false,
  children,
}) => {
  const frame = useCurrentFrame();
  const isMobile = variant === "mobile";

  //  "Scale Ramp" — wide dashboard → macro shot
  const macroZoom = enableMacroZoom
    ? interpolate(frame, [duration * 0.55, duration * 0.85], [1, 1.35], {
        ...clamp,
        easing: SNAP,
      })
    : 1;

  const macroShift = enableMacroZoom
    ? interpolate(frame, [duration * 0.55, duration * 0.85], [0, isMobile ? -80 : -150], {
        ...clamp,
        easing: SNAP,
      })
    : 0;

  // If two screenshots, transition between them
  const showSecond = screenshotSrc2
    ? interpolate(frame, [duration * 0.42, duration * 0.54], [0, 1], {
        ...clamp,
        easing: SNAP,
      })
    : 0;

  const hideFirst = screenshotSrc2
    ? interpolate(frame, [duration * 0.38, duration * 0.48], [1, 0], clamp)
    : 1;

  // Enter / exit
  const enterOp = interpolate(frame, [0, 20], [0, 1], { ...clamp, easing: EXPO_OUT });
  const exitOp = interpolate(frame, [duration - 22, duration], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        opacity: enterOp * exitOp,
      }}
    >
      {/* Ambient glow for this scene */}
      <GlowEmitter
        color={glowColor}
        opacity={0.25}
        size={600}
        x={isMobile ? "50%" : "70%"}
        y={isMobile ? "60%" : "45%"}
        blur={100}
      />

      {/* LEFT: Text block */}
      <div
        style={{
          position: "absolute",
          left: isMobile ? 50 : 90,
          right: isMobile ? 50 : "auto",
          top: isMobile ? 100 : "auto",
          bottom: isMobile ? "auto" : 90,
          width: isMobile ? "auto" : 600,
          zIndex: 10,
        }}
      >
        <SectionLabel text={tag} color={tagColor} delay={5} />
        <KineticText
          text={headline}
          fontSize={isMobile ? 52 : 48}
          delay={8}
          wordDelay={4}
          highlightWords={highlightWords}
          highlightColor={tagColor}
        />
        <Subtext text={subtext} delay={20} />
      </div>

      {/* RIGHT: Screenshot(s) with macro zoom */}
      <div
        style={{
          position: "absolute",
          right: isMobile ? 0 : 30,
          top: isMobile ? "38%" : "50%",
          transform: `translateY(-50%) scale(${macroZoom}) translateX(${macroShift}px)`,
          display: "flex",
          alignItems: "center",
          justifyContent: isMobile ? "center" : "flex-end",
          width: isMobile ? "100%" : "auto",
          transformOrigin: isMobile ? "center center" : "right center",
        }}
      >
        {/* Primary screenshot */}
        <div style={{ opacity: hideFirst }}>
          <CinematicScreenshot
            src={screenshotSrc}
            width={isMobile ? 880 : 820}
            rotateY={rotateY}
            rotateX={rotateX}
            enterFrom={enterFrom}
            delay={12}
            variant={variant}
            glowColor={glowColor}
          />
        </div>

        {/* Optional second screenshot */}
        {screenshotSrc2 && (
          <div
            style={{
              position: "absolute",
              opacity: showSecond,
            }}
          >
            <CinematicScreenshot
              src={screenshotSrc2}
              width={isMobile ? 880 : 820}
              rotateY={-rotateY}
              rotateX={rotateX * 0.5}
              enterFrom={enterFrom === "right" ? "left" : "right"}
              delay={Math.round(duration * 0.46)}
              variant={variant}
              glowColor={glowColor}
            />
          </div>
        )}
      </div>

      {/* Extra children (notification badges, pills, etc.) */}
      {children}
    </AbsoluteFill>
  );
};

// ─── Concrete feature scene wrappers ─────────────────────────────────

const SearchScene: React.FC<{ variant: Variant; duration: number }> = (props) => (
  <FeatureScene
    {...props}
    tag="UNIFIED SEARCH"
    tagColor={P.cyberCyan}
    headline="One search. Every tournament."
    highlightWords={["Every"]}
    subtext="Start.gg, Challonge, and native Brackify events unified in one intelligent stream."
    screenshotSrc="Assets/Search.png"
    glowColor={P.glowCyan}
    enableMacroZoom
  />
);

const BracketsScene: React.FC<{ variant: Variant; duration: number }> = (props) => (
  <FeatureScene
    {...props}
    tag="BRACKET ENGINE"
    tagColor={P.neonGreen}
    headline="Brackets engineered for momentum."
    highlightWords={["momentum."]}
    subtext="Create, manage, and run tournaments with a system that just works."
    screenshotSrc="Assets/bracket-creation.png"
    screenshotSrc2="Assets/Brackets.png"
    glowColor={P.glowGreen}
    enableMacroZoom
  />
);

const CrossEventsScene: React.FC<{ variant: Variant; duration: number }> = (props) => (
  <FeatureScene
    {...props}
    tag="CROSS PLATFORM"
    tagColor={P.electricBlue}
    headline="Events across the entire ecosystem."
    highlightWords={["entire"]}
    subtext="Find and join tournaments from every platform, all in one unified experience."
    screenshotSrc="Assets/cross-events.png"
    glowColor={P.glowBlue}
    enterFrom="bottom"
    rotateY={-6}
  />
);

const SocialFeedScene: React.FC<{ variant: Variant; duration: number }> = (props) => (
  <FeatureScene
    {...props}
    tag="ENGAGEMENT"
    tagColor={P.solarOrange}
    headline="Predict. Share. Clip the moment."
    highlightWords={["Clip"]}
    subtext="Engagement loops that amplify every bracket beat and keep the community alive."
    screenshotSrc="Assets/SocialFeed.png"
    glowColor={P.glowOrange}
    rotateY={8}
    rotateX={-2}
  />
);

const NotificationsSceneWrapped: React.FC<{ variant: Variant; duration: number }> = ({
  variant,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isMobile = variant === "mobile";

  const badges = [
    { text: "Push Notification", icon: "●", delay: 55, color: P.neonGreen },
    { text: "Discord Webhook", icon: "●", delay: 75, color: P.electricBlue },
    { text: "Twitch Alert", icon: "●", delay: 95, color: P.plasmaViolet },
  ];

  return (
    <FeatureScene
      variant={variant}
      duration={duration}
      tag="AUTOMATION"
      tagColor={P.plasmaViolet}
      headline="Announce once. Publish everywhere."
      highlightWords={["everywhere."]}
      subtext="Automated distribution across Discord, Twitch, push, and more. One click."
      screenshotSrc="Assets/Notifications.png"
      glowColor={P.glowViolet}
      enableMacroZoom
    >
      {/* Floating automation badges that slide in */}
      {badges.map((badge, i) => {
        const enter = spring({
          frame: frame - badge.delay,
          fps,
          config: SPRING_SNAPPY,
        });

        return (
          <div
            key={badge.text}
            style={{
              position: "absolute",
              right: isMobile ? "auto" : 60 + i * 30,
              left: isMobile ? "50%" : "auto",
              top: isMobile ? "auto" : 180 + i * 70,
              bottom: isMobile ? `${200 - i * 65}px` : "auto",
              transform: isMobile
                ? `translateX(-50%) translateX(${interpolate(enter, [0, 1], [150, 0], clamp)}px)`
                : `translateX(${interpolate(enter, [0, 1], [100, 0], clamp)}px)`,
              opacity: enter,
              ...glass({ blur: 20, opacity: 0.06, border: `${badge.color}35`, radius: 12 }),
              padding: "10px 18px",
              fontSize: isMobile ? 18 : 15,
              color: P.text,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 10,
              zIndex: 20,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: badge.color,
                boxShadow: `0 0 10px ${badge.color}`,
              }}
            />
            {badge.text}
          </div>
        );
      })}
    </FeatureScene>
  );
};

const MediaNewsScene: React.FC<{ variant: Variant; duration: number }> = ({
  variant,
  duration,
}) => {
  const frame = useCurrentFrame();
  const isMobile = variant === "mobile";

  const card1 = spring({
    frame: frame - 12,
    fps: FPS,
    config: SPRING_SNAPPY,
  });
  const card2 = spring({
    frame: frame - 28,
    fps: FPS,
    config: SPRING_SNAPPY,
  });

  const float1 = Math.sin(frame * 0.018) * 4;
  const float2 = Math.sin(frame * 0.018 + 2) * 4;

  const enterOp = interpolate(frame, [0, 20], [0, 1], { ...clamp, easing: EXPO_OUT });
  const exitOp = interpolate(frame, [duration - 22, duration], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ opacity: enterOp * exitOp }}>
      <GlowEmitter
        color={P.glowPink}
        opacity={0.25}
        size={600}
        x={isMobile ? "50%" : "65%"}
        y="50%"
        blur={100}
      />

      {/* Text block */}
      <div
        style={{
          position: "absolute",
          left: isMobile ? 50 : 90,
          right: isMobile ? 50 : "auto",
          top: isMobile ? 100 : "auto",
          bottom: isMobile ? "auto" : 90,
          width: isMobile ? "auto" : 580,
          zIndex: 10,
        }}
      >
        <SectionLabel text="DISCOVERY" color={P.hotPink} delay={5} />
        <KineticText
          text="Your gaming universe. Curated."
          fontSize={isMobile ? 52 : 48}
          delay={8}
          wordDelay={4}
          highlightWords={["Curated."]}
          highlightColor={P.hotPink}
        />
        <Subtext
          text="Media, news, and tournament content in one competitive feed."
          delay={20}
        />
      </div>

      {/* Two isometric Z-stacked cards */}
      <div
        style={{
          position: "absolute",
          right: isMobile ? 0 : 40,
          top: isMobile ? "40%" : "50%",
          transform: isMobile ? "translateY(-50%)" : "translateY(-50%)",
          display: "flex",
          alignItems: isMobile ? "center" : "flex-end",
          justifyContent: isMobile ? "center" : "flex-end",
          width: isMobile ? "100%" : "auto",
          perspective: 1600,
        }}
      >
        {/* Back card (Media) — tilted, deeper Z */}
        <div
          style={{
            position: "absolute",
            right: isMobile ? "auto" : 80,
            opacity: card1,
            transform: `translateY(${float1 - 30}px) translateZ(-40px) rotateY(-12deg) rotateX(5deg) scale(${interpolate(card1, [0, 1], [0.7, isMobile ? 0.65 : 0.85], clamp)})`,
            transformStyle: "preserve-3d",
            zIndex: 1,
          }}
        >
          <div style={{ ...glass({ blur: 24, opacity: 0.04, border: `${P.hotPink}25`, radius: 14 }), padding: 7 }}>
            <div style={{ display: "flex", gap: 5, padding: "7px 10px 5px" }}>
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <div key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <Img
              src={staticFile("Assets/Media&TV.png")}
              style={{ width: isMobile ? 640 : 460, borderRadius: "0 0 10px 10px", display: "block" }}
            />
          </div>
        </div>

        {/* Front card (News) — higher Z, slight opposite tilt */}
        <div
          style={{
            opacity: card2,
            transform: `translateY(${float2 + 20}px) translateZ(40px) rotateY(5deg) rotateX(-2deg) scale(${interpolate(card2, [0, 1], [0.7, isMobile ? 0.7 : 0.92], clamp)})`,
            transformStyle: "preserve-3d",
            zIndex: 2,
          }}
        >
          <div style={{ ...glass({ blur: 24, opacity: 0.05, border: `${P.hotPink}30`, radius: 14 }), padding: 7 }}>
            <div style={{ display: "flex", gap: 5, padding: "7px 10px 5px" }}>
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <div key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <Img
              src={staticFile("Assets/News.png")}
              style={{ width: isMobile ? 640 : 460, borderRadius: "0 0 10px 10px", display: "block" }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ProfileScene: React.FC<{ variant: Variant; duration: number }> = ({
  variant,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isMobile = variant === "mobile";

  const pills = [
    { label: "Themes", color: P.cyberCyan, x: -360, y: -130 },
    { label: "Badges", color: P.neonGreen, x: 340, y: -160 },
    { label: "Stats", color: P.electricBlue, x: -320, y: 150 },
    { label: "Flair", color: P.plasmaViolet, x: 310, y: 160 },
  ];

  return (
    <FeatureScene
      variant={variant}
      duration={duration}
      tag="PERSONALIZATION"
      tagColor={P.cyberCyan}
      headline="Your profile. Your identity."
      highlightWords={["identity."]}
      subtext="Themes, badges, stat modules — competitive identity at depth."
      screenshotSrc="Assets/Social-profile.png"
      glowColor={P.glowCyan}
      enableMacroZoom
    >
      {/* Orbiting feature pills */}
      {pills.map((pill, i) => {
        const enter = spring({
          frame: frame - 40 - i * 10,
          fps,
          config: SPRING_SNAPPY,
        });
        const float = Math.sin(frame * 0.025 + i * 1.8) * 6;
        const mScale = isMobile ? 0.8 : 1;

        return (
          <div
            key={pill.label}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translate(${pill.x * enter * mScale}px, ${(pill.y * enter + float) * mScale}px) scale(${enter})`,
              opacity: enter,
              ...glass({ blur: 20, opacity: 0.06, border: `${pill.color}40`, radius: 10 }),
              padding: "9px 18px",
              fontSize: isMobile ? 18 : 15,
              color: P.text,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
              zIndex: 20,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: pill.color,
                boxShadow: `0 0 8px ${pill.color}`,
              }}
            />
            {pill.label}
          </div>
        );
      })}
    </FeatureScene>
  );
};

// ─── SCENE: Hero Moment — 3D Bracket Assembly ────────────────────────
// "The AI Reasoning Moment" — lattice structures pulsing into alignment

const HeroMomentScene: React.FC<{ variant: Variant; duration: number }> = ({
  variant,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isMobile = variant === "mobile";

  // 3D Camera path — continuous fly-through
  const cameraPhase = interpolate(frame, [0, duration], [0, 1], clamp);

  const tiltDown = interpolate(cameraPhase, [0, 0.3], [-10, -65], {
    ...clamp,
    easing: SNAP,
  });
  const tiltRecover = interpolate(cameraPhase, [0.3, 0.7], [-65, -15], {
    ...clamp,
    easing: SNAP,
  });
  const tilt = cameraPhase <= 0.3 ? tiltDown : tiltRecover;

  const yaw = interpolate(cameraPhase, [0, 0.5, 1], [12, -8, 3], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });

  const zoom = interpolate(cameraPhase, [0, 0.4, 0.8, 1], [0.85, 1.05, 1.15, 1.08], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });

  const enter = spring({ frame, fps, config: SPRING_SMOOTH });

  // Bracket structure
  const nodes = [
    // Round 1 Left
    { x: 120, y: 160, tier: 0 }, { x: 120, y: 260, tier: 0 },
    { x: 120, y: 380, tier: 0 }, { x: 120, y: 480, tier: 0 },
    { x: 120, y: 560, tier: 0 }, { x: 120, y: 660, tier: 0 },
    // Round 2 Left
    { x: 320, y: 210, tier: 1 }, { x: 320, y: 430, tier: 1 },
    { x: 320, y: 610, tier: 1 },
    // Round 3 Left
    { x: 520, y: 320, tier: 2 }, { x: 520, y: 520, tier: 2 },
    // Semi Left
    { x: 700, y: 420, tier: 3 },
    // ── Right mirror ──
    { x: 1200, y: 160, tier: 0 }, { x: 1200, y: 260, tier: 0 },
    { x: 1200, y: 380, tier: 0 }, { x: 1200, y: 480, tier: 0 },
    { x: 1200, y: 560, tier: 0 }, { x: 1200, y: 660, tier: 0 },
    { x: 1000, y: 210, tier: 1 }, { x: 1000, y: 430, tier: 1 },
    { x: 1000, y: 610, tier: 1 },
    { x: 800, y: 320, tier: 2 }, { x: 800, y: 520, tier: 2 },
    { x: 620, y: 420, tier: 3 },
    // Champion
    { x: 660, y: 420, tier: 4 },
  ];

  const connections = [
    // Left R1→R2
    { x1: 130, y1: 210, x2: 310, y2: 210 },
    { x1: 130, y1: 430, x2: 310, y2: 430 },
    { x1: 130, y1: 610, x2: 310, y2: 610 },
    // Left R2→R3
    { x1: 330, y1: 320, x2: 510, y2: 320 },
    { x1: 330, y1: 520, x2: 510, y2: 520 },
    // Left R3→Semi
    { x1: 530, y1: 420, x2: 690, y2: 420 },
    // Right mirror
    { x1: 1010, y1: 210, x2: 1190, y2: 210 },
    { x1: 1010, y1: 430, x2: 1190, y2: 430 },
    { x1: 1010, y1: 610, x2: 1190, y2: 610 },
    { x1: 810, y1: 320, x2: 990, y2: 320 },
    { x1: 810, y1: 520, x2: 990, y2: 520 },
    { x1: 630, y1: 420, x2: 790, y2: 420 },
    // Finals
    { x1: 650, y1: 420, x2: 670, y2: 420 },
  ];

  // Data flow pulse — light traveling along connections
  const pulsePhase = (frame * 0.025) % 1;

  return (
    <AbsoluteFill>
      {/* Scene glow */}
      <GlowEmitter color={P.glowGreen} opacity={0.3} size={800} x="50%" y="50%" blur={120} />
      <GlowEmitter color={P.glowBlue} opacity={0.2} size={500} x="30%" y="35%" blur={100} />
      <GlowEmitter color={P.glowViolet} opacity={0.15} size={500} x="70%" y="65%" blur={100} />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? 80 : 36,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <SectionLabel text="SIGNATURE FEATURE" color={P.neonGreen} delay={0} />
        <KineticText
          text="Brackets. Engineered for momentum."
          fontSize={isMobile ? 48 : 44}
          delay={5}
          wordDelay={4}
          highlightWords={["momentum."]}
          highlightColor={P.neonGreen}
          textAlign="center"
        />
      </div>

      {/* 3D Bracket visualization */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: enter,
        }}
      >
        <div
          style={{
            width: isMobile ? 960 : 1340,
            height: isMobile ? 680 : 800,
            transformStyle: "preserve-3d",
            transform: `scale(${zoom}) rotateX(${tilt}deg) rotateY(${yaw}deg)`,
          }}
        >
          {/* Glass backdrop */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              ...glass({ blur: 32, opacity: 0.03, border: `${P.neonGreen}18`, radius: 28 }),
              background: `linear-gradient(160deg, rgba(12,16,24,0.9) 0%, rgba(8,10,16,0.5) 50%, rgba(6,8,12,0.92) 100%)`,
            }}
          />

          {/* Connection lines with data-flow pulse */}
          {connections.map((conn, idx) => {
            const len = Math.hypot(conn.x2 - conn.x1, conn.y2 - conn.y1);
            const angle = (Math.atan2(conn.y2 - conn.y1, conn.x2 - conn.x1) * 180) / Math.PI;
            const reveal = interpolate(frame, [idx * 12 + 10, idx * 12 + 45], [0, 1], {
              ...clamp,
              easing: EXPO_OUT,
            });

            const tierColor = idx < 6
              ? P.cyberCyan
              : idx < 12
                ? P.electricBlue
                : P.neonGreen;

            return (
              <React.Fragment key={`conn-${idx}`}>
                {/* Base line */}
                <div
                  style={{
                    position: "absolute",
                    left: conn.x1,
                    top: conn.y1,
                    width: len * reveal,
                    height: 2,
                    borderRadius: 999,
                    transformOrigin: "left center",
                    transform: `rotate(${angle}deg)`,
                    background: `linear-gradient(90deg, ${tierColor}90, ${tierColor}50)`,
                    boxShadow: `0 0 12px ${tierColor}50`,
                  }}
                />
                {/* Pulse traveling along line */}
                {reveal > 0.9 && (
                  <div
                    style={{
                      position: "absolute",
                      left: conn.x1 + (conn.x2 - conn.x1) * ((pulsePhase + idx * 0.07) % 1),
                      top: conn.y1 + (conn.y2 - conn.y1) * ((pulsePhase + idx * 0.07) % 1),
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: P.white,
                      boxShadow: `0 0 12px ${tierColor}, 0 0 24px ${tierColor}80`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}

          {/* Nodes */}
          {nodes.map((node, idx) => {
            const nodeEnter = spring({
              frame: frame - idx * 4 - 8,
              fps,
              durationInFrames: 30,
              config: SPRING_SNAPPY,
            });

            const isChampion = node.tier === 4;
            const size = isChampion ? 28 : 12 + node.tier * 3;
            const glowSize = isChampion ? 2.5 : 1 + node.tier * 0.3;

            const tierColor = node.tier <= 1
              ? P.cyberCyan
              : node.tier <= 2
                ? P.electricBlue
                : node.tier <= 3
                  ? P.plasmaViolet
                  : P.neonGreen;

            // "Breathing" glow on champion
            const breathe = isChampion
              ? 0.7 + Math.sin(frame * 0.06) * 0.3
              : 1;

            return (
              <div
                key={`node-${idx}`}
                style={{
                  position: "absolute",
                  left: node.x,
                  top: node.y,
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  background: isChampion
                    ? `radial-gradient(circle, ${P.white} 0%, ${P.neonGreen} 40%, ${P.cyberCyan}80 100%)`
                    : `radial-gradient(circle, ${P.text}E0 0%, ${tierColor}B0 60%, ${tierColor}40 100%)`,
                  boxShadow: `0 0 ${14 * glowSize}px ${tierColor}${Math.round(breathe * 99).toString().padStart(2, "0")}`,
                  transform: `translate(-50%, -50%) scale(${nodeEnter})`,
                  opacity: nodeEnter,
                }}
              />
            );
          })}

          {/* Champion label */}
          {(() => {
            const labelOp = interpolate(frame, [150, 180], [0, 1], clamp);
            return (
              <div
                style={{
                  position: "absolute",
                  left: 660,
                  top: 365,
                  transform: "translate(-50%, 0)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: P.neonGreen,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  textShadow: `0 0 20px ${P.neonGreen}80`,
                  opacity: labelOp,
                }}
              >
                CHAMPION
              </div>
            );
          })()}
        </div>
      </div>

      {/* Light streak at peak moment */}
      <LightStreak
        progress={interpolate(frame, [duration * 0.3, duration * 0.5], [0, 1], clamp)}
        color={P.neonGreen}
        y="52%"
      />
    </AbsoluteFill>
  );
};

// ─── SCENE: Outro — CTA Close ────────────────────────────────────────

const OutroScene: React.FC<{ variant: Variant; duration: number }> = ({
  variant,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isMobile = variant === "mobile";

  const logoEnter = spring({ frame, fps, config: SPRING_BOUNCY });
  const titleEnter = spring({ frame: frame - 18, fps, config: SPRING_SNAPPY });
  const tagEnter = spring({ frame: frame - 35, fps, config: SPRING_SMOOTH });
  const ctaEnter = spring({ frame: frame - 55, fps, config: SPRING_SNAPPY });

  // Closing bracket animation
  const bracketProgress = interpolate(frame, [0, 50], [0, 1], {
    ...clamp,
    easing: SNAP,
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background glow burst */}
      <GlowEmitter color={P.glowGreen} size={700} opacity={0.4 * logoEnter} />
      <GlowEmitter color={P.glowBlue} size={500} opacity={0.25 * logoEnter} y="55%" />

      {/* Animated closing brackets [ ] */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: isMobile ? "28%" : "32%",
          transform: `translate(calc(-50% + ${interpolate(bracketProgress, [0, 1], [-250, -90], clamp)}px), -50%)`,
          fontSize: isMobile ? 200 : 160,
          fontWeight: 200,
          color: P.cyberCyan,
          opacity: bracketProgress * 0.25,
          textShadow: `0 0 60px ${P.cyberCyan}50`,
        }}
      >
        [
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: isMobile ? "28%" : "32%",
          transform: `translate(calc(-50% + ${interpolate(bracketProgress, [0, 1], [250, 90], clamp)}px), -50%)`,
          fontSize: isMobile ? 200 : 160,
          fontWeight: 200,
          color: P.neonGreen,
          opacity: bracketProgress * 0.25,
          textShadow: `0 0 60px ${P.neonGreen}50`,
        }}
      >
        ]
      </div>

      {/* Logo */}
      <Img
        src={staticFile("logo.png")}
        style={{
          width: isMobile ? 180 : 140,
          height: "auto",
          opacity: logoEnter,
          transform: `scale(${interpolate(logoEnter, [0, 1], [0.5, 1], clamp)})`,
          filter: `drop-shadow(0 0 50px ${P.neonGreen}60) drop-shadow(0 12px 30px rgba(0,0,0,0.5))`,
          marginBottom: 24,
        }}
      />

      {/* Title */}
      <div
        style={{
          fontSize: isMobile ? 68 : 54,
          fontWeight: 900,
          color: P.text,
          letterSpacing: "0.06em",
          opacity: titleEnter,
          transform: `translateY(${interpolate(titleEnter, [0, 1], [25, 0], clamp)}px)`,
          textShadow: `0 0 60px ${P.cyberCyan}25`,
        }}
      >
        BRACKIFY
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 14,
          fontSize: isMobile ? 26 : 22,
          fontWeight: 300,
          letterSpacing: "0.08em",
          color: P.textSub,
          opacity: tagEnter,
          transform: `translateY(${interpolate(tagEnter, [0, 1], [15, 0], clamp)}px)`,
        }}
      >
        Create. Automate. Engage.
      </div>

      {/* CTA Button */}
      <div
        style={{
          marginTop: 34,
          padding: "16px 44px",
          borderRadius: 999,
          background: `linear-gradient(135deg, ${P.neonGreen}, ${P.cyberCyan})`,
          fontSize: isMobile ? 24 : 20,
          fontWeight: 700,
          color: P.void,
          letterSpacing: "0.04em",
          opacity: ctaEnter,
          transform: `translateY(${interpolate(ctaEnter, [0, 1], [20, 0], clamp)}px) scale(${interpolate(ctaEnter, [0, 1], [0.85, 1], clamp)})`,
          boxShadow: `0 8px 30px ${P.neonGreen}40, 0 0 80px ${P.neonGreen}15, inset 0 1px 0 rgba(255,255,255,0.3)`,
        }}
      >
        brackify.gg
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// §5  MAIN COMPOSITION — TransitionSeries with slide transitions
// ═══════════════════════════════════════════════════════════════════════

const scenes: Array<{
  id: string;
  Component: React.FC<{ variant: Variant; duration: number }>;
  duration: number;
  transition?: "slide" | "fade";
  transitionDir?: "from-left" | "from-right" | "from-bottom" | "from-top";
}> = [
  { id: "cold-open", Component: ColdOpenScene, duration: SCENE_FRAMES.coldOpen, transition: "fade" },
  { id: "logo-reveal", Component: LogoRevealScene, duration: SCENE_FRAMES.logoReveal, transition: "fade" },
  { id: "problem", Component: ProblemScene, duration: SCENE_FRAMES.problem, transition: "slide", transitionDir: "from-right" },
  { id: "solution-flash", Component: SolutionFlashScene, duration: SCENE_FRAMES.solutionFlash, transition: "fade" },
  { id: "search", Component: SearchScene, duration: SCENE_FRAMES.search, transition: "slide", transitionDir: "from-right" },
  { id: "brackets", Component: BracketsScene, duration: SCENE_FRAMES.brackets, transition: "slide", transitionDir: "from-bottom" },
  { id: "cross-events", Component: CrossEventsScene, duration: SCENE_FRAMES.crossEvents, transition: "slide", transitionDir: "from-left" },
  { id: "social-feed", Component: SocialFeedScene, duration: SCENE_FRAMES.socialFeed, transition: "slide", transitionDir: "from-right" },
  { id: "notifications", Component: NotificationsSceneWrapped, duration: SCENE_FRAMES.notifications, transition: "slide", transitionDir: "from-bottom" },
  { id: "media-news", Component: MediaNewsScene, duration: SCENE_FRAMES.mediaNews, transition: "slide", transitionDir: "from-right" },
  { id: "profile", Component: ProfileScene, duration: SCENE_FRAMES.profile, transition: "slide", transitionDir: "from-left" },
  { id: "hero-moment", Component: HeroMomentScene, duration: SCENE_FRAMES.heroMoment, transition: "fade" },
  { id: "outro", Component: OutroScene, duration: SCENE_FRAMES.outro, transition: "fade" },
];

const BrackifyLaunchNovaBase: React.FC<{ variant: Variant }> = ({ variant }) => {
  return (
    <AbsoluteFill
      style={{
        background: P.void,
        overflow: "hidden",
        fontFamily:
          '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <CinematicBackground variant={variant} />
      <FloatingMotes />

      <TransitionSeries>
        {scenes.map((scene, index) => {
          const elements: React.ReactNode[] = [];

          // Add transition before this scene (except first)
          if (index > 0 && scene.transition) {
            const presentation =
              scene.transition === "slide"
                ? slide({ direction: scene.transitionDir ?? "from-right" })
                : fade();

            elements.push(
              <TransitionSeries.Transition
                key={`trans-${scene.id}`}
                presentation={presentation}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />,
            );
          }

          // Add scene
          elements.push(
            <TransitionSeries.Sequence
              key={scene.id}
              durationInFrames={scene.duration}
            >
              <scene.Component variant={variant} duration={scene.duration} />
            </TransitionSeries.Sequence>,
          );

          return elements;
        })}
      </TransitionSeries>

      {/* Film grain overlay — always present */}
      <FilmGrain />

      {/* Persistent watermark logo */}
      <Watermark variant={variant} />
    </AbsoluteFill>
  );
};

// ─── Watermark ───────────────────────────────────────────────────────

const Watermark: React.FC<{ variant: Variant }> = ({ variant }) => {
  const frame = useCurrentFrame();
  const isMobile = variant === "mobile";

  // Only visible during feature scenes (after intro, before outro)
  const visible =
    frame > SCENE_FRAMES.coldOpen + SCENE_FRAMES.logoReveal + SCENE_FRAMES.problem + 60 &&
    frame < BRACKIFY_NOVA_DURATION - SCENE_FRAMES.outro - 30;

  const opacity = visible ? 0.5 : 0;

  return (
    <div
      style={{
        position: "absolute",
        top: isMobile ? 46 : 32,
        right: isMobile ? 46 : 32,
        opacity,
        transition: "opacity 0.3s",
        zIndex: 100,
      }}
    >
      <Img
        src={staticFile("logo.png")}
        style={{
          width: isMobile ? 48 : 32,
          height: "auto",
          filter: `drop-shadow(0 0 8px ${P.neonGreen}40) drop-shadow(0 4px 10px rgba(0,0,0,0.5))`,
        }}
      />
    </div>
  );
};

// ─── Exports ─────────────────────────────────────────────────────────

export const BrackifyLaunchNova: React.FC = () => {
  return <BrackifyLaunchNovaBase variant="desktop" />;
};

export const BrackifyLaunchNovaMobile: React.FC = () => {
  return <BrackifyLaunchNovaBase variant="mobile" />;
};

export default BrackifyLaunchNova;
