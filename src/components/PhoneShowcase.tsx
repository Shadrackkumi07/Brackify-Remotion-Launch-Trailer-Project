import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Video,
  Img,
  staticFile,
} from "remotion";

// iPhone 17 Pro Max frame dimensions from Figma export
const PHONE_FRAME = {
  width: 462,
  height: 978,
  // Screen area inset from frame edges (adjust if needed based on your export)
  screenInset: {
    top: 18,
    left: 16,
    right: 16,
    bottom: 18,
  },
  screenBorderRadius: 48,
};

// Premium cursor component using SVG file
const PremiumCursor: React.FC<{
  x: number;
  y: number;
  isPressed: boolean;
  opacity: number;
  magneticPull: number;
}> = ({ x, y, isPressed, opacity, magneticPull }) => {
  const pressScale = isPressed ? 0.85 : 1;
  const glowIntensity = isPressed ? 0.8 : 0.4;
  
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-30%, -10%) scale(${pressScale})`,
        opacity,
        zIndex: 100,
        pointerEvents: "none",
        transition: "transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {/* Outer glow */}
      <div
        style={{
          position: "absolute",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,255,255,${glowIntensity * 0.25}) 0%, transparent 70%)`,
          filter: "blur(10px)",
          transform: "translate(-30%, -10%)",
          left: "50%",
          top: "50%",
        }}
      />
      
      {/* Magnetic trail effect */}
      <div
        style={{
          position: "absolute",
          width: 50 + magneticPull * 25,
          height: 50 + magneticPull * 25,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,255,255,${0.08 + magneticPull * 0.08}) 0%, transparent 60%)`,
          filter: "blur(15px)",
          transform: "translate(-30%, -10%)",
          left: "50%",
          top: "50%",
        }}
      />
      
      {/* Pointing hand SVG */}
      <Img
        src={staticFile("pointinghand.svg")}
        style={{
          width: 48,
          height: 48,
          filter: `drop-shadow(0 6px 16px rgba(0,0,0,0.5)) drop-shadow(0 3px 6px rgba(0,0,0,0.3))`,
        }}
      />
      
      {/* Press indicator ring */}
      {isPressed && (
        <div
          style={{
            position: "absolute",
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.7)",
            transform: "translate(20%, 60%)",
            left: "50%",
            top: "50%",
          }}
        />
      )}
    </div>
  );
};

// Transition animation types
type EnterAnimation = "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scaleUp" | "rotateIn" | "flipIn" | "none";
type ExitAnimation = "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scaleDown" | "rotateOut" | "flipOut" | "none";

interface PhoneShowcaseProps {
  videoSrc?: string;
  children?: React.ReactNode;
  startFrame: number;
  duration: number;
  isIsometric?: boolean;
  showHand?: boolean;
  tapPosition?: { x: number; y: number };
  tapFrame?: number;
  swipeDirection?: "up" | "down" | "left" | "right";
  swipeFrame?: number;
  cursorEntryDirection?: "bottomRight" | "bottomLeft" | "topRight" | "topLeft" | "bottom" | "right";
  enterAnimation?: EnterAnimation;
  exitAnimation?: ExitAnimation;
  enableTapSound?: boolean;
  enableSwipeSound?: boolean;
}

export const PhoneShowcase: React.FC<PhoneShowcaseProps> = ({
  videoSrc,
  children,
  startFrame,
  duration,
  isIsometric = true,
  showHand = false,
  tapPosition = { x: 50, y: 50 },
  tapFrame = 30,
  swipeDirection,
  swipeFrame = 45,
  cursorEntryDirection,
  enterAnimation = "scaleUp",
  exitAnimation = "scaleDown",
  enableTapSound = false,
  enableSwipeSound = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  // Determine cursor entry position based on tap location or explicit direction
  const getCursorStartPosition = () => {
    if (cursorEntryDirection) {
      switch (cursorEntryDirection) {
        case "bottomRight": return { x: 130, y: 130 };
        case "bottomLeft": return { x: -30, y: 130 };
        case "topRight": return { x: 130, y: -30 };
        case "topLeft": return { x: -30, y: -30 };
        case "bottom": return { x: 50, y: 140 };
        case "right": return { x: 140, y: 50 };
        default: return { x: 130, y: 130 };
      }
    }
    // Auto-determine based on tap position - cursor enters from opposite corner
    if (tapPosition.x > 50 && tapPosition.y > 50) return { x: -20, y: -20 };
    if (tapPosition.x < 50 && tapPosition.y > 50) return { x: 120, y: -20 };
    if (tapPosition.x > 50 && tapPosition.y < 50) return { x: -20, y: 120 };
    if (tapPosition.x < 50 && tapPosition.y < 50) return { x: 120, y: 120 };
    // Default: enter from bottom right
    return { x: 120, y: 120 };
  };
  const cursorStart = getCursorStartPosition();

  // Entrance animation with spring physics
  const entranceSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 60, mass: 1.2 },
  });

  // Exit animation progress
  const exitProgress = interpolate(
    localFrame,
    [duration - 30, duration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Calculate entrance transforms based on animation type
  const getEntranceTransform = () => {
    switch (enterAnimation) {
      case "none":
        return { translateX: 0, translateY: 0, rotate: 0, rotateX: 0, rotateY: 0 };
      case "slideUp":
        return {
          translateX: 0,
          translateY: interpolate(entranceSpring, [0, 1], [400, 0]),
          rotate: 0,
          rotateX: 0,
          rotateY: 0,
        };
      case "slideDown":
        return {
          translateX: 0,
          translateY: interpolate(entranceSpring, [0, 1], [-400, 0]),
          rotate: 0,
          rotateX: 0,
          rotateY: 0,
        };
      case "slideLeft":
        return {
          translateX: interpolate(entranceSpring, [0, 1], [500, 0]),
          translateY: 0,
          rotate: 0,
          rotateX: 0,
          rotateY: 0,
        };
      case "slideRight":
        return {
          translateX: interpolate(entranceSpring, [0, 1], [-500, 0]),
          translateY: 0,
          rotate: 0,
          rotateX: 0,
          rotateY: 0,
        };
      case "rotateIn":
        return {
          translateX: 0,
          translateY: 0,
          rotate: interpolate(entranceSpring, [0, 1], [-15, 0]),
          rotateX: 0,
          rotateY: interpolate(entranceSpring, [0, 1], [-45, 0]),
        };
      case "flipIn":
        return {
          translateX: 0,
          translateY: 0,
          rotate: 0,
          rotateX: interpolate(entranceSpring, [0, 1], [90, 0]),
          rotateY: 0,
        };
      case "scaleUp":
      default:
        return {
          translateX: 0,
          translateY: 0,
          rotate: 0,
          rotateX: 0,
          rotateY: 0,
        };
    }
  };

  // Calculate exit transforms based on animation type
  const getExitTransform = () => {
    switch (exitAnimation) {
      case "none":
        return { translateX: 0, translateY: 0, rotate: 0, rotateX: 0, rotateY: 0 };
      case "slideUp":
        return {
          translateX: 0,
          translateY: interpolate(exitProgress, [0, 1], [0, -400]),
          rotate: 0,
          rotateX: 0,
          rotateY: 0,
        };
      case "slideDown":
        return {
          translateX: 0,
          translateY: interpolate(exitProgress, [0, 1], [0, 400]),
          rotate: 0,
          rotateX: 0,
          rotateY: 0,
        };
      case "slideLeft":
        return {
          translateX: interpolate(exitProgress, [0, 1], [0, -500]),
          translateY: 0,
          rotate: 0,
          rotateX: 0,
          rotateY: 0,
        };
      case "slideRight":
        return {
          translateX: interpolate(exitProgress, [0, 1], [0, 500]),
          translateY: 0,
          rotate: 0,
          rotateX: 0,
          rotateY: 0,
        };
      case "rotateOut":
        return {
          translateX: 0,
          translateY: 0,
          rotate: interpolate(exitProgress, [0, 1], [0, 15]),
          rotateX: 0,
          rotateY: interpolate(exitProgress, [0, 1], [0, 45]),
        };
      case "flipOut":
        return {
          translateX: 0,
          translateY: 0,
          rotate: 0,
          rotateX: interpolate(exitProgress, [0, 1], [0, -90]),
          rotateY: 0,
        };
      case "scaleDown":
      default:
        return {
          translateX: 0,
          translateY: 0,
          rotate: 0,
          rotateX: 0,
          rotateY: 0,
        };
    }
  };

  const entranceTransform = getEntranceTransform();
  const exitTransform = getExitTransform();

  // Subtle floating animation
  const floatY = Math.sin(localFrame * 0.025) * 6;
  const floatRotate = Math.sin(localFrame * 0.018) * 0.8;

  // Bouncy scale with overshoot
  const scaleRaw = spring({
    frame: localFrame,
    fps,
    config: { damping: 10, stiffness: 80, mass: 0.6 },
  });
  const baseScale = enterAnimation === "scaleUp"
    ? interpolate(scaleRaw, [0, 1], [0.2, 1])
    : enterAnimation === "none"
    ? 1
    : entranceSpring;
  const exitScale = exitAnimation === "scaleDown"
    ? (1 - exitProgress * 0.5)
    : 1;
  const scale = baseScale * exitScale;
  const enterOpacity = enterAnimation === "none" ? 1 : entranceSpring;
  const exitOpacity = exitAnimation === "none" ? 1 : (1 - exitProgress);
  const opacity = enterOpacity * exitOpacity;

  // Isometric transform
  const rotateY = isIsometric ? -15 : 0;
  const rotateX = isIsometric ? 6 : 0;

  // Cursor animation with magnetic easing
  const cursorEntrance = spring({
    frame: localFrame - 15,
    fps,
    config: { damping: 18, stiffness: 90, mass: 0.5 },
  });

  // Magnetic pull effect - cursor accelerates toward target
  const magneticPull = interpolate(
    cursorEntrance,
    [0, 0.7, 1],
    [0, 0.3, 1],
    { extrapolateRight: "clamp" }
  );

  // Tap press detection
  const isTapping = localFrame >= tapFrame && localFrame <= tapFrame + 8;
  const tapPressScale = isTapping ? 0.97 : 1;

  // Tap ripple with multiple rings
  const tapRippleProgress = interpolate(
    localFrame - tapFrame,
    [0, 25],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Swipe animation with easing
  const getSwipeOffset = () => {
    if (!swipeDirection || localFrame < swipeFrame) return { x: 0, y: 0 };
    const swipeProgress = spring({
      frame: localFrame - swipeFrame,
      fps,
      config: { damping: 15, stiffness: 100 },
    });
    const distance = 100;
    switch (swipeDirection) {
      case "up": return { x: 0, y: -distance * swipeProgress };
      case "down": return { x: 0, y: distance * swipeProgress };
      case "left": return { x: -distance * swipeProgress, y: 0 };
      case "right": return { x: distance * swipeProgress, y: 0 };
      default: return { x: 0, y: 0 };
    }
  };
  const swipeOffset = getSwipeOffset();

  // Cursor position with bezier-like path
  const cursorX = interpolate(
    magneticPull,
    [0, 0.5, 1],
    [cursorStart.x, (cursorStart.x + tapPosition.x) / 2 + 10, tapPosition.x]
  );
  const cursorY = interpolate(
    magneticPull,
    [0, 0.5, 1],
    [cursorStart.y, (cursorStart.y + tapPosition.y) / 2 - 10, tapPosition.y]
  );
  
  // Rim light animation
  const rimLightAngle = localFrame * 0.3;

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        perspective: 1500,
      }}
    >
      {/* Cinematic backlight glow - matches iPhone 17 bronze/gold */}
      <div
        style={{
          position: "absolute",
          width: 650,
          height: 650,
          background: `
            radial-gradient(ellipse at 30% 40%, rgba(205, 127, 50, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 60%, rgba(255, 170, 51, 0.12) 0%, transparent 50%)
          `,
          filter: "blur(90px)",
          opacity: enterOpacity * 0.8,
          zIndex: -1,
          transform: `rotate(${rimLightAngle}deg)`,
        }}
      />

      {/* Phone container with 3D transforms */}
      <div
        style={{
          position: "relative",
          width: PHONE_FRAME.width,
          height: PHONE_FRAME.height,
          transform: `
            scale(${scale * tapPressScale * 0.82})
            translateX(${entranceTransform.translateX + exitTransform.translateX}px)
            translateY(${floatY + entranceTransform.translateY + exitTransform.translateY}px)
            rotateY(${rotateY + floatRotate + entranceTransform.rotateY + exitTransform.rotateY}deg)
            rotateX(${rotateX + entranceTransform.rotateX + exitTransform.rotateX}deg)
            rotate(${entranceTransform.rotate + exitTransform.rotate}deg)
          `,
          transformStyle: "preserve-3d",
          opacity,
          transition: "transform 0.08s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Enhanced shadow with depth */}
        <div
          style={{
            position: "absolute",
            bottom: -70,
            left: "50%",
            transform: "translateX(-50%) rotateX(90deg)",
            width: 400,
            height: 140,
            background: `
              radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)
            `,
            filter: "blur(30px)",
          }}
        />

        {/* Screen content container - positioned behind the frame */}
        <div
          style={{
            position: "absolute",
            top: PHONE_FRAME.screenInset.top,
            left: PHONE_FRAME.screenInset.left,
            right: PHONE_FRAME.screenInset.right,
            bottom: PHONE_FRAME.screenInset.bottom,
            borderRadius: PHONE_FRAME.screenBorderRadius,
            overflow: "hidden",
            background: "#000",
          }}
        >
          {/* Content: Video or Children */}
          {videoSrc ? (
            <Video
              src={staticFile(videoSrc)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              startFrom={0}
              volume={0}
              muted
            />
          ) : children ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
              }}
            >
              {children}
            </div>
          ) : null}

          {/* Premium glass reflection with subtle movement */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `
                linear-gradient(
                  ${125 + Math.sin(localFrame * 0.02) * 10}deg,
                  rgba(255,255,255,0.04) 0%,
                  transparent 35%,
                  transparent 65%,
                  rgba(255,255,255,0.02) 100%
                )
              `,
              pointerEvents: "none",
            }}
          />

          {/* Premium tap ripple effects */}
          {showHand && tapRippleProgress > 0 && tapRippleProgress < 1 && (
            <>
              {/* Outer ripple */}
              <div
                style={{
                  position: "absolute",
                  left: `${tapPosition.x}%`,
                  top: `${tapPosition.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: 100 * tapRippleProgress,
                  height: 100 * tapRippleProgress,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.4)",
                  opacity: 1 - tapRippleProgress,
                  boxShadow: "0 0 30px rgba(255,255,255,0.2)",
                }}
              />
              {/* Inner ripple */}
              <div
                style={{
                  position: "absolute",
                  left: `${tapPosition.x}%`,
                  top: `${tapPosition.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: 60 * tapRippleProgress,
                  height: 60 * tapRippleProgress,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, rgba(255,255,255,${0.15 * (1 - tapRippleProgress)}) 0%, transparent 70%)`,
                }}
              />
              {/* Center glow */}
              <div
                style={{
                  position: "absolute",
                  left: `${tapPosition.x}%`,
                  top: `${tapPosition.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.6)",
                  filter: "blur(8px)",
                  opacity: (1 - tapRippleProgress) * 0.8,
                }}
              />
            </>
          )}
        </div>

        {/* iPhone 17 Pro Max Frame from Figma - layered on top */}
        <Img
          src={staticFile("iphone17-frame.png")}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: PHONE_FRAME.width,
            height: PHONE_FRAME.height,
            pointerEvents: "none",
          }}
        />

        {/* Animated rim light reflection on frame */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 55,
            background: `
              linear-gradient(
                ${135 + rimLightAngle * 0.5}deg,
                rgba(255,255,255,0.08) 0%,
                transparent 20%,
                transparent 80%,
                rgba(255,255,255,0.03) 100%
              )
            `,
            pointerEvents: "none",
          }}
        />

        {/* Premium cursor */}
        {showHand && cursorEntrance > 0 && (
          <PremiumCursor
            x={cursorX + swipeOffset.x * 0.1}
            y={cursorY + swipeOffset.y * 0.1}
            isPressed={isTapping}
            opacity={interpolate(cursorEntrance, [0, 0.2], [0, 1])}
            magneticPull={magneticPull}
          />
        )}
      </div>

      {/* Ambient gradient glow behind phone - bronze/gold accent */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          background: `
            radial-gradient(circle, rgba(205, 127, 50, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 60% 40%, rgba(255, 170, 51, 0.1) 0%, transparent 40%)
          `,
          filter: "blur(80px)",
          opacity: entranceSpring * 0.7,
          zIndex: -1,
        }}
      />
    </div>
  );
};

// Dual phone showcase for comparison views
export const DualPhoneShowcase: React.FC<{
  videoSrc1: string;
  videoSrc2: string;
  startFrame: number;
  duration: number;
}> = ({ videoSrc1, videoSrc2, startFrame, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 70 },
  });

  const phone1X = interpolate(entrance, [0, 1], [-200, -220]);
  const phone2X = interpolate(entrance, [0, 1], [200, 220]);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `translateX(${phone1X}px) scale(0.75)`, opacity: entrance }}>
        <PhoneShowcase videoSrc={videoSrc1} startFrame={startFrame} duration={duration} />
      </div>
      <div style={{ transform: `translateX(${phone2X}px) scale(0.75)`, opacity: entrance }}>
        <PhoneShowcase videoSrc={videoSrc2} startFrame={startFrame} duration={duration} />
      </div>
    </div>
  );
};

export default PhoneShowcase;
