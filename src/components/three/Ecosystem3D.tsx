import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, Line } from "@react-three/drei";
import * as THREE from "three";
import { Globe, Smartphone, Palette, Megaphone } from "lucide-react";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { SceneErrorBoundary } from "./SceneErrorBoundary";

export const ECOSYSTEM_PILLARS = [
  { id: "web", slug: "web-development", label: "Web", subtitle: "Sites & SaaS", pos: [-2.7, 0.35, 0] as [number, number, number], icon: Globe },
  { id: "mobile", slug: "mobile-apps", label: "Mobile", subtitle: "Android Apps", pos: [-0.9, -0.35, 0.3] as [number, number, number], icon: Smartphone },
  { id: "design", slug: "graphic-design", label: "Design", subtitle: "UI/UX & Brand", pos: [0.9, 0.35, -0.2] as [number, number, number], icon: Palette },
  { id: "marketing", slug: "digital-marketing", label: "Marketing", subtitle: "Growth & Media", pos: [2.7, -0.3, 0.1] as [number, number, number], icon: Megaphone },
] as const;

function PillarShape({ id, active }: { id: string; active: boolean }) {
  const color = active ? "#67e8f9" : "#22d3ee";
  const emissive = active ? "#22d3ee" : "#0891b2";
  const emissiveIntensity = active ? 0.95 : 0.35;

  if (id === "web") {
    return (
      <group>
        <mesh>
          <boxGeometry args={[0.85, 0.58, 0.12]} />
          <meshPhysicalMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} metalness={0.35} roughness={0.14} clearcoat={1} />
        </mesh>
        <mesh rotation={[0.45, 0.3, 0]}>
          <torusGeometry args={[0.62, 0.032, 16, 64]} />
          <meshStandardMaterial color="#a5f3fc" emissive="#22d3ee" emissiveIntensity={active ? 1.2 : 0.5} />
        </mesh>
      </group>
    );
  }

  if (id === "mobile") {
    return (
      <group>
        <mesh>
          <boxGeometry args={[0.48, 0.88, 0.1]} />
          <meshPhysicalMaterial color="#0ea5e9" emissive={emissive} emissiveIntensity={emissiveIntensity} metalness={0.6} roughness={0.14} clearcoat={1} />
        </mesh>
        <mesh position={[0, 0, 0.065]}>
          <planeGeometry args={[0.38, 0.72]} />
          <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={active ? 1.15 : 0.45} />
        </mesh>
      </group>
    );
  }

  if (id === "design") {
    return (
      <group>
        <mesh>
          <octahedronGeometry args={[0.52, 0]} />
          <meshPhysicalMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} metalness={0.25} roughness={0.1} transmission={0.45} thickness={0.6} clearcoat={1} />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0.5, 0]}>
          <torusGeometry args={[0.66, 0.025, 14, 64]} />
          <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={active ? 1.1 : 0.45} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.035, 16, 64]} />
        <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={active ? 1.2 : 0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0.6, 0]}>
        <torusGeometry args={[0.36, 0.03, 14, 48]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={active ? 1.1 : 0.45} />
      </mesh>
      <mesh>
        <dodecahedronGeometry args={[0.24, 0]} />
        <meshPhysicalMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} metalness={0.5} roughness={0.15} />
      </mesh>
    </group>
  );
}

function PillarNode({
  pillar,
  index,
  active,
  onHover,
}: {
  pillar: (typeof ECOSYSTEM_PILLARS)[number];
  index: number;
  active: boolean;
  onHover: (idx: number | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.05);
    const damp = 1 - Math.exp(-7 * dt);
    const targetScale = active ? 1.28 : 1;
    const s = groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * damp;
    groupRef.current.scale.setScalar(s);
    groupRef.current.rotation.y += dt * (active ? 1.45 : 0.45);
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.18;
  });

  return (
    <Float speed={1.6 + index * 0.15} floatIntensity={0.35} rotationIntensity={0.1}>
      <group position={pillar.pos}>
        <group
          ref={groupRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
            onHover(index);
          }}
          onPointerOut={() => {
            document.body.style.cursor = "";
            onHover(null);
          }}
        >
          <PillarShape id={pillar.id} active={active} />
        </group>
      </group>
    </Float>
  );
}

function LinkBeams({ activeIndex }: { activeIndex: number | null }) {
  const pulseRefs = useRef<Array<THREE.Mesh | null>>([]);
  const pairs = useMemo(
    () => [
      [ECOSYSTEM_PILLARS[0].pos, ECOSYSTEM_PILLARS[1].pos],
      [ECOSYSTEM_PILLARS[1].pos, ECOSYSTEM_PILLARS[2].pos],
      [ECOSYSTEM_PILLARS[2].pos, ECOSYSTEM_PILLARS[3].pos],
      [ECOSYSTEM_PILLARS[0].pos, ECOSYSTEM_PILLARS[2].pos],
      [ECOSYSTEM_PILLARS[1].pos, ECOSYSTEM_PILLARS[3].pos],
    ] as const,
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    pairs.forEach(([a, b], i) => {
      const mesh = pulseRefs.current[i];
      if (!mesh) return;
      const u = (t * (0.45 + i * 0.06) + i * 0.25) % 1;
      mesh.position.set(
        a[0] + (b[0] - a[0]) * u,
        a[1] + (b[1] - a[1]) * u,
        a[2] + (b[2] - a[2]) * u,
      );
    });
  });

  return (
    <group>
      {pairs.map(([a, b], i) => (
        <group key={i}>
          <Line
            points={[a, b]}
            color={activeIndex !== null ? "#67e8f9" : "#22d3ee"}
            lineWidth={activeIndex !== null ? 2 : 1.2}
            transparent
            opacity={i < 3 ? 0.55 : 0.22}
          />
          <mesh
            ref={(el) => {
              pulseRefs.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color="#a5f3fc" emissive="#22d3ee" emissiveIntensity={1.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Ecosystem2DFallback({
  activeIndex,
  onHover,
}: {
  activeIndex: number | null;
  onHover: (idx: number | null) => void;
}) {
  return (
    <div className="relative flex flex-wrap items-center justify-center gap-3 py-6 px-4">
      {ECOSYSTEM_PILLARS.map((p, idx) => {
        const Icon = p.icon;
        const isActive = activeIndex === idx;
        return (
          <button
            key={p.id}
            type="button"
            onMouseEnter={() => onHover(idx)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onHover(isActive ? null : idx)}
            className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all border ${
              isActive
                ? "bg-primary/20 border-primary text-primary shadow-elegant"
                : "glass border-glass-border text-foreground hover:border-primary/40"
            }`}
          >
            <Icon className="size-4 text-primary" />
            <span className="font-display text-sm font-semibold">{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Ecosystem3D({
  activeIndex,
  onHover,
}: {
  activeIndex: number | null;
  onHover: (idx: number | null) => void;
}) {
  const { reducedMotion, isMobile } = useMotionPrefs();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { rootMargin: "160px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!mounted || reducedMotion || isMobile) {
    return (
      <div className="liquid-glass-surface rounded-3xl mb-10">
        <Ecosystem2DFallback activeIndex={activeIndex} onHover={onHover} />
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative liquid-glass-surface rounded-3xl h-[290px] md:h-[330px] mb-10 overflow-hidden"
    >
      <div className="pointer-events-none absolute top-4 left-5 z-10 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="size-2 rounded-full bg-primary animate-pulse-glow" />
        <span>Interactive YEMELINK Ecosystem · Hover a 3D node</span>
      </div>
      <SceneErrorBoundary fallback={<Ecosystem2DFallback activeIndex={activeIndex} onHover={onHover} />}>
        <Canvas
          dpr={[1, 2]}
          frameloop={inView ? "always" : "demand"}
          camera={{ position: [0, -0.1, 5.9], fov: 40 }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.45} />
          <directionalLight position={[4, 5, 5]} intensity={1.7} color="#e0f7fa" />
          <directionalLight position={[-4, -3, 2]} intensity={0.8} color="#38bdf8" />
          <Environment resolution={128}>
            <Lightformer intensity={2} position={[0, 4, 3]} scale={[12, 3, 1]} color="#a5f3fc" />
            <Lightformer intensity={1.2} position={[-5, 0, 2]} rotation={[0, Math.PI / 2, 0]} scale={[8, 4, 1]} color="#0284c7" />
          </Environment>
          <LinkBeams activeIndex={activeIndex} />
          {ECOSYSTEM_PILLARS.map((pillar, idx) => (
            <PillarNode
              key={pillar.id}
              pillar={pillar}
              index={idx}
              active={activeIndex === idx}
              onHover={onHover}
            />
          ))}
        </Canvas>
      </SceneErrorBoundary>
      <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-center gap-2.5 flex-wrap">
        {ECOSYSTEM_PILLARS.map((p, idx) => {
          const Icon = p.icon;
          const isActive = activeIndex === idx;
          return (
            <button
              key={p.id}
              type="button"
              onMouseEnter={() => onHover(idx)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(idx)}
              onBlur={() => onHover(null)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-display font-semibold transition-all duration-300 border ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-elegant scale-105"
                  : "glass border-glass-border text-foreground/90 hover:border-primary/50"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{p.label}</span>
              <span className={`text-[10px] ${isActive ? "text-primary-foreground/80" : "text-primary/80"}`}>
                · {p.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}