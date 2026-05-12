import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export function Globe3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    let phi = 0;
    let width = 0;
    const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 16000,
      mapBrightness: 7,
      baseColor: [0.15, 0.25, 0.4],
      markerColor: [0.4, 0.95, 1],
      glowColor: [0.2, 0.7, 1],
      markers: [
        { location: [3.848, 11.502], size: 0.12 },   // Yaoundé, Cameroon
        { location: [41.015, 28.979], size: 0.12 },  // Istanbul, Turkey
        { location: [40.712, -74.006], size: 0.07 }, // New York
        { location: [48.856, 2.352], size: 0.07 },   // Paris
        { location: [51.507, -0.127], size: 0.07 },  // London
        { location: [-23.55, -46.633], size: 0.06 }, // São Paulo
        { location: [35.689, 139.692], size: 0.06 }, // Tokyo
        { location: [1.352, 103.819], size: 0.06 },  // Singapore
        { location: [-33.868, 151.209], size: 0.06 },// Sydney
        { location: [25.204, 55.270], size: 0.06 },  // Dubai
        { location: [-1.292, 36.821], size: 0.06 },  // Nairobi
        { location: [19.076, 72.877], size: 0.06 },  // Mumbai
        { location: [37.774, -122.419], size: 0.06 },// SF
        { location: [55.755, 37.617], size: 0.05 },  // Moscow
        { location: [-26.2, 28.043], size: 0.05 },   // Johannesburg
      ],
      onRender: (state) => {
        if (!pointerInteracting.current) phi += 0.004;
        state.phi = phi + pointerInteractionMovement.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => canvasRef.current && (canvasRef.current.style.opacity = "1"), 0);
    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[640px] mx-auto aspect-square">
      <div className="absolute inset-0 bg-primary/30 blur-[120px] animate-pulse-glow" />
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
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
