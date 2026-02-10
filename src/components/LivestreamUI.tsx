import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { GlassCard } from "./GlassCard";

const VideoThumbnail: React.FC<{ delay: number; isLive?: boolean }> = ({
  delay,
  isLive = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 15, stiffness: 100 },
  });

  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Pulsing live dot
  const pulse = spring({
    frame: frame % 30,
    fps,
    config: { damping: 10, stiffness: 200 },
  });
  const liveDotScale = 1 + pulse * 0.3;

  return (
    <div
      style={{
        width: 200,
        height: 120,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 8,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        transform: `scale(${scale})`,
        opacity,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Fake video gradient */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`,
        }}
      />

      {/* Play button overlay */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 36,
          height: 36,
          backgroundColor: "rgba(249, 115, 22, 0.8)",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "12px solid white",
            borderTop: "7px solid transparent",
            borderBottom: "7px solid transparent",
            marginLeft: 3,
          }}
        />
      </div>

      {/* Live badge */}
      {isLive && (
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            backgroundColor: "rgba(34, 197, 94, 0.9)",
            padding: "4px 8px",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              backgroundColor: "#fff",
              borderRadius: "50%",
              transform: `scale(${liveDotScale})`,
            }}
          />
          <span
            style={{
              color: "#fff",
              fontSize: 11,
              fontWeight: "bold",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            LIVE
          </span>
        </div>
      )}

      {/* Viewer count */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 8,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "2px 6px",
          borderRadius: 4,
          color: "#fff",
          fontSize: 11,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {isLive ? "2.4K" : "12K"} viewers
      </div>
    </div>
  );
};

export const LivestreamUI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera zoom-through effect
  const cameraSpring = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const cameraScale = interpolate(cameraSpring, [0, 1], [1.1, 1]);
  const cameraY = interpolate(cameraSpring, [0, 1], [-20, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${cameraScale}) translateY(${cameraY}px)`,
      }}
    >
      <GlassCard delay={0} rotateY={0} className="">
        <div style={{ padding: 24, width: 500 }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                color: "#fff",
                fontSize: 24,
                fontWeight: "bold",
                margin: 0,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Live Tournaments
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#f97316",
                fontSize: 14,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              <span>View All</span>
              <span>→</span>
            </div>
          </div>

          {/* Video grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
            }}
          >
            <VideoThumbnail delay={5} isLive />
            <VideoThumbnail delay={10} isLive />
            <VideoThumbnail delay={15} />
            <VideoThumbnail delay={20} />
          </div>

          {/* Bottom stats */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {[
              { label: "Active", value: "1,234" },
              { label: "Players", value: "45.2K" },
              { label: "Prizes", value: "$250K" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                style={{ textAlign: "center" }}
              >
                <div
                  style={{
                    color: i === 2 ? "#22c55e" : "#f97316",
                    fontSize: 20,
                    fontWeight: "bold",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: 12,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </AbsoluteFill>
  );
};
