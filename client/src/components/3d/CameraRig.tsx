import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { damp, damp3 } from 'maath/easing';
import { sampleCameraPath } from '@/lib/camera-path';
import { useSceneStore } from '@/store/scene-store';

/**
 * Drives the camera along the scripted journey every frame.
 *
 * Reads hot store fields imperatively (getState) so scroll never re-renders
 * React. Three layers of motion compose here:
 *   1. path position/lookAt sampled from the spline at pathParam
 *   2. critically-damped smoothing toward that target (maath damp3) — this
 *      is what makes scrolling feel like mass, not a scrubber
 *   3. pointer parallax: the camera leans up to ~0.6 units toward the
 *      cursor, applied around the path position so it survives travel
 *
 * During the intro (preloader → hero) the camera starts deep behind the
 * Mind and dollies forward through it to the hero station.
 */
const INTRO_START_Z = -6; // inside/behind the network, so we fly THROUGH it
const PARALLAX = { x: 0.6, y: 0.35 };

export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  // Scratch vectors reused every frame — no allocation in the loop.
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const smoothedLook = useRef(new THREE.Vector3(0, 0, 0));
  const introT = useRef(0); // 0..1 dolly-in progress after preloader

  useFrame((_, rawDelta) => {
    // Clamp delta so a backgrounded tab doesn't snap the camera on return.
    const delta = Math.min(rawDelta, 1 / 30);
    const { pathParam, pointer, introComplete, reducedMotion } =
      useSceneStore.getState();

    const { fov } = sampleCameraPath(pathParam, targetPos.current, targetLook.current);

    if (reducedMotion) {
      // Static fallback: park exactly at the station, no parallax, no dolly.
      camera.position.copy(targetPos.current);
      camera.lookAt(targetLook.current);
      camera.fov = fov;
      camera.updateProjectionMatrix();
      return;
    }

    // Intro dolly: ease introT 0→1 once the preloader hands off, and pull
    // the camera from deep inside the network out to the hero station.
    if (introComplete && introT.current < 1) {
      introT.current = Math.min(introT.current + delta * 0.55, 1);
    }
    if (introT.current < 1) {
      const e = 1 - Math.pow(1 - introT.current, 3); // easeOutCubic
      targetPos.current.z = THREE.MathUtils.lerp(
        INTRO_START_Z,
        targetPos.current.z,
        e
      );
    }

    // Pointer parallax — lean toward the cursor in camera-local X/Y.
    targetPos.current.x += pointer.x * PARALLAX.x;
    targetPos.current.y += pointer.y * PARALLAX.y;

    // Critically-damped spring toward the target (smoothTime in seconds).
    damp3(camera.position, targetPos.current, 0.38, delta);
    damp3(smoothedLook.current, targetLook.current, 0.32, delta);
    camera.lookAt(smoothedLook.current);

    if (Math.abs(camera.fov - fov) > 0.01) {
      damp(camera, 'fov', fov, 0.4, delta);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
