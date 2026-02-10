import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface BorderFrameProps {
  closing?: boolean;
}

export const BorderFrame: React.FC<BorderFrameProps> = ({ closing = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulse animation for the brackets
  const pulse = spring({
    frame: frame % 60, // Repeat every 2 seconds
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const pulseScale = 1 + pulse * 0.02;

  // Closing animation for outro
  const closeProgress = closing
    ? spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 80 },
      })
    : 0;

  const closeOffset = closeProgress * 40;

  const bracketSize = 60;
  const borderWidth = 4;

  const bracketStyle = {
    position: "absolute" as const,
    width: bracketSize,
    height: bracketSize,
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
      {/* Top-Left - Orange */}
      <div
        style={{
          ...bracketStyle,
          top: 20 + closeOffset,
          left: 20 + closeOffset,
          borderTop: `${borderWidth}px solid #f97316`,
          borderLeft: `${borderWidth}px solid #f97316`,
          transform: `scale(${pulseScale})`,
          transformOrigin: "top left",
          boxShadow: "0 0 20px rgba(249, 115, 22, 0.5)",
        }}
      />

      {/* Top-Right - Green */}
      <div
        style={{
          ...bracketStyle,
          top: 20 + closeOffset,
          right: 20 + closeOffset,
          borderTop: `${borderWidth}px solid #22c55e`,
          borderRight: `${borderWidth}px solid #22c55e`,
          transform: `scale(${pulseScale})`,
          transformOrigin: "top right",
          boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)",
        }}
      />

      {/* Bottom-Right - Orange */}
      <div
        style={{
          ...bracketStyle,
          bottom: 20 + closeOffset,
          right: 20 + closeOffset,
          borderBottom: `${borderWidth}px solid #f97316`,
          borderRight: `${borderWidth}px solid #f97316`,
          transform: `scale(${pulseScale})`,
          transformOrigin: "bottom right",
          boxShadow: "0 0 20px rgba(249, 115, 22, 0.5)",
        }}
      />

      {/* Bottom-Left - Green */}
      <div
        style={{
          ...bracketStyle,
          bottom: 20 + closeOffset,
          left: 20 + closeOffset,
          borderBottom: `${borderWidth}px solid #22c55e`,
          borderLeft: `${borderWidth}px solid #22c55e`,
          transform: `scale(${pulseScale})`,
          transformOrigin: "bottom left",
          boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)",
        }}
      />
    </AbsoluteFill>
  );
};
