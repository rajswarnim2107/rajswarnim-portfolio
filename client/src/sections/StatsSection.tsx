import { motion, type Variants } from 'framer-motion';
import { SCALE_STATS } from '@/data/cinematic-data';
import { PALETTE } from '@/lib/palette';
import { AnimatedNumber } from '@/components/effects/AnimatedNumber';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Per-stat accent cycle: purple → blue → cyan → magenta. */
const STAT_ACCENTS = [
  PALETTE.purple,
  PALETTE.blue,
  PALETTE.cyan,
  PALETTE.magenta,
] as const;

const headerReveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

/* Typographic mass: each number tilts up from a 25° recline and rises
   60px — heavy, decisive, no bounce (the cinematic ease never overshoots). */
const statReveal: Variants = {
  hidden: { opacity: 0, y: 60, rotateX: 25 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: i * 0.12, duration: 1.0, ease: EASE },
  }),
};

/**
 * "At Scale" — full-bleed kinetic numbers floating raw over the DataRiver.
 * No glass panels here; contrast comes from a soft radial vignette behind
 * the grid so the type holds against the particle stream.
 */
export function StatsSection() {
  return (
    <section id="stats" className="station-section">
      <div className="relative mx-auto w-full max-w-6xl px-6 py-24">
        {/* Vignette: darkens the center of the river just enough for the
            raw type to read, fading to nothing so the 3D stays visible. */}
        <div
          aria-hidden="true"
          className="absolute -inset-x-24 -inset-y-16 bg-[radial-gradient(ellipse_at_center,rgba(9,9,15,0.72),transparent_70%)]"
          style={{ pointerEvents: 'none' }}
        />

        <div className="relative">
          <motion.header
            variants={headerReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-15%' }}
          >
            <p className="font-mono-hud text-sm text-[#4facfe]/70">
              {'// 04 — at scale'}
            </p>
            <h2 className="font-display mt-3 text-4xl font-bold text-white md:text-6xl">
              Numbers with mass.
            </h2>
          </motion.header>

          {/* perspective on the grid gives the rotateX entrances real depth
              instead of a flat squash */}
          <dl
            className="mt-16 grid grid-cols-1 gap-x-12 gap-y-14 md:grid-cols-2 md:gap-y-20"
            style={{ perspective: '900px' }}
          >
            {SCALE_STATS.map((stat, i) => {
              const accent = STAT_ACCENTS[i % STAT_ACCENTS.length];
              return (
                <motion.div
                  key={stat.label}
                  custom={i}
                  variants={statReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-15%' }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="m-0">
                    {/* Wrapper carries accent + matching soft glow ('66' =
                        40% alpha hex); both inherit into the counting span. */}
                    <span
                      className="block"
                      style={{
                        color: accent,
                        textShadow: `0 0 40px ${accent}66`,
                      }}
                    >
                      <AnimatedNumber
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        decimals={stat.decimals}
                        mass={1.6}
                        className="font-mono-hud block text-6xl font-bold md:text-8xl"
                      />
                    </span>
                    <span className="font-mono-hud mt-4 block text-xs uppercase tracking-[0.2em] text-white/50">
                      {stat.label}
                    </span>
                  </dd>
                </motion.div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
