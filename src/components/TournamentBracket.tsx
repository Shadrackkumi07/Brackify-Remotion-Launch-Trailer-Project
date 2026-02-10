import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

interface BracketNodeProps {
  x: number;
  y: number;
  label: string;
  delay: number;
  isWinner?: boolean;
}

const BracketNode: React.FC<BracketNodeProps> = ({
  x,
  y,
  label,
  delay,
  isWinner = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 12, stiffness: 100 },
  });

  const scale = interpolate(entrance, [0, 1], [0, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      style={{ opacity }}
    >
      <rect
        x={-60}
        y={-18}
        width={120}
        height={36}
        rx={6}
        fill={isWinner ? "rgba(249, 115, 22, 0.3)" : "rgba(255, 255, 255, 0.05)"}
        stroke={isWinner ? "#f97316" : "rgba(255, 255, 255, 0.2)"}
        strokeWidth={isWinner ? 2 : 1}
      />
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        fill={isWinner ? "#fff" : "rgba(255, 255, 255, 0.8)"}
        fontSize={14}
        fontFamily="system-ui, sans-serif"
        fontWeight={isWinner ? "bold" : "normal"}
      >
        {label}
      </text>
      {isWinner && (
        <circle
          cx={50}
          cy={0}
          r={8}
          fill="#22c55e"
        />
      )}
    </g>
  );
};

interface BracketLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}

const BracketLine: React.FC<BracketLineProps> = ({ x1, y1, x2, y2, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    delay,
    config: { damping: 20, stiffness: 80 },
  });

  // Calculate the path length animation
  const midX = x1 + (x2 - x1) / 2;

  const path = `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`;

  // Approximate total path length
  const totalLength = Math.abs(midX - x1) + Math.abs(y2 - y1) + Math.abs(x2 - midX);
  const dashOffset = interpolate(progress, [0, 1], [totalLength, 0]);

  return (
    <path
      d={path}
      fill="none"
      stroke="#f97316"
      strokeWidth={2}
      strokeDasharray={totalLength}
      strokeDashoffset={dashOffset}
      style={{
        filter: "drop-shadow(0 0 4px rgba(249, 115, 22, 0.5))",
      }}
    />
  );
};

export const TournamentBracket: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera effect
  const cameraSpring = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  const cameraScale = interpolate(cameraSpring, [0, 1], [0.85, 1]);
  const cameraY = interpolate(cameraSpring, [0, 1], [30, 0]);

  const teams = [
    "Team Alpha",
    "Team Beta",
    "Team Gamma",
    "Team Delta",
    "Team Epsilon",
    "Team Zeta",
    "Team Eta",
    "Team Theta",
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${cameraScale}) translateY(${cameraY}px)`,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 60,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 3,
            backgroundColor: "#f97316",
          }}
        />
        <h2
          style={{
            color: "#fff",
            fontSize: 28,
            fontWeight: "bold",
            margin: 0,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: 2,
          }}
        >
          CHAMPIONSHIP BRACKET
        </h2>
        <div
          style={{
            width: 40,
            height: 3,
            backgroundColor: "#22c55e",
          }}
        />
      </div>

      <svg
        width={700}
        height={400}
        viewBox="0 0 700 400"
        style={{ marginTop: 40 }}
      >
        {/* Round 1 - Left side */}
        <BracketNode x={80} y={50} label={teams[0]} delay={0} />
        <BracketNode x={80} y={110} label={teams[1]} delay={3} />
        <BracketNode x={80} y={190} label={teams[2]} delay={6} />
        <BracketNode x={80} y={250} label={teams[3]} delay={9} />

        {/* Round 1 - Right side */}
        <BracketNode x={620} y={50} label={teams[4]} delay={2} />
        <BracketNode x={620} y={110} label={teams[5]} delay={5} />
        <BracketNode x={620} y={190} label={teams[6]} delay={8} />
        <BracketNode x={620} y={250} label={teams[7]} delay={11} />

        {/* Semi-finals */}
        <BracketNode x={220} y={80} label={teams[0]} delay={20} isWinner />
        <BracketNode x={220} y={220} label={teams[2]} delay={24} isWinner />
        <BracketNode x={480} y={80} label={teams[4]} delay={22} isWinner />
        <BracketNode x={480} y={220} label={teams[7]} delay={26} isWinner />

        {/* Finals */}
        <BracketNode x={350} y={150} label={teams[0]} delay={35} isWinner />

        {/* Connection lines - Round 1 to Semi */}
        <BracketLine x1={140} y1={50} x2={160} y2={80} delay={15} />
        <BracketLine x1={140} y1={110} x2={160} y2={80} delay={15} />
        <BracketLine x1={140} y1={190} x2={160} y2={220} delay={18} />
        <BracketLine x1={140} y1={250} x2={160} y2={220} delay={18} />

        <BracketLine x1={560} y1={50} x2={540} y2={80} delay={17} />
        <BracketLine x1={560} y1={110} x2={540} y2={80} delay={17} />
        <BracketLine x1={560} y1={190} x2={540} y2={220} delay={20} />
        <BracketLine x1={560} y1={250} x2={540} y2={220} delay={20} />

        {/* Semi to Finals */}
        <BracketLine x1={280} y1={80} x2={290} y2={150} delay={30} />
        <BracketLine x1={280} y1={220} x2={290} y2={150} delay={30} />
        <BracketLine x1={420} y1={80} x2={410} y2={150} delay={32} />
        <BracketLine x1={420} y1={220} x2={410} y2={150} delay={32} />
      </svg>

      {/* Winner Trophy */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 24,
            color: "#f97316",
          }}
        >
          🏆
        </span>
        <span
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: 14,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Prize Pool: $50,000
        </span>
      </div>
    </AbsoluteFill>
  );
};
