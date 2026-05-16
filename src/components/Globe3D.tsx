import { useEffect, useRef } from "react";
import * as THREE from "three";

const EARTH_TEXTURE = "https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg";
const BUMP_TEXTURE = "https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png";
const CLOUDS_TEXTURE = "https://unpkg.com/three-globe@2.31.1/example/img/clouds.png";

export function Globe3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const targetRotYRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    const earthGeo = new THREE.SphereGeometry(1, 96, 96);
    const earthMat = new THREE.MeshPhongMaterial({
      map: loader.load(EARTH_TEXTURE),
      bumpMap: loader.load(BUMP_TEXTURE),
      bumpScale: 0.04,
      specular: new THREE.Color(0x222233),
      shininess: 18,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    const cloudsGeo = new THREE.SphereGeometry(1.012, 96, 96);
    const cloudsMat = new THREE.MeshPhongMaterial({
      map: loader.load(CLOUDS_TEXTURE),
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const clouds = new THREE.Mesh(cloudsGeo, cloudsMat);
    scene.add(clouds);

    // Atmosphere glow shell
    const atmoGeo = new THREE.SphereGeometry(1.08, 96, 96);
    const atmoMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      uniforms: {},
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
          gl_FragColor = vec4(0.35, 0.75, 1.0, 1.0) * intensity;
        }
      `,
    });
    const atmosphere = new THREE.Mesh(atmoGeo, atmoMat);
    scene.add(atmosphere);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(5, 3, 5);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x66aaff, 0.6);
    rim.position.set(-5, -2, -3);
    scene.add(rim);

    // Tilt like Earth
    earth.rotation.z = 0.41;
    clouds.rotation.z = 0.41;

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const animate = () => {
      if (!draggingRef.current) targetRotYRef.current += 0.0018;
      earth.rotation.y += (targetRotYRef.current - earth.rotation.y) * 0.08;
      clouds.rotation.y = earth.rotation.y + 0.0002 * performance.now() * 0.001;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    // Pointer drag
    const canvas = renderer.domElement;
    canvas.style.cursor = "grab";
    const onDown = (e: PointerEvent) => {
      draggingRef.current = true;
      lastXRef.current = e.clientX;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      targetRotYRef.current += dx * 0.005;
    };
    const onUp = (e: PointerEvent) => {
      draggingRef.current = false;
      canvas.style.cursor = "grab";
      try { canvas.releasePointerCapture(e.pointerId); } catch {}
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      renderer.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      cloudsGeo.dispose();
      cloudsMat.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
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

      <div
        ref={mountRef}
        className="absolute inset-0"
        style={{ filter: "drop-shadow(0 0 60px rgba(56, 189, 248, 0.35))" }}
      />
    </div>
  );
}
