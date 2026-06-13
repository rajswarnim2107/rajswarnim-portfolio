import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { damp } from 'maath/easing';
import { useSceneStore } from '@/store/scene-store';
import { STATION_CENTERS } from '@/lib/camera-path';
import { SKILL_CLUSTERS } from '@/data/cinematic-data';

/**
 * "The Architect" set piece: four skill clusters orbiting the about
 * station like constellations. Each cluster is an anchor star with its
 * skills ringed around it, joined by faint lines, labeled by a
 * canvas-texture sprite. Hovering the DOM legend (AboutSection) writes
 * focusedCluster to the store; the matching cluster pulls inward toward
 * the camera and brightens while the others dim — nothing snaps.
 */

const CENTER = STATION_CENTERS.about;
const ORBIT_RADIUS = 3.4;
const FOCUS_RADIUS = 2.2;
const LOCAL_RING = 0.7;

/** Crisp mono label rendered to a 2x canvas → sprite (no network fonts in 3D). */
function makeLabelTexture(text: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.font = '600 64px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(text, 256, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

interface ClusterRuntime {
  group: THREE.Group | null;
  anchorMat: THREE.MeshBasicMaterial;
  nodeMat: THREE.MeshBasicMaterial;
  lineMat: THREE.LineBasicMaterial;
  spriteMat: THREE.SpriteMaterial;
  /** Current orbital radius (damped between ORBIT_RADIUS and FOCUS_RADIUS). */
  radius: { value: number };
  scale: { value: number };
  /** Orbit plane tilt + phase, hashed per cluster so each path is distinct. */
  tilt: number;
  phase: number;
  speed: number;
}

export function SkillConstellations() {
  const rootRef = useRef<THREE.Group>(null);

  // All geometry/materials/textures built once. Each cluster owns its own
  // materials so focus dim/brighten can be per-cluster without cloning.
  const clusters = useMemo<ClusterRuntime[]>(
    () =>
      SKILL_CLUSTERS.map((cluster, i) => {
        const accent = new THREE.Color(cluster.accent);
        return {
          group: null,
          anchorMat: new THREE.MeshBasicMaterial({
            color: accent,
            transparent: true,
            opacity: 0.95,
            toneMapped: false,
          }),
          nodeMat: new THREE.MeshBasicMaterial({
            color: accent.clone().lerp(new THREE.Color('#ffffff'), 0.35),
            transparent: true,
            opacity: 0.8,
            toneMapped: false,
          }),
          lineMat: new THREE.LineBasicMaterial({
            color: accent,
            transparent: true,
            opacity: 0.22,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
          spriteMat: new THREE.SpriteMaterial({
            map: makeLabelTexture(cluster.label),
            transparent: true,
            opacity: 0.65,
            depthWrite: false,
          }),
          radius: { value: ORBIT_RADIUS },
          scale: { value: 1 },
          tilt: (i / SKILL_CLUSTERS.length) * 0.9 - 0.45, // distinct planes
          phase: (i / SKILL_CLUSTERS.length) * Math.PI * 2,
          speed: 0.05 + (i % 2) * 0.012,
        };
      }),
    []
  );

  const anchorGeo = useMemo(() => new THREE.IcosahedronGeometry(0.16, 1), []);
  const nodeGeo = useMemo(() => new THREE.IcosahedronGeometry(0.09, 1), []);

  // Spokes from anchor to each skill node, per cluster (positions are in
  // cluster-local space, so one static geometry per cluster works).
  const spokeGeos = useMemo(
    () =>
      SKILL_CLUSTERS.map((cluster) => {
        const pts: number[] = [];
        cluster.skills.forEach((_, j) => {
          const a = (j / cluster.skills.length) * Math.PI * 2;
          pts.push(0, 0, 0);
          pts.push(Math.cos(a) * LOCAL_RING, Math.sin(a) * 0.25, Math.sin(a) * LOCAL_RING);
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        return geo;
      }),
    []
  );

  useFrame((state, rawDelta) => {
    const root = rootRef.current;
    if (!root) return;
    const { pathParam, focusedCluster, reducedMotion } = useSceneStore.getState();

    // Only run while the about station is anywhere near the camera.
    const visible = pathParam > 0.2 && pathParam < 2.6;
    if (root.visible !== visible) root.visible = visible;
    if (!visible) return;

    const delta = Math.min(rawDelta, 1 / 30);
    const t = state.clock.elapsedTime;

    clusters.forEach((c, i) => {
      const g = c.group;
      if (!g) return;
      const focused = focusedCluster === SKILL_CLUSTERS[i].id;
      const anyFocus = focusedCluster !== null;

      // Damp radius/scale toward focus targets — the "zoom" is just the
      // cluster sliding down its orbit radius toward the station center
      // (which sits between camera and the far clusters at this station).
      damp(c.radius, 'value', focused ? FOCUS_RADIUS : ORBIT_RADIUS, 0.3, delta);
      damp(c.scale, 'value', focused ? 1.5 : 1, 0.3, delta);

      const dimT = anyFocus && !focused ? 0.25 : 1;
      damp(c.anchorMat, 'opacity', 0.95 * dimT, 0.25, delta);
      damp(c.nodeMat, 'opacity', 0.8 * dimT, 0.25, delta);
      damp(c.lineMat, 'opacity', 0.22 * dimT, 0.25, delta);
      damp(c.spriteMat, 'opacity', focused ? 1 : 0.65 * dimT, 0.25, delta);

      // Orbit: angle advances slowly; tilt rotates the orbit plane so the
      // four paths interleave instead of stacking on one ring.
      const angle = c.phase + (reducedMotion ? 0 : t * c.speed);
      const x = Math.cos(angle) * c.radius.value;
      const z = Math.sin(angle) * c.radius.value;
      const y = Math.sin(angle + c.tilt) * c.radius.value * Math.sin(c.tilt);
      g.position.set(CENTER.x + x, CENTER.y + y, CENTER.z + z);
      g.scale.setScalar(c.scale.value);

      // Twinkle: subtle shimmer on the whole cluster (cheaper than per-node).
      if (!reducedMotion) {
        const shimmer = 1 + Math.sin(t * 2.1 + i * 1.7) * 0.04;
        g.scale.multiplyScalar(shimmer);
      }
    });
  });

  return (
    <group ref={rootRef}>
      {SKILL_CLUSTERS.map((cluster, i) => {
        const c = clusters[i];
        return (
          <group key={cluster.id} ref={(g) => (c.group = g)}>
            <mesh geometry={anchorGeo} material={c.anchorMat} />
            <lineSegments geometry={spokeGeos[i]} material={c.lineMat} />
            {cluster.skills.map((skill, j) => {
              const a = (j / cluster.skills.length) * Math.PI * 2;
              return (
                <mesh
                  key={skill.name}
                  geometry={nodeGeo}
                  material={c.nodeMat}
                  position={[
                    Math.cos(a) * LOCAL_RING,
                    Math.sin(a) * 0.25,
                    Math.sin(a) * LOCAL_RING,
                  ]}
                />
              );
            })}
            <sprite material={c.spriteMat} position={[0, 0.55, 0]} scale={[1.6, 0.4, 1]} />
          </group>
        );
      })}
    </group>
  );
}
