import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { BorderFrame } from "./BorderFrame";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const logoScale = interpolate(logoSpring, [0, 1], [0.8, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  // CTA entrance with delay
  const ctaSpring = spring({
    frame,
    fps,
    delay: 15,
    config: { damping: 15, stiffness: 100 },
  });

  const ctaOpacity = interpolate(ctaSpring, [0, 1], [0, 1]);
  const ctaY = interpolate(ctaSpring, [0, 1], [20, 0]);

  // Keep button scale stable to avoid flicker in exports
  const buttonScale = 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Closing border frame */}
      <BorderFrame closing />

      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          background: `radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          background: `radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)`,
          filter: "blur(80px)",
          transform: "translate(100px, 50px)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
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
            }}
          />
        </div>

        <h1
          style={{
            fontSize: 64,
            fontWeight: "bold",
            color: "#ffffff",
            margin: 0,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: -2,
          }}
        >
          BRACKIFY
        </h1>

        <p
          style={{
            fontSize: 16,
            color: "rgba(255, 255, 255, 0.5)",
            marginTop: 8,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: 3,
          }}
        >
          YOUR TOURNAMENT PLATFORM
        </p>
      </div>

      {/* CTA Section */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
        }}
      >
        {/* Download button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "linear-gradient(135deg, #f97316 0%, #92400e 100%)",
            padding: "14px 32px",
            borderRadius: 12,
            transform: `scale(${buttonScale})`,
            boxShadow: "0 4px 20px rgba(249, 115, 22, 0.4)",
          }}
        >
          <span style={{ fontSize: 20 }}>📱</span>
          <span
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Download Now
          </span>
        </div>

        {/* App store badges hint */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontSize: 12,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Available on iOS & Android
          </span>
        </div>

        {/* Website */}
        <span
          style={{
            color: "#f97316",
            fontSize: 14,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          brackify.app
        </span>
      </div>
    </AbsoluteFill>
  );
};
