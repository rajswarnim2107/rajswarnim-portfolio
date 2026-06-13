import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@/store/scene-store';
import { STATION_CENTERS } from '@/lib/camera-path';
import { PALETTE } from '@/lib/palette';

/**
 * CalmCore — the contact-station finale: the Mind from the hero,
 * "reassembled and contracted into a calm core". Where NeuralMind fires
 * synapses, this just breathes — a compact point-sphere, a soft purple
 * glow heart, and a few slow gyroscope rings. A mind at rest.
 *
 * Perf: 3 ring meshes + 1 glow mesh + 1 Points = 5 tiny draw calls, and
 * the entire frame loop short-circuits (group hidden, zero mutation)
 * whenever the camera is more than ~1.6 stations away.
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

const CONTACT_STATION_T = 5; // contact is the last of 6 stations (t = 0..5)

// Distinct tilts + speeds per ring so they never visually sync — reads as
// slow gyroscopic precession rather than a spinning machine part.
const RINGS = [
  { radius: 1.8, tilt: [Math.PI / 2.4, 0.3, 0] as const, speed: 0.1 },
  { radius: 2.2, tilt: [Math.PI / 3.2, -0.5, 0.4] as const, speed: -0.07 },
  { radius: 2.6, tilt: [Math.PI / 1.9, 0.9, -0.2] as const, speed: 0.05 },
];

export function CalmCore() {
  const quality = useSceneStore((s) => s.quality); // cold field

  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Compact fibonacci sphere — same construction as the hero Mind's shell,
  // shrunk to r≈1.3: the visual rhyme that says "this is the same mind".
  const pointsGeometry = useMemo(() => {
    const rand = mulberry32(7331);
    const count = quality === 'low' ? 45 : 90;
    const positions = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      const radius = 1.3 + (rand() - 0.5) * 0.12;
      positions[i * 3] = Math.cos(theta) * r * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = Math.sin(theta) * r * radius;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [quality]);

  const pointsMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color(PALETTE.purple).lerp(
          new THREE.Color(PALETTE.cyan),
          0.35
        ),
        size: 0.07,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    []
  );

  const glowGeometry = useMemo(() => new THREE.IcosahedronGeometry(0.55, 2), []);
  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: PALETTE.purple,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    []
  );

  // Thin tori; segment counts kept low — at 9 units away through fog the
  // silhouette matters, not the tessellation.
  const ringGeometries = useMemo(
    () => RINGS.map((r) => new THREE.TorusGeometry(r.radius, 0.012, 6, 96)),
    []
  );
  const ringMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: PALETTE.cyan,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    []
  );

  useFrame((state, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;

    const { pathParam, reducedMotion } = useSceneStore.getState();

    // Only worth animating near the contact station; the fog hides the
    // toggle, so we hard-skip every mutation when the camera is far away.
    const near = Math.abs(pathParam - CONTACT_STATION_T) <= 1.6;
    if (group.visible !== near) group.visible = near;
    if (!near || reducedMotion) return;

    const t = state.clock.elapsedTime;
    const delta = Math.min(rawDelta, 1 / 30);

    // Breath: one full inhale/exhale every ~5s, ±6% — resting heart rate.
    const breath = 1 + 0.06 * Math.sin((t * Math.PI * 2) / 5);
    if (glowRef.current) glowRef.current.scale.setScalar(breath);

    // Point shell counter-rotates against the glow's breath axis — the
    // gentle opposition keeps the core feeling alive without any "event".
    const points = pointsRef.current;
    if (points) {
      points.rotation.y -= delta * 0.06;
      points.rotation.x = Math.sin(t * 0.13) * 0.1;
    }

    // Rings precess in-plane at their own speeds (rotation.z spins each
    // torus around its local axis after the static tilt orients the plane).
    for (let i = 0; i < RINGS.length; i++) {
      const ring = ringRefs.current[i];
      if (ring) ring.rotation.z += delta * RINGS[i].speed;
    }
  });

  const c = STATION_CENTERS.contact;
  return (
    <group ref={groupRef} position={[c.x, c.y, c.z]}>
      <points geometry={pointsGeometry} material={pointsMaterial} ref={pointsRef} />
      <mesh geometry={glowGeometry} material={glowMaterial} ref={glowRef} />
      {RINGS.map((ring, i) => (
        <mesh
          key={ring.radius}
          geometry={ringGeometries[i]}
          material={ringMaterial}
          rotation={[ring.tilt[0], ring.tilt[1], ring.tilt[2]]}
          ref={(m) => {
            ringRefs.current[i] = m;
          }}
        />
      ))}
    </group>
  );
}
