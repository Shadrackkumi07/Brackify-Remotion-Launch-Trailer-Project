import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { Cursor, ClickRipple, HapticButton } from "./Cursor";
import { ProfileReveal } from "./ScrollList";
import { Phone3D } from "./MacroZoom";
import { StaccatoText } from "./StaccatoText";

export const InteractiveShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Timeline events
  const cursorEnterFrame = 10;
  const buttonClickFrame = 35;
  const revealStartFrame = 45;
  const textRevealFrame = 70;

  // Cursor path - human-like bezier movement to the "Show" button
  const cursorPath = [
    { x: width * 0.7, y: height * 0.8, frame: cursorEnterFrame },
    { x: width * 0.65, y: height * 0.65, frame: cursorEnterFrame + 10 },
    { x: width * 0.58, y: height * 0.52, frame: buttonClickFrame - 5 },
    { x: width * 0.55, y: height * 0.48, frame: buttonClickFrame },
    { x: width * 0.55, y: height * 0.48, frame: buttonClickFrame + 30 },
  ];

  // Show button reveal state
  const showButtonClicked = frame >= buttonClickFrame;
  const listRevealProgress = spring({
    frame: frame - revealStartFrame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Profiles to reveal
  const profiles = [
    { name: "Pro Player", handle: "proplayer", avatarColor: "#f97316" },
    { name: "Tournament Host", handle: "tournamentking", avatarColor: "#22c55e" },
    { name: "Esports Org", handle: "esportsofficial", avatarColor: "#92400e" },
    { name: "Gaming Legend", handle: "legendgamer", avatarColor: "#f97316" },
  ];

  // Camera zoom effect after reveal
  const cameraZoom = spring({
    frame: frame - 85,
    fps,
    config: { damping: 20, stiffness: 60 },
  });
  const scale = 1 + interpolate(cameraZoom, [0, 1], [0, 0.15]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${scale})`,
      }}
    >
      {/* Background gradient glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          background: `radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 60%)`,
          filter: "blur(60px)",
          transform: "translate(-100px, -50px)",
        }}
      />

      {/* Phone with UI */}
      <Phone3D rotateY={-12} rotateX={5} floating>
        <div style={{ padding: "50px 16px 16px" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: 600,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Notifications
            </span>
            <div
              style={{
                backgroundColor: "rgba(249, 115, 22, 0.2)",
                color: "#f97316",
                padding: "4px 10px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              4 new
            </div>
          </div>

          {/* Message Request Card */}
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 16,
              padding: 16,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: 14,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                Message Requests
              </span>

              {/* The "Show" button with haptic feedback */}
              <HapticButton clickFrame={buttonClickFrame}>
                <div
                  style={{
                    backgroundColor: showButtonClicked ? "#22c55e" : "#f97316",
                    padding: "8px 20px",
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                >
                  <span
                    style={{
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    {showButtonClicked ? "Showing" : "Show"}
                  </span>
                </div>
              </HapticButton>
            </div>

            {/* Profile list reveal */}
            {showButtonClicked && (
              <div
                style={{
                  opacity: interpolate(listRevealProgress, [0, 0.3], [0, 1]),
                  maxHeight: interpolate(listRevealProgress, [0, 1], [0, 300]),
                  overflow: "hidden",
                }}
              >
                <ProfileReveal
                  profiles={profiles}
                  startFrame={revealStartFrame}
                  stagger={6}
                />
              </div>
            )}
          </div>

          {/* Bottom text */}
          {frame >= textRevealFrame && (
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <StaccatoText
                text="Connect with top players"
                stagger={2}
                startFrame={textRevealFrame}
                highlightWords={["top", "players"]}
                fontSize={16}
                fontWeight={600}
                color="rgba(255, 255, 255, 0.6)"
                accentColor="#f97316"
              />
            </div>
          )}
        </div>
      </Phone3D>

      {/* Interactive cursor */}
      <Cursor
        path={cursorPath}
        clickFrame={buttonClickFrame}
        visible={frame >= cursorEnterFrame}
      />

      {/* Click ripple effect */}
      <ClickRipple
        x={width * 0.55}
        y={height * 0.48}
        startFrame={buttonClickFrame}
        color="rgba(249, 115, 22, 0.6)"
      />

      {/* Title text */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
        }}
      >
        <StaccatoText
          text="Tap to Discover"
          stagger={3}
          startFrame={0}
          highlightWords={["Discover"]}
          fontSize={32}
          fontWeight={700}
          accentColor="#f97316"
        />
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          right: 60,
          textAlign: "right",
        }}
      >
        {frame >= 50 && (
          <StaccatoText
            text="Find your community"
            stagger={2}
            startFrame={50}
            highlightWords={["community"]}
            fontSize={20}
            fontWeight={500}
            color="rgba(255, 255, 255, 0.5)"
            accentColor="#22c55e"
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
