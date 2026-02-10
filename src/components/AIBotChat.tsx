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

// Chat messages data
const CHAT_MESSAGES = [
  {
    id: 1,
    type: "user" as const,
    text: "Which tournaments are happening this week?",
    delay: 0,
  },
  {
    id: 2,
    type: "bot" as const,
    text: "This week features 12 major events! 🎮",
    subtext: "Tech City Tekken #206 (Tomorrow), The Cutting Edge Qualifier 4 (Wed), Otter's Grotto S1 (Fri), and 9 more locals near you.",
    delay: 45,
  },
  {
    id: 3,
    type: "user" as const,
    text: "Frame data for Sub-Zero in MK1?",
    delay: 120,
  },
  {
    id: 4,
    type: "bot" as const,
    text: "Sub-Zero Frame Data 🧊",
    subtext: "• Ice Ball: 18f startup, -8 on block\n• Slide: 12f startup, -14 on block\n• b+2,1,2: 15f mid, +3 on block\n• 2,1,2 string: 8f high starter, jailable",
    delay: 165,
  },
  {
    id: 5,
    type: "user" as const,
    text: "Who won Evo 2025?",
    delay: 270,
  },
  {
    id: 6,
    type: "bot" as const,
    text: "Evo 2025 Champions 🏆",
    subtext: "• TEKKEN 8: Arslan Ash 🇵🇰\n• SF6: Punk 🇺🇸\n• MK1: SonicFox 🇺🇸\n• Strive: Umisho 🇯🇵",
    delay: 315,
  },
];

// Typing indicator with liquid effect
const TypingIndicator: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > 35) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 20px",
        opacity: interpolate(localFrame, [0, 5, 30, 35], [0, 1, 1, 0]),
      }}
    >
      {/* Bot avatar */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          overflow: "hidden",
          background: "linear-gradient(135deg, #f97316 0%, #22c55e 100%)",
          padding: 2,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 12,
            overflow: "hidden",
            background: "#0a0a0a",
          }}
        >
          <Img
            src={staticFile("aibot.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Typing dots */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "14px 20px",
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: 20,
          backdropFilter: "blur(20px)",
        }}
      >
        {[0, 1, 2].map((i) => {
          const dotDelay = i * 4;
          const bounce = Math.sin((localFrame - dotDelay) * 0.4) * 4;
          return (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
                transform: `translateY(${Math.max(0, bounce)}px)`,
                boxShadow: "0 0 10px rgba(249, 115, 22, 0.5)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// Liquid Glass Chat Bubble
const ChatBubble: React.FC<{
  message: typeof CHAT_MESSAGES[0];
  startFrame: number;
}> = ({ message, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame - message.delay;

  const isBot = message.type === "bot";

  // Entrance animation
  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 130, mass: 0.6 },
  });

  // Slide direction based on type
  const translateX = interpolate(
    entrance,
    [0, 1],
    [isBot ? -100 : 100, 0]
  );
  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  const opacity = interpolate(entrance, [0, 0.5, 1], [0, 0.8, 1]);

  // Liquid shimmer
  const shimmerPos = interpolate(
    (frame + message.id * 30) % 150,
    [0, 150],
    [-100, 500]
  );

  // Text reveal for bot messages
  const textReveal = interpolate(
    localFrame,
    [10, 40],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isBot ? "row" : "row-reverse",
        alignItems: "flex-end",
        gap: 14,
        marginBottom: 20,
        transform: `translateX(${translateX}px) scale(${scale})`,
        opacity,
      }}
    >
      {/* Avatar for bot */}
      {isBot && (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            overflow: "hidden",
            background: "linear-gradient(135deg, #f97316 0%, #22c55e 100%)",
            padding: 2,
            flexShrink: 0,
            boxShadow: "0 4px 20px rgba(249, 115, 22, 0.3)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 14,
              overflow: "hidden",
              background: "#0a0a0a",
            }}
          >
            <Img
              src={staticFile("aibot.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      )}

      {/* Message bubble */}
      <div
        style={{
          position: "relative",
          maxWidth: 380,
          padding: isBot ? "18px 24px" : "14px 20px",
          borderRadius: isBot ? "24px 24px 24px 8px" : "24px 24px 8px 24px",
          background: isBot
            ? `linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 255, 255, 0.05) 100%
              )`
            : `linear-gradient(
                135deg,
                rgba(249, 115, 22, 0.25) 0%,
                rgba(249, 115, 22, 0.15) 100%
              )`,
          backdropFilter: "blur(30px) saturate(150%)",
          WebkitBackdropFilter: "blur(30px) saturate(150%)",
          border: `1px solid ${isBot ? "rgba(255, 255, 255, 0.15)" : "rgba(249, 115, 22, 0.3)"}`,
          boxShadow: isBot
            ? "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255,255,255,0.05)"
            : "0 8px 32px rgba(249, 115, 22, 0.15), 0 0 20px rgba(249, 115, 22, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* Liquid shimmer */}
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
              rgba(255, 255, 255, ${isBot ? 0.08 : 0.15}) 50%,
              transparent 100%
            )`,
            transform: `translateX(${shimmerPos}px)`,
            pointerEvents: "none",
          }}
        />

        {/* Top edge highlight */}
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
              rgba(255, 255, 255, ${isBot ? 0.3 : 0.5}) 50%,
              transparent 100%
            )`,
          }}
        />

        {/* Main text */}
        <div
          style={{
            fontSize: 16,
            fontWeight: isBot ? 600 : 500,
            fontFamily: "'SF Pro Text', -apple-system, sans-serif",
            color: "#ffffff",
            lineHeight: 1.5,
            letterSpacing: "-0.01em",
          }}
        >
          {message.text}
        </div>

        {/* Subtext for bot responses */}
        {isBot && message.subtext && (
          <div
            style={{
              marginTop: 12,
              fontSize: 14,
              fontWeight: 400,
              fontFamily: "'SF Pro Text', -apple-system, sans-serif",
              color: "rgba(255, 255, 255, 0.75)",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
              opacity: textReveal,
              transform: `translateY(${interpolate(textReveal, [0, 1], [10, 0])}px)`,
            }}
          >
            {message.subtext}
          </div>
        )}
      </div>

      {/* User avatar */}
      {!isBot && (
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
          }}
        >
          <span style={{ fontSize: 20 }}>👤</span>
        </div>
      )}
    </div>
  );
};

// Chat input area with liquid glass
const ChatInput: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const shimmer = interpolate((frame % 100), [0, 100], [0, 100]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        left: 24,
        right: 24,
        opacity: entrance,
        transform: `translateY(${interpolate(entrance, [0, 1], [30, 0])}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 20px",
          borderRadius: 28,
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(40px) saturate(150%)",
          WebkitBackdropFilter: "blur(40px) saturate(150%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 8px 40px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255,255,255,0.05)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Shimmer effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)`,
            transform: `translateX(${shimmer}%)`,
          }}
        />

        {/* Bot icon */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            overflow: "hidden",
            background: "linear-gradient(135deg, #f97316 0%, #22c55e 100%)",
            padding: 2,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 10,
              overflow: "hidden",
              background: "#0a0a0a",
            }}
          >
            <Img
              src={staticFile("aibot.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Input text */}
        <span
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: 500,
            fontFamily: "'SF Pro Text', -apple-system, sans-serif",
            color: "rgba(255, 255, 255, 0.5)",
          }}
        >
          Ask anything...
        </span>

        {/* Send button */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(249, 115, 22, 0.4)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
          </svg>
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          textAlign: "center",
          marginTop: 16,
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "'SF Pro Text', -apple-system, sans-serif",
          color: "rgba(255, 255, 255, 0.4)",
        }}
      >
        <span style={{ color: "#f97316" }}>BrackiBot</span> answers anything.
      </div>
    </div>
  );
};

// Header component
const ChatHeader: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "20px 24px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        opacity: entrance,
        transform: `translateY(${interpolate(entrance, [0, 1], [-20, 0])}px)`,
      }}
    >
      {/* Bot avatar with animated ring */}
      <div
        style={{
          position: "relative",
          width: 56,
          height: 56,
        }}
      >
        {/* Animated glow ring */}
        <div
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: 20,
            background: "linear-gradient(135deg, #f97316 0%, #22c55e 50%, #f97316 100%)",
            opacity: 0.6,
            filter: "blur(8px)",
            transform: `scale(${pulse})`,
          }}
        />
        <div
          style={{
            position: "relative",
            width: 56,
            height: 56,
            borderRadius: 18,
            overflow: "hidden",
            background: "linear-gradient(135deg, #f97316 0%, #22c55e 100%)",
            padding: 3,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 15,
              overflow: "hidden",
              background: "#0a0a0a",
            }}
          >
            <Img
              src={staticFile("aibot.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Online indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#22c55e",
            border: "3px solid #0a0a0a",
            boxShadow: "0 0 10px rgba(34, 197, 94, 0.5)",
          }}
        />
      </div>

      {/* Title */}
      <div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: "'SF Pro Display', -apple-system, sans-serif",
            color: "#ffffff",
            letterSpacing: "-0.02em",
          }}
        >
          BrackiBot
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "'SF Pro Text', -apple-system, sans-serif",
            color: "#22c55e",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
              animation: "pulse 2s infinite",
            }}
          />
          AI Tournament Assistant
        </div>
      </div>
    </div>
  );
};

// Main component
export const AIBotChat: React.FC = () => {
  const frame = useCurrentFrame();

  // Background gradient animation
  const gradientAngle = frame * 0.15;

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
              ellipse at 20% 30%,
              rgba(249, 115, 22, 0.12) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at 80% 70%,
              rgba(34, 197, 94, 0.08) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at 50% 50%,
              rgba(139, 92, 246, 0.05) 0%,
              transparent 60%
            ),
            linear-gradient(
              ${gradientAngle}deg,
              #0a0a0a 0%,
              #0f0805 50%,
              #0a0a0a 100%
            )
          `,
        }}
      />

      {/* Floating orbs */}
      {[0, 1, 2].map((i) => {
        const orbitX = Math.sin(frame * 0.01 + i * 2) * 200;
        const orbitY = Math.cos(frame * 0.008 + i * 2) * 150;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${30 + i * 20}%`,
              top: `${20 + i * 25}%`,
              width: 300 - i * 50,
              height: 300 - i * 50,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(249, 115, 22, ${0.08 - i * 0.02}) 0%, transparent 70%)`,
              filter: "blur(60px)",
              transform: `translate(${orbitX}px, ${orbitY}px)`,
            }}
          />
        );
      })}

      {/* Chat container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <ChatHeader frame={frame} />

        {/* Messages area */}
        <div
          style={{
            flex: 1,
            padding: "24px",
            overflowY: "hidden",
          }}
        >
          {/* Typing indicators before bot messages */}
          <TypingIndicator startFrame={CHAT_MESSAGES[1].delay - 35} />
          <TypingIndicator startFrame={CHAT_MESSAGES[3].delay - 35} />
          <TypingIndicator startFrame={CHAT_MESSAGES[5].delay - 35} />

          {/* Chat messages */}
          {CHAT_MESSAGES.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              startFrame={0}
            />
          ))}
        </div>

        {/* Input area */}
        <ChatInput frame={frame} />
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle noise texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.025,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      >
        <svg width="100%" height="100%">
          <filter id="chatNoise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              seed={frame % 8}
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#chatNoise)" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

export default AIBotChat;
