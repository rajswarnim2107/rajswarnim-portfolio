import * as THREE from 'three';
import { SECTION_IDS, type SectionId } from '@/store/scene-store';

/**
 * The scripted camera journey. Each section pins a "station": where the
 * camera sits and what it looks at while that section's DOM panel is on
 * screen. Scroll drives a continuous parameter t in [0, STATIONS.length-1];
 * between stations we sample a Catmull-Rom spline so the flight curves
 * through space instead of tracking straight rails.
 *
 * World layout (one neighborhood per station, spaced along -Z so the
 * journey reads as flying deeper into the machine):
 *   hero     z≈0     — the neural Mind, viewed head-on
 *   about    z≈-30   — skill constellations, viewed from an oblique orbit
 *   projects z≈-60   — gallery corridor (cards laid out along +X)
 *   stats    z≈-95   — inside the data river
 *   journey  z≈-125  — timeline wall
 *   contact  z≈-155  — the calm core (the Mind, reassembled + contracted)
 */
export interface CameraStation {
  id: SectionId;
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
}

export const STATIONS: CameraStation[] = [
  {
    id: 'hero',
    position: new THREE.Vector3(0, 0, 11),
    lookAt: new THREE.Vector3(0, 0, 0),
    fov: 50,
  },
  {
    id: 'about',
    position: new THREE.Vector3(6, 1.5, -21),
    lookAt: new THREE.Vector3(0, 0, -30),
    fov: 50,
  },
  {
    id: 'projects',
    position: new THREE.Vector3(0, 0.5, -51),
    lookAt: new THREE.Vector3(0, 0, -60),
    fov: 55,
  },
  {
    id: 'stats',
    position: new THREE.Vector3(0, 0, -86),
    lookAt: new THREE.Vector3(0, 0, -95),
    fov: 62, // wider lens inside the river for an engulfing feel
  },
  {
    id: 'journey',
    position: new THREE.Vector3(-4, 1, -116),
    lookAt: new THREE.Vector3(0, 0, -125),
    fov: 50,
  },
  {
    id: 'contact',
    position: new THREE.Vector3(0, 0, -146),
    lookAt: new THREE.Vector3(0, 0, -155),
    fov: 48,
  },
];

/** World-space origin of each station's 3D set piece. */
export const STATION_CENTERS: Record<SectionId, THREE.Vector3> = {
  hero: new THREE.Vector3(0, 0, 0),
  about: new THREE.Vector3(0, 0, -30),
  projects: new THREE.Vector3(0, 0, -60),
  stats: new THREE.Vector3(0, 0, -95),
  journey: new THREE.Vector3(0, 0, -125),
  contact: new THREE.Vector3(0, 0, -155),
};

// Spline through station positions; centripetal parameterization avoids
// cusps/self-intersection when stations are unevenly spaced.
const positionSpline = new THREE.CatmullRomCurve3(
  STATIONS.map((s) => s.position),
  false,
  'centripetal',
  0.5
);
const lookAtSpline = new THREE.CatmullRomCurve3(
  STATIONS.map((s) => s.lookAt),
  false,
  'centripetal',
  0.5
);

// Ease applied to the fractional segment progress so the camera lingers at
// stations and accelerates through the space between them (smoothstep).
function settle(f: number): number {
  return f * f * (3 - 2 * f);
}

const MAX_T = STATIONS.length - 1;

/**
 * Sample the journey at path parameter t (0 = hero … 5 = contact).
 * Writes into the provided out-vectors to avoid per-frame allocation.
 */
export function sampleCameraPath(
  t: number,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3
): { fov: number } {
  const clamped = THREE.MathUtils.clamp(t, 0, MAX_T);
  const i = Math.min(Math.floor(clamped), MAX_T - 1);
  const eased = i + settle(clamped - i);

  positionSpline.getPoint(eased / MAX_T, outPos);
  lookAtSpline.getPoint(eased / MAX_T, outLook);

  const fov = THREE.MathUtils.lerp(
    STATIONS[i].fov,
    STATIONS[i + 1].fov,
    settle(clamped - i)
  );
  return { fov };
}

/** Nearest station to a path parameter — used for nav state. */
export function nearestSection(t: number): SectionId {
  const idx = THREE.MathUtils.clamp(Math.round(t), 0, MAX_T);
  return SECTION_IDS[idx];
}
