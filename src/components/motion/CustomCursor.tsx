import { useEffect, useRef, useState } from "react";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";

type CursorMode = "default" | "pointer" | "view" | "drag";

export function CustomCursor() {
  const { reducedMotion, isCoarsePointer } = useMotionPrefs();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion || isCoarsePointer) return;

    const pos = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let raf = 0;
    let activeMode: CursorMode = "default";

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      setVisible(true);

      const target = e.target as HTMLElement | null;
      const cursorEl = target?.closest<HTMLElement>("[data-cursor]");
      const custom = cursorEl?.dataset.cursor;
      let next: CursorMode = "default";
      if (custom === "view") next = "view";
      else if (custom === "drag") next = "drag";
      else if (target?.closest("a, button, [role='button'], input, textarea, select")) {
        next = "pointer";
      }
      if (next !== activeMode) {
        activeMode = next;
        setMode(next);
      }
    };

    const onLeave = () => setVisible(false);

    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.16;
      ring.y += (pos.y - ring.y) * 0.16;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [reducedMotion, isCoarsePointer]);

  if (reducedMotion || isCoarsePointer) return null;

  const label = mode === "view" ? "View" : mode === "drag" ? "Drag" : "";
  const ringClass =
    mode === "view" || mode === "drag"
      ? "w-16 h-16 bg-primary/20 border-primary/80 backdrop-blur-md"
      : mode === "pointer"
        ? "w-11 h-11 bg-primary/12 border-primary/70"
        : "w-8 h-8 bg-transparent border-primary/45";

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[90] pointer-events-none transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border flex items-center justify-center transition-[width,height,background-color,border-color] duration-200 will-change-transform ${ringClass}`}
      >
        {label && (
          <span className="text-[10px] font-display font-semibold uppercase tracking-wider text-foreground">
            {label}
          </span>
        )}
      </div>
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 rounded-full bg-primary shadow-[0_0_10px_var(--primary)] transition-transform duration-150 will-change-transform ${
          mode === "view" || mode === "drag" ? "w-1 h-1 opacity-0" : "w-1.5 h-1.5 opacity-100"
        }`}
      />
    </div>
  );
}