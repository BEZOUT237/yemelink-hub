import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export function Globe3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    let width = 0;
    const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 22000,
      mapBrightness: 9,
      baseColor: [0.12, 0.22, 0.45],
      markerColor: [0.45, 0.95, 1],
      glowColor: [0.25, 0.75, 1.1],
      markers: [
        { location: [3.848, 11.502], size: 0.14 },
        { location: [41.015, 28.979], size: 0.12 },
        { location: [40.712, -74.006], size: 0.08 },
        { location: [48.856, 2.352], size: 0.08 },
        { location: [51.507, -0.127], size: 0.08 },
        { location: [-23.55, -46.633], size: 0.07 },
        { location: [35.689, 139.692], size: 0.07 },
        { location: [1.352, 103.819], size: 0.07 },
        { location: [-33.868, 151.209], size: 0.07 },
        { location: [25.204, 55.270], size: 0.07 },
        { location: [-1.292, 36.821], size: 0.07 },
        { location: [19.076, 72.877], size: 0.07 },
        { location: [37.774, -122.419], size: 0.07 },
        { location: [55.755, 37.617], size: 0.06 },
        { location: [-26.2, 28.043], size: 0.06 },
        { location: [19.432, -99.133], size: 0.06 },
        { location: [39.904, 116.407], size: 0.07 },
        { location: [13.736, 100.523], size: 0.06 },
      ],
      onRender: (state: Record<string, any>) => {
        if (!pointerInteracting.current) phiRef.current += 0.0035;
        state.phi = phiRef.current + pointerInteractionMovement.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    } as any);

    setTimeout(() => canvasRef.current && (canvasRef.current.style.opacity = "1"), 0);
    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[680px] mx-auto aspect-square">
      {/* Outer atmospheric glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 via-cyan-400/20 to-blue-600/30 blur-[140px] animate-pulse-glow" />
      <div className="absolute inset-[10%] rounded-full bg-cyan-300/10 blur-[80px]" />

      {/* Orbit rings */}
      <div
        className="absolute inset-[2%] rounded-full border border-primary/20"
        style={{ animation: "spin 40s linear infinite" }}
      />
      <div
        className="absolute inset-[6%] rounded-full border border-cyan-400/10"
        style={{ animation: "spin 60s linear infinite reverse" }}
      />

      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          canvasRef.current && (canvasRef.current.style.cursor = "grabbing");
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current && (canvasRef.current.style.cursor = "grab");
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          canvasRef.current && (canvasRef.current.style.cursor = "grab");
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 100;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 100;
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1.2s ease",
          filter: "drop-shadow(0 0 60px rgba(56, 189, 248, 0.35))",
        }}
      />
    </div>
  );
}
