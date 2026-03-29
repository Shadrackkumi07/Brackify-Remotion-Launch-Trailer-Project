import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FilmGrain, Vignette } from "./FilmGrain";
import { Outro } from "../Outro";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const PALETTE = {
  ink: "#102033",
  inkSoft: "#4a5e76",
  cream: "#f6f2ea",
  mist: "#eef5ff",
  line: "rgba(16, 32, 51, 0.1)",
  white: "#ffffff",
  orange: "#ff7a45",
  orangeSoft: "#ffd7c5",
  sky: "#87d6ff",
  mint: "#66d9c3",
  blue: "#5a8eff",
  navy: "#16314d",
};

const ASSETS = {
  creation: staticFile("Team battle/TEAM BATTLE CREATION.png"),
  registrationProgress: staticFile(
    "Team battle/TEAM BATTLE TEAM REGISTRATION IN PROGRESS.png",
  ),
  registrationTeams: staticFile("Team battle/TEAM BATTLE TEAMS REGISTRATION.png"),
  inviteOnly: staticFile("Team battle/TEAM BATTLE BRACKET INVITE ONLY.png"),
  bracketLight: staticFile("Team battle/TEAM BATTLE BRACKET VIEW light mode.png"),
  bracketDark: staticFile("Team battle/TEAM BATTLE BRACKET VIEW dark mode.png"),
  admin: staticFile("Team battle/TEAM BATTLE ADMIN PANEL.png"),
  winners: staticFile("Team battle/TEAM BATTLE TOP WINNERS GRAPHICS.png"),
  logo: staticFile("logo.png"),
} as const;

export const TEAM_BATTLE_LAUNCH_FPS = 30;
export const TEAM_BATTLE_LAUNCH_DURATION = 1770;

const SCENES = {
  hero: { from: 0, duration: 155 },
  creation: { from: 155, duration: 235 },
  logic: { from: 390, duration: 195 },
  registration: { from: 585, duration: 275 },
  bracket: { from: 860, duration: 310 },
  admin: { from: 1170, duration: 235 },
  winners: { from: 1405, duration: 185 },
  outro: { from: 1590, duration: 180 },
} as const;

const cardSurface: React.CSSProperties = {
  border: `1px solid ${PALETTE.line}`,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.68) 100%)",
  boxShadow:
    "0 24px 80px rgba(18, 41, 69, 0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
  backdropFilter: "blur(18px)",
};

const BackgroundWash: React.FC = () => {
  const frame = useCurrentFrame();

  const driftA = Math.sin(frame * 0.018) * 70;
  const driftB = Math.cos(frame * 0.014) * 90;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, #f8f4ec 0%, #eef4ff 42%, #f8f7f2 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: -200,
          background:
            "radial-gradient(circle at 16% 22%, rgba(255,122,69,0.18) 0%, transparent 34%), radial-gradient(circle at 78% 18%, rgba(135,214,255,0.26) 0%, transparent 35%), radial-gradient(circle at 58% 78%, rgba(102,217,195,0.2) 0%, transparent 36%)",
          filter: "blur(28px)",
          transform: `translate3d(${driftA}px, ${driftB * 0.25}px, 0)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(16,32,51,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(16,32,51,0.045) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 40,
          borderRadius: 40,
          border: `1px solid ${PALETTE.line}`,
          opacity: 0.45,
        }}
      />
    </AbsoluteFill>
  );
};

const BrandMark: React.FC<{ light?: boolean }> = ({ light = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 18px 10px 12px",
        borderRadius: 999,
        transform: `scale(${interpolate(pop, [0, 1], [0.94, 1], clamp)})`,
        color: light ? PALETTE.white : PALETTE.ink,
        background: light ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.68)",
        border: `1px solid ${light ? "rgba(255,255,255,0.18)" : PALETTE.line}`,
        boxShadow: light
          ? "0 18px 44px rgba(4, 16, 29, 0.2)"
          : "0 18px 44px rgba(18, 41, 69, 0.08)",
      }}
    >
      <Img src={ASSETS.logo} style={{ width: 28, height: 28 }} />
      <div
        style={{
          fontFamily: '"Segoe UI Variable Display", "Aptos Display", "Inter", sans-serif',
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Team Battle Launch
      </div>
    </div>
  );
};

const Tag: React.FC<{
  label: string;
  tone?: "orange" | "sky" | "mint" | "ink";
}> = ({ label, tone = "ink" }) => {
  const colors = {
    orange: { bg: "rgba(255,122,69,0.14)", text: PALETTE.orange },
    sky: { bg: "rgba(90,142,255,0.12)", text: PALETTE.blue },
    mint: { bg: "rgba(102,217,195,0.14)", text: "#0f6f61" },
    ink: { bg: "rgba(16,32,51,0.08)", text: PALETTE.ink },
  }[tone];

  return (
    <div
      style={{
        padding: "10px 16px",
        borderRadius: 999,
        background: colors.bg,
        color: colors.text,
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </div>
  );
};

const CopyBlock: React.FC<{
  eyebrow: string;
  title: string;
  description: string;
  bullets?: string[];
  tags?: Array<{ label: string; tone?: "orange" | "sky" | "mint" | "ink" }>;
  align?: "left" | "right";
  invert?: boolean;
  sceneDuration?: number;
  titleColor?: string;
  descriptionStyle?: React.CSSProperties;
}> = ({ eyebrow, title, description, bullets = [], tags = [], align = "left", invert = false, sceneDuration = 120, titleColor, descriptionStyle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 180 },
  });
  const leave = interpolate(frame, [sceneDuration - 24, sceneDuration], [0, 1], clamp);
  const visibility = Math.max(0, enter - leave);
  const sideStyle = align === "left" ? { left: 110 } : { right: 110 };

  return (
    <div
      style={{
        position: "absolute",
        top: 110,
        width: 620,
        ...sideStyle,
        opacity: visibility,
        transform: `translateY(${interpolate(visibility, [0, 1], [48, 0], clamp)}px)`,
        color: invert ? PALETTE.white : PALETTE.ink,
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          borderRadius: 999,
          background: invert ? "rgba(255,255,255,0.12)" : "rgba(16,32,51,0.06)",
          border: `1px solid ${invert ? "rgba(255,255,255,0.16)" : PALETTE.line}`,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "0.11em",
          textTransform: "uppercase",
          marginBottom: 26,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontFamily: '"Segoe UI Variable Display", "Aptos Display", "Inter", sans-serif',
          fontSize: 72,
          lineHeight: 1,
          fontWeight: 760,
          letterSpacing: "-0.05em",
          textWrap: "balance",
          color: titleColor ?? undefined,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 20,
          maxWidth: 560,
          fontSize: 28,
          lineHeight: 1.4,
          color: invert ? "rgba(255,255,255,0.78)" : PALETTE.inkSoft,
          ...descriptionStyle,
        }}
      >
        {description}
      </div>
      {tags.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 28,
          }}
        >
          {tags.map((tag) => (
            <Tag key={tag.label} label={tag.label} tone={tag.tone} />
          ))}
        </div>
      ) : null}
      {bullets.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginTop: 28,
          }}
        >
          {bullets.map((bullet, index) => {
            const bulletIn = spring({
              frame: frame - 8 - index * 4,
              fps,
              config: { damping: 200 },
            });

            return (
              <div
                key={bullet}
                style={{
                  ...cardSurface,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: "18px 20px",
                  borderRadius: 24,
                  opacity: bulletIn,
                  transform: `translateX(${interpolate(bulletIn, [0, 1], [22, 0], clamp)}px)`,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    marginTop: 12,
                    borderRadius: 999,
                    background: index % 3 === 0 ? PALETTE.orange : index % 3 === 1 ? PALETTE.blue : PALETTE.mint,
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    fontSize: 22,
                    lineHeight: 1.45,
                    color: invert ? PALETTE.ink : PALETTE.ink,
                    fontWeight: 600,
                  }}
                >
                  {bullet}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

const FloatingCard: React.FC<{
  src: string;
  width: number;
  x: number;
  y: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  delay?: number;
  glow?: string;
  radius?: number;
}> = ({
  src,
  width,
  x,
  y,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  delay = 0,
  glow = "rgba(18, 41, 69, 0.14)",
  radius = 28,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inView = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });
  const drift = Math.sin((frame + delay) * 0.03) * 14;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width,
        aspectRatio: "16 / 9",
        borderRadius: radius,
        overflow: "hidden",
        ...cardSurface,
        boxShadow: `0 34px 80px ${glow}, inset 0 1px 0 rgba(255,255,255,0.78)`,
        opacity: inView,
        transform: `translate(-50%, -50%) translate3d(${x}px, ${y + drift}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${interpolate(inView, [0, 1], [0.9, 1], clamp)})`,
        zIndex: 1,
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
};

const FeatureTile: React.FC<{
  label: string;
  value: string;
  x: number;
  y: number;
  tone?: "orange" | "sky" | "mint";
  delay?: number;
}> = ({ label, value, x, y, tone = "orange", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inView = spring({
    frame: frame - delay,
    fps,
    config: { damping: 180 },
  });

  const accent = {
    orange: PALETTE.orange,
    sky: PALETTE.blue,
    mint: "#13937b",
  }[tone];

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 240,
        borderRadius: 24,
        padding: "18px 20px",
        ...cardSurface,
        opacity: inView,
        transform: `translateY(${interpolate(inView, [0, 1], [20, 0], clamp)}px)`,
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: PALETTE.inkSoft,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 28,
          fontWeight: 760,
          lineHeight: 1.1,
          color: accent,
        }}
      >
        {value}
      </div>
    </div>
  );
};

const LogicModeCard: React.FC<{
  title: string;
  body: string;
  tone: "orange" | "sky" | "mint";
  x: number;
  y: number;
  delay: number;
}> = ({ title, body, tone, x, y, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inView = spring({
    frame: frame - delay,
    fps,
    config: { damping: 180 },
  });

  const colors = {
    orange: { stroke: PALETTE.orange, glow: "rgba(255,122,69,0.24)" },
    sky: { stroke: PALETTE.blue, glow: "rgba(90,142,255,0.24)" },
    mint: { stroke: "#13937b", glow: "rgba(102,217,195,0.28)" },
  }[tone];

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 410,
        minHeight: 162,
        padding: "24px 26px",
        borderRadius: 28,
        ...cardSurface,
        border: `1px solid ${colors.stroke}33`,
        boxShadow: `0 30px 70px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.86)`,
        opacity: inView,
        transform: `translateY(${interpolate(inView, [0, 1], [36, 0], clamp)}px) rotate(${interpolate(inView, [0, 1], [3, 0], clamp)}deg)`,
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: 64,
          height: 6,
          borderRadius: 999,
          background: colors.stroke,
          marginBottom: 18,
        }}
      />
      <div
        style={{
          fontSize: 30,
          fontWeight: 760,
          color: PALETTE.ink,
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 21,
          lineHeight: 1.45,
          color: PALETTE.inkSoft,
          fontWeight: 600,
        }}
      >
        {body}
      </div>
    </div>
  );
};

const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Image position and size controls - adjust these numbers to move/resize images
  const IMAGE_1_X = 190;
  const IMAGE_1_Y = -240;
  const IMAGE_1_SIZE = 920;
  const IMAGE_2_X = 580;
  const IMAGE_2_Y = 90;
  const IMAGE_2_SIZE = 900;
  const IMAGE_3_X = 30;
  const IMAGE_3_Y = 300;
  const IMAGE_3_SIZE = 680;

  const reveal = spring({ frame, fps, config: { damping: 180 } });
  const titleY = interpolate(reveal, [0, 1], [48, 0], clamp);
  const titleScale = interpolate(reveal, [0, 1], [0.94, 1], clamp);

  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      {/* Images - rendered first so they appear behind text */}
      <FloatingCard
        src={ASSETS.registrationTeams}
        width={IMAGE_1_SIZE}
        x={IMAGE_1_X}
        y={IMAGE_1_Y}
        rotateX={8}
        rotateY={-20}
        rotateZ={7}
        delay={8}
        glow="rgba(255,122,69,0.24)"
      />
      <FloatingCard
        src={ASSETS.bracketDark}
        width={IMAGE_2_SIZE}
        x={IMAGE_2_X}
        y={IMAGE_2_Y}
        rotateX={11}
        rotateY={-14}
        rotateZ={-5}
        delay={14}
        glow="rgba(90,142,255,0.24)"
      />
      <FloatingCard
        src={ASSETS.winners}
        width={IMAGE_3_SIZE}
        x={IMAGE_3_X}
        y={IMAGE_3_Y}
        rotateX={15}
        rotateY={-22}
        rotateZ={11}
        delay={20}
        glow="rgba(102,217,195,0.22)"
      />

      {/* Text - rendered after images so it appears on top */}
      <div style={{ position: "absolute", top: 70, left: 90, zIndex: 10 }}>
        <BrandMark />
      </div>

      <div
        style={{
          position: "absolute",
          left: 96,
          top: 210,
          width: 770,
          opacity: reveal,
          transform: `translateY(${titleY}px) scale(${titleScale})`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: '"Segoe UI Variable Display", "Aptos Display", "Inter", sans-serif',
            fontSize: 96,
            lineHeight: 0.94,
            letterSpacing: "-0.06em",
            fontWeight: 800,
            color: PALETTE.ink,
            textWrap: "balance",
          }}
        >
          Team Battle turns every tournament into a broadcast-ready presentation.
        </div>
        <div
          style={{
            marginTop: 28,
            maxWidth: 660,
            fontSize: 30,
            lineHeight: 1.42,
            color: PALETTE.inkSoft,
            fontWeight: 600,
          }}
        >
          Build teams, invite captains, run adaptive brackets, score live, and export polished winners graphics from one enterprise-grade flow.
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 30 }}>
          <Tag label="2 to 8 teams" tone="orange" />
          <Tag label="1v1 to 5v5+" tone="sky" />
          <Tag label="Live scoring" tone="mint" />
          <Tag label="4K exports" tone="ink" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CreationScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Image position controls - adjust these numbers to move image
  const IMAGE_X = 200;
  const IMAGE_Y = 200;
  const IMAGE_SIZE = 1200;

  const zoom = interpolate(frame, [0, 235], [1.45, 1.32], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      {/* Image - rendered first so it appears behind text */}
      <div
        style={{
          position: "absolute",
          right: IMAGE_X,
          top: IMAGE_Y,
          width: IMAGE_SIZE,
          aspectRatio: "16 / 9",
          borderRadius: 34,
          overflow: "hidden",
          ...cardSurface,
          boxShadow: "0 40px 100px rgba(18, 41, 69, 0.16)",
          transform: `rotateY(-8deg) rotateX(3deg) scale(${zoom})`,
          zIndex: 1,
        }}
      >
        <Img
          src={ASSETS.creation}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Text - rendered after image so it appears on top */}
      <CopyBlock
        eyebrow="01 · Creation"
        title="Spin up Team Battle in minutes."
        description="The creation flow keeps setup fast while still letting organizers define scale, team size, and the exact competitive format they want to run."
        align="left"
        sceneDuration={235}
        tags={[
          { label: 'Format: Team Battle', tone: 'orange' },
          { label: 'Scale: 2 to 8 teams', tone: 'sky' },
          { label: 'Size: 1v1 to 10v10', tone: 'mint' },
        ]}
        bullets={[
          'Select Team Battle directly from the Bracket Creation Wizard.',
          'Set team count and player count per team without leaving the flow.',
          'Choose Team Battle format - Public or Invite-only'
        ]}
        titleColor={PALETTE.orange}
        descriptionStyle={{
          color: "black",
          WebkitTextStroke: "0.5px white",
        }}
      />
    </AbsoluteFill>
  );
};

const LogicScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <CopyBlock
        eyebrow="02 · Bracket Logic"
        title="The bracket restructures itself for the format you choose."
        description="Team Battle handles standard elimination, odd-team byes, and six-team finals seeding without forcing admins into manual bracket workarounds."
        align="left"
        sceneDuration={195}
        bullets={[
          '2, 4, and 8 teams follow a direct-elimination path.',
          '3, 5, and 7 teams use a seeded bye system for the top slot you choose.',
          '6-team events support a direct finals seed so one Round 1 winner can jump ahead.',
        ]}
      />

      <LogicModeCard
        title="Standard progression"
        body="Use the classic direct-elimination structure for even-team brackets."
        tone="orange"
        x={980}
        y={150}
        delay={8}
      />
      <LogicModeCard
        title="Bye system"
        body="For odd team counts, admins assign the top-seeded pass into the next stage."
        tone="sky"
        x={1080}
        y={350}
        delay={18}
      />
      <LogicModeCard
        title="Direct finals seed"
        body="In six-team formats, move one Round 1 winner directly into Finals when the event format demands it."
        tone="mint"
        x={980}
        y={560}
        delay={28}
      />

      <div
        style={{
          position: "absolute",
          left: 900,
          top: 225,
          width: 160,
          height: 480,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 0,
            width: 2,
            height: 480,
            background: "linear-gradient(180deg, rgba(255,122,69,0.26) 0%, rgba(90,142,255,0.24) 45%, rgba(102,217,195,0.3) 100%)",
          }}
        />
        {[80, 240, 400].map((top, index) => (
          <div
            key={top}
            style={{
              position: "absolute",
              left: 0,
              top,
              width: 120,
              height: 2,
              background: index === 0 ? "rgba(255,122,69,0.3)" : index === 1 ? "rgba(90,142,255,0.3)" : "rgba(102,217,195,0.3)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const RegistrationScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Image position controls - adjust these numbers to move image
  const IMAGE_X = 200;
  const IMAGE_Y = 200;
  const IMAGE_SIZE = 1320;

  const zoom = interpolate(frame, [0, 275], [1.32, 1.18], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ perspective: 1900 }}>
      {/* Image - rendered first so it appears behind text */}
      <div
        style={{
          position: "absolute",
          right: IMAGE_X,
          top: IMAGE_Y,
          width: IMAGE_SIZE,
          aspectRatio: "16 / 9",
          borderRadius: 36,
          overflow: "hidden",
          ...cardSurface,
          boxShadow: "0 44px 110px rgba(18, 41, 69, 0.18)",
          transform: `rotateY(-7deg) rotateX(3deg) scale(${zoom})`,
          zIndex: 1,
        }}
      >
        <Img
          src={ASSETS.registrationTeams}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Text - rendered after image so it appears on top */}
      <CopyBlock
        eyebrow="03 · Registration"
        title="Give captains an open lobby or a closed invitation path."
        description="Admins decide how teams enter. Captains own their team identity, roster, branding, and claim flow from the start."
        align="left"
        sceneDuration={275}
        tags={[
          { label: 'Public: Claim Team', tone: 'orange' },
          { label: 'Invite-only: Secure access', tone: 'sky' },
          { label: 'Captain-managed identity', tone: 'mint' },
        ]}
        bullets={[
          'Public mode keeps empty slots open to any signed-in user on a first-come basis.',
          'Invite-only mode lets admins send secure, single-use email invites to the right captains.',
          'Teams can carry a name, logo, brand color, background, and roster from day one.'
        ]}
        titleColor={PALETTE.orange}
        descriptionStyle={{
          color: "black",
          WebkitTextStroke: "0.5px white",
        }}
      />
    </AbsoluteFill>
  );
};

const BracketScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Image position controls - adjust these numbers to move image
  const IMAGE_X = 70;
  const IMAGE_Y = 106;
  const IMAGE_SIZE = 1500;

  const mainScale = interpolate(frame, [0, 310], [1.02, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  const lightOpacity = interpolate(frame, [0, 120, 190, 310], [1, 1, 0, 0], clamp);
  const darkOpacity = interpolate(frame, [0, 120, 190, 310], [0, 0, 1, 1], clamp);

  return (
    <AbsoluteFill style={{ perspective: 2000 }}>
      {/* Images - rendered first so they appear behind text */}
      <div
        style={{
          position: "absolute",
          right: IMAGE_X,
          top: IMAGE_Y,
          width: IMAGE_SIZE,
          aspectRatio: "16 / 9",
          borderRadius: 34,
          overflow: "hidden",
          ...cardSurface,
          transform: `rotateY(-6deg) rotateX(2deg) scale(${mainScale})`,
          boxShadow: "0 44px 120px rgba(18, 41, 69, 0.18)",
          opacity: lightOpacity,
          zIndex: 1,
        }}
      >
        <Img src={ASSETS.bracketLight} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      <div
        style={{
          position: "absolute",
          right: IMAGE_X,
          top: IMAGE_Y,
          width: IMAGE_SIZE,
          aspectRatio: "16 / 9",
          borderRadius: 34,
          overflow: "hidden",
          ...cardSurface,
          transform: `rotateY(-6deg) rotateX(2deg) scale(${mainScale})`,
          boxShadow: "0 44px 120px rgba(18, 41, 69, 0.18)",
          opacity: darkOpacity,
          zIndex: 1,
        }}
      >
        <Img src={ASSETS.bracketDark} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Text - rendered after images so it appears on top */}
      <CopyBlock
        eyebrow="04 · Bracket View"
        title="Run the match live, score it live, and present it live."
        description="The Team Battle bracket view is designed for spectators, broadcasters, and tournament staff who need every update to land instantly without refreshing the page."
        align="left"
        sceneDuration={310}
        bullets={[
          'Admins eliminate players with a red X and the opposing side gets the point immediately.',
          'Mistakes are reversible before the match is finalized, keeping the desk in control.',
          'Every Team Battle  tab is exportable as a 4K graphic. Embed brackets into your stream overlays ( OBS or any capture software '
        ]}
        titleColor={PALETTE.orange}
        descriptionStyle={{
          color: "black",
          WebkitTextStroke: "0.5px white",
        }}
      />
    </AbsoluteFill>
  );
};

const AdminScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Image position controls - adjust these numbers to move image
  const IMAGE_X = 300;
  const IMAGE_Y = 250; 
  const IMAGE_SIZE = 1200;

  const zoom = interpolate(frame, [0, 235], [1.38, 1.24], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ perspective: 1900 }}>
      {/* Image - rendered first so it appears behind text */}
      <div
        style={{
          position: "absolute",
          left: IMAGE_X,
          top: IMAGE_Y,
          width: IMAGE_SIZE,
          aspectRatio: "16 / 9",
          borderRadius: 34,
          overflow: "hidden",
          ...cardSurface,
          transform: `rotateY(6deg) rotateX(2deg) scale(${zoom})`,
          boxShadow: "0 40px 100px rgba(18, 41, 69, 0.18)",
          zIndex: 1,
        }}
      >
        <Img src={ASSETS.admin} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Text - rendered after image so it appears on top */}
      <CopyBlock
        eyebrow="05 · Admin Controls"
        title="The event desk gets full control without leaving the bracket."
        description="From match flow to global branding, Team Battle centralizes the switches that keep the event polished from check-in to finals."
        align="right"
        sceneDuration={235}
        tags={[
          { label: 'Advance winners', tone: 'orange' },
          { label: 'Randomize seeds', tone: 'sky' },
          { label: 'Discord + Twitch', tone: 'mint' },
        ]}
        bullets={[
          'Advance winners, edit round labels, and reset the bracket when you need a clean restart.',
          'Apply a global branded background overlay across match tabs for a consistent event package.',
          'Broadcast tournament movement automatically to Discord and Twitch through integrated announcements.',
        ]}
        titleColor={PALETTE.orange}
        descriptionStyle={{
          color: "black",
          WebkitTextStroke: "0.5px white",
        }}
      />
    </AbsoluteFill>
  );
};

const WinnersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const shimmer = 0.65 + Math.sin(frame * 0.05) * 0.1;

  // Image position controls - adjust these numbers to move image
  const IMAGE_X = 80;
  const IMAGE_Y = 200;
  const IMAGE_SIZE = 1200;

  return (
    <AbsoluteFill style={{ perspective: 1900 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,122,69,0.12) 0%, transparent 34%, rgba(90,142,255,0.08) 100%)",
        }}
      />

      {/* Image - rendered first so it appears behind text */}
      <div
        style={{
          position: "absolute",
          right: IMAGE_X,
          top: IMAGE_Y,
          width: IMAGE_SIZE,
          aspectRatio: "16 / 9",
          borderRadius: 36,
          overflow: "hidden",
          ...cardSurface,
          boxShadow: `0 40px 100px rgba(255,122,69,${0.18 * shimmer}), 0 20px 80px rgba(18, 41, 69, 0.14)`,
          transform: "rotateY(-6deg) rotateX(3deg)",
          zIndex: 1,
        }}
      >
        <Img src={ASSETS.winners} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Text - rendered after image so it appears on top */}
      <CopyBlock
        eyebrow="06 · Winners Export"
        title="The tournament ends with a ready-to-publish winners package."
        description="As soon as Team Battle finishes, admins can generate polished Top Winners graphics and customize the final presentation for sponsors, socials, and stream recaps."
        align="left"
        sceneDuration={185}
        bullets={[
          'Generate the top winners team graphic instantly when the bracket closes.',
          'Adjust branding, style, and presentation details for the final result card.',
          'Turn the last frame of the event into a shareable asset instead of extra design work.',
        ]}
        titleColor={PALETTE.orange}
      />
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  return <Outro />;
};

export const TeamBattleLaunch: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.cream }}>
      <BackgroundWash />

      <Sequence from={SCENES.hero.from} durationInFrames={SCENES.hero.duration}>
        <HeroScene />
      </Sequence>

      <Sequence from={SCENES.creation.from} durationInFrames={SCENES.creation.duration}>
        <CreationScene />
      </Sequence>

      <Sequence from={SCENES.logic.from} durationInFrames={SCENES.logic.duration}>
        <LogicScene />
      </Sequence>

      <Sequence from={SCENES.registration.from} durationInFrames={SCENES.registration.duration}>
        <RegistrationScene />
      </Sequence>

      <Sequence from={SCENES.bracket.from} durationInFrames={SCENES.bracket.duration}>
        <BracketScene />
      </Sequence>

      <Sequence from={SCENES.admin.from} durationInFrames={SCENES.admin.duration}>
        <AdminScene />
      </Sequence>

      <Sequence from={SCENES.winners.from} durationInFrames={SCENES.winners.duration}>
        <WinnersScene />
      </Sequence>

      <Sequence from={SCENES.outro.from} durationInFrames={SCENES.outro.duration}>
        <OutroScene />
      </Sequence>

      <FilmGrain intensity={0.025} size={2.6} />
      <Vignette intensity={0.14} innerRadius={54} />
    </AbsoluteFill>
  );
};

export default TeamBattleLaunch;