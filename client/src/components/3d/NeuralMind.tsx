import { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { damp } from 'maath/easing';
import { useSceneStore } from '@/store/scene-store';
import { PALETTE } from '@/lib/palette';

/**
 * NeuralMind — the hero centerpiece at STATION_CENTERS.hero (the origin).
 *
 * A "living mind": a fibonacci-sphere shell of glowing nodes plus a sparse
 * inner core, wired by additive edges, with bright signal packets racing
 * along random synapses. During the preloader the whole network assembles
 * from a scattered debris cloud (driven by the hot `assembly` store field).
 *
 * Draw calls: exactly 3 — one InstancedMesh (nodes), one LineSegments
 * (edges), one Points (packets). Zero allocation in the frame loop.
 */

// ----------------------------------------------------------------------------
// Deterministic PRNG (mulberry32) so the network layout is identical on
// every load — important because the preloader scatter→assemble must look
// authored, not random-each-refresh.
// ----------------------------------------------------------------------------
function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** smoothstep — turns the linear preloader progress into an eased settle. */
function smoothstep(x: number): number {
  const t = THREE.MathUtils.clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
}

interface MindData {
  count: number;
  /** Final (assembled) node positions, xyz-packed. */
  finalPos: Float32Array;
  /** Scattered (assembly=0) node positions, radius 7–10 debris cloud. */
  scatterPos: Float32Array;
  /** Per-node pulse phase + speed + base scale (visual variety). */
  phase: Float32Array;
  pulseSpeed: Float32Array;
  baseScale: Float32Array;
  /** Edge node-index pairs (a,b interleaved). */
  edges: Uint16Array;
  edgeCount: number;
  /** adjacency[node] = neighbor node ids — packets hop along this graph. */
  adjacency: number[][];
  /** Packet state: graph edge currently being traveled + progress. */
  pktFrom: Uint16Array;
  pktTo: Uint16Array;
  pktT: Float32Array;
  pktSpeed: Float32Array;
  packetCount: number;
}

function buildMind(quality: 'high' | 'low'): MindData {
  const rand = mulberry32(1337);
  const shellCount = quality === 'low' ? 55 : 110;
  const coreCount = quality === 'low' ? 12 : 24;
  const count = shellCount + coreCount;

  const finalPos = new Float32Array(count * 3);
  const scatterPos = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const pulseSpeed = new Float32Array(count);
  const baseScale = new Float32Array(count);

  // Shell: fibonacci sphere gives near-uniform spacing (golden-angle spiral),
  // jittered radially so it reads organic instead of mathematically perfect.
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < shellCount; i++) {
    const y = 1 - (i / (shellCount - 1)) * 2; // -1..1 latitude
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const radius = 3.2 + (rand() - 0.5) * 0.55;
    finalPos[i * 3] = Math.cos(theta) * r * radius;
    finalPos[i * 3 + 1] = y * radius;
    finalPos[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  // Inner core: random directions at ~half radius — gives the brain depth
  // so edges cross through the volume, not just along the surface.
  for (let i = shellCount; i < count; i++) {
    const z = rand() * 2 - 1;
    const t = rand() * Math.PI * 2;
    const r = Math.sqrt(Math.max(0, 1 - z * z));
    const radius = 1.6 + (rand() - 0.5) * 0.5;
    finalPos[i * 3] = Math.cos(t) * r * radius;
    finalPos[i * 3 + 1] = z * radius;
    finalPos[i * 3 + 2] = Math.sin(t) * r * radius;
  }

  for (let i = 0; i < count; i++) {
    // Scatter cloud: random shell at radius 7–10 — far enough outside the
    // final form that assembly reads as a convergence, near enough that
    // every particle stays in the hero camera's view (camera at z=11).
    const z = rand() * 2 - 1;
    const t = rand() * Math.PI * 2;
    const r = Math.sqrt(Math.max(0, 1 - z * z));
    const radius = 7 + rand() * 3;
    scatterPos[i * 3] = Math.cos(t) * r * radius;
    scatterPos[i * 3 + 1] = z * radius;
    scatterPos[i * 3 + 2] = Math.sin(t) * r * radius;

    phase[i] = rand() * Math.PI * 2;
    pulseSpeed[i] = 1.4 + rand() * 1.6;
    baseScale[i] = (i < shellCount ? 0.85 : 0.65) + rand() * 0.45;
  }

  // Edges: every pair closer than 1.9 in the assembled form is a candidate
  // synapse. Deterministically shuffle then cap, so the kept edges are
  // spread over the whole network instead of clustering at low indices.
  const edgeCap = quality === 'low' ? 90 : 180;
  const candidates: number[] = [];
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const dx = finalPos[i * 3] - finalPos[j * 3];
      const dy = finalPos[i * 3 + 1] - finalPos[j * 3 + 1];
      const dz = finalPos[i * 3 + 2] - finalPos[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < 1.9 * 1.9) candidates.push(i, j);
    }
  }
  const pairCount = candidates.length / 2;
  const order: number[] = Array.from({ length: pairCount }, (_, k) => k);
  for (let k = order.length - 1; k > 0; k--) {
    const j = Math.floor(rand() * (k + 1));
    const tmp = order[k];
    order[k] = order[j];
    order[j] = tmp;
  }
  const edgeCount = Math.min(edgeCap, pairCount);
  const edges = new Uint16Array(edgeCount * 2);
  const adjacency: number[][] = Array.from({ length: count }, () => []);
  for (let e = 0; e < edgeCount; e++) {
    const a = candidates[order[e] * 2];
    const b = candidates[order[e] * 2 + 1];
    edges[e * 2] = a;
    edges[e * 2 + 1] = b;
    adjacency[a].push(b);
    adjacency[b].push(a);
  }

  // Packets start mid-flight on random edges so the network feels alive
  // the instant it fades in.
  const packetCount = quality === 'low' ? 14 : 28;
  const pktFrom = new Uint16Array(packetCount);
  const pktTo = new Uint16Array(packetCount);
  const pktT = new Float32Array(packetCount);
  const pktSpeed = new Float32Array(packetCount);
  for (let p = 0; p < packetCount; p++) {
    const e = Math.floor(rand() * edgeCount);
    pktFrom[p] = edges[e * 2];
    pktTo[p] = edges[e * 2 + 1];
    pktT[p] = rand();
    pktSpeed[p] = 0.5 + rand() * 0.7; // edges traversed per second
  }

  return {
    count,
    finalPos,
    scatterPos,
    phase,
    pulseSpeed,
    baseScale,
    edges,
    edgeCount,
    adjacency,
    pktFrom,
    pktTo,
    pktT,
    pktSpeed,
    packetCount,
  };
}

const NODE_COLORS = [PALETTE.purple, PALETTE.blue, PALETTE.cyan];

export function NeuralMind() {
  // Cold field — re-renders only when the perf governor demotes once.
  const quality = useSceneStore((s) => s.quality);
  const data = useMemo(() => buildMind(quality), [quality]);

  const outerRef = useRef<THREE.Group>(null); // pointer lean + bob
  const innerRef = useRef<THREE.Group>(null); // slow auto-rotation
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Scratch objects reused every frame — never allocated in the loop.
  const dummy = useMemo(() => new THREE.Object3D(), []);
  // Live node positions (lerped scatter→final); packets + edges read this.
  const curPos = useMemo(() => new Float32Array(data.count * 3), [data]);
  const lastAssembly = useRef(-1);
  const autoAngle = useRef(0);

  const nodeGeometry = useMemo(() => new THREE.IcosahedronGeometry(0.07, 0), []);
  const nodeMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ toneMapped: false }),
    []
  );

  const lineGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const attr = new THREE.BufferAttribute(
      new Float32Array(data.edgeCount * 2 * 3),
      3
    );
    attr.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('position', attr);
    return g;
  }, [data]);
  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        // Halfway between palette blue and cyan — the "circuitry" tone.
        color: new THREE.Color(PALETTE.blue).lerp(new THREE.Color(PALETTE.cyan), 0.5),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  const packetGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const attr = new THREE.BufferAttribute(new Float32Array(data.packetCount * 3), 3);
    attr.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('position', attr);
    return g;
  }, [data]);
  const packetMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: '#dffaff', // white-cyan: hot enough to trip the bloom pass
        size: 0.09,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    []
  );

  // Per-instance colors (purple/blue/cyan mix) — set once after mount.
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const rand = mulberry32(9001);
    const c = new THREE.Color();
    for (let i = 0; i < data.count; i++) {
      c.set(NODE_COLORS[Math.floor(rand() * NODE_COLORS.length)]);
      // Slight brightness variance so the cloud shimmers under bloom.
      c.multiplyScalar(0.75 + rand() * 0.5);
      mesh.setColorAt(i, c);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    nodeMaterial.needsUpdate = true;
    lastAssembly.current = -1; // force first position/edge write
  }, [data, nodeMaterial]);

  useFrame((state, rawDelta) => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    const mesh = meshRef.current;
    if (!outer || !inner || !mesh) return;

    const { pathParam, assembly, pointer, introComplete, reducedMotion } =
      useSceneStore.getState();

    // Past the about station the fog has fully swallowed the Mind — stop
    // rendering it entirely (no pop: density 0.016 at >40 units ≈ black).
    if (pathParam > 2.5) {
      if (outer.visible) outer.visible = false;
      return;
    }
    if (!outer.visible) outer.visible = true;

    const delta = Math.min(rawDelta, 1 / 30);

    // Cheap idle spin always runs while visible (kept when far from station).
    if (!reducedMotion) {
      autoAngle.current += delta * 0.04;
      inner.rotation.y = autoAngle.current;
    }
    // Beyond ~1.8 the Mind is a distant glow — skip all per-instance work.
    if (pathParam > 1.8) return;

    const t = state.clock.elapsedTime;
    const a = smoothstep(assembly);
    const aChanged = a !== lastAssembly.current;

    // --- Node positions: lerp scatter→final by eased assembly -------------
    if (aChanged) {
      const { scatterPos, finalPos, count } = data;
      for (let i = 0; i < count * 3; i++) {
        curPos[i] = scatterPos[i] + (finalPos[i] - scatterPos[i]) * a;
      }
    }

    // --- Instance matrices: position + phase-offset sine pulse ------------
    // (skipped under reduced motion unless positions actually moved)
    if (!reducedMotion || aChanged) {
      const pulseAmp = reducedMotion ? 0 : 0.22;
      for (let i = 0; i < data.count; i++) {
        dummy.position.set(curPos[i * 3], curPos[i * 3 + 1], curPos[i * 3 + 2]);
        const s =
          data.baseScale[i] *
          (1 + pulseAmp * Math.sin(t * data.pulseSpeed[i] + data.phase[i]));
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    // --- Edges follow their endpoint nodes (only while assembling) --------
    if (aChanged) {
      const ePos = lineGeometry.attributes.position as THREE.BufferAttribute;
      const arr = ePos.array as Float32Array;
      for (let e = 0; e < data.edgeCount; e++) {
        const ia = data.edges[e * 2] * 3;
        const ib = data.edges[e * 2 + 1] * 3;
        const o = e * 6;
        arr[o] = curPos[ia];
        arr[o + 1] = curPos[ia + 1];
        arr[o + 2] = curPos[ia + 2];
        arr[o + 3] = curPos[ib];
        arr[o + 4] = curPos[ib + 1];
        arr[o + 5] = curPos[ib + 2];
      }
      ePos.needsUpdate = true;
      lastAssembly.current = a;
    }
    // Network "connects" as it forms: a² keeps wires dark until late.
    lineMaterial.opacity = 0.18 * a * a;
    packetMaterial.opacity = a * a;

    // --- Signal packets: hop node→node along the synapse graph ------------
    if (a > 0.03) {
      const pPos = packetGeometry.attributes.position as THREE.BufferAttribute;
      const pArr = pPos.array as Float32Array;
      const speedScale = reducedMotion ? 0 : 1;
      for (let p = 0; p < data.packetCount; p++) {
        data.pktT[p] += data.pktSpeed[p] * speedScale * delta;
        if (data.pktT[p] >= 1) {
          // Arrived: continue from this node along a random adjacent edge.
          const node = data.pktTo[p];
          const neighbors = data.adjacency[node];
          if (neighbors.length > 0) {
            data.pktFrom[p] = node;
            data.pktTo[p] = neighbors[Math.floor(Math.random() * neighbors.length)];
          } else {
            // Isolated node (rare): respawn on a random edge.
            const e = Math.floor(Math.random() * data.edgeCount);
            data.pktFrom[p] = data.edges[e * 2];
            data.pktTo[p] = data.edges[e * 2 + 1];
          }
          data.pktT[p] -= 1;
        }
        const fi = data.pktFrom[p] * 3;
        const ti = data.pktTo[p] * 3;
        const k = data.pktT[p];
        pArr[p * 3] = curPos[fi] + (curPos[ti] - curPos[fi]) * k;
        pArr[p * 3 + 1] = curPos[fi + 1] + (curPos[ti + 1] - curPos[fi + 1]) * k;
        pArr[p * 3 + 2] = curPos[fi + 2] + (curPos[ti + 2] - curPos[fi + 2]) * k;
      }
      pPos.needsUpdate = true;
    }

    // --- Whole-group motion: pointer lean + post-intro bob ----------------
    if (!reducedMotion) {
      // Critically damped lean toward the cursor — the Mind "notices" you.
      damp(outer.rotation, 'y', pointer.x * 0.12, 0.6, delta);
      damp(outer.rotation, 'x', -pointer.y * 0.12, 0.6, delta);
      outer.position.y = introComplete ? Math.sin(t * 0.4) * 0.08 : 0;
    }
  });

  return (
    <group ref={outerRef} position={[0, 0, 0]}>
      <group ref={innerRef}>
        <instancedMesh
          ref={meshRef}
          args={[nodeGeometry, nodeMaterial, data.count]}
          frustumCulled={false}
        />
        <lineSegments
          geometry={lineGeometry}
          material={lineMaterial}
          frustumCulled={false}
        />
        <points
          geometry={packetGeometry}
          material={packetMaterial}
          frustumCulled={false}
        />
      </group>
    </group>
  );
}
