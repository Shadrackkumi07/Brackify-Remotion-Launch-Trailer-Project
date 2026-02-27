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

// Notification data - condensed for phone view
const NOTIFICATIONS = [
  {
    id: 1,
    user: "Ashton",
    message: "created Tech City Tekken #206 on start.gg",
    time: "now",
    game: "T8",
  },
  {
    id: 2,
    user: "SMK | Forgiveness",
    message: "created The Cutting Edge Qualifier 4",
    time: "5m",
    game: "MK1",
  },
  {
    id: 6,
    user: "Jujitsu Otter",
    message: "created Otter's Grotto S1 #13",
    time: "12m",
    game: "SF6",
  },
  {
    id: 3,
    user: "Tandomonium",
    message: "Your bracket starts in 3 hours",
    time: "17m",
    isAlert: true,
    game: "2XKO",
  },
  {
    id: 4,
    user: "Trendo",
    message: "started following you",
    time: "32m",
  },
  {
    id: 5,
    user: "Seeker Path",
    message: "entered Losers Finals",
    time: "45m",
    isLive: true,
  },
  {
    id: 7,
    user: "Seeker Path",
    message: "TragicMs is Your Champion! - Winner 👑" ,
    time: "now",
    isLive: false,
  },
];

// Compact Notification Card for Phone
const PhoneNotificationCard: React.FC<{
  notification: typeof NOTIFICATIONS[0];
  index: number;
  startFrame: number;
}> = ({ notification, index, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = index * 2;
  const localFrame = frame - startFrame - delay;

  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.7 },
  });

  const translateX = interpolate(entrance, [0, 1], [150, 0]);
  const scale = interpolate(entrance, [0, 1], [0.9, 1]);
  const opacity = interpolate(entrance, [0, 0.3, 1], [0, 0.5, 1]);

  const shimmerX = interpolate((frame + index * 15) % 80, [0, 80], [-50, 200]);
  const floatY = Math.sin((frame + index * 10) * 0.05) * 1;

  const getGlowColor = () => {
    if (notification.isAlert) return "rgba(249, 115, 22, 0.3)";
    if (notification.isLive) return "rgba(239, 68, 68, 0.3)";
    return "rgba(255, 255, 255, 0.05)";
  };

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        transform: `translateX(${translateX}px) scale(${scale}) translateY(${floatY}px)`,
        opacity,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 14px",
          borderRadius: 18,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: `0 6px 24px rgba(0,0,0,0.25), 0 0 24px ${getGlowColor()}`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Shimmer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)`,
            transform: `translateX(${shimmerX}px)`,
          }}
        />

        {/* App icon */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            overflow: "hidden",
            flexShrink: 0,
            boxShadow: notification.isAlert 
              ? "0 0 16px rgba(249, 115, 22, 0.5)" 
              : "0 3px 10px rgba(0,0,0,0.25)",
          }}
        >
          <Img
            src={staticFile("app logo.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                fontFamily: "'SF Pro Display', sans-serif",
              }}
            >
              {notification.user}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {notification.isLive && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#ef4444",
                    background: "rgba(239, 68, 68, 0.25)",
                    padding: "3px 8px",
                    borderRadius: 6,
                  }}
                >
                  LIVE
                </span>
              )}
              <span
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.55)",
                  fontFamily: "'SF Pro Text', sans-serif",
                }}
              >
                {notification.time}
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.85)",
              fontFamily: "'SF Pro Text', sans-serif",
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {notification.message}
            {notification.game && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#f97316",
                  background: "rgba(249, 115, 22, 0.2)",
                  padding: "2px 6px",
                  borderRadius: 5,
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

// Phone Status Bar
const PhoneStatusBar: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 16px",
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#fff",
          fontFamily: "'SF Pro Text', sans-serif",
        }}
      >
        9:41
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <svg width="14" height="10" viewBox="0 0 18 12" fill="white">
          <rect x="0" y="6" width="3" height="6" rx="1" opacity="0.4" />
          <rect x="5" y="4" width="3" height="8" rx="1" opacity="0.6" />
          <rect x="10" y="2" width="3" height="10" rx="1" opacity="0.8" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
          <div
            style={{
              width: 20,
              height: 10,
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.5)",
              padding: 1,
            }}
          >
            <div
              style={{
                width: "80%",
                height: "100%",
                background: "#22c55e",
                borderRadius: 1,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Phone Notifications Component
export const PhoneNotifications: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentZoom = 1;
  const panY = 0;
  const notifOpacity = 1;

  const gradientRotate = frame * 0.3;

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: -50,
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(249, 115, 22, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
            linear-gradient(${gradientRotate}deg, #0a0a0a, #0f0805, #0a0a0a)
          `,
        }}
      />

      {/* Phone content - no status bar, starts from top */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${currentZoom}) translateY(${panY}px)`,
          transformOrigin: "center top",
        }}
      >
        {/* Notification Center */}
        <div
          style={{
            padding: "60px 14px 14px",
            opacity: notifOpacity,
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'SF Pro Display', sans-serif",
              marginBottom: 20,
            }}
          >
            Notifications
          </h2>

          {NOTIFICATIONS.map((notification, index) => (
            <PhoneNotificationCard
              key={notification.id}
              notification={notification}
              index={index}
              startFrame={0}
            />
          ))}
        </div>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export default PhoneNotifications;
