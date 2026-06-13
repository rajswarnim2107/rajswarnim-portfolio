import { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { ABOUT, SKILL_CLUSTERS, type SkillCluster } from '@/data/cinematic-data';
import { useSceneStore } from '@/store/scene-store';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE,
      staggerChildren: 0.09,
      delayChildren: 0.1,
    },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/**
 * Mirror the hovered/focused cluster into the scene store. The 3D skill
 * constellation (orbiting behind the right column) reads `focusedCluster`
 * to zoom toward / highlight that cluster — DOM drives 3D, never the
 * reverse, because the canvas is pointer-events:none.
 */
function setFocusedCluster(id: string | null) {
  useSceneStore.getState().set({ focusedCluster: id });
}

interface ClusterRowProps {
  cluster: SkillCluster;
  expanded: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

function ClusterRow({ cluster, expanded, onEnter, onLeave }: ClusterRowProps) {
  return (
    // Mouse intent lives on the wrapper (so moving down into the expanded
    // bars doesn't collapse them); keyboard intent lives on the button.
    <li
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`rounded-xl border transition-colors duration-300 ${
        expanded ? 'border-white/10 bg-white/[0.02]' : 'border-transparent'
      }`}
    >
      <button
        type="button"
        data-cursor-hover
        aria-expanded={expanded}
        onFocus={onEnter}
        onBlur={onLeave}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-300 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4facfe]"
      >
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{
            backgroundColor: cluster.accent,
            boxShadow: `0 0 10px ${cluster.accent}`,
          }}
        />
        <span className="font-display text-sm font-medium tracking-wide text-white/90">
          {cluster.label}
        </span>
        <span className="font-mono-hud ml-auto text-xs text-white/40">
          ({cluster.skills.length})
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <ul className="space-y-3 px-3 pb-4 pt-1">
              {cluster.skills.map((skill, i) => (
                <li key={skill.name}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="text-sm text-white/80">{skill.name}</span>
                    <span className="font-mono-hud text-[11px] text-white/40">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="skill-bar-track">
                    {/* Bars draw themselves left → right, staggered 60ms */}
                    <motion.div
                      className="skill-bar-fill"
                      style={{
                        backgroundColor: cluster.accent,
                        boxShadow: `0 0 8px ${cluster.accent}`,
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: skill.level / 100 }}
                      transition={{
                        duration: 0.7,
                        ease: EASE,
                        delay: 0.1 + i * 0.06,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/**
 * Station 01 — "The Architect". Glass bio panel on the left; the right
 * column stays mostly empty on desktop so the 3D skill constellations
 * (orbiting behind it in world space) read through the fog. The DOM only
 * carries the cluster legend, which drives the 3D focus state.
 */
export function AboutSection() {
  const [focused, setFocused] = useState<string | null>(null);

  const enter = (id: string) => {
    setFocused(id);
    setFocusedCluster(id);
  };
  const leave = () => {
    setFocused(null);
    setFocusedCluster(null);
  };

  return (
    <section id="about" className="station-section">
      <div className="mx-auto w-full max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,520px)_1fr]">
          {/* LEFT — bio panel */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-15%' }}
            className="space-glass p-8 md:p-10"
          >
            <motion.p
              variants={childVariants}
              className="font-mono-hud text-sm text-[#3b82f6]/70"
            >
              {'// 01 — the architect'}
            </motion.p>

            <motion.h2
              variants={childVariants}
              className="font-display mt-4 text-4xl font-semibold tracking-tight text-white/90 md:text-5xl"
            >
              {ABOUT.heading}
            </motion.h2>

            <motion.p
              variants={childVariants}
              className="mt-6 leading-relaxed text-white/70"
            >
              {ABOUT.bio}
            </motion.p>

            <motion.div
              variants={childVariants}
              className="my-8 h-px bg-white/10"
              aria-hidden="true"
            />

            <ul className="space-y-5">
              {ABOUT.education.map((edu) => (
                <motion.li key={edu.degree} variants={childVariants}>
                  <p className="font-display text-base font-medium text-white/90">
                    {edu.degree}
                  </p>
                  <p className="font-mono-hud mt-1 text-sm text-white/60">
                    {edu.school} ·{' '}
                    <span className="text-[#4facfe]/70">{edu.detail}</span>
                  </p>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* RIGHT — constellation legend (3D orbits behind this column) */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="w-full max-w-xs self-center lg:justify-self-end"
          >
            <p className="font-mono-hud mb-4 px-3 text-xs text-[#4facfe]/70">
              $ skills --map · hover to focus
            </p>
            <ul className="space-y-1">
              {SKILL_CLUSTERS.map((cluster) => (
                <ClusterRow
                  key={cluster.id}
                  cluster={cluster}
                  expanded={focused === cluster.id}
                  onEnter={() => enter(cluster.id)}
                  onLeave={leave}
                />
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
