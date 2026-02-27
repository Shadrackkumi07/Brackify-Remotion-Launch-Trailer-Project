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

// Chat messages
const CHAT_MESSAGES = [
  {
    id: 1,
    type: "user" as const,
    text: "Send me tournaments happening this week?",
    delay: 0,
  },
  {
    id: 2,
    type: "bot" as const,
    text: "12 events this week! 🎮",
    subtext: "Tech City Tekken #206, Cutting Edge Qualifier 4, plus 10 locals near you.",
    delay: 30,
  },
  {
    id: 3,
    type: "user" as const,
    text: "Sub-Zero frame data in MK1?",
    delay: 80,
  },
  {
    id: 4,
    type: "bot" as const,
    text: "Sub-Zero MK1 🧊",
    subtext: "Ice Ball: 18f, -8 | Slide: 12f, -14 | b+2,1,2: mid, +3 | ..more",
    delay: 110,
  },
  {
    id: 5,
    type: "user" as const,
    text: "Who won Evo 2025?",
    delay: 160,
  },
  {
    id: 6,
    type: "bot" as const,
    text: "Evo 2025 🏆",
    subtext: "T8: Arslan Ash | SF6: Punk | MK1: SonicFox",
    delay: 190,
  },
];

// Typing dots
const TypingDots: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > 25) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        opacity: interpolate(localFrame, [0, 3, 20, 25], [0, 1, 1, 0]),
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          overflow: "hidden",
          background: "linear-gradient(135deg, #f97316, #22c55e)",
          padding: 2,
        }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: 6, background: "#0a0a0a", overflow: "hidden" }}>
          <Img src={staticFile("aibot.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: "8px 12px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 12,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#f97316",
              transform: `translateY(${Math.sin((localFrame - i * 3) * 0.5) * 3}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Chat bubble
const ChatBubble: React.FC<{
  message: typeof CHAT_MESSAGES[0];
  startFrame: number;
}> = ({ message, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame - message.delay;
  const isBot = message.type === "bot";

  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.6 },
  });

  const translateX = interpolate(entrance, [0, 1], [isBot ? -60 : 60, 0]);
  const scale = interpolate(entrance, [0, 1], [0.85, 1]);
  const opacity = interpolate(entrance, [0, 0.5, 1], [0, 0.8, 1]);

  const textReveal = interpolate(localFrame, [8, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isBot ? "row" : "row-reverse",
        alignItems: "flex-end",
        gap: 8,
        marginBottom: 10,
        transform: `translateX(${translateX}px) scale(${scale})`,
        opacity,
      }}
    >
      {/* Avatar */}
      {isBot && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 9,
            overflow: "hidden",
            background: "linear-gradient(135deg, #f97316, #22c55e)",
            padding: 2,
            flexShrink: 0,
            boxShadow: "0 2px 10px rgba(249, 115, 22, 0.3)",
          }}
        >
          <div style={{ width: "100%", height: "100%", borderRadius: 7, background: "#0a0a0a", overflow: "hidden" }}>
            <Img src={staticFile("aibot.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      )}

      {/* Bubble */}
      <div
        style={{
          maxWidth: "75%",
          padding: isBot ? "10px 12px" : "8px 12px",
          borderRadius: isBot ? "14px 14px 14px 4px" : "14px 14px 4px 14px",
          background: isBot
            ? "rgba(255,255,255,0.1)"
            : "rgba(249, 115, 22, 0.2)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${isBot ? "rgba(255,255,255,0.1)" : "rgba(249, 115, 22, 0.3)"}`,
          boxShadow: isBot
            ? "0 4px 15px rgba(0,0,0,0.15)"
            : "0 4px 15px rgba(249, 115, 22, 0.15)",
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: isBot ? 600 : 500,
            color: "#fff",
            fontFamily: "'SF Pro Text', sans-serif",
          }}
        >
          {message.text}
        </div>
        {isBot && message.subtext && (
          <div
            style={{
              marginTop: 6,
              fontSize: 13,
              color: "rgba(255,255,255,0.75)",
              fontFamily: "'SF Pro Text', sans-serif",
              lineHeight: 1.4,
              opacity: textReveal,
              transform: `translateY(${(1 - textReveal) * 5}px)`,
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
            width: 26,
            height: 26,
            borderRadius: 8,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 14 }}>👤</span>
        </div>
      )}
    </div>
  );
};

// Main Phone AI Chat Component
export const PhoneAIChat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const inputEntrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const gradientRotate = frame * 0.2;

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: -30,
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(34, 197, 94, 0.07) 0%, transparent 50%),
            linear-gradient(${gradientRotate}deg, #0a0a0a, #0f0805, #0a0a0a)
          `,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          opacity: headerEntrance,
          transform: `translateY(${(1 - headerEntrance) * -15}px)`,
        }}
      >
        {/* Bot avatar */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: -3,
              borderRadius: 12,
              background: "linear-gradient(135deg, #f97316, #22c55e)",
              opacity: 0.5,
              filter: "blur(6px)",
              transform: `scale(${pulse})`,
            }}
          />
          <div
            style={{
              position: "relative",
              width: 36,
              height: 36,
              borderRadius: 11,
              overflow: "hidden",
              background: "linear-gradient(135deg, #f97316, #22c55e)",
              padding: 2,
            }}
          >
            <div style={{ width: "100%", height: "100%", borderRadius: 9, background: "#0a0a0a", overflow: "hidden" }}>
              <Img src={staticFile("aibot.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -1,
              right: -1,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#22c55e",
              border: "2px solid #0a0a0a",
            }}
          />
        </div>
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'SF Pro Display', sans-serif",
            }}
          >
            BrackiBot
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#22c55e",
              fontFamily: "'SF Pro Text', sans-serif",
            }}
          >
            AI Assistant
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: "12px", overflowY: "hidden" }}>
        <TypingDots startFrame={CHAT_MESSAGES[1].delay - 25} />
        <TypingDots startFrame={CHAT_MESSAGES[3].delay - 25} />
        <TypingDots startFrame={CHAT_MESSAGES[5].delay - 25} />
        
        {CHAT_MESSAGES.map((msg) => (
          <ChatBubble key={msg.id} message={msg} startFrame={0} />
        ))}
      </div>

      {/* Input */}
      <div
        style={{
          padding: "10px 12px 20px",
          opacity: inputEntrance,
          transform: `translateY(${(1 - inputEntrance) * 20}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 18,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              overflow: "hidden",
              background: "linear-gradient(135deg, #f97316, #22c55e)",
              padding: 2,
            }}
          >
            <div style={{ width: "100%", height: "100%", borderRadius: 5, background: "#0a0a0a", overflow: "hidden" }}>
              <Img src={staticFile("aibot.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
          <span
            style={{
              flex: 1,
              fontSize: 14,
              color: "rgba(255,255,255,0.4)",
              fontFamily: "'SF Pro Text', sans-serif",
            }}
          >
            Ask anything...
          </span>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, #f97316, #fb923c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 8,
            fontSize: 10,
            color: "rgba(255,255,255,0.35)",
            fontFamily: "'SF Pro Text', sans-serif",
          }}
        >
          <span style={{ color: "#f97316" }}>BrackiBot</span> answers anything.
        </div>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.35) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export default PhoneAIChat;
