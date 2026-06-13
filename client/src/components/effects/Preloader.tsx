import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSceneStore } from '@/store/scene-store';

/** Total assembly timeline length (ms). */
const DURATION = 1900;

/** Mono captions cycled while the neural substrate "boots". */
const PHRASES = [
  'bootstrapping neural substrate…',
  'calibrating camera spline…',
  'hydrating skill constellations…',
  'igniting aurora field…',
];

// Symmetric ease — slow attach, fast mid-assembly, gentle settle. Matches
// the feel of particles being magnetically pulled into the sphere.
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Full-screen boot overlay. Drives a single rAF timeline that writes the
 * percentage + progress line imperatively (zero React re-renders during
 * the count) AND feeds `assembly` into the scene store so the 3D
 * NeuralMind morphs from scattered points to a formed sphere in lockstep
 * with the number. home.tsx unmounts this ~900ms after introComplete, so
 * the exit is a plain animate-state fade (no AnimatePresence needed).
 */
export function Preloader() {
  const reducedMotion = useSceneStore((s) => s.reducedMotion);
  const counterRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const store = useSceneStore.getState();
    if (store.reducedMotion) {
      // Belt-and-braces: home.tsx skips mounting under reduced motion, but
      // if we ever do mount, unlock the experience immediately.
      store.set({ introComplete: true, assembly: 1 });
      return;
    }

    const set = store.set;
    const start = performance.now();
    let raf = 0;
    let lastPhrase = -1;

    const tick = (now: number) => {
      const p = Math.min((now - start) / DURATION, 1);
      const eased = easeInOutCubic(p);
      const pct = Math.round(eased * 100);

      // Imperative DOM writes — the counter never re-renders React.
      if (counterRef.current) {
        counterRef.current.textContent = String(pct).padStart(3, '0');
      }
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${eased})`;
      }
      const phrase = Math.min(Math.floor(p * PHRASES.length), PHRASES.length - 1);
      if (phrase !== lastPhrase && captionRef.current) {
        captionRef.current.textContent = PHRASES[phrase];
        lastPhrase = phrase;
      }

      // The 3D world reads `assembly` per-frame; this is the sync point.
      set({ assembly: eased });

      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        set({ introComplete: true, assembly: 1 });
        setDone(true);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (reducedMotion) return null;

  return (
    <motion.div
      className="preloader-overlay"
      role="status"
      aria-live="polite"
      initial={false}
      animate={
        done
          ? { opacity: 0, scale: 1.06 }
          : { opacity: 1, scale: 1 }
      }
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: done ? 'none' : 'auto' }}
    >
      <span className="sr-only">Loading portfolio</span>

      <div className="font-mono-hud text-5xl text-white/90" aria-hidden="true">
        <span ref={counterRef}>000</span>
        <span className="ml-1 text-2xl text-white/40">%</span>
      </div>

      <div className="preloader-line-track" aria-hidden="true">
        <div
          ref={fillRef}
          className="preloader-line-fill"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      <p
        ref={captionRef}
        className="font-mono-hud text-xs tracking-widest text-white/40"
        aria-hidden="true"
      >
        {PHRASES[0]}
      </p>
    </motion.div>
  );
}
