import { createContext, useContext, useEffect, useRef, type ReactNode, type MutableRefObject } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocation } from "@tanstack/react-router";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollMetrics {
  velocity: number;
  direction: 1 | -1;
  progress: number;
  scrollY: number;
}

interface SmoothScrollContextValue {
  metricsRef: MutableRefObject<ScrollMetrics>;
  lenisRef: MutableRefObject<Lenis | null>;
}

const defaultMetrics: ScrollMetrics = {
  velocity: 0,
  direction: 1,
  progress: 0,
  scrollY: 0,
};

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

export function useScrollMetrics() {
  const ctx = useContext(SmoothScrollContext);
  const fallbackMetrics = useRef<ScrollMetrics>({ ...defaultMetrics });
  const fallbackLenis = useRef<Lenis | null>(null);
  return ctx ?? { metricsRef: fallbackMetrics, lenisRef: fallbackLenis };
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { reducedMotion } = useMotionPrefs();
  const location = useLocation();
  const metricsRef = useRef<ScrollMetrics>({ ...defaultMetrics });
  const lenisRef = useRef<Lenis | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      const onNativeScroll = () => {
        const doc = document.documentElement;
        const max = Math.max(1, doc.scrollHeight - window.innerHeight);
        const p = Math.min(1, Math.max(0, window.scrollY / max));
        metricsRef.current.progress = p;
        metricsRef.current.scrollY = window.scrollY;
        metricsRef.current.velocity = 0;
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      };
      onNativeScroll();
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      return () => window.removeEventListener("scroll", onNativeScroll);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", (e: Lenis) => {
      const vel = typeof e.velocity === "number" ? e.velocity : 0;
      const dir: 1 | -1 = vel < -0.05 ? -1 : vel > 0.05 ? 1 : metricsRef.current.direction;
      const prog = typeof e.progress === "number" && Number.isFinite(e.progress) ? e.progress : 0;
      metricsRef.current.velocity = vel;
      metricsRef.current.direction = dir;
      metricsRef.current.progress = prog;
      metricsRef.current.scrollY = e.scroll ?? window.scrollY;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, prog))})`;
      }
      ScrollTrigger.update();
    });

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  // Reset scroll & refresh ScrollTrigger cleanly on route transitions
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    if (barRef.current) barRef.current.style.transform = "scaleX(0)";
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [location.pathname]);

  return (
    <SmoothScrollContext.Provider value={{ metricsRef, lenisRef }}>
      <div
        aria-hidden
        className="fixed top-0 left-0 right-0 z-[70] h-[2px] pointer-events-none bg-transparent"
      >
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-gradient-to-r from-primary via-primary-glow to-primary shadow-[0_0_12px_var(--primary)]"
          style={{ transform: "scaleX(0)", willChange: "transform" }}
        />
      </div>
      {children}
    </SmoothScrollContext.Provider>
  );
}