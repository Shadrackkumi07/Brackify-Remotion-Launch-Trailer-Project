import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

interface ScrollListProps {
  children: React.ReactNode[];
  /** Frame when scrolling starts */
  scrollStartFrame: number;
  /** Total scroll distance in pixels */
  scrollDistance?: number;
  /** Duration of scroll in frames */
  scrollDuration?: number;
  /** Whether to add bounce at the end */
  bounce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollList: React.FC<ScrollListProps> = ({
  children,
  scrollStartFrame,
  scrollDistance = 200,
  scrollDuration = 30,
  bounce = true,
  className,
  style,
}) => {
  const frame = useCurrentFrame();

  // Main scroll interpolation with easing
  const scrollProgress = interpolate(
    frame,
    [scrollStartFrame, scrollStartFrame + scrollDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }
  );

  // Scroll bounce using sin wave at the end
  const bounceAmount = bounce && frame > scrollStartFrame + scrollDuration
    ? Math.sin((frame - scrollStartFrame - scrollDuration) * 0.5) *
      Math.exp(-(frame - scrollStartFrame - scrollDuration) * 0.15) * 15
    : 0;

  const translateY = -(scrollProgress * scrollDistance) + bounceAmount;

  return (
    <div
      className={className}
      style={{
        ...style,
        transform: `translateY(${translateY}px)`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};

interface StaggeredListProps {
  items: Array<{
    id: string;
    content: React.ReactNode;
  }>;
  startFrame?: number;
  stagger?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  itemClassName?: string;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  items,
  startFrame = 0,
  stagger = 5,
  direction = "up",
  className,
  itemClassName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const getTransform = (progress: number) => {
    const distance = interpolate(progress, [0, 1], [40, 0]);
    switch (direction) {
      case "up":
        return `translateY(${distance}px)`;
      case "down":
        return `translateY(${-distance}px)`;
      case "left":
        return `translateX(${distance}px)`;
      case "right":
        return `translateX(${-distance}px)`;
    }
  };

  return (
    <div className={className}>
      {items.map((item, i) => {
        const itemStartFrame = startFrame + i * stagger;

        const entrance = spring({
          frame: frame - itemStartFrame,
          fps,
          config: { damping: 15, stiffness: 120 },
        });

        const opacity = interpolate(entrance, [0, 1], [0, 1]);

        return (
          <div
            key={item.id}
            className={itemClassName}
            style={{
              transform: getTransform(entrance),
              opacity,
            }}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
};

interface ProfileRevealProps {
  profiles: Array<{
    name: string;
    handle: string;
    avatarColor: string;
  }>;
  startFrame?: number;
  stagger?: number;
}

export const ProfileReveal: React.FC<ProfileRevealProps> = ({
  profiles,
  startFrame = 0,
  stagger = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {profiles.map((profile, i) => {
        const itemStartFrame = startFrame + i * stagger;

        const entrance = spring({
          frame: frame - itemStartFrame,
          fps,
          config: { damping: 12, stiffness: 150 },
        });

        const slideX = interpolate(entrance, [0, 1], [60, 0]);
        const opacity = interpolate(entrance, [0, 1], [0, 1]);

        // Shine sweep effect
        const shineProgress = interpolate(
          frame - itemStartFrame,
          [10, 25],
          [0, 100],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={profile.handle}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 12,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transform: `translateX(${slideX}px)`,
              opacity,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Shine sweep overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(120deg, transparent ${shineProgress - 30}%, rgba(255,255,255,0.15) ${shineProgress}%, transparent ${shineProgress + 30}%)`,
                pointerEvents: "none",
              }}
            />

            {/* Avatar */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${profile.avatarColor} 0%, ${profile.avatarColor}80 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: "bold",
                color: "#fff",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {profile.name.charAt(0)}
            </div>

            {/* Info */}
            <div>
              <div
                style={{
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {profile.name}
              </div>
              <div
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: 13,
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                @{profile.handle}
              </div>
            </div>

            {/* Follow button */}
            <div
              style={{
                marginLeft: "auto",
                padding: "6px 14px",
                backgroundColor: "#f97316",
                borderRadius: 8,
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Follow
            </div>
          </div>
        );
      })}
    </div>
  );
};
