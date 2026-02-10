import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { GlassCard } from "./GlassCard";

const CodeEditor: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 15, stiffness: 100 },
  });

  const translateX = interpolate(entrance, [0, 1], [50, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Typing animation
  const typingProgress = interpolate(
    frame,
    [delay + 10, delay + 40],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const codeLines = [
    '# Tournament: Summer Championship',
    '',
    '## Rules',
    '- Best of 3 matches',
    '- Double elimination',
    '- 5 minute breaks',
    '',
    '## Schedule',
    '- Quarter Finals: 2:00 PM',
    '- Semi Finals: 4:00 PM',
    '- Finals: 6:00 PM',
  ];

  const visibleLines = Math.floor(typingProgress * codeLines.length);

  return (
    <div
      style={{
        transform: `translateX(${translateX}px)`,
        opacity,
        width: 340,
      }}
    >
      <GlassCard delay={delay} rotateY={0}>
        <div style={{ padding: 16 }}>
          {/* Editor header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
              paddingBottom: 12,
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 6,
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ff5f56" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#27ca3f" }} />
            </div>
            <span
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: 12,
                fontFamily: "system-ui, sans-serif",
                marginLeft: 8,
              }}
            >
              tournament.md
            </span>
          </div>

          {/* Code content */}
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {codeLines.slice(0, visibleLines + 1).map((line, i) => (
              <div
                key={i}
                style={{
                  color: line.startsWith("#")
                    ? "#f97316"
                    : line.startsWith("-")
                    ? "#22c55e"
                    : "rgba(255, 255, 255, 0.7)",
                  minHeight: 20,
                }}
              >
                {i === visibleLines
                  ? line.slice(0, Math.floor((typingProgress * codeLines.length - visibleLines) * line.length))
                  : line}
                {i === visibleLines && frame % 15 < 8 && (
                  <span style={{ backgroundColor: "#f97316", marginLeft: 2 }}>│</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

const PreviewPanel: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 15, stiffness: 100 },
  });

  const translateX = interpolate(entrance, [0, 1], [-50, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        transform: `translateX(${translateX}px)`,
        opacity,
        width: 340,
      }}
    >
      <GlassCard delay={delay} rotateY={0}>
        <div style={{ padding: 16 }}>
          {/* Preview header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
              paddingBottom: 12,
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <span
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: 14,
                fontWeight: "bold",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Preview
            </span>
            <div
              style={{
                backgroundColor: "rgba(249, 115, 22, 0.2)",
                color: "#f97316",
                padding: "4px 8px",
                borderRadius: 4,
                fontSize: 11,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Live
            </div>
          </div>

          {/* Preview content */}
          <div>
            <h3
              style={{
                color: "#f97316",
                fontSize: 18,
                margin: "0 0 12px 0",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Summer Championship
            </h3>

            <h4
              style={{
                color: "#22c55e",
                fontSize: 14,
                margin: "0 0 8px 0",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Rules
            </h4>

            <ul
              style={{
                margin: "0 0 16px 0",
                paddingLeft: 20,
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: 12,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              <li>Best of 3 matches</li>
              <li>Double elimination</li>
              <li>5 minute breaks</li>
            </ul>

            <h4
              style={{
                color: "#22c55e",
                fontSize: 14,
                margin: "0 0 8px 0",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Schedule
            </h4>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {[
                { time: "2:00 PM", event: "Quarter Finals" },
                { time: "4:00 PM", event: "Semi Finals" },
                { time: "6:00 PM", event: "Finals" },
              ].map((item) => (
                <div
                  key={item.event}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: 12,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  <span>{item.event}</span>
                  <span style={{ color: "#f97316" }}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export const OrganizeUI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera effect
  const cameraSpring = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  const cameraScale = interpolate(cameraSpring, [0, 1], [1.1, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${cameraScale})`,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 40,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            color: "#f97316",
            fontSize: 24,
          }}
        >
          ⚙️
        </span>
        <h2
          style={{
            color: "#fff",
            fontSize: 24,
            fontWeight: "bold",
            margin: 0,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Easy Tournament Setup
        </h2>
      </div>

      {/* Split panels */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginTop: 20,
        }}
      >
        <PreviewPanel delay={5} />
        <CodeEditor delay={0} />
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: 14,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Markdown-powered • Real-time preview
        </span>
      </div>
    </AbsoluteFill>
  );
};
