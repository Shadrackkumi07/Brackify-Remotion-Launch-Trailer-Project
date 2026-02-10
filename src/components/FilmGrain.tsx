import { AbsoluteFill, useCurrentFrame } from "remotion";

interface FilmGrainProps {
  /** Grain intensity 0-1 */
  intensity?: number;
  /** Grain size in pixels */
  size?: number;
}

export const FilmGrain: React.FC<FilmGrainProps> = ({
  intensity = 0.08,
  size = 2,
}) => {
  const frame = useCurrentFrame();

  // Generate pseudo-random grain pattern that changes each frame
  // Using canvas-like approach with CSS
  const seed = frame * 12345;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "overlay",
        opacity: intensity,
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={`grain-${frame}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={0.7 / size}
              numOctaves={4}
              seed={seed}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          filter={`url(#grain-${frame})`}
          opacity={1}
        />
      </svg>
    </AbsoluteFill>
  );
};

interface VignetteProps {
  /** Vignette intensity 0-1 */
  intensity?: number;
  /** Inner radius percentage */
  innerRadius?: number;
}

export const Vignette: React.FC<VignetteProps> = ({
  intensity = 0.4,
  innerRadius = 40,
}) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 9998,
        background: `radial-gradient(ellipse at center, transparent ${innerRadius}%, rgba(0,0,0,${intensity}) 100%)`,
      }}
    />
  );
};

interface ScanLinesProps {
  /** Line spacing in pixels */
  spacing?: number;
  /** Line opacity */
  opacity?: number;
}

export const ScanLines: React.FC<ScanLinesProps> = ({
  spacing = 4,
  opacity = 0.05,
}) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 9997,
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent ${spacing - 1}px,
          rgba(0, 0, 0, ${opacity}) ${spacing - 1}px,
          rgba(0, 0, 0, ${opacity}) ${spacing}px
        )`,
      }}
    />
  );
};

interface ChromaticAberrationProps {
  /** Offset amount in pixels */
  offset?: number;
  children: React.ReactNode;
}

export const ChromaticAberration: React.FC<ChromaticAberrationProps> = ({
  offset = 2,
  children,
}) => {
  return (
    <div style={{ position: "relative" }}>
      {/* Red channel offset */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: -offset,
          right: offset,
          bottom: 0,
          mixBlendMode: "screen",
          opacity: 0.5,
          filter: "url(#redChannel)",
        }}
      >
        {children}
      </div>
      {/* Blue channel offset */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: offset,
          right: -offset,
          bottom: 0,
          mixBlendMode: "screen",
          opacity: 0.5,
          filter: "url(#blueChannel)",
        }}
      >
        {children}
      </div>
      {/* Main content */}
      {children}
    </div>
  );
};

interface LensFlareProps {
  x: number;
  y: number;
  startFrame: number;
  color?: string;
}

export const LensFlare: React.FC<LensFlareProps> = ({
  x,
  y,
  startFrame,
  color = "#f97316",
}) => {
  const frame = useCurrentFrame();

  const progress = Math.min(1, Math.max(0, (frame - startFrame) / 15));
  const fadeOut = Math.max(0, 1 - (frame - startFrame - 15) / 10);

  if (frame < startFrame) return null;

  const opacity = progress * fadeOut;
  const scale = 0.5 + progress * 0.5;

  return (
    <>
      {/* Main flare */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 100,
          height: 100,
          background: `radial-gradient(circle, ${color}80 0%, transparent 70%)`,
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity,
          pointerEvents: "none",
          zIndex: 998,
          filter: "blur(10px)",
        }}
      />
      {/* Secondary flares */}
      {[0.3, 0.5, 0.7].map((offset, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x + (x - window.innerWidth / 2) * offset,
            top: y + (y - window.innerHeight / 2) * offset,
            width: 30 + i * 10,
            height: 30 + i * 10,
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            transform: `translate(-50%, -50%) scale(${scale * 0.5})`,
            opacity: opacity * 0.5,
            pointerEvents: "none",
            zIndex: 998,
            filter: "blur(5px)",
            borderRadius: "50%",
          }}
        />
      ))}
    </>
  );
};
