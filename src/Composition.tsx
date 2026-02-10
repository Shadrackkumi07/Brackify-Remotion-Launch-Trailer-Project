import { AbsoluteFill, Series, useVideoConfig } from "remotion";
import {
  BorderFrame,
  IntroScene,
  IsometricBentoGrid,
  KineticTypography,
  TournamentBracket,
  OrganizeUI,
  OutroScene,
  InteractiveShowcase,
  FilmGrain,
  Vignette,
} from "./components";

export const MyComposition = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Persistent border frame overlay */}
      <BorderFrame />

      {/* Sequenced scenes */}
      <Series>
        {/* Intro: 0-1s (30 frames) */}
        <Series.Sequence durationInFrames={1 * fps}>
          <IntroScene />
        </Series.Sequence>

        {/* Isometric Bento Grid - Tournament Discovery: 1-4s (90 frames with snap-zoom) */}
        <Series.Sequence durationInFrames={3 * fps}>
          <IsometricBentoGrid />
        </Series.Sequence>

        {/* Interactive Showcase - Hand gestures & haptic UI: 4-7s (90 frames) */}
        <Series.Sequence durationInFrames={3 * fps}>
          <InteractiveShowcase />
        </Series.Sequence>

        {/* Kinetic Typography: 7-8s (30 frames) */}
        <Series.Sequence durationInFrames={1 * fps}>
          <KineticTypography />
        </Series.Sequence>

        {/* Tournament Bracket: 8-10s (60 frames) */}
        <Series.Sequence durationInFrames={2 * fps}>
          <TournamentBracket />
        </Series.Sequence>

        {/* Organize UI: 10-12s (60 frames) */}
        <Series.Sequence durationInFrames={2 * fps}>
          <OrganizeUI />
        </Series.Sequence>

        {/* Outro: 12-14s (60 frames) */}
        <Series.Sequence durationInFrames={2 * fps}>
          <OutroScene />
        </Series.Sequence>
      </Series>

      {/* Premium cinematic overlays */}
      <FilmGrain intensity={0.06} size={2} />
      <Vignette intensity={0.35} innerRadius={50} />
    </AbsoluteFill>
  );
};
