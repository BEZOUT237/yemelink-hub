import { useRef, type ReactNode, type MouseEvent } from "react";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function Magnetic({ children, strength = 0.24, className = "inline-block" }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion, isCoarsePointer } = useMotionPrefs();

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || isCoarsePointer || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    ref.current.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
  };

  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}