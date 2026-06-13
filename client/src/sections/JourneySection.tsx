import { useRef } from 'react';
import { motion, useScroll, useSpring, type Variants } from 'framer-motion';
import { Trophy, Medal, Code } from 'lucide-react';
import { JOURNEY, AWARDS } from '@/data/cinematic-data';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Accent per node, cycling the section's blue→cyan→purple identity. */
const NODE_ACCENTS = ['#a855f7', '#3b82f6', '#4facfe', '#3b82f6', '#a855f7'];

const MEDAL_ICONS = [Trophy, Medal, Code];

const awardsContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const awardCard: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

interface TimelineNodeProps {
  node: (typeof JOURNEY)[number];
  index: number;
  isLast: boolean;
}

function TimelineNode({ node, index, isLast }: TimelineNodeProps) {
  const accent = NODE_ACCENTS[index % NODE_ACCENTS.length];

  return (
    <motion.li
      initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
      className="relative pl-12 md:pl-16"
    >
      {/* Node dot — sits on the timeline, lights up as it scrolls in.
          The "Present" node breathes with a looping glow. */}
      <motion.span
        aria-hidden="true"
        className="absolute left-[11px] top-1.5 h-[14px] w-[14px] rounded-full border-2 md:left-[15px]"
        style={{ borderColor: accent }}
        initial={{ backgroundColor: 'rgba(9,9,15,1)', boxShadow: '0 0 0px rgba(0,0,0,0)' }}
        whileInView={
          isLast
            ? {
                backgroundColor: accent,
                boxShadow: [
                  `0 0 8px ${accent}`,
                  `0 0 22px ${accent}`,
                  `0 0 8px ${accent}`,
                ],
              }
            : { backgroundColor: accent, boxShadow: `0 0 14px ${accent}` }
        }
        viewport={{ once: true, margin: '-15%' }}
        transition={
          isLast
            ? {
                backgroundColor: { duration: 0.5, ease: EASE },
                boxShadow: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
              }
            : { duration: 0.6, ease: EASE, delay: 0.15 }
        }
      />

      <p className="font-mono-hud text-sm text-[#4facfe]/70">{node.year}</p>
      <h3 className="font-display mt-1 text-xl font-medium text-white/90">
        {node.title}
      </h3>
      <p className="mt-0.5 text-white/60">{node.org}</p>
      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/50">
        {node.detail}
      </p>
    </motion.li>
  );
}

/**
 * Station 05 — "The Journey". No dedicated 3D set piece at this station
 * (starfield + fog only), so the DOM carries the drama: a timeline whose
 * glowing fill draws itself as the section scrolls through the viewport,
 * plus shimmering award medals below.
 */
export function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Map section scroll → timeline fill. 'start 0.7' begins the draw as the
  // section's top crosses 70% of the viewport; the spring gives the fill a
  // liquid lag so it chases the scroll instead of tracking it rigidly.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.7', 'end 0.5'],
  });
  const fillProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.6,
  });

  return (
    <section id="journey" ref={sectionRef} className="station-section">
      <div className="mx-auto w-full max-w-5xl px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="font-mono-hud text-sm text-[#3b82f6]/70">
            {'// 05 — the journey'}
          </p>
          <h2 className="font-display mt-4 text-4xl font-semibold tracking-tight text-white/90 md:text-6xl">
            The Journey
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative mt-16">
          {/* Static rail */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[17px] top-0 w-px bg-gradient-to-b from-[#a855f7]/60 via-[#3b82f6]/40 to-transparent md:left-[21px]"
          />
          {/* Scroll-driven glowing fill (sharp core + blurred halo share
              the same scaleY so they draw together) */}
          <motion.div
            aria-hidden="true"
            className="absolute bottom-0 left-[17px] top-0 w-px origin-top bg-gradient-to-b from-[#a855f7] to-[#4facfe] md:left-[21px]"
            style={{ scaleY: fillProgress }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute bottom-0 left-[16px] top-0 w-[3px] origin-top bg-gradient-to-b from-[#a855f7] to-[#4facfe] opacity-60 blur-[6px] md:left-[20px]"
            style={{ scaleY: fillProgress }}
          />

          <ul className="space-y-12">
            {JOURNEY.map((node, i) => (
              <TimelineNode
                key={node.year}
                node={node}
                index={i}
                isLast={i === JOURNEY.length - 1}
              />
            ))}
          </ul>
        </div>

        {/* Awards */}
        <div className="mt-24">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-mono-hud text-sm text-[#3b82f6]/70"
          >
            {'// honors'}
          </motion.h3>

          <motion.ul
            variants={awardsContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-15%' }}
            className="mt-8 grid gap-6 md:grid-cols-3"
          >
            {AWARDS.map((award, i) => {
              const Icon = MEDAL_ICONS[i % MEDAL_ICONS.length];
              return (
                <motion.li
                  key={award.title}
                  variants={awardCard}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  data-cursor-hover
                  className="space-glass light-sweep rounded-xl p-6"
                >
                  {/* Medal emblem — slowly rotating conic ring with a fixed
                      inner disc so the icon stays upright while the rim spins */}
                  <div className="relative h-10 w-10" aria-hidden="true">
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          'conic-gradient(from 0deg, #a855f7, #4facfe, #f093fb, #a855f7)',
                        boxShadow: '0 0 16px rgba(168, 85, 247, 0.4)',
                      }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 9,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-[#09090f]">
                      <Icon className="h-4 w-4 text-white/90" strokeWidth={1.75} />
                    </div>
                  </div>

                  <h4 className="font-display mt-5 text-lg font-medium text-white/90">
                    {award.title}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/50">
                    {award.detail}
                  </p>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
