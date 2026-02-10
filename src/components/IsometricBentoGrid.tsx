import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// Brackify colors
const COLORS = {
  orange: "#f97316",
  brown: "#92400e",
  green: "#22c55e",
  darkBg: "#0a0a0a",
};

interface BentoCardProps {
  title: string;
  subtitle: string;
  accentColor: string;
  width: number;
  height: number;
  translateZ: number;
  bobSpeed: number;
  delay: number;
  isFeatured?: boolean;
}

const BentoCard: React.FC<BentoCardProps> = ({
  title,
  subtitle,
  accentColor,
  width,
  height,
  translateZ,
  bobSpeed,
  delay,
  isFeatured = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation
  const entrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 15, stiffness: 80 },
  });

  const entranceY = interpolate(entrance, [0, 1], [60, 0]);
  const entranceOpacity = interpolate(entrance, [0, 1], [0, 1]);

  // Floating bob motion using sin wave
  const bobAmount = Math.sin((frame + delay * 10) * bobSpeed * 0.05) * 8;

  // Moving sheen effect (sweeps every ~60 frames / 2 seconds)
  const sheenPosition = interpolate(
    (frame + delay * 5) % 90,
    [0, 90],
    [-100, 200]
  );

  return (
    <div
      style={{
        width,
        height,
        transform: `translateZ(${translateZ}px) translateY(${entranceY + bobAmount}px)`,
        opacity: entranceOpacity,
        position: "relative",
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(12px)",
        borderRadius: 16,
        borderTop: `3px solid ${accentColor}`,
        border: `1px solid rgba(255, 255, 255, 0.08)`,
        boxShadow: isFeatured
          ? `0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px ${accentColor}30`
          : "0 20px 50px rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Moving sheen overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(120deg, transparent ${sheenPosition - 30}%, rgba(255,255,255,0.08) ${sheenPosition}%, transparent ${sheenPosition + 30}%)`,
          pointerEvents: "none",
        }}
      />

      {/* Card content */}
      <div>
        {/* Game icon placeholder */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}80 100%)`,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          {title === "Rocket League" && "🚗"}
          {title === "Smash Bros" && "⚔️"}
          {title === "Tekken 8" && "👊"}
          {title === "Valorant" && "🎯"}
          {title === "Street Fighter" && "🔥"}
        </div>

        <h3
          style={{
            color: "#fff",
            fontSize: isFeatured ? 22 : 18,
            fontWeight: "bold",
            margin: 0,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: 13,
            margin: "6px 0 0 0",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Bottom section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: COLORS.green,
              animation: "none",
            }}
          />
          <span
            style={{
              color: COLORS.green,
              fontSize: 11,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 500,
            }}
          >
            LIVE
          </span>
        </div>
        <span
          style={{
            color: "rgba(255, 255, 255, 0.4)",
            fontSize: 12,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          128 teams
        </span>
      </div>

      {/* Featured badge */}
      {isFeatured && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: `linear-gradient(135deg, ${COLORS.orange} 0%, ${COLORS.brown} 100%)`,
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 10,
            fontWeight: "bold",
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: 1,
          }}
        >
          FEATURED
        </div>
      )}
    </div>
  );
};

export const IsometricBentoGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Calculate zoom transition timing (last 20 frames)
  const zoomStartFrame = durationInFrames - 20;

  // Snap-zoom "Camera Dive" interpolation
  const zoomProgress = interpolate(
    frame,
    [zoomStartFrame, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Zoom scale: 1.0 -> 8.0
  const zoomScale = interpolate(zoomProgress, [0, 1], [1, 8]);

  // Center on the featured card (Rocket League - positioned top-right area)
  // These values center the camera on our featured card
  const zoomTranslateX = interpolate(zoomProgress, [0, 1], [0, 150]);
  const zoomTranslateY = interpolate(zoomProgress, [0, 1], [0, -50]);

  // Fade out as we zoom through
  const zoomOpacity = interpolate(zoomProgress, [0.7, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Initial entrance for the whole grid
  const gridEntrance = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  const gridEntranceScale = interpolate(gridEntrance, [0, 1], [0.8, 1]);
  const gridEntranceOpacity = interpolate(gridEntrance, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.darkBg,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Gradient background glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          background: `radial-gradient(circle, ${COLORS.orange}20 0%, transparent 60%)`,
          filter: "blur(80px)",
          transform: "translate(-200px, -100px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          background: `radial-gradient(circle, ${COLORS.green}15 0%, transparent 60%)`,
          filter: "blur(60px)",
          transform: "translate(200px, 100px)",
        }}
      />

      {/* Perspective container */}
      <div
        style={{
          perspective: 1200,
          perspectiveOrigin: "center center",
        }}
      >
        {/* 3D Transformed Grid */}
        <div
          style={{
            transform: `
              rotateY(-18deg) 
              rotateX(10deg) 
              scale(${gridEntranceScale * zoomScale})
              translateX(${zoomTranslateX}px)
              translateY(${zoomTranslateY}px)
            `,
            transformStyle: "preserve-3d",
            opacity: gridEntranceOpacity * zoomOpacity,
            display: "grid",
            gridTemplateColumns: "200px 240px 180px",
            gridTemplateRows: "160px 180px 140px",
            gap: 20,
          }}
        >
          {/* Row 1 */}
          <BentoCard
            title="Smash Bros"
            subtitle="Weekly Tournament"
            accentColor={COLORS.green}
            width={200}
            height={160}
            translateZ={10}
            bobSpeed={1.2}
            delay={0}
          />
          <BentoCard
            title="Rocket League"
            subtitle="Championship Finals"
            accentColor={COLORS.orange}
            width={240}
            height={160}
            translateZ={50}
            bobSpeed={0.8}
            delay={5}
            isFeatured
          />
          <BentoCard
            title="Valorant"
            subtitle="Regional Qualifiers"
            accentColor={COLORS.brown}
            width={180}
            height={160}
            translateZ={25}
            bobSpeed={1.0}
            delay={10}
          />

          {/* Row 2 - Spanning card */}
          <div
            style={{
              gridColumn: "1 / 3",
              transform: `translateZ(35px)`,
            }}
          >
            <BentoCard
              title="Tekken 8"
              subtitle="World Tour Grand Finals • $50K Prize Pool"
              accentColor={COLORS.orange}
              width={460}
              height={180}
              translateZ={0}
              bobSpeed={0.6}
              delay={15}
            />
          </div>
          <BentoCard
            title="Street Fighter"
            subtitle="Open Bracket"
            accentColor={COLORS.green}
            width={180}
            height={180}
            translateZ={60}
            bobSpeed={1.4}
            delay={20}
          />

          {/* Row 3 - Stats cards */}
          <div
            style={{
              gridColumn: "1 / 4",
              display: "flex",
              gap: 20,
              transform: `translateZ(20px)`,
            }}
          >
            {[
              { label: "Active Events", value: "2,847", color: COLORS.orange },
              { label: "Players Online", value: "145K", color: COLORS.green },
              { label: "Prize Pools", value: "$1.2M", color: COLORS.brown },
            ].map((stat, i) => {
              const statEntrance = spring({
                frame,
                fps,
                delay: 25 + i * 5,
                config: { damping: 15, stiffness: 100 },
              });
              
              return (
                <div
                  key={stat.label}
                  style={{
                    flex: 1,
                    height: 100,
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(12px)",
                    borderRadius: 12,
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderTop: `2px solid ${stat.color}`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: interpolate(statEntrance, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(statEntrance, [0, 1], [20, 0])}px)`,
                    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <span
                    style={{
                      color: stat.color,
                      fontSize: 28,
                      fontWeight: "bold",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.5)",
                      fontSize: 12,
                      fontFamily: "system-ui, sans-serif",
                      marginTop: 4,
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Title overlay */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 60,
          opacity: interpolate(frame, [0, 20], [0, 1], {
            extrapolateRight: "clamp",
          }) * interpolate(zoomProgress, [0, 0.3], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: 36,
            fontWeight: "bold",
            margin: 0,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Discover
        </h1>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: 16,
            margin: "8px 0 0 0",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Find your next tournament
        </p>
      </div>
    </AbsoluteFill>
  );
};
