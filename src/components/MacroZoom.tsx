import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

interface MacroZoomProps {
  children: React.ReactNode;
  /** Frame when zoom starts */
  zoomStartFrame: number;
  /** Duration of zoom in frames */
  zoomDuration?: number;
  /** Target scale */
  targetScale?: number;
  /** Focus point X (0-1, where 0.5 is center) */
  focusX?: number;
  /** Focus point Y (0-1, where 0.5 is center) */
  focusY?: number;
  /** Use high-tension curve (fast start, slow settle) */
  highTension?: boolean;
}

export const MacroZoom: React.FC<MacroZoomProps> = ({
  children,
  zoomStartFrame,
  zoomDuration = 20,
  targetScale = 3,
  focusX = 0.5,
  focusY = 0.5,
  highTension = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const zoomProgress = highTension
    ? spring({
        frame: frame - zoomStartFrame,
        fps,
        config: { damping: 25, stiffness: 120 },
        durationInFrames: zoomDuration,
      })
    : interpolate(
        frame,
        [zoomStartFrame, zoomStartFrame + zoomDuration],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }
      );

  const scale = interpolate(zoomProgress, [0, 1], [1, targetScale]);

  // Calculate translation to keep focus point centered
  const translateX = interpolate(
    zoomProgress,
    [0, 1],
    [0, (0.5 - focusX) * width * (targetScale - 1)]
  );
  const translateY = interpolate(
    zoomProgress,
    [0, 1],
    [0, (0.5 - focusY) * height * (targetScale - 1)]
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        transform: `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
};

interface Phone3DProps {
  children: React.ReactNode;
  /** Rotation on Y axis in degrees */
  rotateY?: number;
  /** Rotation on X axis in degrees */
  rotateX?: number;
  /** Float animation */
  floating?: boolean;
  /** Screen scroll offset */
  scrollY?: number;
  className?: string;
}

export const Phone3D: React.FC<Phone3DProps> = ({
  children,
  rotateY = -15,
  rotateX = 5,
  floating = true,
  scrollY = 0,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating animation
  const floatY = floating ? Math.sin(frame * 0.08) * 8 : 0;
  const floatRotate = floating ? Math.sin(frame * 0.05) * 1 : 0;

  // Entrance animation
  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 60 },
  });

  const entranceScale = interpolate(entrance, [0, 1], [0.8, 1]);
  const entranceOpacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      className={className}
      style={{
        perspective: 1200,
        perspectiveOrigin: "center center",
      }}
    >
      <div
        style={{
          transform: `
            rotateY(${rotateY + floatRotate}deg) 
            rotateX(${rotateX}deg)
            translateY(${floatY}px)
            scale(${entranceScale})
          `,
          transformStyle: "preserve-3d",
          opacity: entranceOpacity,
        }}
      >
        {/* iPhone frame */}
        <div
          style={{
            width: 280,
            height: 580,
            backgroundColor: "#1a1a1a",
            borderRadius: 44,
            padding: 12,
            boxShadow: `
              0 50px 100px rgba(0, 0, 0, 0.5),
              0 20px 40px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
            position: "relative",
          }}
        >
          {/* Dynamic Island / Notch */}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              width: 100,
              height: 28,
              backgroundColor: "#000",
              borderRadius: 20,
              zIndex: 10,
            }}
          />

          {/* Screen */}
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#0a0a0a",
              borderRadius: 36,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Screen content with scroll */}
            <div
              style={{
                transform: `translateY(${-scrollY}px)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              {children}
            </div>
          </div>

          {/* Home indicator */}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 120,
              height: 4,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
};

interface SnapZoomTransitionProps {
  children: React.ReactNode;
  /** Frame when snap zoom triggers */
  triggerFrame: number;
  /** Element position to zoom into (relative to container) */
  targetRect?: { x: number; y: number; width: number; height: number };
  /** Fade out at the end */
  fadeOut?: boolean;
}

export const SnapZoomTransition: React.FC<SnapZoomTransitionProps> = ({
  children,
  triggerFrame,
  targetRect = { x: 0.5, y: 0.5, width: 0.3, height: 0.3 },
  fadeOut = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const zoomProgress = spring({
    frame: frame - triggerFrame,
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  // Calculate scale needed to fill screen with target area
  const targetWidth = targetRect.width * width;
  const targetHeight = targetRect.height * height;
  const scaleX = width / targetWidth;
  const scaleY = height / targetHeight;
  const targetScale = Math.max(scaleX, scaleY) * 1.2;

  const scale = interpolate(zoomProgress, [0, 1], [1, targetScale]);

  // Center on target
  const centerX = targetRect.x * width;
  const centerY = targetRect.y * height;
  const translateX = interpolate(
    zoomProgress,
    [0, 1],
    [0, (width / 2 - centerX) * scale]
  );
  const translateY = interpolate(
    zoomProgress,
    [0, 1],
    [0, (height / 2 - centerY) * scale]
  );

  const opacity = fadeOut
    ? interpolate(zoomProgress, [0.7, 1], [1, 0], { extrapolateLeft: "clamp" })
    : 1;

  if (frame < triggerFrame) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        transform: `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`,
        transformOrigin: "center center",
        opacity,
      }}
    >
      {children}
    </div>
  );
};
