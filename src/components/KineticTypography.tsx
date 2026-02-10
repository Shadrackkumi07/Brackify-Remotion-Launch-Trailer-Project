import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { ClickRipple } from "./Cursor";

export const KineticTypography: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Flash effect at the start
  const flashOpacity = interpolate(frame, [0, 3, 8], [1, 1, 0], {
    extrapolateRight: "clamp",
  });

  // High-tension mask reveal (fast start, slow settle)
  const revealSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 180 },
  });

  const clipWidth = interpolate(revealSpring, [0, 1], [0, 100]);

  // Haptic scale bounce (1.0 -> 0.95 -> 1.05 -> 1.0)
  const bounceSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 8, stiffness: 400 },
  });

  const scale = frame > 5
    ? interpolate(bounceSpring, [0, 0.3, 0.6, 1], [1.15, 0.98, 1.08, 1])
    : interpolate(revealSpring, [0, 1], [1.2, 1]);

  // Subtle shake for impact
  const shakeX = frame < 10 ? Math.sin(frame * 8) * 4 : 0;
  const shakeY = frame < 10 ? Math.cos(frame * 6) * 3 : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Flash overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: "#ffffff",
          opacity: flashOpacity,
          zIndex: 10,
        }}
      />

      {/* Click ripple on impact */}
      <ClickRipple
        x={width / 2}
        y={height / 2}
        startFrame={3}
        color="rgba(249, 115, 22, 0.6)"
      />

      {/* Background glow - animated */}
      <div
        style={{
          position: "absolute",
          width: 600 + revealSpring * 100,
          height: 200 + revealSpring * 50,
          background: `radial-gradient(ellipse, rgba(249, 115, 22, 0.35) 0%, transparent 70%)`,
          filter: "blur(40px)",
          opacity: revealSpring,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 600 + revealSpring * 80,
          height: 200 + revealSpring * 40,
          background: `radial-gradient(ellipse, rgba(34, 197, 94, 0.25) 0%, transparent 70%)`,
          filter: "blur(60px)",
          transform: "translate(50px, 30px)",
          opacity: revealSpring,
        }}
      />

      {/* Main text with mask reveal */}
      <div
        style={{
          transform: `scale(${scale}) translate(${shakeX}px, ${shakeY}px)`,
          clipPath: `inset(0 ${50 - clipWidth / 2}% 0 ${50 - clipWidth / 2}%)`,
        }}
      >
        <h1
          style={{
            fontSize: 160,
            fontWeight: 900,
            color: "#ffffff",
            margin: 0,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: -6,
            textTransform: "uppercase",
            textShadow: `
              0 0 40px rgba(249, 115, 22, 0.4),
              0 4px 20px rgba(0, 0, 0, 0.5)
            `,
          }}
        >
          COMPETE
        </h1>
      </div>

      {/* Accent lines with staggered reveal */}
      <div
        style={{
          position: "absolute",
          bottom: "32%",
          display: "flex",
          gap: 12,
        }}
      >
        <div
          style={{
            width: interpolate(revealSpring, [0, 1], [0, 100]),
            height: 5,
            backgroundColor: "#f97316",
            borderRadius: 3,
            boxShadow: "0 0 15px rgba(249, 115, 22, 0.5)",
          }}
        />
        <div
          style={{
            width: interpolate(revealSpring, [0.2, 1], [0, 80]),
            height: 5,
            backgroundColor: "#22c55e",
            borderRadius: 3,
            boxShadow: "0 0 15px rgba(34, 197, 94, 0.5)",
          }}
        />
        <div
          style={{
            width: interpolate(revealSpring, [0.4, 1], [0, 60]),
            height: 5,
            backgroundColor: "#92400e",
            borderRadius: 3,
            boxShadow: "0 0 15px rgba(146, 64, 14, 0.5)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
