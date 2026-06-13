import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@/store/scene-store';
import { STATION_CENTERS } from '@/lib/camera-path';
import { PALETTE } from '@/lib/palette';

/**
 * "At Scale" set piece: a luminous river of data particles streaming
 * across the stats station. Particles flow along +X in a flattened band
 * whose centerline arcs gently (sine of x); per-particle speed variance
 * is what makes it read as data traffic rather than fog. A handful of
 * faster elongated "streaks" play the role of packet bursts.
 */

const CENTER = STATION_CENTERS.stats;
const SPAN_X = 16; // river half-length; particles wrap at ±SPAN_X
const BAND_Y = 3.5; // band height
const BAND_Z = 4.5; // band depth
const STREAKS = 12;

// Deterministic PRNG so the river looks identical every load.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Centerline of the river: a gentle arc so the flow reads as a current. */
function bandCurve(x: number, swell: number): number {
  return Math.sin(x * 0.22) * (0.9 + swell * 0.35);
}

export function DataRiver() {
  const rootRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const streaksRef = useRef<THREE.InstancedMesh>(null);
  const quality = useSceneStore((s) => s.quality);
  const count = quality === 'low' ? 1100 : 2400;

  const { positions, colors, speeds, offsets, streakData } = useMemo(() => {
    const rand = mulberry32(20260613);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count * 2); // per-particle y/z offset in band

    const cyan = new THREE.Color(PALETTE.cyan);
    const blue = new THREE.Color(PALETTE.blue);
    const purple = new THREE.Color(PALETTE.purple);
    const magenta = new THREE.Color(PALETTE.magenta);
    const scratch = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const x = (rand() * 2 - 1) * SPAN_X;
      const oy = (rand() * 2 - 1) * (BAND_Y / 2);
      const oz = (rand() * 2 - 1) * (BAND_Z / 2);
      positions[i * 3] = CENTER.x + x;
      positions[i * 3 + 1] = CENTER.y + oy + bandCurve(x, 0);
      positions[i * 3 + 2] = CENTER.z + oz;
      offsets[i * 2] = oy;
      offsets[i * 2 + 1] = oz;
      speeds[i] = 0.8 + rand() * 2.2; // 0.8–3.0 u/s — the variance is the point

      // 70% cyan/blue, 20% purple, 10% magenta sparks (brighter → bloom)
      const r = rand();
      if (r < 0.7) scratch.copy(cyan).lerp(blue, rand());
      else if (r < 0.9) scratch.copy(purple);
      else scratch.copy(magenta).multiplyScalar(1.5);
      colors[i * 3] = scratch.r;
      colors[i * 3 + 1] = scratch.g;
      colors[i * 3 + 2] = scratch.b;
    }

    // Streak lanes: fixed y/z lane per streak, faster than any particle.
    const streakData = Array.from({ length: STREAKS }, () => ({
      x: (rand() * 2 - 1) * SPAN_X,
      oy: (rand() * 2 - 1) * (BAND_Y / 2) * 0.8,
      oz: (rand() * 2 - 1) * (BAND_Z / 2) * 0.8,
      speed: 4 + rand() * 3,
    }));

    return { positions, colors, speeds, offsets, streakData };
  }, [count]);

  const pointsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  const pointsMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.07,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
        toneMapped: false,
      }),
    []
  );

  const streakGeo = useMemo(() => new THREE.BoxGeometry(1.6, 0.015, 0.015), []);
  const streakMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: PALETTE.cyan,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    []
  );

  const scratchObj = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, rawDelta) => {
    const root = rootRef.current;
    if (!root) return;
    const { pathParam, reducedMotion } = useSceneStore.getState();

    const visible = pathParam > 2.2 && pathParam < 4.6;
    if (root.visible !== visible) root.visible = visible;
    if (!visible || reducedMotion) return;

    const delta = Math.min(rawDelta, 1 / 30);
    const t = state.clock.elapsedTime;
    // The whole band breathes slowly — amplitude swell shared by all.
    const swell = Math.sin(t * 0.3);

    const pos = pointsGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      let x = pos[i * 3] - CENTER.x + speeds[i] * delta;
      if (x > SPAN_X) x -= SPAN_X * 2; // seamless wrap
      pos[i * 3] = CENTER.x + x;
      pos[i * 3 + 1] = CENTER.y + offsets[i * 2] + bandCurve(x, swell);
      pos[i * 3 + 2] = CENTER.z + offsets[i * 2 + 1];
    }
    pointsGeo.attributes.position.needsUpdate = true;

    const streaks = streaksRef.current;
    if (streaks) {
      streakData.forEach((s, i) => {
        s.x += s.speed * delta;
        if (s.x > SPAN_X) s.x -= SPAN_X * 2;
        scratchObj.position.set(
          CENTER.x + s.x,
          CENTER.y + s.oy + bandCurve(s.x, swell),
          CENTER.z + s.oz
        );
        // Align the streak with the local flow direction (slope of the arc).
        scratchObj.rotation.z = Math.atan(0.22 * Math.cos(s.x * 0.22));
        scratchObj.updateMatrix();
        streaks.setMatrixAt(i, scratchObj.matrix);
      });
      streaks.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={rootRef}>
      <points ref={pointsRef} geometry={pointsGeo} material={pointsMat} frustumCulled={false} />
      <instancedMesh
        ref={streaksRef}
        args={[streakGeo, streakMat, STREAKS]}
        frustumCulled={false}
      />
    </group>
  );
}
