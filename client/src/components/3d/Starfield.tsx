import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@/store/scene-store';
import { PALETTE } from '@/lib/palette';

/**
 * Starfield — ambient deep-space dust spanning the entire journey corridor
 * (z 15 → -175), so every camera station floats in the same continuous
 * space. Static buffers + one slow whole-object rotation: the cheapest
 * possible "the world is big" signal. Single draw call, no per-point work.
 */

function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Starfield() {
  const quality = useSceneStore((s) => s.quality); // cold field
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const rand = mulberry32(42);
    const count = quality === 'low' ? 350 : 700;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const white = new THREE.Color(PALETTE.white).multiplyScalar(0.4); // white/40
    const cyan = new THREE.Color(PALETTE.cyan).multiplyScalar(0.55);

    for (let i = 0; i < count; i++) {
      // Box spread covering every station's neighborhood with margin.
      positions[i * 3] = -40 + rand() * 80; // x ∈ [-40, 40]
      positions[i * 3 + 1] = -25 + rand() * 50; // y ∈ [-25, 25]
      positions[i * 3 + 2] = 15 - rand() * 190; // z ∈ [15, -175]

      // ~1 in 6 stars carries a cyan tint; brightness varies so the field
      // reads as depth layers even though all points share one size.
      const c = rand() < 0.16 ? cyan : white;
      const lum = 0.6 + rand() * 0.4;
      colors[i * 3] = c.r * lum;
      colors[i * 3 + 1] = c.g * lum;
      colors[i * 3 + 2] = c.b * lum;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, [quality]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.06,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    []
  );

  useFrame((_, rawDelta) => {
    const points = pointsRef.current;
    if (!points) return;
    if (useSceneStore.getState().reducedMotion) return;
    // Barely-perceptible drift around the corridor axis — the slowest layer
    // of the parallax stack, just enough that space never feels frozen.
    points.rotation.y += Math.min(rawDelta, 1 / 30) * 0.003;
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}
