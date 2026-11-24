import { useEffect, useState } from "react";

export interface MotionPrefs {
  reducedMotion: boolean;
  isCoarsePointer: boolean;
  isMobile: boolean;
}

export function useMotionPrefs(): MotionPrefs {
  const [prefs, setPrefs] = useState<MotionPrefs>({
    reducedMotion: false,
    isCoarsePointer: false,
    isMobile: false,
  });

  useEffect(() => {
    const reducedMql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseMql = window.matchMedia("(pointer: coarse)");

    const update = () => {
      setPrefs({
        reducedMotion: reducedMql.matches,
        isCoarsePointer: coarseMql.matches,
        isMobile: window.innerWidth < 768,
      });
    };

    update();
    reducedMql.addEventListener("change", update);
    coarseMql.addEventListener("change", update);
    window.addEventListener("resize", update, { passive: true });

    return () => {
      reducedMql.removeEventListener("change", update);
      coarseMql.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return prefs;
}