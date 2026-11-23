import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logoImg from "@/assets/yemelink-logo.png";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";

const SESSION_KEY = "yemelink_intro_seen";

export function IntroLoader() {
  const { reducedMotion } = useMotionPrefs();
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    try {
      return !sessionStorage.getItem(SESSION_KEY);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!show || reducedMotion) {
      setShow(false);
      return;
    }
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore storage errors
    }
    const timer = window.setTimeout(() => setShow(false), 1250);
    return () => window.clearTimeout(timer);
  }, [show, reducedMotion]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="yemelink-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -24, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          aria-hidden
        >
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute size-40 rounded-full bg-primary/25 blur-3xl animate-pulse-glow" />
            <svg width="160" height="72" viewBox="0 0 160 72" fill="none" className="relative">
              <motion.rect
                x="14"
                y="16"
                width="68"
                height="40"
                rx="20"
                stroke="var(--primary)"
                strokeWidth="3.5"
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 10, opacity: 1 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.rect
                x="78"
                y="16"
                width="68"
                height="40"
                rx="20"
                stroke="var(--primary-glow)"
                strokeWidth="3.5"
                initial={{ x: 24, opacity: 0 }}
                animate={{ x: -10, opacity: 1 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.circle
                cx="80"
                cy="36"
                r="6"
                fill="var(--primary-glow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.4, 1], opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.45 }}
              />
            </svg>
            <motion.img
              src={logoImg}
              alt="YEMELINK"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute size-12 rounded-xl shadow-elegant"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.45 }}
            className="font-display text-sm tracking-[0.35em] uppercase text-primary"
          >
            YEMELINK
          </motion.div>
          <div className="mt-4 w-36 h-0.5 rounded-full bg-secondary overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
              className="h-full origin-left bg-gradient-to-r from-primary to-primary-glow"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}