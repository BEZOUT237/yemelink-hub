import { useEffect, useRef } from "react";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { useScrollMetrics } from "./SmoothScrollProvider";

const KEYWORDS = ["Web", "Mobile", "Design", "Marketing", "YEMELINK"];

export function VelocityMarquee() {
  const { reducedMotion } = useMotionPrefs();
  const { metricsRef } = useScrollMetrics();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    let offset = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const track = trackRef.current;
      if (track) {
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) {
          const vel = metricsRef.current.velocity;
          const dir = metricsRef.current.direction;
          const speed = 72 + Math.min(260, Math.abs(vel) * 14);
          offset -= dir * speed * dt;
          if (offset <= -halfWidth) offset += halfWidth;
          if (offset > 0) offset -= halfWidth;
          track.style.transform = `translate3d(${offset.toFixed(1)}px, 0, 0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, metricsRef]);

  const items = [...KEYWORDS, ...KEYWORDS, ...KEYWORDS, ...KEYWORDS];

  if (reducedMotion) {
    return (
      <section aria-label="Core expertise" className="py-8 border-y border-border/60 bg-card/20">
        <div className="mx-auto max-w-7xl px-4 flex flex-wrap justify-center gap-x-8 gap-y-2 font-display text-2xl md:text-4xl font-bold tracking-tight text-foreground/80">
          {KEYWORDS.map((w) => (
            <span key={w} className={w === "YEMELINK" ? "text-gradient" : ""}>
              {w}
            </span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Core expertise marquee"
      className="relative py-8 md:py-10 overflow-hidden border-y border-border/60 bg-card/20 select-none"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center shrink-0">
            {items.map((word, idx) => (
              <span
                key={`${dup}-${idx}`}
                className="inline-flex items-center gap-6 md:gap-10 px-4 md:px-6 font-display text-4xl md:text-6xl font-bold tracking-tight"
              >
                <span className={word === "YEMELINK" ? "text-gradient" : "text-foreground/85"}>
                  {word}
                </span>
                <span className="size-2.5 rounded-full bg-primary/70 shadow-[0_0_12px_var(--primary)]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}