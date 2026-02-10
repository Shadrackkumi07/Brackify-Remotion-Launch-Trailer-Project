import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";

// ============================================
// TEXT ANIMATION TYPES - Inspired by Jitter motion design
// ============================================
export type HeadlineAnimation = "blurRotate" | "bouncyGravity" | "slideReveal" | "composeScale";
export type SubtextAnimation = "blurFade" | "bounceUp" | "waveReveal" | "scaleIn";

// Spring configs for each headline animation
const HEADLINE_SPRING_CONFIGS: Record<HeadlineAnimation, { damping: number; stiffness: number; mass: number }> = {
  blurRotate: { damping: 14, stiffness: 120, mass: 0.7 },
  bouncyGravity: { damping: 7, stiffness: 160, mass: 0.8 },
  slideReveal: { damping: 20, stiffness: 200, mass: 0.5 },
  composeScale: { damping: 12, stiffness: 140, mass: 0.6 },
};

// Word stagger delays per headline animation
const HEADLINE_WORD_DELAYS: Record<HeadlineAnimation, number> = {
  blurRotate: 4,
  bouncyGravity: 5,
  slideReveal: 2,
  composeScale: 3,
};

// Get headline word animation styles
const getHeadlineWordStyle = (
  animation: HeadlineAnimation,
  entrance: number,
  index: number,
  totalWords: number,
): { transform: string; filter?: string; opacity: number } => {
  switch (animation) {
    case "blurRotate": {
      const rotation = interpolate(entrance, [0, 1], [(index % 2 === 0 ? -15 : 15), 0]);
      const blur = interpolate(entrance, [0, 0.6, 1], [14, 3, 0], { extrapolateRight: "clamp" });
      const y = interpolate(entrance, [0, 1], [25, 0]);
      const scale = interpolate(entrance, [0, 0.5, 1], [0.6, 1.08, 1]);
      return {
        transform: `translateY(${y}px) rotate(${rotation}deg) scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity: interpolate(entrance, [0, 0.25], [0, 1], { extrapolateRight: "clamp" }),
      };
    }
    case "bouncyGravity": {
      const y = interpolate(entrance, [0, 0.35, 0.55, 0.7, 0.82, 0.92, 1], [-90, 10, -6, 3, -2, 1, 0]);
      const scale = interpolate(entrance, [0, 0.35, 0.55, 0.75, 1], [0.4, 1.2, 0.92, 1.04, 1]);
      const rotation = interpolate(entrance, [0, 0.35, 0.6, 1], [(index % 2 === 0 ? -10 : 10), 3, -1, 0]);
      return {
        transform: `translateY(${y}px) scale(${scale}) rotate(${rotation}deg)`,
        opacity: interpolate(entrance, [0, 0.12], [0, 1], { extrapolateRight: "clamp" }),
      };
    }
    case "slideReveal": {
      const direction = index % 2 === 0 ? -1 : 1;
      const x = interpolate(entrance, [0, 1], [100 * direction, 0]);
      const y = interpolate(entrance, [0, 0.5, 1], [20, -3, 0]);
      const skew = interpolate(entrance, [0, 0.5, 1], [direction * 5, 0, 0]);
      return {
        transform: `translateX(${x}px) translateY(${y}px) skewX(${skew}deg)`,
        opacity: interpolate(entrance, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
      };
    }
    case "composeScale": {
      const scatterX = (index - totalWords / 2) * 50;
      const scatterY = (index % 2 === 0 ? -40 : 40) + (index % 3) * 15;
      const x = interpolate(entrance, [0, 1], [scatterX, 0]);
      const y = interpolate(entrance, [0, 1], [scatterY, 0]);
      const scale = interpolate(entrance, [0, 0.5, 0.8, 1], [0.2, 1.15, 0.97, 1]);
      const rotation = interpolate(entrance, [0, 1], [(index % 3 - 1) * 18, 0]);
      return {
        transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg)`,
        opacity: interpolate(entrance, [0, 0.2], [0, 1], { extrapolateRight: "clamp" }),
      };
    }
  }
};

// Spring configs for each subtext animation
const SUBTEXT_SPRING_CONFIGS: Record<SubtextAnimation, { damping: number; stiffness: number; mass: number }> = {
  blurFade: { damping: 15, stiffness: 100, mass: 0.5 },
  bounceUp: { damping: 8, stiffness: 180, mass: 0.4 },
  waveReveal: { damping: 14, stiffness: 130, mass: 0.5 },
  scaleIn: { damping: 10, stiffness: 150, mass: 0.4 },
};

// Get subtext word animation styles
const getSubtextWordStyle = (
  animation: SubtextAnimation,
  entrance: number,
  index: number,
  totalWords: number,
): { transform: string; filter?: string; opacity: number } => {
  switch (animation) {
    case "blurFade": {
      const blur = interpolate(entrance, [0, 0.6, 1], [10, 1, 0], { extrapolateRight: "clamp" });
      const y = interpolate(entrance, [0, 1], [12, 0]);
      return {
        transform: `translateY(${y}px)`,
        filter: `blur(${blur}px)`,
        opacity: interpolate(entrance, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
      };
    }
    case "bounceUp": {
      const y = interpolate(entrance, [0, 0.4, 0.6, 0.8, 0.9, 1], [30, -8, 4, -2, 1, 0]);
      const scale = interpolate(entrance, [0, 0.4, 0.65, 1], [0.7, 1.12, 0.96, 1]);
      return {
        transform: `translateY(${y}px) scale(${scale})`,
        opacity: interpolate(entrance, [0, 0.2], [0, 1], { extrapolateRight: "clamp" }),
      };
    }
    case "waveReveal": {
      const wavePhase = Math.sin(index * 0.9) * 18;
      const y = interpolate(entrance, [0, 1], [25 + Math.abs(wavePhase), 0]);
      const x = interpolate(entrance, [0, 1], [wavePhase, 0]);
      const rotation = interpolate(entrance, [0, 1], [wavePhase * 0.3, 0]);
      return {
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
        opacity: interpolate(entrance, [0, 0.35], [0, 1], { extrapolateRight: "clamp" }),
      };
    }
    case "scaleIn": {
      const scale = interpolate(entrance, [0, 0.5, 0.8, 1], [0.1, 1.15, 0.95, 1]);
      const rotation = interpolate(entrance, [0, 0.6, 1], [(index % 2 === 0 ? 8 : -8), -1, 0]);
      return {
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        opacity: interpolate(entrance, [0, 0.25], [0, 1], { extrapolateRight: "clamp" }),
      };
    }
  }
};

// Subtext with dynamic animation styles
const SubtextWithTypewriter: React.FC<{
  text: string;
  startFrame: number;
  position: "left" | "right" | "bottom" | "center";
  isMobile?: boolean;
  subtextColor?: string;
  subtextAnimation?: SubtextAnimation;
}> = ({ text, startFrame, position, isMobile = false, subtextColor = "#ffffff", subtextAnimation = "bounceUp" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  const words = text.split(" ");

  const containerEntrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <div
      style={{
        fontSize: isMobile ? 28 : 26,
        fontWeight: 700,
        fontFamily: "'Inter', sans-serif",
        color: subtextColor,
        lineHeight: 1.6,
        maxWidth: isMobile ? 900 : 550,
        opacity: containerEntrance,
        display: "flex",
        flexWrap: "wrap",
        gap: "0 8px",
        justifyContent: position === "center" || position === "bottom" ? "center" : "flex-start",
        textShadow: "0 2px 12px rgba(0,0,0,0.6)",
      }}
    >
      {words.map((word, index) => {
        const wordDelay = index * 4;
        const wordLocalFrame = localFrame - wordDelay;

        const wordEntrance = spring({
          frame: wordLocalFrame,
          fps,
          config: SUBTEXT_SPRING_CONFIGS[subtextAnimation],
        });

        const animStyle = getSubtextWordStyle(subtextAnimation, wordEntrance, index, words.length);

        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              ...animStyle,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

interface SceneTextProps {
  headline: string;
  subtext?: string;
  startFrame: number;
  duration: number;
  position?: "left" | "right" | "bottom" | "center";
  highlightWords?: string[];
  // Mobile offset controls
  offsetX?: number;  // Horizontal offset (negative = left, positive = right)
  offsetY?: number;  // Vertical offset (negative = up, positive = down)
  subtextColor?: string;  // Color of the subtext
  // Jitter-inspired text animation styles
  textAnimation?: HeadlineAnimation;
  subtextAnimation?: SubtextAnimation;
}

export const SceneText: React.FC<SceneTextProps> = ({
  headline,
  subtext,
  startFrame,
  duration,
  position = "left",
  highlightWords = [],
  offsetX = 0,
  offsetY = 0,
  subtextColor = "#ffffff",
  textAnimation = "bouncyGravity",
  subtextAnimation = "bounceUp",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const localFrame = frame - startFrame;

  // Detect mobile (portrait) mode
  const isMobile = height > width;

  // Word-by-word animation with Jitter-style motion
  const words = headline.split(" ");
  const wordDelay = HEADLINE_WORD_DELAYS[textAnimation];

  // Container entrance
  const containerEntrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  // Exit animation
  const exitProgress = interpolate(
    localFrame,
    [duration - 15, duration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Position styles with offset support
  const getPositionStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? 20 : 16,
      maxWidth: isMobile ? 950 : 600,
      zIndex: 50,
    };

    // Apply offsets via CSS custom properties that get added to transform
    const applyOffset = (baseTransform: string) => {
      if (offsetX === 0 && offsetY === 0) return baseTransform;
      return `${baseTransform} translateX(${offsetX}px) translateY(${offsetY}px)`;
    };

    switch (position) {
      case "left":
        return { ...baseStyles, left: 80 + offsetX, top: `calc(50% + ${offsetY}px)`, transform: "translateY(-50%)" };
      case "right":
        return { ...baseStyles, right: 80 - offsetX, top: `calc(50% + ${offsetY}px)`, transform: "translateY(-50%)", textAlign: "right", alignItems: "flex-end" };
      case "bottom":
        return { ...baseStyles, left: `calc(50% + ${offsetX}px)`, bottom: (isMobile ? 100 : 120) - offsetY, transform: "translateX(-50%)", textAlign: "center", alignItems: "center", maxWidth: isMobile ? 950 : 900 };
      case "center":
        return { ...baseStyles, left: `calc(50% + ${offsetX}px)`, top: `calc(50% + ${offsetY}px)`, transform: "translate(-50%, -50%)", textAlign: "center", alignItems: "center" };
      default:
        return baseStyles;
    }
  };

  // Font sizes based on mobile
  const headlineFontSize = isMobile ? 68 : 56;

  return (
    <div
      style={{
        ...getPositionStyles(),
        opacity: containerEntrance * (1 - exitProgress),
      }}
    >
      {/* Headline with Jitter-style bold animation */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: isMobile ? "0 16px" : "0 14px",
          justifyContent: position === "center" || position === "bottom" ? "center" : "flex-start",
          perspective: textAnimation === "composeScale" ? 800 : undefined,
        }}
      >
        {words.map((word, index) => {
          const stagger = index * wordDelay;
          const wordEntrance = spring({
            frame: localFrame - stagger,
            fps,
            config: HEADLINE_SPRING_CONFIGS[textAnimation],
          });

          const isHighlighted = highlightWords.some(hw => 
            word.toLowerCase().includes(hw.toLowerCase())
          );

          const animStyle = getHeadlineWordStyle(textAnimation, wordEntrance, index, words.length);

          return (
            <span
              key={index}
              style={{
                fontSize: headlineFontSize,
                fontWeight: 900,
                fontFamily: "'Inter', sans-serif",
                color: isHighlighted ? "#f97316" : "#ffffff",
                textShadow: isHighlighted 
                  ? "0 0 50px rgba(249, 115, 22, 0.7), 0 0 20px rgba(249, 115, 22, 0.4), 0 4px 24px rgba(0,0,0,0.5)"
                  : "0 4px 24px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.05)",
                display: "inline-block",
                letterSpacing: "-0.03em",
                ...animStyle,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Subtext with dynamic animation */}
      {subtext && (
        <SubtextWithTypewriter
          text={subtext}
          startFrame={startFrame + words.length * wordDelay + 5}
          position={position}
          isMobile={isMobile}
          subtextColor={subtextColor}
          subtextAnimation={subtextAnimation}
        />
      )}

      {/* Accent line */}
      <div
        style={{
          width: interpolate(containerEntrance, [0, 1], [0, 80]),
          height: 4,
          background: "linear-gradient(90deg, #f97316 0%, #22c55e 100%)",
          borderRadius: 2,
          marginTop: 8,
          boxShadow: "0 0 20px rgba(249, 115, 22, 0.4)",
        }}
      />
    </div>
  );
};

// Feature badge component - supports both emoji and image icons
export const FeatureBadge: React.FC<{
  icon: string;
  iconImage?: string;
  text: string;
  startFrame: number;
  delay?: number;
  animationStyle?: "slideUp" | "slideLeft" | "slideRight" | "scale" | "rotate" | "bounce" | "flip";
  animated?: boolean;
}> = ({ icon, iconImage, text, startFrame, delay = 0, animationStyle = "slideUp", animated = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame - delay;

  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  // Different entrance transforms based on animation style
  const getTransform = () => {
    const baseScale = interpolate(entrance, [0, 1], [0.8, 1]);
    
    switch (animationStyle) {
      case "slideUp":
        return `translateY(${interpolate(entrance, [0, 1], [40, 0])}px) scale(${baseScale})`;
      case "slideLeft":
        return `translateX(${interpolate(entrance, [0, 1], [-60, 0])}px) scale(${baseScale})`;
      case "slideRight":
        return `translateX(${interpolate(entrance, [0, 1], [60, 0])}px) scale(${baseScale})`;
      case "scale":
        return `scale(${interpolate(entrance, [0, 1], [0.3, 1])})`;
      case "rotate":
        return `rotate(${interpolate(entrance, [0, 1], [-15, 0])}deg) scale(${baseScale})`;
      case "bounce":
        const bounceY = interpolate(entrance, [0, 0.6, 0.8, 1], [50, -10, 5, 0]);
        return `translateY(${bounceY}px) scale(${baseScale})`;
      case "flip":
        return `rotateX(${interpolate(entrance, [0, 1], [90, 0])}deg) scale(${baseScale})`;
      default:
        return `translateY(${interpolate(entrance, [0, 1], [30, 0])}px) scale(${baseScale})`;
    }
  };

  // Animated icon effect (pulsing/bouncing)
  const iconPulse = animated ? 1 + Math.sin(localFrame * 0.15) * 0.1 : 1;
  const iconBounce = animated ? Math.sin(localFrame * 0.2) * 3 : 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 22px",
        background: "rgba(249, 115, 22, 0.12)",
        border: "1px solid rgba(249, 115, 22, 0.25)",
        borderRadius: 16,
        backdropFilter: "blur(12px)",
        transform: getTransform(),
        opacity: entrance,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {iconImage ? (
        <Img
          src={staticFile(iconImage)}
          style={{
            width: 32,
            height: 32,
            objectFit: "contain",
            transform: `scale(${iconPulse}) translateY(${iconBounce}px)`,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}
        />
      ) : (
        <span 
          style={{ 
            fontSize: 28,
            transform: `scale(${iconPulse}) translateY(${iconBounce}px)`,
          }}
        >
          {icon}
        </span>
      )}
      <span
        style={{
          fontSize: 18,
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          color: "#ffffff",
          textShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        {text}
      </span>
    </div>
  );
};

// Animation style types
type AnimationStyle = "slideUp" | "slideLeft" | "slideRight" | "scale" | "rotate" | "bounce" | "flip";
type ListAnimationStyle = "stagger" | "cascade" | "wave" | "pop" | "slide";

// Animated feature list with multiple animation styles
export const FeatureList: React.FC<{
  features: Array<{ icon: string; iconImage?: string; text: string; animated?: boolean }>;
  startFrame: number;
  position?: "left" | "right";
  listAnimation?: ListAnimationStyle;
}> = ({ features, startFrame, position = "right", listAnimation = "stagger" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  const containerEntrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Get animation style for each item based on list animation type
  const getItemAnimation = (index: number): { style: AnimationStyle; delay: number } => {
    switch (listAnimation) {
      case "stagger":
        return { 
          style: ["slideUp", "slideUp", "slideUp"][index % 3] as AnimationStyle, 
          delay: index * 10 
        };
      case "cascade":
        return { 
          style: ["slideRight", "slideUp", "slideLeft"][index % 3] as AnimationStyle, 
          delay: index * 8 
        };
      case "wave":
        return { 
          style: "bounce" as AnimationStyle, 
          delay: index * 6 
        };
      case "pop":
        return { 
          style: "scale" as AnimationStyle, 
          delay: index * 12 
        };
      case "slide":
        return { 
          style: position === "left" ? "slideLeft" : "slideRight" as AnimationStyle, 
          delay: index * 7 
        };
      default:
        return { style: "slideUp", delay: index * 8 };
    }
  };

  // Container animation varies by position
  const containerSlide = position === "left" 
    ? interpolate(containerEntrance, [0, 1], [-30, 0])
    : interpolate(containerEntrance, [0, 1], [30, 0]);

  return (
    <div
      style={{
        position: "absolute",
        [position]: 80,
        top: "50%",
        transform: `translateY(-50%) translateX(${containerSlide}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        opacity: containerEntrance,
      }}
    >
      {features.map((feature, index) => {
        const { style, delay } = getItemAnimation(index);
        return (
          <FeatureBadge
            key={index}
            icon={feature.icon}
            iconImage={feature.iconImage}
            text={feature.text}
            startFrame={startFrame}
            delay={delay}
            animationStyle={style}
            animated={feature.animated}
          />
        );
      })}
    </div>
  );
};

export default SceneText;
