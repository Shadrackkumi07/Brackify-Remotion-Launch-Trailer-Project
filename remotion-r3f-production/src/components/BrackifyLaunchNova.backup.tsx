import React, { Suspense, useEffect, useRef, useState } from "react";
import { ThreeCanvas } from "@remotion/three";
import useSpline from "@splinetool/r3f-spline";
import { useGLTF } from "@react-three/drei";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { BufferGeometry, Material } from "three";

type Variant = "desktop" | "mobile";

type SceneId =
  | "signal"
  | "unified"
  | "automation"
  | "engagement"
  | "discovery"
  | "personalization"
  | "hero"
  | "outro";

type SceneConfig = {
  id: SceneId;
  from: number;
  duration: number;
  headline: string;
  subtext: string;
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// 3D Import Options
const USE_3D_MODEL = true; // Set to false to use simple fallback
const USE_GLB = true; // true = GLB (stable), false = Splinecode (may crash)
const MODEL_URL = staticFile(USE_GLB ? "scene.glb" : "scene.splinecode");

// Preload GLB for better performance
if (USE_GLB && typeof window !== 'undefined') {
  try {
    useGLTF.preload(MODEL_URL);
  } catch (err) {
    console.warn('[3D] Preload failed:', err);
  }
}

export const BRACKIFY_NOVA_FPS = 60;
const SPLINE_INTRO_FRAMES = 300;
export const BRACKIFY_NOVA_DURATION =
  42 * BRACKIFY_NOVA_FPS + SPLINE_INTRO_FRAMES;

const SCENES: SceneConfig[] = [
  {
    id: "signal",
    from: 0,
    duration: 210,
    headline: "Competition is fragmented.",
    subtext: "One match signal grows into the full tournament universe.",
  },
  {
    id: "unified",
    from: 210,
    duration: 330,
    headline: "One search. Every tournament.",
    subtext: "Start.gg, Challonge, and native Brackify events in one stream.",
  },
  {
    id: "automation",
    from: 540,
    duration: 300,
    headline: "Announce once. Publish everywhere.",
    subtext: "Automated announcements and instant push distribution.",
  },
  {
    id: "engagement",
    from: 840,
    duration: 300,
    headline: "Predict. Share. Clip the moment.",
    subtext: "Engagement loops that amplify every bracket beat.",
  },
  {
    id: "discovery",
    from: 1140,
    duration: 330,
    headline: "Find players across the ecosystem.",
    subtext: "Cross-platform search and a curated competitive feed.",
  },
  {
    id: "personalization",
    from: 1470,
    duration: 330,
    headline: "Your profile, fully custom.",
    subtext: "Themes, badges, stats modules, and identity at depth.",
  },
  {
    id: "hero",
    from: 1800,
    duration: 450,
    headline: "Brackets. Engineered for momentum.",
    subtext: "A 3D logic system assembling itself in real time.",
  },
  {
    id: "outro",
    from: 2250,
    duration: 270,
    headline: "Run tournaments at scale.",
    subtext: "Create. Automate. Engage.  brackify.gg",
  },
];

const PALETTE = {
  bg0: "#060b12",
  bg1: "#0b1422",
  text: "#eaf2ff",
  textDim: "#9fb2cc",
  cyan: "#a7e6ff",
  mint: "#4de2c5",
  blue: "#7ab8ff",
  orange: "#ff7a45",
};

const easeHero = Easing.bezier(0.22, 1, 0.36, 1);

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(167, 230, 255, 0.24)",
  background:
    "linear-gradient(140deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 45%, rgba(5,12,20,0.35) 100%)",
  backdropFilter: "blur(16px)",
  boxShadow:
    "0 30px 80px rgba(5, 14, 24, 0.45), inset 0 1px 0 rgba(255,255,255,0.24)",
};

const AmbientBackground: React.FC<{ variant: Variant }> = ({ variant }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.012) * 120;
  const pulse = 0.55 + Math.sin(frame * 0.02) * 0.09;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: -200,
          background:
            "radial-gradient(circle at 20% 20%, rgba(77,226,197,0.20) 0%, transparent 35%), radial-gradient(circle at 76% 24%, rgba(122,184,255,0.18) 0%, transparent 36%), radial-gradient(circle at 55% 78%, rgba(255,122,69,0.15) 0%, transparent 40%)",
          transform: `translate3d(${drift * (variant === "mobile" ? 0.35 : 1)}px, ${-drift * 0.25}px, 0) scale(${pulse})`,
          filter: "blur(52px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(167,230,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(167,230,255,0.05) 1px, transparent 1px)",
          backgroundSize: variant === "mobile" ? "72px 72px" : "88px 88px",
          opacity: 0.3,
        }}
      />
    </AbsoluteFill>
  );
};

const SceneCopy: React.FC<{
  variant: Variant;
  scene: SceneConfig;
}> = ({ variant, scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const exit = spring({
    frame: frame - (scene.duration - 28),
    fps,
    durationInFrames: 28,
    config: { damping: 200 },
  });

  const visibility = Math.max(0, enter - exit);

  const textBlockWidth = variant === "mobile" ? 860 : 780;

  return (
    <div
      style={{
        position: "absolute",
        left: variant === "mobile" ? 110 : 90,
        right: variant === "mobile" ? 110 : "auto",
        top: variant === "mobile" ? 140 : "auto",
        bottom: variant === "mobile" ? "auto" : 94,
        width: variant === "mobile" ? "auto" : textBlockWidth,
        opacity: visibility,
        transform: `translateY(${interpolate(visibility, [0, 1], [44, 0], clamp)}px)`,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "8px 14px",
          borderRadius: 999,
          border: "1px solid rgba(122,184,255,0.42)",
          color: PALETTE.cyan,
          letterSpacing: "0.11em",
          fontWeight: 700,
          fontSize: variant === "mobile" ? 22 : 15,
          marginBottom: 20,
          textTransform: "uppercase",
          background: "rgba(7, 16, 28, 0.48)",
        }}
      >
        Brackify Launch
      </div>
      <div
        style={{
          color: PALETTE.text,
          fontSize: variant === "mobile" ? 66 : 58,
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          fontWeight: 750,
          textWrap: "balance",
          textShadow: "0 8px 34px rgba(5, 12, 20, 0.65)",
        }}
      >
        {scene.headline}
      </div>
      <div
        style={{
          marginTop: 16,
          color: PALETTE.textDim,
          fontSize: variant === "mobile" ? 28 : 26,
          lineHeight: 1.35,
          maxWidth: variant === "mobile" ? "100%" : 650,
        }}
      >
        {scene.subtext}
      </div>
    </div>
  );
};

const SignalVisual: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, duration], [0, 1], {
    ...clamp,
    easing: easeHero,
  });

  const scale = interpolate(progress, [0, 1], [1.7, 0.7], clamp);
  const rotate = interpolate(progress, [0, 1], [0, 12], clamp);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale}) rotate(${rotate}deg)`,
      }}
    >
      <div
        style={{
          width: 740,
          height: 740,
          borderRadius: "50%",
          border: "1px solid rgba(167,230,255,0.24)",
          boxShadow: "0 0 100px rgba(122,184,255,0.25)",
          position: "relative",
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((ring) => {
          const ringScale = 0.16 + ring * 0.14 + Math.sin(frame * 0.06 + ring) * 0.01;
          return (
            <div
              key={ring}
              style={{
                position: "absolute",
                inset: 0,
                margin: "auto",
                width: 740 * ringScale,
                height: 740 * ringScale,
                borderRadius: "50%",
                border: "1px solid rgba(167,230,255,0.22)",
                opacity: 0.8 - ring * 0.12,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const UnifiedVisual: React.FC<{ duration: number; variant: Variant }> = ({
  duration,
  variant,
}) => {
  const frame = useCurrentFrame();
  const converge = interpolate(frame, [0, duration * 0.62], [0, 1], {
    ...clamp,
    easing: easeHero,
  });

  const platforms = [
    { name: "start.gg", color: PALETTE.cyan, x: -460, y: -160 },
    { name: "Challonge", color: PALETTE.mint, x: 430, y: -90 },
    { name: "Brackify", color: PALETTE.orange, x: -40, y: 270 },
  ];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: variant === "mobile" ? "56%" : "48%",
          width: variant === "mobile" ? 820 : 920,
          height: variant === "mobile" ? 132 : 116,
          borderRadius: 999,
          ...cardStyle,
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
          color: PALETTE.textDim,
          fontSize: variant === "mobile" ? 34 : 30,
        }}
      >
        Search players, events, and tournaments...
      </div>
      {platforms.map((platform, index) => {
        const settle = interpolate(converge, [0, 1], [0, 1], clamp);
        const x = interpolate(settle, [0, 1], [platform.x, 0], clamp);
        const y = interpolate(settle, [0, 1], [platform.y, 0], clamp);
        const scale = interpolate(settle, [0, 1], [1, 0.82], clamp);
        const opacity = interpolate(settle, [0, 1], [0.98, 0.72], clamp);

        return (
          <div
            key={platform.name}
            style={{
              position: "absolute",
              left: "50%",
              top: variant === "mobile" ? "56%" : "48%",
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
              borderRadius: 999,
              border: `1px solid ${platform.color}66`,
              padding: variant === "mobile" ? "14px 26px" : "12px 20px",
              color: PALETTE.text,
              fontSize: variant === "mobile" ? 28 : 24,
              opacity,
              background: `rgba(8,16,28,${0.65 - index * 0.08})`,
              boxShadow: `0 0 36px ${platform.color}55`,
            }}
          >
            {platform.name}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const AutomationVisual: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();

  const explode = interpolate(frame, [0, duration * 0.45], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const rebuild = interpolate(frame, [duration * 0.45, duration], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });

  const layers = [
    { label: "Announcement", x: -300, y: -180, z: 120, color: PALETTE.cyan },
    { label: "Push", x: 320, y: -150, z: 200, color: PALETTE.mint },
    { label: "Discord", x: -360, y: 180, z: 160, color: PALETTE.blue },
    { label: "Twitch", x: 290, y: 200, z: 90, color: PALETTE.orange },
    { label: "Schedule", x: 0, y: -280, z: 230, color: PALETTE.cyan },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        perspective: 1500,
      }}
    >
      {layers.map((layer) => {
        const spread = explode * (1 - rebuild);
        return (
          <div
            key={layer.label}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translate3d(${layer.x * spread}px, ${layer.y * spread}px, ${layer.z * spread}px) rotateX(${spread * 14}deg)`,
              width: 230,
              height: 120,
              borderRadius: 18,
              ...cardStyle,
              color: PALETTE.text,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              borderColor: `${layer.color}80`,
              boxShadow: `0 20px 50px rgba(4,8,14,0.5), 0 0 34px ${layer.color}55`,
            }}
          >
            {layer.label}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(77,226,197,0.42) 0%, transparent 65%)",
          filter: "blur(18px)",
          opacity: 0.6,
        }}
      />
    </div>
  );
};

const EngagementVisual: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const orbit = interpolate(frame, [0, duration], [0, Math.PI * 2], clamp);

  const chips = ["Prediction +18", "Share Clip", "Hot Clip", "Live Votes", "Boosted"];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 440,
          height: 440,
          borderRadius: "50%",
          border: "1px solid rgba(122,184,255,0.28)",
        }}
      />
      {chips.map((chip, index) => {
        const angle = orbit + (index / chips.length) * Math.PI * 2;
        const x = Math.cos(angle) * 280;
        const y = Math.sin(angle) * 180;
        const glow = 0.55 + 0.45 * Math.sin(frame * 0.08 + index);

        return (
          <div
            key={chip}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
              borderRadius: 999,
              padding: "14px 22px",
              fontSize: 24,
              color: PALETTE.text,
              background: "rgba(7,15,26,0.78)",
              border: "1px solid rgba(167,230,255,0.36)",
              boxShadow: `0 0 32px rgba(122,184,255,${0.35 * glow})`,
            }}
          >
            {chip}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const DiscoveryVisual: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const pathReveal = interpolate(frame, [0, duration * 0.8], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });

  const nodes = [
    { x: 380, y: 280, size: 82, label: "Player" },
    { x: 620, y: 200, size: 66, label: "start.gg" },
    { x: 880, y: 330, size: 66, label: "Challonge" },
    { x: 680, y: 510, size: 74, label: "Brackify" },
    { x: 970, y: 520, size: 70, label: "News" },
  ];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 320,
          top: 160,
          width: 760,
          height: 112,
          borderRadius: 999,
          ...cardStyle,
          display: "flex",
          alignItems: "center",
          paddingLeft: 40,
          color: PALETTE.textDim,
          fontSize: 28,
        }}
      >
        Search: "Mango" across all platforms
      </div>

      {[
        { x1: 380, y1: 280, x2: 620, y2: 200 },
        { x1: 620, y1: 200, x2: 880, y2: 330 },
        { x1: 380, y1: 280, x2: 680, y2: 510 },
        { x1: 680, y1: 510, x2: 970, y2: 520 },
      ].map((line, index) => {
        const len = Math.hypot(line.x2 - line.x1, line.y2 - line.y1);
        const angle = (Math.atan2(line.y2 - line.y1, line.x2 - line.x1) * 180) / Math.PI;
        const reveal = interpolate(pathReveal, [index * 0.16, 0.25 + index * 0.16], [0, 1], clamp);
        return (
          <div
            key={`${line.x1}-${line.y1}-${line.x2}`}
            style={{
              position: "absolute",
              left: line.x1,
              top: line.y1,
              width: len * reveal,
              height: 2,
              background: "linear-gradient(90deg, rgba(167,230,255,0.85), rgba(77,226,197,0.60))",
              transformOrigin: "left center",
              transform: `rotate(${angle}deg)`,
              boxShadow: "0 0 18px rgba(122,184,255,0.65)",
            }}
          />
        );
      })}

      {nodes.map((node, index) => {
        const localReveal = interpolate(pathReveal, [index * 0.13, 0.3 + index * 0.13], [0, 1], clamp);
        return (
          <div
            key={node.label}
            style={{
              position: "absolute",
              left: node.x - node.size / 2,
              top: node.y - node.size / 2,
              width: node.size,
              height: node.size,
              borderRadius: "50%",
              ...cardStyle,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: PALETTE.text,
              fontSize: 16,
              opacity: localReveal,
              transform: `scale(${interpolate(localReveal, [0, 1], [0.6, 1], clamp)})`,
            }}
          >
            {node.label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const PersonalizationVisual: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const modules = [
    { name: "Theme", x: -360, y: -150 },
    { name: "Badges", x: 320, y: -180 },
    { name: "Stats", x: -340, y: 190 },
    { name: "Social", x: 330, y: 180 },
  ];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 340,
          height: 480,
          borderRadius: 28,
          ...cardStyle,
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: PALETTE.text,
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        Player Profile
      </div>
      {modules.map((module, index) => {
        const reveal = spring({
          frame: frame - index * 16,
          fps: BRACKIFY_NOVA_FPS,
          durationInFrames: duration - index * 18,
          config: { damping: 200 },
        });

        return (
          <div
            key={module.name}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translate(${module.x * reveal}px, ${module.y * reveal}px) scale(${interpolate(reveal, [0, 1], [0.6, 1], clamp)})`,
              width: 220,
              height: 120,
              borderRadius: 18,
              ...cardStyle,
              color: PALETTE.text,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            {module.name}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

type SplineNode = {
  geometry?: BufferGeometry;
};

type SplineData = {
  nodes: Record<string, SplineNode>;
  materials: Record<string, Material>;
};

// Simplified fallback scene (shown when 3D disabled or load fails)
const SimpleFallbackScene: React.FC = () => {
  return (
    <>
      <color attach="background" args={["#1a1a2e"]} />
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ff9a56" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4fc3dc" />
      
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]} rotation={[0.2, 0.3, 0]}>
          <torusKnotGeometry args={[60, 18, 100, 16]} />
          <meshStandardMaterial 
            color="#ff7a45" 
            emissive="#ff4500" 
            emissiveIntensity={0.3}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        
        <mesh position={[80, 30, -20]} rotation={[0.5, 0, 0.3]}>
          <boxGeometry args={[40, 40, 40]} />
          <meshStandardMaterial 
            color="#7ab8ff" 
            emissive="#4fa3ff" 
            emissiveIntensity={0.4}
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
        
        <mesh position={[-70, -20, 10]} rotation={[0.3, 0.8, 0]}>
          <sphereGeometry args={[35, 32, 32]} />
          <meshStandardMaterial 
            color="#ff6b9d" 
            emissive="#ff1744" 
            emissiveIntensity={0.35}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[300, 300]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            roughness={0.8}
            metalness={0.2}
            opacity={0.3}
            transparent
          />
        </mesh>
      </group>
    </>
  );
};

// GLB Scene using stable Three.js loader
const GLBScene: React.FC<{ variant: Variant }> = ({ variant }) => {
  const [error, setError] = useState<string | null>(null);
  const gltf = useGLTF(MODEL_URL) as any;
  const scale = variant === "mobile" ? 0.6 : 0.8;
  
  useEffect(() => {
    if (!gltf?.scene) {
      setError('GLB scene not loaded');
      return;
    }

    console.log('[GLB] Loaded successfully');
    
    // Optimize materials for video rendering
    gltf.scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const mat = child.material;
        // Disable expensive features
        if ('transmission' in mat) mat.transmission = 0;
        if ('thickness' in mat) mat.thickness = 0;
        if ('clearcoat' in mat) mat.clearcoat = 0;
        if ('roughness' in mat && mat.roughness < 0.1) mat.roughness = 0.2;
        mat.needsUpdate = true;
      }
    });
  }, [gltf]);

  if (error || !gltf?.scene) {
    console.warn('[GLB]', error || 'Scene not ready');
    return <SimpleFallbackScene />;
  }

  return (
    <>
      <color attach="background" args={["#0a0a0f"]} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.8} />
      <pointLight position={[0, 15, 10]} intensity={1.2} color="#ffffff" />
      <spotLight 
        position={[0, 20, 15]} 
        intensity={1.5} 
        angle={0.6} 
        penumbra={0.5}
        color="#e8f4ff"
      />
      
      <primitive 
        object={gltf.scene} 
        scale={scale}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    </>
  );
};

// Spline Scene using .splinecode (may have stability issues)
const SplineScene: React.FC<{ variant: Variant }> = ({ variant }) => {
  const splineData = useSpline(MODEL_URL) as SplineData | null;
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!splineData) return;
    
    try {
      const nodeKeys = Object.keys(splineData.nodes || {});
      const materialKeys = Object.keys(splineData.materials || {});
      
      console.log(
        `[Spline] Loaded: ${nodeKeys.length} nodes, ${materialKeys.length} materials`,
      );
      
      // Disable expensive features on Spline materials
      if (splineData.materials) {
        Object.values(splineData.materials).forEach((mat: any) => {
          if (mat.transmission !== undefined) mat.transmission = 0;
          if (mat.thickness !== undefined) mat.thickness = 0;
          if (mat.clearcoat !== undefined) mat.clearcoat = 0;
        });
      }
    } catch (err) {
      console.error('[Spline] Load error:', err);
      setError(String(err));
    }
  }, [splineData]);

  if (error || !splineData?.nodes) {
    console.warn('[Spline] Falling back to simple scene');
    return <SimpleFallbackScene />;
  }

  const { nodes, materials } = splineData;

  // Render Spline scene with proper positioning for Remotion's ThreeCanvas
  const scale = variant === "mobile" ? 0.8 : 0.7;
  const positionOffset = variant === "mobile" ? -100 : 0;

  return (
    <>
      <color attach="background" args={["#393939"]} />
      <group position={[positionOffset, 0, 0]} scale={scale}>
        {nodes.Shape?.geometry && materials["Shape Material"] && (
          <mesh
            geometry={nodes.Shape.geometry}
            material={materials["Shape Material"]}
            position={[1510.29, 1384.58, 566.45]}
            rotation={[-0.83, 0.51, 0.53]}
          />
        )}
        
        <group position={[1862.92, 909.83, 793.23]}>
          {nodes["Rectangle 5"]?.geometry && materials["Rectangle 5 Material"] && (
            <mesh
              geometry={nodes["Rectangle 5"].geometry}
              material={materials["Rectangle 5 Material"]}
              rotation={[-0.83, 0.51, 0.53]}
              scale={[0.65, 0.6, 2.36]}
            />
          )}
          {nodes["Text 15"]?.geometry && materials["Text 15 Material"] && (
            <mesh
              geometry={nodes["Text 15"].geometry}
              material={materials["Text 15 Material"]}
              position={[-49.36, 31.44, 11]}
              rotation={[-0.83, 0.51, 0.53]}
              scale={[0.65, 0.6, 2.36]}
            />
          )}
        </group>
        
        <pointLight intensity={0.8} distance={1500} color="#fe9300" position={[129.57, 327.49, 200]} />
        <directionalLight intensity={0.5} position={[-370.97, 198.64, 300]} />
        <hemisphereLight intensity={0.7} color="#eaeaea" />
      </group>
    </>
  );
};

// Main scene selector
const InlineSplineSceneInner: React.FC<{ variant: Variant }> = ({ variant }) => {
  if (!USE_3D_MODEL) {
    return <SimpleFallbackScene />;
  }
  
  if (USE_GLB) {
    return <GLBScene variant={variant} />;
  }
  
  return <SplineScene variant={variant} />;
};

const InlineSplineScene = React.memo(InlineSplineSceneInner);

const SplineIntroVisual: React.FC<{ variant: Variant }> = ({ variant }) => {
  const frame = useCurrentFrame();
  const [isContextLost, setIsContextLost] = useState(false);
  const contextLostLoggedRef = useRef(false);
  const fadeOut = interpolate(
    frame,
    [SPLINE_INTRO_FRAMES - 26, SPLINE_INTRO_FRAMES],
    [1, 0],
    clamp,
  );

  if (isContextLost) {
    return (
      <AbsoluteFill
        style={{
          opacity: fadeOut,
          background:
            "radial-gradient(circle at 50% 44%, rgba(122,184,255,0.22), rgba(5,12,21,0.95) 60%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "#eaf2ff",
            fontFamily: "monospace",
            fontSize: 22,
            padding: "12px 16px",
            borderRadius: 10,
            background: "rgba(7,16,28,0.72)",
            border: "1px solid rgba(167,230,255,0.35)",
          }}
        >
          Spline preview fallback (WebGL reset)
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ opacity: fadeOut, background: "#050c15" }}>
      <ThreeCanvas
        width={variant === "mobile" ? 1080 : 1920}
        height={variant === "mobile" ? 1920 : 1080}
        frameloop="demand"
        dpr={1.5}
        camera={{
          position: [0, 5, 15],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          stencil: false,
          depth: true,
        }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 0, 0);
          gl.toneMappingExposure = 1.2;
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          
          console.log(`[3D] Camera ready - GLB scene active`);
          
          // Handle context loss gracefully
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            if (!contextLostLoggedRef.current) {
              contextLostLoggedRef.current = true;
              console.warn("[3D] Context lost - showing fallback");
              setIsContextLost(true);
            }
          });
        }}
      >
        <Suspense fallback={<SimpleFallbackScene />}>
          <InlineSplineScene variant={variant} />
        </Suspense>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

const HeroBracketVisual: React.FC<{ duration: number; variant: Variant }> = ({
  duration,
  variant,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame;
  const localDuration = Math.max(1, duration);

  const tiltDown = interpolate(localFrame, [0, localDuration * 0.4], [-18, -90], {
    ...clamp,
    easing: easeHero,
  });
  const tiltRecover = interpolate(localFrame, [localDuration * 0.4, localDuration * 0.8], [-90, -24], {
    ...clamp,
    easing: easeHero,
  });
  const tilt = localFrame <= localDuration * 0.4 ? tiltDown : tiltRecover;

  const yaw = interpolate(localFrame, [0, localDuration], [18, -12], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });

  const depthZoom = interpolate(localFrame, [0, localDuration], [0.92, 1.08], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });

  const bracketNodes = [
    { x: 200, y: 210 },
    { x: 200, y: 340 },
    { x: 200, y: 470 },
    { x: 200, y: 600 },
    { x: 370, y: 275 },
    { x: 370, y: 535 },
    { x: 540, y: 405 },
    { x: 1120, y: 210 },
    { x: 1120, y: 340 },
    { x: 1120, y: 470 },
    { x: 1120, y: 600 },
    { x: 950, y: 275 },
    { x: 950, y: 535 },
    { x: 780, y: 405 },
    { x: 660, y: 405 },
  ];

  const lines = [
    { left: 210, top: 275, width: 150 },
    { left: 210, top: 535, width: 150 },
    { left: 380, top: 405, width: 150 },
    { left: 960, top: 275, width: 150 },
    { left: 960, top: 535, width: 150 },
    { left: 790, top: 405, width: 150 },
    { left: 670, top: 405, width: 100 },
  ];

  const bracketOpacity = interpolate(frame, [0, 18], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: 1700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: bracketOpacity,
        }}
      >
        <div
          style={{
            width: variant === "mobile" ? 980 : 1380,
            height: variant === "mobile" ? 980 : 900,
            transformStyle: "preserve-3d",
            transform: `scale(${depthZoom}) rotateX(${tilt}deg) rotateY(${yaw}deg)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 36,
              border: "1px solid rgba(167,230,255,0.35)",
              background:
                "linear-gradient(160deg, rgba(9,16,28,0.84) 0%, rgba(8,14,24,0.48) 60%, rgba(5,10,18,0.88) 100%)",
              boxShadow: "0 40px 100px rgba(5, 12, 20, 0.55)",
            }}
          />

          {lines.map((line, index) => {
            const reveal = interpolate(localFrame, [index * 20, index * 20 + 36], [0, 1], {
              ...clamp,
              easing: Easing.out(Easing.exp),
            });

            return (
              <div
                key={`line-${line.left}-${line.top}`}
                style={{
                  position: "absolute",
                  left: line.left,
                  top: line.top,
                  width: line.width * reveal,
                  height: 3,
                  borderRadius: 999,
                  transformOrigin: "left center",
                  background: "linear-gradient(90deg, rgba(122,184,255,0.95), rgba(77,226,197,0.8))",
                  boxShadow: "0 0 20px rgba(122,184,255,0.75)",
                }}
              />
            );
          })}

          {bracketNodes.map((node, index) => {
            const reveal = spring({
              frame: localFrame - index * 8,
              fps: BRACKIFY_NOVA_FPS,
              durationInFrames: 28,
              config: { damping: 200 },
            });

            return (
              <div
                key={`node-${node.x}-${node.y}`}
                style={{
                  position: "absolute",
                  left: node.x,
                  top: node.y,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(234,242,255,0.95) 0%, rgba(122,184,255,0.88) 50%, rgba(77,226,197,0.62) 100%)",
                  boxShadow: "0 0 24px rgba(122,184,255,0.88)",
                  transform: `translate(-50%, -50%) scale(${reveal})`,
                  opacity: reveal,
                }}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const OutroVisual: React.FC<{ variant: Variant }> = ({ variant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img
        src={staticFile("logo.png")}
        style={{
          width: variant === "mobile" ? 260 : 220,
          height: "auto",
          transform: `scale(${enter})`,
          filter: "drop-shadow(0 16px 40px rgba(122,184,255,0.40))",
        }}
      />
      <div
        style={{
          marginTop: 26,
          fontSize: variant === "mobile" ? 58 : 44,
          color: PALETTE.text,
          letterSpacing: "-0.02em",
          fontWeight: 740,
          opacity: enter,
          textAlign: "center",
        }}
      >
        BRACKIFY
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: variant === "mobile" ? 30 : 24,
          color: PALETTE.textDim,
          opacity: enter,
        }}
      >
        Create. Automate. Engage.
      </div>
    </AbsoluteFill>
  );
};

const SceneVisual: React.FC<{
  scene: SceneConfig;
  variant: Variant;
}> = ({ scene, variant }) => {
  if (scene.id === "signal") {
    return <SignalVisual duration={scene.duration} />;
  }

  if (scene.id === "unified") {
    return <UnifiedVisual duration={scene.duration} variant={variant} />;
  }

  if (scene.id === "automation") {
    return <AutomationVisual duration={scene.duration} />;
  }

  if (scene.id === "engagement") {
    return <EngagementVisual duration={scene.duration} />;
  }

  if (scene.id === "discovery") {
    return <DiscoveryVisual duration={scene.duration} />;
  }

  if (scene.id === "personalization") {
    return <PersonalizationVisual duration={scene.duration} />;
  }

  if (scene.id === "hero") {
    return <HeroBracketVisual duration={scene.duration} variant={variant} />;
  }

  return <OutroVisual variant={variant} />;
};

const BrackifyLaunchNovaBase: React.FC<{ variant: Variant }> = ({ variant }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(150deg, ${PALETTE.bg0} 0%, ${PALETTE.bg1} 55%, ${PALETTE.bg0} 100%)`,
        overflow: "hidden",
      }}
    >
      <AmbientBackground variant={variant} />

      <Sequence durationInFrames={SPLINE_INTRO_FRAMES}>
        <SplineIntroVisual variant={variant} />
      </Sequence>

      {SCENES.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.from + SPLINE_INTRO_FRAMES}
          durationInFrames={scene.duration}
        >
          <AbsoluteFill>
            <SceneVisual scene={scene} variant={variant} />
            {scene.id === "outro" ? null : (
              <SceneCopy variant={variant} scene={scene} />
            )}
          </AbsoluteFill>
        </Sequence>
      ))}

      <div
        style={{
          position: "absolute",
          top: variant === "mobile" ? 70 : 44,
          right: variant === "mobile" ? 70 : 44,
          opacity:
            frame > SPLINE_INTRO_FRAMES + 120 &&
            frame < BRACKIFY_NOVA_DURATION - 240
              ? 0.7
              : 0,
        }}
      >
        <Img
          src={staticFile("logo.png")}
          style={{
            width: variant === "mobile" ? 72 : 46,
            height: "auto",
            filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.45))",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const BrackifyLaunchNova: React.FC = () => {
  return <BrackifyLaunchNovaBase variant="desktop" />;
};

export const BrackifyLaunchNovaMobile: React.FC = () => {
  return <BrackifyLaunchNovaBase variant="mobile" />;
};

export default BrackifyLaunchNova;
