import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { SceneErrorBoundary } from "./SceneErrorBoundary";

function NodeNetworkMesh({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const { pointsGeo, linesGeo, velocities, basePositions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);

    // Deterministic seeded distribution for consistent visuals
    let seed = 4219;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < count; i++) {
      const x = (rand() - 0.5) * 18;
      const y = (rand() - 0.5) * 11;
      const z = (rand() - 0.5) * 6;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;
      vels[i * 3] = (rand() - 0.5) * 0.25;
      vels[i * 3 + 1] = (rand() - 0.5) * 0.25;
      vels[i * 3 + 2] = (rand() - 0.5) * 0.12;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const maxSegments = count * 4;
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(maxSegments * 6), 3));
    lGeo.setDrawRange(0, 0);

    return { pointsGeo: pGeo, linesGeo: lGeo, velocities: vels, basePositions: base };
  }, [count]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      pointsGeo.dispose();
      linesGeo.dispose();
    };
  }, [pointsGeo, linesGeo]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const pAttr = pointsGeo.getAttribute("position") as THREE.BufferAttribute;
    const arr = pAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      arr[idx] = (basePositions[idx] ?? 0) + Math.sin(t * 0.35 + i) * 0.45 + (velocities[idx] ?? 0) * Math.sin(t * 0.2);
      arr[idx + 1] = (basePositions[idx + 1] ?? 0) + Math.cos(t * 0.3 + i * 0.7) * 0.4;
      arr[idx + 2] = (basePositions[idx + 2] ?? 0) + Math.sin(t * 0.25 + i * 1.3) * 0.25;
    }
    pAttr.needsUpdate = true;

    const lAttr = linesGeo.getAttribute("position") as THREE.BufferAttribute;
    const lArr = lAttr.array as Float32Array;
    const maxDistSq = 3.1 * 3.1;
    let seg = 0;
    const maxSegs = count * 4;

    for (let i = 0; i < count && seg < maxSegs; i++) {
      const ix = arr[i * 3] ?? 0;
      const iy = arr[i * 3 + 1] ?? 0;
      const iz = arr[i * 3 + 2] ?? 0;
      for (let j = i + 1; j < count && seg < maxSegs; j++) {
        const dx = ix - (arr[j * 3] ?? 0);
        const dy = iy - (arr[j * 3 + 1] ?? 0);
        const dz = iz - (arr[j * 3 + 2] ?? 0);
        if (dx * dx + dy * dy + dz * dz < maxDistSq) {
          const o = seg * 6;
          lArr[o] = ix;
          lArr[o + 1] = iy;
          lArr[o + 2] = iz;
          lArr[o + 3] = arr[j * 3] ?? 0;
          lArr[o + 4] = arr[j * 3 + 1] ?? 0;
          lArr[o + 5] = arr[j * 3 + 2] ?? 0;
          seg++;
        }
      }
    }
    linesGeo.setDrawRange(0, seg * 2);
    lAttr.needsUpdate = true;

    if (groupRef.current) {
      const damp = 1 - Math.exp(-3.5 * dt);
      groupRef.current.rotation.y += (pointer.current.x * 0.14 - groupRef.current.rotation.y) * damp;
      groupRef.current.rotation.x += (-pointer.current.y * 0.08 - groupRef.current.rotation.x) * damp;
    }
  });

  return (
    <group ref={groupRef}>
      <points geometry={pointsGeo}>
        <pointsMaterial color="#22d3ee" size={0.075} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
      </points>
      <lineSegments geometry={linesGeo}>
        <lineBasicMaterial color="#00bcd4" transparent opacity={0.14} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

export default function NetworkBackground() {
  const { reducedMotion, isMobile } = useMotionPrefs();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (!mounted || reducedMotion || isMobile) return null;

  return (
    <SceneErrorBoundary fallback={null}>
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-75" aria-hidden>
        <Canvas
          dpr={[1, 1.5]}
          frameloop={visible ? "always" : "demand"}
          camera={{ position: [0, 0, 9], fov: 50 }}
          gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        >
          <NodeNetworkMesh count={44} />
        </Canvas>
      </div>
    </SceneErrorBoundary>
  );
}