import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { useScrollMetrics } from "@/components/motion/SmoothScrollProvider";
import { SceneErrorBoundary } from "./SceneErrorBoundary";
import logoImg from "@/assets/yemelink-logo.png";

/** Procedural stadium / chain-link tube geometry representing YEMELINK's core "LINK" identity */
function createChainLinkGeometry(length = 0.85, radius = 0.44, tube = 0.145) {
  const curvePoints: THREE.Vector3[] = [];
  const half = length / 2;
  const arcSteps = 24;
  for (let i = 0; i <= arcSteps; i++) {
    const a = -Math.PI / 2 + (i / arcSteps) * Math.PI;
    curvePoints.push(new THREE.Vector3(half + Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  for (let i = 0; i <= arcSteps; i++) {
    const a = Math.PI / 2 + (i / arcSteps) * Math.PI;
    curvePoints.push(new THREE.Vector3(-half + Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  const curve = new THREE.CatmullRomCurve3(curvePoints, true, "centripetal");
  return new THREE.TubeGeometry(curve, 96, tube, 24, true);
}

function InterlockedLinks({
  scrollProgressRef,
  onReady,
}: {
  scrollProgressRef: React.MutableRefObject<{ progress: number }>;
  onReady: () => void;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const readyFired = useRef(false);

  const linkGeo = useMemo(() => createChainLinkGeometry(0.95, 0.46, 0.15), []);
  const nodePositions = useMemo(
    () => [
      [1.85, 0.65, 0.3],
      [-1.8, -0.55, 0.45],
      [0.45, 1.82, -0.35],
      [-0.5, -1.78, -0.3],
      [1.35, -1.2, -0.45],
      [-1.4, 1.15, 0.25],
    ] as const,
    [],
  );

  useEffect(() => {
    return () => linkGeo.dispose();
  }, [linkGeo]);

  useFrame((state, delta) => {
    if (!readyFired.current) {
      readyFired.current = true;
      onReady();
    }
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const scrollP = scrollProgressRef.current.progress;
    const damp = 1 - Math.exp(-5 * dt);

    if (rootRef.current) {
      const targetRotY = t * 0.32 + state.pointer.x * 0.55 + scrollP * Math.PI * 1.6;
      const targetRotX = Math.sin(t * 0.45) * 0.15 - state.pointer.y * 0.35;
      rootRef.current.rotation.y += (targetRotY - rootRef.current.rotation.y) * damp;
      rootRef.current.rotation.x += (targetRotX - rootRef.current.rotation.x) * damp;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.22;
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.4) * 0.12;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.22} floatIntensity={0.45}>
      <group ref={rootRef}>
        {/* Link A — liquid cyan glass */}
        <mesh geometry={linkGeo} position={[-0.42, 0, 0]} rotation={[0.2, 0.15, 0.28]}>
          <meshPhysicalMaterial
            color="#22d3ee"
            emissive="#0891b2"
            emissiveIntensity={0.35}
            metalness={0.25}
            roughness={0.12}
            transmission={0.55}
            thickness={0.7}
            ior={1.45}
            clearcoat={1}
            clearcoatRoughness={0.08}
          />
        </mesh>

        {/* Link B — deep YEMELINK metallic navy-chrome */}
        <mesh geometry={linkGeo} position={[0.42, 0, 0]} rotation={[Math.PI / 2 + 0.18, -0.15, -0.28]}>
          <meshPhysicalMaterial
            color="#0ea5e9"
            emissive="#0369a1"
            emissiveIntensity={0.28}
            metalness={0.85}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Glowing nexus core where the two links interlock */}
        <mesh>
          <icosahedronGeometry args={[0.24, 2]} />
          <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={1.35} roughness={0.15} metalness={0.3} />
        </mesh>

        {/* Orbital network ring & connected nodes */}
        <group ref={ringRef}>
          <mesh>
            <torusGeometry args={[1.9, 0.014, 16, 120]} />
            <meshStandardMaterial color="#38bdf8" emissive="#00bcd4" emissiveIntensity={0.85} transparent opacity={0.65} />
          </mesh>
          <mesh rotation={[Math.PI / 2.6, 0.4, 0]}>
            <torusGeometry args={[1.65, 0.009, 12, 96]} />
            <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={0.65} transparent opacity={0.45} />
          </mesh>
        </group>

        {nodePositions.map((pos, idx) => (
          <mesh key={idx} position={[pos[0], pos[1], pos[2]]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={1.1} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export function HeroLogoFallback() {
  return (
    <div className="relative flex items-center justify-center w-full h-full p-8 md:p-14">
      <div className="absolute inset-[14%] rounded-full border border-primary/25 animate-spin [animation-duration:28s]" />
      <div className="absolute inset-[24%] rounded-full border border-primary-glow/20 animate-spin [animation-direction:reverse] [animation-duration:36s]" />
      <img
        src={logoImg}
        alt="YEMELINK"
        className="relative w-full max-w-xs animate-float drop-shadow-[0_0_50px_rgba(0,188,212,0.45)] rounded-3xl"
      />
    </div>
  );
}

export default function HeroLinkScene() {
  const { reducedMotion, isMobile } = useMotionPrefs();
  const { metricsRef } = useScrollMetrics();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { rootMargin: "120px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const use2D = reducedMotion || isMobile;

  return (
    <div
      ref={containerRef}
      data-scene-ready={use2D || sceneReady ? "true" : undefined}
      data-cursor="drag"
      className="relative liquid-glass-surface rounded-3xl shadow-deep aspect-square flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-accent/15 pointer-events-none" />
      {use2D ? (
        <HeroLogoFallback />
      ) : (
        <SceneErrorBoundary fallback={<HeroLogoFallback />}>
          <div className="absolute inset-0">
            <Canvas
              dpr={[1, 2]}
              frameloop={inView ? "always" : "demand"}
              camera={{ position: [0, 0, 5.2], fov: 42 }}
              gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            >
              <ambientLight intensity={0.45} />
              <directionalLight position={[5, 5, 5]} intensity={1.8} color="#e0f7fa" />
              <directionalLight position={[-4, -3, -2]} intensity={0.9} color="#38bdf8" />
              <Environment resolution={128}>
                <Lightformer intensity={2.2} position={[0, 5, 3]} scale={[10, 4, 1]} color="#a5f3fc" />
                <Lightformer intensity={1.4} position={[-6, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[8, 4, 1]} color="#0284c7" />
                <Lightformer intensity={1.2} position={[6, -2, -2]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 4, 1]} color="#22d3ee" />
              </Environment>
              <InterlockedLinks scrollProgressRef={metricsRef} onReady={() => setSceneReady(true)} />
            </Canvas>
          </div>
          {/* Brand emblem badge preserving the iconic YEMELINK logo cleanly */}
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-2.5 rounded-2xl glass">
            <div className="flex items-center gap-2.5">
              <img src={logoImg} alt="YEMELINK" className="size-8 rounded-lg shadow-elegant" />
              <div className="leading-tight">
                <div className="text-xs font-display font-bold tracking-wider text-foreground">YEMELINK CORE</div>
                <div className="text-[10px] text-primary">Interactive 3D Link · Move cursor</div>
              </div>
            </div>
            <span className="size-2 rounded-full bg-primary animate-pulse-glow" />
          </div>
        </SceneErrorBoundary>
      )}
    </div>
  );
}