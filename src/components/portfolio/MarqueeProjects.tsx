import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, X } from "lucide-react";
import { GlassCard } from "@/components/motion/GlassCard";
import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/button";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";

export type ProjectCategory = "Web" | "Mobile" | "Design" | "Marketing";

export interface PortfolioProject {
  title: string;
  description: string;
  url: string;
  image: string;
  tags: string[];
  category: ProjectCategory;
}

const CATEGORIES: Array<"All" | ProjectCategory> = ["All", "Web", "Mobile", "Design", "Marketing"];

function InfiniteTrack({
  items,
  direction,
  baseSpeed,
  onSelect,
}: {
  items: PortfolioProject[];
  direction: 1 | -1;
  baseSpeed: number;
  onSelect: (project: PortfolioProject) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  const draggingRef = useRef(false);
  const draggedDistRef = useRef(0);
  const lastXRef = useRef(0);
  const boostRef = useRef(0);
  const offsetRef = useRef(0);

  // Ensure enough repeated items inside one half so wide displays stay seamlessly filled
  const unitList = useMemo(() => {
    if (items.length === 0) return [];
    const copies = Math.max(2, Math.ceil(6 / items.length));
    const out: PortfolioProject[] = [];
    for (let c = 0; c < copies; c++) {
      out.push(...items);
    }
    return out;
  }, [items]);

  useEffect(() => {
    offsetRef.current = 0;
  }, [unitList]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let currentSpeed = baseSpeed;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const track = trackRef.current;
      if (track) {
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) {
          const targetSpeed = draggingRef.current ? 0 : hoveredRef.current ? baseSpeed * 0.08 : baseSpeed;
          currentSpeed += (targetSpeed - currentSpeed) * (1 - Math.exp(-6 * dt));
          boostRef.current *= Math.exp(-5.5 * dt);

          if (!draggingRef.current) {
            offsetRef.current -= direction * currentSpeed * dt + boostRef.current * dt;
          }

          while (offsetRef.current <= -halfWidth) offsetRef.current += halfWidth;
          while (offsetRef.current > 0) offsetRef.current -= halfWidth;

          track.style.transform = `translate3d(${offsetRef.current.toFixed(1)}px, 0, 0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [baseSpeed, direction]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    draggedDistRef.current = 0;
    lastXRef.current = e.clientX;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    draggedDistRef.current += Math.abs(dx);
    offsetRef.current += dx;
    boostRef.current = -dx * 12;
  };

  const onPointerUp = () => {
    draggingRef.current = false;
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const impulse = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY * 0.45;
    boostRef.current = Math.max(-700, Math.min(700, boostRef.current + impulse * 2.4));
  };

  return (
    <div
      ref={viewportRef}
      data-cursor="drag"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerUp}
      onWheel={onWheel}
      className="relative overflow-hidden py-3 select-none cursor-grab active:cursor-grabbing"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-28 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-28 z-10 bg-gradient-to-l from-background to-transparent" />

      <div ref={trackRef} className="flex will-change-transform">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 gap-5 md:gap-6 pr-5 md:pr-6">
            {unitList.map((project, idx) => (
              <div
                key={`${dup}-${project.url}-${idx}`}
                onMouseEnter={() => {
                  hoveredRef.current = true;
                }}
                onMouseLeave={() => {
                  hoveredRef.current = false;
                }}
                className="w-[300px] sm:w-[360px] md:w-[410px] shrink-0"
              >
                <GlassCard
                  data-cursor="view"
                  role="button"
                  tabIndex={dup === 0 ? 0 : -1}
                  aria-label={`View ${project.title} details`}
                  onClick={() => {
                    if (draggedDistRef.current > 8) return;
                    onSelect(project);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(project);
                    }
                  }}
                  className="group h-full rounded-3xl overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="aspect-[16/10] relative overflow-hidden bg-card">
                    <img
                      src={project.image}
                      alt={`${project.title} interface`}
                      loading="lazy"
                      draggable={false}
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full glass-strong text-[11px] font-display font-semibold text-primary">
                      {project.category}
                    </span>
                    <div className="absolute top-3.5 right-3.5 size-9 rounded-full glass-strong flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  <div className="p-5 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3.5 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3.5">
                      {project.tags.map((t) => (
                        <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                      <ExternalLink className="size-3" /> Inspect & launch
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MarqueeProjects({ projects }: { projects: PortfolioProject[] }) {
  const { reducedMotion } = useMotionPrefs();
  const [activeCategory, setActiveCategory] = useState<"All" | ProjectCategory>("All");
  const [selected, setSelected] = useState<PortfolioProject | null>(null);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return projects;
    const exact = projects.filter((p) => p.category === activeCategory);
    return exact.length > 0 ? exact : projects;
  }, [projects, activeCategory]);

  const rowB = useMemo(() => {
    if (filtered.length <= 1) return filtered;
    const mid = Math.ceil(filtered.length / 2);
    return [...filtered.slice(mid), ...filtered.slice(0, mid)];
  }, [filtered]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <div>
      {/* Category filters with smooth animated pill */}
      <div className="mx-auto max-w-7xl px-4 mb-10 flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const count = cat === "All" ? projects.length : projects.filter((p) => p.category === cat).length;
          if (cat !== "All" && count === 0) return null;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive ? "text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="portfolio-category-pill"
                  transition={{ type: "spring", stiffness: 360, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary-glow shadow-elegant"
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {cat}
                <span className={`text-[11px] ${isActive ? "text-primary-foreground/80" : "text-primary"}`}>
                  {count}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {reducedMotion ? (
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <GlassCard
              key={project.url}
              tilt={false}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(project)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(project);
                }
              }}
              className="group rounded-3xl overflow-hidden text-left"
            >
              <div className="aspect-[16/10] relative overflow-hidden bg-card">
                <img src={project.image} alt={`${project.title} interface`} className="absolute inset-0 w-full h-full object-cover object-top" />
                <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full glass-strong text-[11px] font-semibold text-primary">
                  {project.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t}</span>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <InfiniteTrack items={filtered} direction={1} baseSpeed={56} onSelect={setSelected} />
            <InfiniteTrack items={rowB} direction={-1} baseSpeed={44} onSelect={setSelected} />
          </motion.div>
        </AnimatePresence>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Hover any project to slow the stream · Drag or scroll to glide · Click to inspect
      </p>

      {/* Smooth liquid-glass detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[80] bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              className="relative w-full max-w-3xl liquid-glass-surface rounded-3xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close project details"
                className="absolute top-4 right-4 z-10 size-10 rounded-full glass-strong flex items-center justify-center text-foreground hover:text-primary hover:border-primary/50 transition-colors"
              >
                <X className="size-5" />
              </button>

              <div className="aspect-[16/9] relative bg-card overflow-hidden">
                <img
                  src={selected.image}
                  alt={`${selected.title} full preview`}
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute bottom-4 left-4 px-3.5 py-1 rounded-full glass-strong text-xs font-display font-semibold text-primary">
                  {selected.category}
                </span>
              </div>

              <div className="p-6 md:p-8">
                <h2 id="project-modal-title" className="font-display text-2xl md:text-3xl font-bold mb-2">
                  {selected.title}
                </h2>
                <p className="text-muted-foreground mb-5 leading-relaxed">{selected.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selected.tags.map((t) => (
                    <span key={t} className="text-xs px-3 py-1 rounded-full bg-primary/15 text-primary font-medium">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Magnetic>
                    <a href={selected.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="hero" size="lg">
                        <ExternalLink className="size-4" /> Visit live site
                      </Button>
                    </a>
                  </Magnetic>
                  <Button variant="glass" size="lg" onClick={() => setSelected(null)}>
                    Back to showcase
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}