import { useRef, type ReactNode, type MouseEvent, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  tilt?: boolean;
  maxTilt?: number;
  highlighted?: boolean;
}

export function GlassCard({
  children,
  className,
  tilt = true,
  maxTilt = 7,
  highlighted = false,
  onMouseMove,
  onMouseLeave,
  ...props
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion, isCoarsePointer } = useMotionPrefs();

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    onMouseMove?.(e);
    if (reducedMotion || isCoarsePointer || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ref.current.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    ref.current.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    ref.current.style.setProperty("--glow-opacity", "1");
    if (tilt) {
      const rotX = (0.5 - py) * maxTilt * 2;
      const rotY = (px - 0.5) * maxTilt * 2;
      ref.current.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(0)`;
    }
  };

  const handleLeave = (e: MouseEvent<HTMLDivElement>) => {
    onMouseLeave?.(e);
    if (!ref.current) return;
    ref.current.style.setProperty("--glow-opacity", "0");
    if (tilt) {
      ref.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        "liquid-glass-surface rounded-2xl transition-[transform,border-color,box-shadow] duration-300 ease-out will-change-transform",
        highlighted
          ? "border-primary/60 shadow-elegant ring-1 ring-primary/35"
          : "hover:border-primary/40 hover:shadow-elegant",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}