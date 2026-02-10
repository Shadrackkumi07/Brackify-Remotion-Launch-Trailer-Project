import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
  Easing,
} from "remotion";

// Notification data
const NOTIFICATIONS = [
  {
    id: 1,
    user: "Ashton",
    message: "created a new tournament on start.gg: Tech City Tekken #206 - T8 Weekly",
    game: "TEKKEN 8",
    time: "just now",
  },
  {
    id: 2,
    user: "SMK | Forgiveness",
    message: "created a new bracket: The Cutting Edge Qualifier 4",
    time: "2m ago",
  },
  {
    id: 3,
    user: "Jujitsu Otter",
    message: "created a new bracket: The Otter's Grotto S1 Qualifier's #13 & 14",
    time: "5m ago",
  },
  {
    id: 4,
    user: "Tandomonium",
    message: 'Your bracket "Adapt or Die Qualifier #8" starts in 3 hours',
    time: "15m ago",
    isAlert: true,
  },
  {
    id: 5,
    user: "Trendo",
    message: "started following you",
    time: "32m ago",
  },
  {
    id: 6,
    user: "Seeker Path",
    message: "just entered Losers Finals",
    time: "45m ago",
    isLive: true,
  },
  {
    id: 7,
    user: "TragicMs",
    message: "won the tournament you participated in!",
    time: "1h ago",
    isCelebration: true,
  },
];

// Liquid Glass Notification Card
const LiquidGlassCard: React.FC<{
  notification: typeof NOTIFICATIONS[0];
  index: number;
  startFrame: number;
}> = ({ notification, index, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = index * 12;
  const localFrame = frame - startFrame - delay;

  // Card entrance with spring
  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.7 },
  });

  // Slide from right with scale
  const translateX = interpolate(entrance, [0, 1], [400, 0]);
  const translateY = interpolate(entrance, [0, 1], [-20, 0]);
  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  const opacity = interpolate(entrance, [0, 0.3, 1], [0, 0.5, 1]);

  // Liquid shimmer effect
  const shimmerX = interpolate(
    (frame + index * 20) % 120,
    [0, 120],
    [-100, 400]
  );

  // Subtle floating animation
  const floatY = Math.sin((frame + index * 15) * 0.04) * 2;
  const floatRotate = Math.sin((frame + index * 10) * 0.02) * 0.3;

  // Icon pulse for alerts
  const iconPulse = notification.isAlert 
    ? 1 + Math.sin(frame * 0.15) * 0.1 
    : 1;

  // Glow color based on notification type
  const getGlowColor = () => {
    if (notification.isAlert) return "rgba(249, 115, 22, 0.4)";
    if (notification.isLive) return "rgba(239, 68, 68, 0.4)";
    if (notification.isCelebration) return "rgba(34, 197, 94, 0.4)";
    return "rgba(255, 255, 255, 0.1)";
  };

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        position: "relative",
        transform: `
          translateX(${translateX}px) 
          translateY(${translateY + floatY}px) 
          scale(${scale})
          rotate(${floatRotate}deg)
        `,
        opacity,
        marginBottom: 16,
      }}
    >
      {/* Main glass card */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
          padding: "18px 22px",
          borderRadius: 24,
          background: `linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.08) 100%
          )`,
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.05) inset,
            0 20px 40px -10px ${getGlowColor()}
          `,
          overflow: "hidden",
        }}
      >
        {/* Liquid shimmer overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.1) 50%,
              transparent 100%
            )`,
            transform: `translateX(${shimmerX}px)`,
            pointerEvents: "none",
          }}
        />

        {/* Refraction edge highlight */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.4) 20%,
              rgba(255, 255, 255, 0.6) 50%,
              rgba(255, 255, 255, 0.4) 80%,
              transparent 100%
            )`,
          }}
        />

        {/* App icon with glow */}
        <div
          style={{
            position: "relative",
            width: 52,
            height: 52,
            borderRadius: 14,
            overflow: "hidden",
            flexShrink: 0,
            transform: `scale(${iconPulse})`,
            boxShadow: notification.isAlert 
              ? "0 0 20px rgba(249, 115, 22, 0.5)" 
              : "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Img
            src={staticFile("app logo.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Icon glass overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                }}
              >
                {notification.user}
              </span>
              {notification.isLive && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#ef4444",
                    background: "rgba(239, 68, 68, 0.2)",
                    padding: "2px 8px",
                    borderRadius: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  LIVE
                </span>
              )}
              {notification.isCelebration && (
                <span style={{ fontSize: 16 }}>🏆</span>
              )}
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "'SF Pro Text', -apple-system, sans-serif",
              }}
            >
              {notification.time}
            </span>
          </div>

          {/* Message */}
          <div
            style={{
              fontSize: 15,
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.85)",
              fontFamily: "'SF Pro Text', -apple-system, sans-serif",
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
            }}
          >
            {notification.message}
            {notification.game && (
              <span
                style={{
                  display: "inline-block",
                  marginLeft: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#f97316",
                  background: "rgba(249, 115, 22, 0.15)",
                  padding: "2px 8px",
                  borderRadius: 6,
                }}
              >
                {notification.game}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Status bar component
const StatusBar: React.FC<{ time: string }> = ({ time }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 28px",
        width: "100%",
      }}
    >
      {/* Time */}
      <span
        style={{
          fontSize: 17,
          fontWeight: 600,
          fontFamily: "'SF Pro Text', -apple-system, sans-serif",
          color: "#ffffff",
        }}
      >
        {time}
      </span>

      {/* Right icons */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* Signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="white">
          <rect x="0" y="6" width="3" height="6" rx="1" opacity="0.4" />
          <rect x="5" y="4" width="3" height="8" rx="1" opacity="0.6" />
          <rect x="10" y="2" width="3" height="10" rx="1" opacity="0.8" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* WiFi */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
          <path d="M8.5 2C5.5 2 2.8 3.2 1 5.2L2.4 6.6C3.9 5 6.1 4 8.5 4C10.9 4 13.1 5 14.6 6.6L16 5.2C14.2 3.2 11.5 2 8.5 2Z" opacity="0.5" />
          <path d="M8.5 5C6.5 5 4.7 5.8 3.5 7.2L4.9 8.6C5.8 7.6 7.1 7 8.5 7C9.9 7 11.2 7.6 12.1 8.6L13.5 7.2C12.3 5.8 10.5 5 8.5 5Z" opacity="0.75" />
          <circle cx="8.5" cy="10" r="2" />
        </svg>
        {/* Battery */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <div
            style={{
              width: 25,
              height: 12,
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.5)",
              padding: 1,
            }}
          >
            <div
              style={{
                width: "80%",
                height: "100%",
                background: "#22c55e",
                borderRadius: 2,
              }}
            />
          </div>
          <div
            style={{
              width: 2,
              height: 5,
              background: "rgba(255,255,255,0.5)",
              borderRadius: "0 2px 2px 0",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Dynamic Island component
const DynamicIsland: React.FC<{ expanded: boolean; frame: number }> = ({ expanded, frame }) => {
  const { fps } = useVideoConfig();

  const expandProgress = spring({
    frame: expanded ? frame : 0,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  const width = interpolate(expandProgress, [0, 1], [126, 220]);
  const height = interpolate(expandProgress, [0, 1], [37, 48]);
  const borderRadius = interpolate(expandProgress, [0, 1], [20, 24]);

  // Pulse animation
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: "50%",
        transform: `translateX(-50%) scale(${pulse})`,
        width,
        height,
        background: "#000000",
        borderRadius,
        boxShadow: expanded 
          ? "0 0 30px rgba(249, 115, 22, 0.3), 0 0 60px rgba(249, 115, 22, 0.1)"
          : "none",
        transition: "box-shadow 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {expanded && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: expandProgress,
          }}
        >
          <Img
            src={staticFile("app logo.png")}
            style={{ width: 28, height: 28, borderRadius: 8 }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#f97316",
              fontFamily: "'SF Pro Text', -apple-system, sans-serif",
            }}
          >
            7 new
          </span>
        </div>
      )}
    </div>
  );
};

// Main component
export const LiquidGlassNotifications: React.FC = () => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  // Animation phases
  const ZOOM_IN_START = 0;
  const ZOOM_IN_END = 40;
  const ZOOM_HOLD = 60;
  const ZOOM_OUT_END = 100;
  const NOTIFICATIONS_START = 110;

  // Zoom animation
  const zoomIn = interpolate(
    frame,
    [ZOOM_IN_START, ZOOM_IN_END],
    [1, 2.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.2, 1) }
  );

  const zoomOut = interpolate(
    frame,
    [ZOOM_HOLD, ZOOM_OUT_END],
    [2.5, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.2, 1) }
  );

  const currentZoom = frame < ZOOM_HOLD ? zoomIn : zoomOut;

  // Pan to status bar during zoom
  const panY = interpolate(
    frame,
    [ZOOM_IN_START, ZOOM_IN_END, ZOOM_HOLD, ZOOM_OUT_END],
    [0, -height * 0.35, -height * 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Notification center entrance
  const notifCenterOpacity = interpolate(
    frame,
    [ZOOM_OUT_END, ZOOM_OUT_END + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const notifCenterY = interpolate(
    frame,
    [ZOOM_OUT_END, ZOOM_OUT_END + 30],
    [-50, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 1.56, 0.64, 1) }
  );

  // Background gradient animation
  const gradientRotate = frame * 0.2;

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
        overflow: "hidden",
      }}
    >
      {/* Animated gradient background */}
      <div
        style={{
          position: "absolute",
          inset: -100,
          background: `
            radial-gradient(
              ellipse at 30% 20%,
              rgba(249, 115, 22, 0.15) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at 70% 80%,
              rgba(34, 197, 94, 0.1) 0%,
              transparent 50%
            ),
            linear-gradient(
              ${gradientRotate}deg,
              #0a0a0a 0%,
              #0f0805 50%,
              #0a0a0a 100%
            )
          `,
        }}
      />

      {/* Phone screen container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${currentZoom}) translateY(${panY}px)`,
          transformOrigin: "center top",
        }}
      >
        {/* Status bar */}
        <StatusBar time="9:41" />

        {/* Dynamic Island */}
        <DynamicIsland expanded={frame > 30 && frame < ZOOM_OUT_END} frame={frame} />

        {/* Notification Center */}
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 0,
            right: 0,
            bottom: 0,
            padding: "20px 24px",
            opacity: notifCenterOpacity,
            transform: `translateY(${notifCenterY}px)`,
          }}
        >
          {/* Title */}
          <div
            style={{
              marginBottom: 24,
              opacity: interpolate(frame, [ZOOM_OUT_END + 10, ZOOM_OUT_END + 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            <h1
              style={{
                fontSize: 36,
                fontWeight: 700,
                fontFamily: "'SF Pro Display', -apple-system, sans-serif",
                color: "#ffffff",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Notification Center
            </h1>
          </div>

          {/* Notifications list */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 420,
            }}
          >
            {NOTIFICATIONS.map((notification, index) => (
              <LiquidGlassCard
                key={notification.id}
                notification={notification}
                index={index}
                startFrame={NOTIFICATIONS_START}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle film grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      >
        <svg width="100%" height="100%">
          <filter id="liquidNoise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="4"
              seed={frame % 10}
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#liquidNoise)" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

export default LiquidGlassNotifications;
