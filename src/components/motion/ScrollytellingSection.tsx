import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { Globe, Smartphone, Palette, Megaphone } from "lucide-react";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { SceneErrorBoundary } from "@/components/three/SceneErrorBoundary";
import { ScrollSkewHeading } from "./KineticText";

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    step: "01",
    pole: "Web",
    title: "Web Platforms & SaaS Architecture",
    desc: "Fast, conversion-focused websites and full-stack web apps engineered for reliability, SEO, and effortless scale.",
    detail: "From flagship marketing sites to multi-tenant SaaS dashboards.",
    icon: Globe,
  },
  {
    step: "02",
    pole: "Mobile",
    title: "High-Performance Mobile Apps",
    desc: "Fluid Android and cross-platform experiences designed for touch, speed, and real-world daily retention.",
    detail: "Native polish, offline readiness, and push engagement.",
    icon: Smartphone,
  },
  {
    step: "03",
    pole: "Design",
    title: "Brand Identity & Product UI/UX",
    desc: "Cohesive visual systems, memorable logos, and tactile interfaces that make your startup look category-defining.",
    detail: "Design systems built to ship cleanly into production code.",
    icon: Palette,
  },
  {
    step: "04",
    pole: "Marketing",
    title: "Digital Growth, Content & Copy",
    desc: "Data-backed campaigns, video storytelling, and persuasive copywriting that turn attention into loyal clients.",
    detail: "Connected across YouTube, social channels, and search.",
    icon: Megaphone,
  },
] as const;

function MorphingEmblem({ stageRef }: { stageRef: React.MutableRefObject<number> }) {
  const rootRef = useRef<THREE.Group>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const smoothStage = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const damp = 1 - Math.exp(-5 * dt);
    smoothStage.current += (stageRef.current - smoothStage.current) * damp;
    const s = smoothStage.current;

    if (rootRef.current) {
      rootRef.current.rotation.y = t * 0.35 + s * (Math.PI / 2);
      rootRef.current.rotation.x = Math.sin(s * 1.1) * 0.35;
    }
    if (ringARef.current) {
      ringARef.current.rotation.x = 0.4 + s * 0.65;
      ringARef.current.rotation.z = t * 0.25;
      ringARef.current.scale.setScalar(1 + Math.sin(s * Math.PI * 0.5) * 0.14);
    }
    if (ringBRef.current) {
      ringBRef.current.rotation.y = -t * 0.3 + s * 0.9;
      ringBRef.current.rotation.x = Math.PI / 2 - s * 0.4;
    }
    if (coreRef.current) {
      const pulse = 0.92 + Math.sin(t * 2.2) * 0.06 + (s % 1) * 0.08;
      coreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.3} rotationIntensity={0.15}>
      <group ref={rootRef}>
        <mesh ref={ringARef}>
          <torusGeometry args={[1.32, 0.11, 24, 96]} />
          <meshPhysicalMaterial
            color="#22d3ee"
            emissive="#0891b2"
            emissiveIntensity={0.45}
            metalness={0.35}
            roughness={0.14}
            clearcoat={1}
          />
        </mesh>
        <mesh ref={ringBRef}>
          <torusGeometry args={[0.92, 0.08, 20, 80]} />
          <meshPhysicalMaterial
            color="#0ea5e9"
            emissive="#0369a1"
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.18}
            clearcoat={1}
          />
        </mesh>
        <mesh ref={coreRef}>
          <octahedronGeometry args={[0.48, 1]} />
          <meshPhysicalMaterial
            color="#67e8f9"
            emissive="#22d3ee"
            emissiveIntensity={0.95}
            roughness={0.12}
            metalness={0.2}
            transmission={0.45}
            thickness={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
}

export function ScrollytellingSection() {
  const { reducedMotion, isMobile } = useMotionPrefs();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef(0);
  const [activeStage, setActiveStage] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || isMobile || !sectionRef.current) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top+=88",
        end: "+=1700",
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const continuous = self.progress * (STAGES.length - 1);
          stageRef.current = continuous;
          const idx = Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length));
          setActiveStage((prev) => (prev === idx ? prev : idx));
        },
      });
      return () => trigger.kill();
    });
    return () => mm.revert();
  }, [reducedMotion, isMobile]);

  const current = STAGES[activeStage] ?? STAGES[0];

  return (
    <section ref={sectionRef} className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
      <div className="liquid-glass-surface rounded-3xl p-6 md:p-10 lg:p-12 overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: 3D morphing YEMELINK link emblem */}
          <div className="lg:col-span-5">
            <div className="relative aspect-square max-w-[380px] mx-auto rounded-3xl glass border border-glass-border overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-radial opacity-70 pointer-events-none" />
              {reducedMotion || isMobile ? (
                <div className="relative flex flex-col items-center justify-center p-8 text-center">
                  <div className="size-24 rounded-3xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center shadow-glow mb-4">
                    <current.icon className="size-10 text-primary-foreground" />
                  </div>
                  <span className="font-display text-3xl font-bold text-gradient">{current.step}</span>
                  <span className="text-xs uppercase tracking-widest text-primary mt-1">{current.pole}</span>
                </div>
              ) : (
                <SceneErrorBoundary
                  fallback={
                    <div className="font-display text-4xl font-bold text-gradient">{current.step}</div>
                  }
                >
                  <Canvas
                    dpr={[1, 2]}
                    frameloop={inView ? "always" : "demand"}
                    camera={{ position: [0, 0, 4.4], fov: 42 }}
                    gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
                  >
                    <ambientLight intensity={0.45} />
                    <directionalLight position={[4, 5, 4]} intensity={1.6} color="#e0f7fa" />
                    <Environment resolution={128}>
                      <Lightformer intensity={2} position={[0, 4, 2]} scale={[8, 3, 1]} color="#a5f3fc" />
                    </Environment>
                    <MorphingEmblem stageRef={stageRef} />
                  </Canvas>
                </SceneErrorBoundary>
              )}
              <div className="pointer-events-none absolute top-4 left-4 px-3 py-1 rounded-full glass text-xs font-display font-semibold text-primary">
                {current.step} / 04 · {current.pole}
              </div>
            </div>
          </div>

          {/* Right: 4 connected scrollytelling steps */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass text-xs font-medium mb-4">
              <span className="text-primary">●</span> How YEMELINK Links Everything
            </div>
            <ScrollSkewHeading>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-8">
                One connected <span className="text-gradient">digital ecosystem</span>
              </h2>
            </ScrollSkewHeading>

            <div className="space-y-3">
              {STAGES.map((stage, idx) => {
                const isActive = idx === activeStage;
                const Icon = stage.icon;
                return (
                  <button
                    key={stage.step}
                    type="button"
                    onClick={() => {
                      stageRef.current = idx;
                      setActiveStage(idx);
                    }}
                    className={`w-full text-left rounded-2xl p-4 md:p-5 transition-all duration-300 border ${
                      isActive
                        ? "glass-strong border-primary/50 shadow-elegant"
                        : "glass border-transparent opacity-65 hover:opacity-100 hover:border-glass-border"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`size-10 shrink-0 rounded-xl grid place-items-center transition-colors ${
                          isActive
                            ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-glow"
                            : "bg-secondary text-primary"
                        }`}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-display font-semibold text-primary">{stage.step}</span>
                          <h3 className="font-display font-bold text-base md:text-lg text-foreground">
                            {stage.title}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{stage.desc}</p>
                        {isActive && (
                          <p className="text-xs text-primary mt-2">{stage.detail}</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}