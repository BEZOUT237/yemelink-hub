import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { useScrollMetrics } from "./SmoothScrollProvider";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/•";

interface SplitRevealProps {
  text: string;
  mode?: "words" | "chars";
  immediate?: boolean;
  delay?: number;
  className?: string;
  itemClassName?: string;
}

export function SplitReveal({
  text,
  mode = "words",
  immediate = false,
  delay = 0,
  className = "",
  itemClassName = "",
}: SplitRevealProps) {
  const { reducedMotion } = useMotionPrefs();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const active = reducedMotion || immediate || inView;
  const parts = mode === "chars" ? Array.from(text) : text.split(" ");

  if (reducedMotion) {
    return <span className={`${className} ${itemClassName}`}>{text}</span>;
  }

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${mode === "words" ? "gap-x-[0.26em]" : ""} ${className}`}>
      {parts.map((part, idx) => (
        <span key={`${part}-${idx}`} className="inline-block overflow-hidden align-bottom py-[0.04em]">
          <motion.span
            className={`inline-block ${itemClassName}`}
            initial={{ y: "110%", opacity: 0 }}
            animate={active ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
            transition={{
              duration: 0.65,
              delay: delay + idx * (mode === "chars" ? 0.035 : 0.07),
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {part === " " ? "\u00A0" : part}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function ScrollSkewHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPrefs();
  const { metricsRef } = useScrollMetrics();

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    let currentSkew = 0;

    const tick = () => {
      const vel = metricsRef.current.velocity;
      const target = Math.max(-4.5, Math.min(4.5, vel * 0.14));
      currentSkew += (target - currentSkew) * 0.12;
      if (ref.current) {
        ref.current.style.transform =
          Math.abs(currentSkew) < 0.02 ? "none" : `skewY(${currentSkew.toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, metricsRef]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

export function ScrambleText({ text, className = "" }: { text: string; className?: string }) {
  const { reducedMotion } = useMotionPrefs();
  const [display, setDisplay] = useState(text);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setDisplay(text);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [text]);

  const startScramble = () => {
    if (reducedMotion) return;
    if (timerRef.current) window.clearInterval(timerRef.current);
    let step = 0;
    timerRef.current = window.setInterval(() => {
      step += 0.55;
      const next = text
        .split("")
        .map((ch, idx) => {
          if (ch === " ") return " ";
          if (idx < step) return ch;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? ch;
        })
        .join("");
      setDisplay(next);
      if (step >= text.length) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        setDisplay(text);
      }
    }, 28);
  };

  return (
    <span onMouseEnter={startScramble} className={className} aria-label={text}>
      <span aria-hidden>{display}</span>
    </span>
  );
}

export function AnimatedCounter({ value, className = "" }: { value: string | number; className?: string }) {
  const { reducedMotion } = useMotionPrefs();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const raw = String(value);
  const match = raw.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1] ?? "0", 10) : 0;
  const suffix = match ? (match[2] ?? "") : "";
  const [shown, setShown] = useState(reducedMotion ? raw : `0${suffix}`);

  useEffect(() => {
    if (!match) {
      setShown(raw);
      return;
    }
    if (reducedMotion) {
      setShown(raw);
      return;
    }
    if (!inView) return;

    const duration = 1100;
    const start = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(eased * target);
      setShown(`${current}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reducedMotion, raw, target, suffix, match]);

  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  );
}

export function ScrollReveal({
  children,
  delay = 0,
  clip = false,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  clip?: boolean;
  className?: string;
}) {
  const { reducedMotion } = useMotionPrefs();
  if (reducedMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={
        clip
          ? { opacity: 0, y: 28, clipPath: "inset(14% 0% 0% 0% round 24px)" }
          : { opacity: 0, y: 24 }
      }
      whileInView={
        clip
          ? { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 24px)" }
          : { opacity: 1, y: 0 }
      }
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}