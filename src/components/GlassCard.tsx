import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  delay?: number;
  rotateY?: number;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  delay = 0,
  rotateY = -15,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 12, stiffness: 100 },
  });

  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const translateY = interpolate(entrance, [0, 1], [30, 0]);

  return (
    <div
      className={className}
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: 12,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        transform: `perspective(1000px) rotateY(${rotateY}deg) scale(${scale}) translateY(${translateY}px)`,
        opacity,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}
    >
      {children}
    </div>
  );
};
