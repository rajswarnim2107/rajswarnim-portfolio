import { useEffect, useRef, useState } from 'react';
import { useSceneStore } from '@/store/scene-store';

/**
 * Morphing custom cursor: a precise cyan dot riding the real pointer, and
 * a purple ring that lerps after it (~0.16/frame, i.e. a ~6-frame trail).
 * Both are positioned via translate3d written straight to the DOM inside
 * one rAF loop — no React state, no re-renders.
 *
 * Hover morphing is event-delegated: any element carrying
 * [data-cursor-hover] swells the ring (CSS class .cursor-hover).
 * Disabled entirely on coarse pointers and under reduced motion.
 */
export function CustomCursor() {
  const reducedMotion = useSceneStore((s) => s.reducedMotion);
  // Lazy init — client-only app, so matchMedia is safe at first render and
  // we never mount the cursor (or the body class) on touch devices.
  const [coarse] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches
  );
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const enabled = !reducedMotion && !coarse;

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('custom-cursor-active');

    // Pointer target; ring position chases it with exponential smoothing.
    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let rx = px;
    let ry = py;
    let seen = false;

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!seen) {
        // Snap the ring on first contact so it doesn't fly in from center.
        rx = px;
        ry = py;
        seen = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    };

    // Delegated hover morph — works for elements mounted at any time.
    const onOver = (e: Event) => {
      const t = e.target as Element | null;
      if (t?.closest?.('[data-cursor-hover]')) ring.classList.add('cursor-hover');
    };
    const onOut = (e: Event) => {
      const ev = e as PointerEvent;
      const from = (ev.target as Element | null)?.closest?.('[data-cursor-hover]');
      if (!from) return;
      // Only shrink when truly leaving hoverable territory — moving between
      // children of the same target (or straight onto another hover element)
      // keeps the ring swollen, avoiding a one-frame flicker.
      const to = (ev.relatedTarget as Element | null)?.closest?.(
        '[data-cursor-hover]'
      );
      if (!to) ring.classList.remove('cursor-hover');
    };

    let raf = 0;
    const loop = () => {
      // Ring lerps toward the pointer; dot tracks it exactly. Offsets of
      // half each element's size center them on the hotspot.
      rx += (px - rx) * 0.16;
      ry += (py - ry) * 0.16;
      dot.style.transform = `translate3d(${px - 3}px, ${py - 3}px, 0)`;
      // Ring width/height animate via CSS on hover, so offset by half its
      // *current* box. offsetWidth is a layout read, but the element is
      // fixed + pointer-events:none, so it never thrashes page layout.
      const half = ring.offsetWidth / 2;
      ring.style.transform = `translate3d(${rx - half}px, ${ry - half}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, true);
    window.addEventListener('pointerout', onOut, true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver, true);
      window.removeEventListener('pointerout', onOut, true);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} aria-hidden="true" />
    </>
  );
}
