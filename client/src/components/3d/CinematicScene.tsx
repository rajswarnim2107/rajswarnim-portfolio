import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { NeuralMind } from './NeuralMind';
import { SkillConstellations } from './SkillConstellations';
import { DataRiver } from './DataRiver';
import { CalmCore } from './CalmCore';
import { Starfield } from './Starfield';
import { useSceneStore } from '@/store/scene-store';
import { PALETTE } from '@/lib/palette';

/**
 * The single persistent WebGL world behind the whole page. All set pieces
 * live here at their station coordinates (see camera-path.ts); the camera
 * travels between them as the user scrolls. DOM panels render above this
 * canvas — the canvas itself never captures pointer events.
 */

/** Adapts render resolution to sustained frame rate (cheap perf governor). */
function AdaptiveQuality() {
  const setDpr = useThree((s) => s.setDpr);
  const slowFrames = useRef(0);
  const demoted = useRef(false);

  useFrame((_, delta) => {
    if (demoted.current) return;
    // ~20 consecutive frames slower than 30fps → drop to low quality once.
    slowFrames.current = delta > 1 / 30 ? slowFrames.current + 1 : 0;
    if (slowFrames.current > 20) {
      demoted.current = true;
      setDpr(1);
      useSceneStore.getState().set({ quality: 'low' });
    }
  });
  return null;
}

function Effects() {
  const quality = useSceneStore((s) => s.quality);
  if (quality === 'low') return null;
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.85}
        luminanceThreshold={0.18}
        luminanceSmoothing={0.85}
        mipmapBlur
      />
      <Noise opacity={0.045} blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil={false} offset={0.18} darkness={0.82} />
    </EffectComposer>
  );
}

export function CinematicScene() {
  const quality = useSceneStore((s) => s.quality);

  // Detect low-power devices once on mount (coarse heuristic; the runtime
  // governor in AdaptiveQuality catches anything this misses).
  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 8;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (cores <= 4 || (coarse && window.innerWidth < 820)) {
      useSceneStore.getState().set({ quality: 'low' });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={quality === 'low' ? 1 : [1, 1.75]}
        gl={{
          antialias: false, // bloom + grain hide aliasing; saves fill rate
          powerPreference: 'high-performance',
          alpha: false,
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(new THREE.Color(PALETTE.bg));
          // Exponential fog sells depth along the -Z journey corridor.
          scene.fog = new THREE.FogExp2(PALETTE.bg, 0.016);
        }}
      >
        <CameraRig />
        <AdaptiveQuality />
        <ambientLight intensity={0.25} />
        <Suspense fallback={null}>
          <Starfield />
          <NeuralMind />
          <SkillConstellations />
          <DataRiver />
          <CalmCore />
        </Suspense>
        <Effects />
      </Canvas>
    </div>
  );
}
