import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";

// ============================================
// "Ask Brackibot" Click Transition Scene
// Silky smooth milky background (like intro)
// iOS 26 liquid glass pill button
// Cursor taps, ripple + flash, zooms out
// ============================================

// iOS 26 sparkle icon (4-point star clusters)
const SparkleIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "#1c1c1e",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Large 4-point star */}
    <path
      d="M12 2C12 2 13.5 8.5 14 10C14.5 11.5 17 12 22 12C17 12 14.5 12.5 14 14C13.5 15.5 12 22 12 22C12 22 10.5 15.5 10 14C9.5 12.5 7 12 2 12C7 12 9.5 11.5 10 10C10.5 8.5 12 2 12 2Z"
      fill={color}
    />
    {/* Small accent star top-right */}
    <path
      d="M18 3C18 3 18.5 5 18.7 5.5C18.9 6 20 6 21 6C20 6 18.9 6 18.7 6.5C18.5 7 18 9 18 9C18 9 17.5 7 17.3 6.5C17.1 6 16 6 15 6C16 6 17.1 6 17.3 5.5C17.5 5 18 3 18 3Z"
      fill={color}
      opacity={0.6}
    />
  </svg>
);

export const AskAITransition: React.FC<{
  duration: number;
}> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isMobile = height > width;

  // ---- TIMING PHASES ----
  const CURSOR_ENTER = 0;
  const CURSOR_ARRIVE = 12;
  const TAP_FRAME = 18;
  const RIPPLE_START = 19;
  const ZOOM_OUT_START = 28;

  // ---- ZOOM ----
  const zoomScale = interpolate(
    frame,
    [0, CURSOR_ARRIVE, TAP_FRAME, ZOOM_OUT_START, ZOOM_OUT_START + 20],
    [2.6, 2.6, 2.85, 2.85, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const zoomY = interpolate(
    frame,
    [0, ZOOM_OUT_START, ZOOM_OUT_START + 20],
    [isMobile ? 8 : 4, isMobile ? 8 : 4, 0],
    { extrapolateRight: "clamp" }
  );

  // ---- BUTTON ----
  const buttonGlow = spring({
    frame: frame - TAP_FRAME,
    fps,
    config: { damping: 8, stiffness: 200 },
  });
  const buttonPressScale = interpolate(
    frame,
    [TAP_FRAME, TAP_FRAME + 3, TAP_FRAME + 8, TAP_FRAME + 14],
    [1, 0.93, 1.05, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ---- RIPPLE ----
  const rippleProgress = spring({
    frame: frame - RIPPLE_START, fps,
    config: { damping: 15, stiffness: 80 },
  });
  const ripple2Progress = spring({
    frame: frame - RIPPLE_START - 4, fps,
    config: { damping: 18, stiffness: 60 },
  });

  // ---- FLASH ----
  const flashOpacity = interpolate(
    frame, [TAP_FRAME, TAP_FRAME + 2, TAP_FRAME + 8], [0, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ---- CONTAINER ----
  const containerOpacity = interpolate(
    frame, [0, 3, duration - 6, duration], [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ---- PARTICLES ----
  const particles = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2;
    const burstProgress = spring({
      frame: frame - TAP_FRAME - 2, fps,
      config: { damping: 20, stiffness: 100 },
    });
    const distance = burstProgress * (50 + i * 8);
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity: interpolate(burstProgress, [0, 0.3, 1], [0, 0.8, 0], { extrapolateRight: "clamp" }),
      scale: interpolate(burstProgress, [0, 0.3, 1], [0.5, 1, 0.15]),
    };
  });

  // ---- TEXT ENTRANCES ----
  const titleEntrance = spring({ frame: frame - 3, fps, config: { damping: 14, stiffness: 120 } });
  const subtitleEntrance = spring({ frame: frame - 8, fps, config: { damping: 16, stiffness: 100 } });
  const afterTapText = spring({ frame: frame - TAP_FRAME - 8, fps, config: { damping: 12, stiffness: 100 } });

  // ---- Soft floating orb animation ----
  const orbDrift1 = Math.sin(frame * 0.04) * 12;
  const orbDrift2 = Math.cos(frame * 0.035) * 10;

  // ---- Toolbar icons subtle entrance ----
  const toolbarEntrance = spring({ frame: frame - 5, fps, config: { damping: 18, stiffness: 80 } });

  return (
    <AbsoluteFill
      style={{
        opacity: containerOpacity,
        overflow: "hidden",
      }}
    >
      {/* ====== SILKY SMOOTH MILKY BACKGROUND (like intro) ====== */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(145deg, #ffffff 0%, #f9f6f0 35%, #f3efe8 65%, #f7f5f2 100%)",
        }}
      />

      {/* Soft warm orb - top right */}
      <div
        style={{
          position: "absolute",
          top: -180 + orbDrift1,
          right: -160 + orbDrift2,
          width: isMobile ? 600 : 750,
          height: isMobile ? 600 : 750,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251, 191, 146, 0.35) 0%, rgba(253, 224, 200, 0.15) 50%, transparent 75%)",
          filter: "blur(70px)",
        }}
      />

      {/* Soft green orb - bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: -200 - orbDrift1,
          left: -180 - orbDrift2,
          width: isMobile ? 600 : 700,
          height: isMobile ? 600 : 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(187, 230, 196, 0.3) 0%, rgba(210, 240, 215, 0.12) 50%, transparent 75%)",
          filter: "blur(80px)",
        }}
      />

      {/* Very subtle amber accent orb - center */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249, 115, 22, 0.06) 0%, transparent 60%)",
          filter: "blur(60px)",
          transform: `translate(-50%, -50%) translate(${orbDrift2}px, ${orbDrift1}px)`,
        }}
      />

      {/* ====== ZOOMED CONTENT ====== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${zoomScale}) translateY(${zoomY}%)`,
          transformOrigin: "50% 50%",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          {/* Powered by AI label */}
          <div
            style={{
              fontSize: isMobile ? 16 : 14,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              color: "rgba(60, 60, 67, 0.4)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              transform: `translateY(${interpolate(titleEntrance, [0, 1], [12, 0])}px)`,
              opacity: titleEntrance,
            }}
          >
            Powered by AI
          </div>

          {/* ====== iOS 26 GLASS TOOLBAR BAR ====== */}
          <div
            style={{
              position: "relative",
              transform: `scale(${buttonPressScale})`,
            }}
          >
            {/* Soft diffused shadow behind entire bar */}
            <div
              style={{
                position: "absolute",
                inset: -8,
                borderRadius: 50,
                background: "rgba(0,0,0,0.04)",
                filter: "blur(24px)",
              }}
            />

            {/* Glass toolbar bar */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 10 : 8,
                padding: isMobile ? "10px 12px" : "8px 10px",
                borderRadius: 44,
                background: `linear-gradient(
                  180deg,
                  rgba(255, 255, 255, ${0.75 + buttonGlow * 0.15}) 0%,
                  rgba(245, 242, 238, ${0.55 + buttonGlow * 0.1}) 100%
                )`,
                border: "1px solid rgba(255, 255, 255, 0.7)",
                boxShadow: `
                  0 1px 3px rgba(0,0,0,0.06),
                  0 6px 20px rgba(0,0,0,0.06),
                  inset 0 1px 0 rgba(255,255,255,0.9),
                  inset 0 -1px 0 rgba(0,0,0,0.03)
                  ${frame >= TAP_FRAME ? `, 0 0 ${buttonGlow * 30}px rgba(249, 115, 22, ${buttonGlow * 0.12})` : ""}
                `,
              }}
            >
              {/* + icon */}
              <div
                style={{
                  width: isMobile ? 38 : 34,
                  height: isMobile ? 38 : 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: toolbarEntrance * 0.35,
                  transform: `scale(${toolbarEntrance})`,
                }}
              >
                <svg width={isMobile ? 20 : 18} height={isMobile ? 20 : 18} viewBox="0 0 20 20" fill="none">
                  <path d="M10 4V16M4 10H16" stroke="#8e8e93" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Paperclip / attach icon */}
              <div
                style={{
                  width: isMobile ? 38 : 34,
                  height: isMobile ? 38 : 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: toolbarEntrance * 0.35,
                  transform: `scale(${toolbarEntrance})`,
                }}
              >
                <svg width={isMobile ? 20 : 18} height={isMobile ? 20 : 18} viewBox="0 0 20 20" fill="none">
                  <path
                    d="M14.5 10.5L9 16C7.34 17.66 4.66 17.66 3 16C1.34 14.34 1.34 11.66 3 10L10.5 2.5C11.72 1.28 13.78 1.28 15 2.5C16.22 3.72 16.22 5.78 15 7L7.5 14.5C6.84 15.16 5.66 15.16 5 14.5C4.34 13.84 4.34 12.66 5 12L11.5 5.5"
                    stroke="#8e8e93"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Divider */}
              <div
                style={{
                  width: 1,
                  height: isMobile ? 28 : 24,
                  background: "rgba(60, 60, 67, 0.08)",
                  marginLeft: 4,
                  marginRight: 4,
                  opacity: toolbarEntrance,
                }}
              />

              {/* ====== ASK BRACKIBOT PILL BUTTON ====== */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? 10 : 8,
                  padding: isMobile ? "12px 28px 12px 20px" : "10px 24px 10px 18px",
                  borderRadius: 40,
                  background: `linear-gradient(
                    180deg,
                    rgba(255, 255, 255, ${0.92 + buttonGlow * 0.08}) 0%,
                    rgba(248, 248, 248, ${0.85 + buttonGlow * 0.1}) 100%
                  )`,
                  border: `1px solid rgba(255, 255, 255, ${0.85 + buttonGlow * 0.15})`,
                  boxShadow: `
                    0 0.5px 1px rgba(0,0,0,0.06),
                    0 2px 8px rgba(0,0,0,0.05),
                    inset 0 1px 0 rgba(255,255,255,1),
                    inset 0 -0.5px 0 rgba(0,0,0,0.02)
                    ${frame >= TAP_FRAME ? `, 0 0 ${buttonGlow * 20}px rgba(249, 115, 22, ${buttonGlow * 0.1})` : ""}
                  `,
                }}
              >
                {/* Sparkle icon */}
                <SparkleIcon
                  size={isMobile ? 22 : 20}
                  color={frame >= TAP_FRAME ? `rgba(249, 115, 22, ${0.3 + buttonGlow * 0.7})` : "#1c1c1e"}
                />

                {/* Button text */}
                <span
                  style={{
                    fontSize: isMobile ? 20 : 18,
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    color: frame >= TAP_FRAME
                      ? `rgba(${Math.round(28 + buttonGlow * 221)}, ${Math.round(28 + buttonGlow * 87)}, ${Math.round(30 + buttonGlow * (22 - 30))}, 1)`
                      : "#1c1c1e",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Ask Brackibot
                </span>
              </div>
            </div>

            {/* Ripple rings on tap */}
            {frame >= RIPPLE_START && (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: "70%",
                    top: "50%",
                    width: 180 * rippleProgress,
                    height: 180 * rippleProgress,
                    borderRadius: "50%",
                    border: "1.5px solid rgba(249, 115, 22, 0.3)",
                    transform: "translate(-50%, -50%)",
                    opacity: 1 - rippleProgress,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "70%",
                    top: "50%",
                    width: 140 * ripple2Progress,
                    height: 140 * ripple2Progress,
                    borderRadius: "50%",
                    border: "1px solid rgba(249, 115, 22, 0.18)",
                    transform: "translate(-50%, -50%)",
                    opacity: 1 - ripple2Progress,
                  }}
                />
              </>
            )}

            {/* Particle burst */}
            {frame >= TAP_FRAME && particles.map((p, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "70%",
                  top: "50%",
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: i % 3 === 0
                    ? "rgba(249, 115, 22, 0.8)"
                    : i % 3 === 1
                    ? "rgba(34, 197, 94, 0.7)"
                    : "rgba(139, 92, 246, 0.6)",
                  transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px)) scale(${p.scale})`,
                  opacity: p.opacity,
                  boxShadow: `0 0 6px ${i % 3 === 0 ? "rgba(249,115,22,0.4)" : i % 3 === 1 ? "rgba(34,197,94,0.3)" : "rgba(139,92,246,0.3)"}`,
                }}
              />
            ))}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: isMobile ? 14 : 13,
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              color: "rgba(60, 60, 67, 0.3)",
              letterSpacing: "0.03em",
              transform: `translateY(${interpolate(subtitleEntrance, [0, 1], [8, 0])}px)`,
              opacity: subtitleEntrance * 0.6,
            }}
          >
            Tap to get instant tournament insights
          </div>

          {/* Post-tap message */}
          {frame >= TAP_FRAME + 8 && (
            <div
              style={{
                marginTop: 6,
                fontSize: isMobile ? 18 : 16,
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                background: "linear-gradient(90deg, #f97316, #22c55e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                transform: `translateY(${interpolate(afterTapText, [0, 1], [12, 0])}px) scale(${interpolate(afterTapText, [0, 0.6, 1], [0.85, 1.04, 1])})`,
                opacity: afterTapText,
              }}
            >
              Initializing Brackibot...
            </div>
          )}
        </div>
      </div>

      {/* Soft flash on tap */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 55% 50%, rgba(249, 115, 22, 0.15) 0%, transparent 50%)",
          opacity: flashOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
