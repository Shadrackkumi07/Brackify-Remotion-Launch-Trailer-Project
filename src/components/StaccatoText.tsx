import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

interface StaccatoTextProps {
  text: string;
  /** Frame delay between each word */
  stagger?: number;
  /** Starting frame for the animation */
  startFrame?: number;
  /** Words to highlight with accent color */
  highlightWords?: string[];
  /** Base color */
  color?: string;
  /** Highlight/accent color */
  accentColor?: string;
  fontSize?: number;
  fontWeight?: number;
  className?: string;
}

export const StaccatoText: React.FC<StaccatoTextProps> = ({
  text,
  stagger = 3,
  startFrame = 0,
  highlightWords = [],
  color = "#ffffff",
  accentColor = "#f97316",
  fontSize = 48,
  fontWeight = 800,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ");

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.3em",
        fontFamily: "system-ui, sans-serif",
        fontSize,
        fontWeight,
      }}
    >
      {words.map((word, i) => {
        const wordStartFrame = startFrame + i * stagger;

        const entrance = spring({
          frame: frame - wordStartFrame,
          fps,
          config: { damping: 12, stiffness: 200 },
        });

        const scale = interpolate(entrance, [0, 1], [0.5, 1]);
        const opacity = interpolate(entrance, [0, 1], [0, 1]);
        const translateY = interpolate(entrance, [0, 1], [20, 0]);

        const isHighlighted = highlightWords.some(
          (hw) => word.toLowerCase().includes(hw.toLowerCase())
        );

        // Color transition for highlighted words
        const colorProgress = spring({
          frame: frame - wordStartFrame - 5,
          fps,
          delay: 5,
          config: { damping: 20, stiffness: 100 },
        });

        const wordColor = isHighlighted
          ? interpolate(colorProgress, [0, 1], [0, 1]) > 0.5
            ? accentColor
            : color
          : color;

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `scale(${scale}) translateY(${translateY}px)`,
              opacity,
              color: wordColor,
              textShadow: isHighlighted && colorProgress > 0.5
                ? `0 0 20px ${accentColor}40`
                : "none",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

interface WordRevealProps {
  words: string[];
  /** Frame to display each word */
  frameDuration?: number;
  startFrame?: number;
  fontSize?: number;
  color?: string;
  accentColor?: string;
}

export const WordReveal: React.FC<WordRevealProps> = ({
  words,
  frameDuration = 20,
  startFrame = 0,
  fontSize = 64,
  color = "#ffffff",
  accentColor = "#f97316",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentWordIndex = Math.floor((frame - startFrame) / frameDuration);
  const currentWord = words[Math.min(currentWordIndex, words.length - 1)];
  const isAccent = currentWordIndex % 2 === 1;

  const wordFrame = (frame - startFrame) % frameDuration;

  // Pop-in animation
  const entrance = spring({
    frame: wordFrame,
    fps,
    config: { damping: 10, stiffness: 300 },
  });

  const scale = interpolate(entrance, [0, 1], [0.7, 1]);
  const opacity = interpolate(
    wordFrame,
    [0, 3, frameDuration - 3, frameDuration],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  if (frame < startFrame || currentWordIndex >= words.length) return null;

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        fontSize,
        fontWeight: 900,
        color: isAccent ? accentColor : color,
        transform: `scale(${scale})`,
        opacity,
        textTransform: "uppercase",
        letterSpacing: -2,
        textShadow: isAccent ? `0 0 40px ${accentColor}60` : "none",
      }}
    >
      {currentWord}
    </div>
  );
};

interface TypewriterTextProps {
  text: string;
  startFrame?: number;
  /** Characters per frame */
  speed?: number;
  fontSize?: number;
  color?: string;
  cursorColor?: string;
  showCursor?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame = 0,
  speed = 0.5,
  fontSize = 24,
  color = "#ffffff",
  cursorColor = "#f97316",
  showCursor = true,
}) => {
  const frame = useCurrentFrame();

  const charsToShow = Math.floor((frame - startFrame) * speed);
  const displayText = text.slice(0, Math.max(0, charsToShow));
  const isTyping = charsToShow < text.length && charsToShow >= 0;

  if (frame < startFrame) return null;

  return (
    <span
      style={{
        fontFamily: "monospace",
        fontSize,
        color,
      }}
    >
      {displayText}
      {showCursor && (
        <span
          style={{
            color: cursorColor,
            opacity: isTyping || frame % 20 < 10 ? 1 : 0,
          }}
        >
          │
        </span>
      )}
    </span>
  );
};
