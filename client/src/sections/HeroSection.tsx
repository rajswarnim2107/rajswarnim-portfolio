import { useEffect, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  type Variants,
} from 'framer-motion';
import { HERO } from '@/data/cinematic-data';
import { useSceneStore } from '@/store/scene-store';
import { scrollToStation } from '@/components/ScrollManager';
import { MagneticButton } from '@/components/effects/MagneticButton';
import { AnimatedNumber } from '@/components/effects/AnimatedNumber';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Entrance choreography — a single staggered sequence gated on the
   preloader finishing (introComplete). Children rise in order:
   greeting → name → title → tagline → CTAs → mobile chips. */
const sequence: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

/* The hero shot: the name resolves out of a blur as it settles into place. */
const nameReveal: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.25, ease: EASE },
  },
};

/* HUD chips arrive after the name has landed, one by one. */
const chipReveal: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 1.05 + i * 0.15, duration: 0.8, ease: EASE },
  }),
};

/* Desktop scatter for the floating stat chips — staggered offsets across
   the right half of the viewport so they read as instruments orbiting
   the neural Mind behind the type. */
const CHIP_POSITIONS: Array<{ top: string; right: string }> = [
  { top: '20%', right: '6%' },
  { top: '38%', right: '17%' },
  { top: '57%', right: '5%' },
  { top: '73%', right: '15%' },
];

export function HeroSection() {
  // Cold field — flips exactly once when the preloader hands off.
  const introComplete = useSceneStore((s) => s.introComplete);

  // ---- Pointer parallax on the name block ------------------------------
  // Springs lag the raw pointer so the headline drifts with cinematic
  // weight (±10px) instead of tracking the cursor 1:1.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const springX = useSpring(px, { stiffness: 50, damping: 18, mass: 0.6 });
  const springY = useSpring(py, { stiffness: 50, damping: 18, mass: 0.6 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (useSceneStore.getState().reducedMotion) return;
      // Normalize pointer to [-1, 1] around viewport center, then scale to
      // a ±10px lean toward the cursor.
      px.set(((e.clientX / window.innerWidth) * 2 - 1) * 10);
      py.set(((e.clientY / window.innerHeight) * 2 - 1) * 10);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [px, py]);

  // ---- Scroll cue fade-out ---------------------------------------------
  // Tiny rAF poll of the HOT scrollProgress field (imperative read — never
  // a hook subscription). Sets state once, then the loop kills itself.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      if (useSceneStore.getState().scrollProgress > 0.02) {
        setScrolled(true);
        return; // cue is gone for good; stop polling
      }
      raf = requestAnimationFrame(check);
    };
    raf = requestAnimationFrame(check);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="hero" className="station-section">
      {/* Localized legibility scrim — sits behind the copy (z-index:-1, above
          the canvas) and stays transparent to clicks/scroll. Left-anchored +
          right-feathered so the network stays fully vivid on the right and
          between glyphs. Inline pointerEvents:none is required because
          `.station-section > *` re-enables pointer events on direct children. */}
      <div className="hero-scrim" style={{ pointerEvents: 'none' }} aria-hidden="true" />

      {/* ---- Main copy block ---- */}
      <motion.div
        className="mx-auto w-full max-w-6xl px-6"
        variants={sequence}
        initial="hidden"
        animate={introComplete ? 'visible' : 'hidden'}
      >
        <motion.p
          variants={rise}
          className="font-mono-hud hero-copy-shadow text-sm text-white/60"
        >
          {HERO.greeting}
        </motion.p>

        {/* Parallax wrapper carries the pointer springs; the inner h1 owns
            the entrance variant so the two transforms never fight. The dark
            halo/glow lives here (hero-name-wrap) — NOT on the h1, whose
            `filter` Framer animates on entrance (blur 12px → 0). */}
        <motion.div className="hero-name-wrap" style={{ x: springX, y: springY }}>
          {/* data-text feeds the ::before opaque glyph floor so the bright
              network can't shine through the transparent gradient fill. */}
          <motion.h1
            variants={nameReveal}
            data-text={HERO.name}
            className="font-display aurora-text mt-4 text-6xl font-bold leading-none tracking-tight md:text-8xl lg:text-[7rem]"
          >
            {HERO.name}
          </motion.h1>
        </motion.div>

        <motion.p
          variants={rise}
          className="mt-6 hero-copy-shadow text-lg font-medium text-white/85 md:text-xl"
        >
          {HERO.title}
        </motion.p>

        <motion.p
          variants={rise}
          className="font-display hero-copy-shadow mt-4 max-w-2xl text-2xl font-semibold text-white md:text-3xl"
        >
          {HERO.tagline}
        </motion.p>

        <motion.div variants={rise} className="mt-10 flex flex-wrap gap-4">
          <MagneticButton
            variant="primary"
            onClick={() => scrollToStation('projects')}
            aria-label="View work — jump to projects"
          >
            View Work
          </MagneticButton>
          <MagneticButton
            variant="ghost"
            onClick={() => scrollToStation('contact')}
            aria-label="Let's talk — jump to contact"
          >
            Let&apos;s Talk
          </MagneticButton>
        </motion.div>

        {/* Mobile: chips as a simple wrapped row under the CTAs */}
        <motion.ul
          variants={rise}
          className="mt-10 flex list-none flex-wrap gap-3 lg:hidden"
          aria-label="Career highlights"
        >
          {HERO.chips.map((chip) => (
            <li key={chip.label} className="hud-chip">
              <AnimatedNumber
                value={chip.value}
                prefix={chip.prefix}
                suffix={chip.suffix}
                decimals={chip.decimals}
                className="font-semibold text-[#4facfe]"
              />
              <span className="ml-1.5 text-white/50">{chip.label}</span>
            </li>
          ))}
        </motion.ul>
      </motion.div>

      {/* ---- Desktop: floating HUD chips around the right half ---- */}
      {/* Inline pointerEvents:none — .station-section > * re-enables pointer
          events on direct children, and this overlay must stay transparent
          to clicks/scroll over the whole viewport. */}
      <ul
        className="absolute inset-0 hidden list-none lg:block"
        style={{ pointerEvents: 'none' }}
        aria-label="Career highlights"
      >
        {HERO.chips.map((chip, i) => {
          const pos = CHIP_POSITIONS[i % CHIP_POSITIONS.length];
          return (
            <motion.li
              key={chip.label}
              className="absolute"
              style={{ top: pos.top, right: pos.right }}
              custom={i}
              variants={chipReveal}
              initial="hidden"
              animate={introComplete ? 'visible' : 'hidden'}
            >
              {/* Inner element owns the perpetual float so it composes with
                  the entrance transform instead of overwriting it. */}
              <motion.div
                className="hud-chip"
                animate={{ y: [0, -8, 0, 8, 0] }}
                transition={{
                  duration: 5 + i * 0.7,
                  delay: i * 0.45,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <AnimatedNumber
                  value={chip.value}
                  prefix={chip.prefix}
                  suffix={chip.suffix}
                  decimals={chip.decimals}
                  className="font-semibold text-[#4facfe]"
                />
                <span className="ml-1.5 text-white/50">{chip.label}</span>
              </motion.div>
            </motion.li>
          );
        })}
      </ul>

      {/* ---- Scroll cue ---- */}
      <div
        className="absolute inset-x-0 bottom-8 flex justify-center"
        style={{ pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: scrolled ? 0 : introComplete ? 1 : 0 }}
          transition={{
            duration: 0.6,
            ease: EASE,
            delay: scrolled ? 0 : 2.2,
          }}
        >
          <span className="font-mono-hud text-[10px] uppercase tracking-[0.3em] text-white/40">
            scroll
          </span>
          <motion.div
            className="flex flex-col items-center text-[#4facfe]"
            animate={{ y: [0, 6, 0], opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="h-7 w-px bg-gradient-to-b from-transparent to-[#4facfe]/80" />
            <svg
              width="14"
              height="8"
              viewBox="0 0 14 8"
              fill="none"
              className="-mt-px"
            >
              <path
                d="M1 1l6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
