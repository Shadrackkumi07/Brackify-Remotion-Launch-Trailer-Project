import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

interface CursorProps {
  /** Array of {x, y, frame} waypoints for the cursor path */
  path: Array<{ x: number; y: number; frame: number }>;
  /** Frame when cursor clicks */
  clickFrame?: number;
  /** Whether to show the cursor */
  visible?: boolean;
}

export const Cursor: React.FC<CursorProps> = ({
  path,
  clickFrame,
  visible = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!visible || path.length === 0) return null;

  // Get current position by interpolating through waypoints
  const frames = path.map((p) => p.frame);
  const xPositions = path.map((p) => p.x);
  const yPositions = path.map((p) => p.y);

  const currentX = interpolate(frame, frames, xPositions, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Smooth human-like movement
  });

  const currentY = interpolate(frame, frames, yPositions, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  // Click animation - hand rotates and scales slightly
  const isClicking = clickFrame !== undefined && frame >= clickFrame && frame < clickFrame + 8;
  
  const clickRotation = clickFrame !== undefined
    ? spring({
        frame: frame - clickFrame,
        fps,
        config: { damping: 12, stiffness: 300 },
        durationInFrames: 10,
      })
    : 0;

  const handRotate = isClicking ? interpolate(clickRotation, [0, 1], [0, -8]) : 0;
  const handScale = isClicking ? interpolate(clickRotation, [0, 0.3, 1], [1, 0.92, 1]) : 1;

  // Fade in entrance
  const opacity = interpolate(frame, [0, 5], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: currentX,
        top: currentY,
        transform: `rotate(${handRotate}deg) scale(${handScale})`,
        opacity,
        zIndex: 1000,
        pointerEvents: "none",
        filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))",
        transition: "none",
      }}
    >
      {/* Minimalist hand cursor */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        style={{ transform: "translate(-8px, -4px)" }}
      >
        {/* Hand pointing cursor */}
        <path
          d="M7 2L7 13L4.5 10.5L3 12L8 17H14L16 11L16 2L14 2L14 8L12 8L12 1L10 1L10 8L8 8L8 2L7 2Z"
          fill="#ffffff"
          stroke="#1a1a1a"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

interface ClickRippleProps {
  x: number;
  y: number;
  startFrame: number;
  color?: string;
}

export const ClickRipple: React.FC<ClickRippleProps> = ({
  x,
  y,
  startFrame,
  color = "rgba(249, 115, 22, 0.6)",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const scale = interpolate(progress, [0, 1], [0, 2.5]);
  const opacity = interpolate(progress, [0, 0.3, 1], [0.8, 0.5, 0]);

  if (frame < startFrame) return null;

  return (
    <>
      {/* Main ripple */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: `3px solid ${color}`,
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity,
          pointerEvents: "none",
          zIndex: 999,
        }}
      />
      {/* Inner flash */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: color,
          transform: `translate(-50%, -50%) scale(${interpolate(progress, [0, 0.5], [1, 0])})`,
          opacity: interpolate(progress, [0, 0.4], [1, 0]),
          pointerEvents: "none",
          zIndex: 999,
          filter: "blur(2px)",
        }}
      />
    </>
  );
};

interface HapticButtonProps {
  children: React.ReactNode;
  clickFrame: number;
  className?: string;
  style?: React.CSSProperties;
}

export const HapticButton: React.FC<HapticButtonProps> = ({
  children,
  clickFrame,
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Haptic bounce: 1.0 -> 0.95 -> 1.05 -> 1.0
  const bounceProgress = spring({
    frame: frame - clickFrame,
    fps,
    config: { damping: 8, stiffness: 400 },
  });

  const scale = frame >= clickFrame
    ? interpolate(
        bounceProgress,
        [0, 0.3, 0.6, 1],
        [1, 0.95, 1.05, 1]
      )
    : 1;

  return (
    <div
      className={className}
      style={{
        ...style,
        transform: `scale(${scale})`,
        transformOrigin: "center",
      }}
    >
      {children}
    </div>
  );
};
