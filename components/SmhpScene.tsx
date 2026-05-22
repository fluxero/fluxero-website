/**
 * SmhpScene — abstract green energy field, Proxara-style.
 *
 * Three layers that together read as a "live" hero:
 *  1. Drifting glowing particles (energy field)
 *  2. A central glowing torus that slowly rotates
 *  3. A soft point light at the origin
 *
 * Scroll-driven: as the user scrolls, camera pulls back and torus tilts,
 * so the hero "responds" to interaction.
 */
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import * as THREE from 'three';

/* ── Particle field ───────────────────────────────────────────────── */
const COUNT = 1600;

function ParticleField({ scrollOffset }: { scrollOffset: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate positions once
  const positions = useMemo(() => {
    const a = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // Spherical shell distribution with some jitter
      const r     = 3 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      a[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      a[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6; // flatten vertically
      a[i * 3 + 2] = r * Math.cos(phi);
    }
    return a;
  }, []);

  // Per-particle tints — green dominant, some amber & cyan for hydrogen/wind/solar vibe
  const colors = useMemo(() => {
    const a = new Float32Array(COUNT * 3);
    const palette = [
      [0.00, 0.84, 0.56], // green
      [0.00, 0.90, 0.72], // mint
      [0.98, 0.75, 0.14], // amber (solar)
      [0.22, 0.74, 0.97], // cyan (hydro)
    ];
    for (let i = 0; i < COUNT; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      a[i * 3 + 0] = c[0];
      a[i * 3 + 1] = c[1];
      a[i * 3 + 2] = c[2];
    }
    return a;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    // Slow continuous rotation + tilt that grows with scroll
    pointsRef.current.rotation.y = t * 0.05;
    pointsRef.current.rotation.x = Math.sin(t * 0.18) * 0.05 + scrollOffset.current * 0.6;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={COUNT} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} count={COUNT} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Central glowing torus knot ───────────────────────────────────── */
function GlowingTorus({ scrollOffset }: { scrollOffset: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.12 + scrollOffset.current * 0.8;
    meshRef.current.rotation.y = t * 0.18;
    // Subtle scale pulse
    const s = 1 + Math.sin(t * 0.6) * 0.03;
    meshRef.current.scale.set(s, s, s);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.35}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.1, 0.32, 220, 32]} />
        <meshStandardMaterial
          color="#00D68F"
          emissive="#00A86B"
          emissiveIntensity={1.1}
          metalness={0.45}
          roughness={0.35}
          transparent
          opacity={0.92}
        />
      </mesh>
    </Float>
  );
}

/* ── Soft fog ring (cheap glow plate) ─────────────────────────────── */
function GlowRing() {
  return (
    <mesh position={[0, 0, -1.5]} rotation={[0, 0, 0]}>
      <ringGeometry args={[1.6, 5.5, 64]} />
      <meshBasicMaterial
        color="#00D68F"
        transparent
        opacity={0.05}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ── Public component ─────────────────────────────────────────────── */
export const SmhpScene: React.FC = () => {
  // Track scroll progress (0..1 across first viewport) and mirror to a ref
  // so the useFrame callbacks (which don't re-render) can read it.
  const { scrollYProgress } = useScroll();
  const tilt = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const scrollRef = useRef(0);
  useMotionValueEvent(tilt, 'change', (v) => { scrollRef.current = v; });

  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 50 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Ambient + a point light at origin to bloom the torus */}
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 0, 0]} intensity={3.2} color="#00D68F" distance={8} decay={2} />
      <pointLight position={[3, 2, 4]} intensity={0.8} color="#00E5B8" />
      <pointLight position={[-4, -1, 3]} intensity={0.5} color="#0099C2" />

      <GlowRing />
      <ParticleField scrollOffset={scrollRef} />
      <GlowingTorus  scrollOffset={scrollRef} />
    </Canvas>
  );
};
