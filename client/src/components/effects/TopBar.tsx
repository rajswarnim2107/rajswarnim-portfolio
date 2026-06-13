import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useSceneStore } from '@/store/scene-store';
import { scrollToStation } from '@/components/ScrollManager';

/** Everything the ambient hum needs to start/stop without re-creating. */
interface HumRig {
  ctx: AudioContext;
  master: GainNode;
}

/**
 * Lazily builds the ambient hum graph on first user gesture:
 * two barely-detuned sines an octave apart (55Hz + 110.5Hz — the 0.5Hz
 * offset against the true octave produces a slow organic beat), plus a
 * whisper of lowpass-filtered white noise for "air". Master gain stays
 * near-silent (0.02) — it should be felt more than heard.
 */
function createHumRig(): HumRig | null {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    const ctx = new Ctor();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const oscA = ctx.createOscillator();
    oscA.type = 'sine';
    oscA.frequency.value = 55;
    const gainA = ctx.createGain();
    gainA.gain.value = 0.6;
    oscA.connect(gainA).connect(master);

    const oscB = ctx.createOscillator();
    oscB.type = 'sine';
    oscB.frequency.value = 110.5;
    const gainB = ctx.createGain();
    gainB.gain.value = 0.35;
    oscB.connect(gainB).connect(master);

    // 2s looping noise buffer → lowpass at 220Hz: a distant-server hush.
    const len = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 220;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.12;
    noise.connect(lowpass).connect(noiseGain).connect(master);

    oscA.start();
    oscB.start();
    noise.start();

    return { ctx, master };
  } catch {
    return null;
  }
}

/**
 * Minimal fixed chrome: monogram (→ hero), ambient-sound toggle, and a
 * ghost "Let's talk" CTA (→ contact). Fades in only once the preloader
 * hands over (introComplete).
 */
export function TopBar() {
  const introComplete = useSceneStore((s) => s.introComplete);
  const soundOn = useSceneStore((s) => s.soundOn);
  const rigRef = useRef<HumRig | null>(null);

  // Tear the audio graph down with the page chrome.
  useEffect(() => {
    return () => {
      try {
        rigRef.current?.ctx.close();
      } catch {
        /* context may already be closed */
      }
      rigRef.current = null;
    };
  }, []);

  const toggleSound = () => {
    const store = useSceneStore.getState();
    const next = !store.soundOn;
    try {
      if (next) {
        // Create on first enable — must happen inside a user gesture.
        if (!rigRef.current) rigRef.current = createHumRig();
        const rig = rigRef.current;
        if (!rig) return; // WebAudio unavailable; leave soundOn false
        void rig.ctx.resume();
        const now = rig.ctx.currentTime;
        rig.master.gain.cancelScheduledValues(now);
        rig.master.gain.setValueAtTime(rig.master.gain.value, now);
        rig.master.gain.linearRampToValueAtTime(0.02, now + 1);
      } else if (rigRef.current) {
        const rig = rigRef.current;
        const now = rig.ctx.currentTime;
        rig.master.gain.cancelScheduledValues(now);
        rig.master.gain.setValueAtTime(rig.master.gain.value, now);
        rig.master.gain.linearRampToValueAtTime(0, now + 0.5);
        window.setTimeout(() => {
          try {
            void rigRef.current?.ctx.suspend();
          } catch {
            /* ignore */
          }
        }, 550);
      }
      store.set({ soundOn: next });
    } catch {
      /* never let audio failures break the chrome */
    }
  };

  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-[#09090f]/80 to-transparent"
      initial={{ opacity: 0, y: -12 }}
      animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    >
      <div className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <button
          type="button"
          data-cursor-hover
          onClick={() => scrollToStation('hero')}
          aria-label="Back to top — Raj Swarnim"
          className="font-mono-hud group relative rounded text-base tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4facfe]"
        >
          {/* Plain ↔ aurora crossfade (custom classes can't take Tailwind
              variants, so we stack two copies and swap opacity). */}
          <span
            className="text-white/90 transition-opacity duration-300 group-hover:opacity-0"
            aria-hidden="true"
          >
            rs._
          </span>
          <span className="aurora-text absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            rs._
          </span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            data-cursor-hover
            onClick={toggleSound}
            aria-label={soundOn ? 'Mute ambient sound' : 'Enable ambient sound'}
            aria-pressed={soundOn}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors duration-300 hover:border-[#4facfe]/50 hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4facfe]"
          >
            {soundOn ? (
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <VolumeX className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            data-cursor-hover
            onClick={() => scrollToStation('contact')}
            className="font-mono-hud rounded-full border border-white/15 px-4 py-2 text-xs tracking-widest text-white/90 transition-colors duration-300 hover:border-[#4facfe]/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4facfe]"
          >
            Let&apos;s talk
          </button>
        </div>
      </div>
    </motion.header>
  );
}
