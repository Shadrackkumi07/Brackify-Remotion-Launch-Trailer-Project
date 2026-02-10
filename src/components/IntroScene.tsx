import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { ClickRipple } from "./Cursor";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Main scale entrance with high-tension spring (fast start, slow settle)
  const scaleSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const scale = interpolate(scaleSpring, [0, 1], [0.3, 1]);
  const opacity = interpolate(scaleSpring, [0, 1], [0, 1]);

  // Haptic bounce effect (1.0 -> 0.95 -> 1.05 -> 1.0)
  const bounceSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 8, stiffness: 400 },
  });
  const hapticScale = frame >= 8
    ? interpolate(bounceSpring, [0, 0.3, 0.6, 1], [1, 0.95, 1.05, 1])
    : 1;

  // Glitch removed for deterministic, flicker-free rendering
  const glitchX = 0;
  const glitchY = 0;
  const showGlitch = false;

  // Background pulse
  const bgPulse = spring({
    frame: frame - 5,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Pulsing background glow */}
      <div
        style={{
          position: "absolute",
          width: 400 + bgPulse * 100,
          height: 400 + bgPulse * 100,
          background: `radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)`,
          filter: "blur(60px)",
          opacity: bgPulse,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 350 + bgPulse * 80,
          height: 350 + bgPulse * 80,
          background: `radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)`,
          filter: "blur(50px)",
          transform: "translate(100px, 50px)",
          opacity: bgPulse,
        }}
      />

      {/* Click ripple at center on entrance */}
      <ClickRipple
        x={width / 2}
        y={height / 2}
        startFrame={5}
        color="rgba(249, 115, 22, 0.5)"
      />

      {/* Glitch layers */}
      {showGlitch && (
        <>
          <div
            style={{
              position: "absolute",
              fontSize: 72,
              fontWeight: "bold",
              color: "#f97316",
              transform: `translate(${glitchX - 3}px, ${glitchY}px) scale(${scale})`,
              opacity: 0.7,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            BRACKIFY
          </div>
          <div
            style={{
              position: "absolute",
              fontSize: 72,
              fontWeight: "bold",
              color: "#22c55e",
              transform: `translate(${glitchX + 3}px, ${glitchY}px) scale(${scale})`,
              opacity: 0.7,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            BRACKIFY
          </div>
        </>
      )}

      {/* Main logo with haptic bounce */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translate(${glitchX}px, ${glitchY}px) scale(${scale * hapticScale})`,
          opacity,
        }}
      >
        {/* Logo bracket icon */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 40,
              height: 60,
              borderLeft: "6px solid #f97316",
              borderTop: "6px solid #f97316",
              borderBottom: "6px solid #f97316",
              borderRadius: "8px 0 0 8px",
              boxShadow: "0 0 20px rgba(249, 115, 22, 0.3)",
            }}
          />
          <div
            style={{
              width: 40,
              height: 60,
              borderRight: "6px solid #22c55e",
              borderTop: "6px solid #22c55e",
              borderBottom: "6px solid #22c55e",
              borderRadius: "0 8px 8px 0",
              boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
            }}
          />
        </div>

        <h1
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "#ffffff",
            margin: 0,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: -2,
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          BRACKIFY
        </h1>

        <p
          style={{
            fontSize: 20,
            color: "rgba(255, 255, 255, 0.6)",
            marginTop: 12,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: 4,
          }}
        >
          TOURNAMENT PLATFORM
        </p>
      </div>
    </AbsoluteFill>
  );
};
