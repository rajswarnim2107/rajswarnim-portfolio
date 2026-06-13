import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import type { CaseStudy } from '@/data/cinematic-data';
import { ProjectViz } from './ProjectViz';
import { AnimatedNumber } from '@/components/effects/AnimatedNumber';
import { useCardTilt } from '@/hooks/use-card-tilt';
import { useSceneStore } from '@/store/scene-store';

interface ProjectCardProps {
  study: CaseStudy;
  onOpen: () => void;
  /** Shared horizontal-scroll progress (0..1) from the gallery. */
  progress: MotionValue<number> | null;
  index: number;
  total: number;
}

/**
 * One cinematic case-study card. Depth illusion: cards scale/dim by their
 * distance from gallery center, derived from the shared scroll progress
 * (no per-frame layout reads). Cursor tilt composes on an inner wrapper so
 * it never fights the track's translate.
 */
export function ProjectCard({ study, onOpen, progress, index, total }: ProjectCardProps) {
  const { ref, transform, handleMouseMove, handleMouseLeave } = useCardTilt(7);

  // This card is "centered" when progress === index/(total-1); falloff 0.5
  // per unit distance, clamped so edge cards never vanish. In the vertical
  // (mobile / reduced-motion) layout there is no shared progress — a static
  // zero MotionValue keeps hook order stable and the style branch unused.
  const center = total > 1 ? index / (total - 1) : 0;
  const fallback = progress === null;
  const staticProgress = useMotionValue(0);
  const source = progress ?? staticProgress;
  const scale = useTransform(source, (p: number) =>
    Math.max(1 - Math.abs(p - center) * 0.5, 0.88)
  );
  const opacity = useTransform(source, (p: number) =>
    Math.max(1 - Math.abs(p - center) * 1.2, 0.55)
  );

  const tiltHandlers = useSceneStore.getState().reducedMotion
    ? {}
    : { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave };

  return (
    <motion.article
      className="w-[78vw] max-w-[560px] flex-shrink-0"
      style={fallback ? undefined : { scale, opacity }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={ref}
        {...tiltHandlers}
        style={{ transform, transition: 'transform 0.25s var(--ease-cinematic)' }}
        className="h-full"
      >
        <button
          type="button"
          onClick={onOpen}
          data-cursor-hover
          aria-label={`Open case study: ${study.title}`}
          className="space-glass light-sweep group block h-full w-full overflow-hidden rounded-2xl text-left transition-shadow duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4facfe]"
          style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.55)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${study.accent}22, 0 24px 64px rgba(0,0,0,0.55)`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 24px 64px rgba(0,0,0,0.55)';
          }}
        >
          {/* Viz header */}
          <div className="relative h-40 overflow-hidden border-b border-white/5 md:h-48">
            <ProjectViz type={study.viz} accent={study.accent} />
            <span
              className="font-mono-hud pointer-events-none absolute right-4 top-2 text-7xl font-bold text-white/[0.06]"
              aria-hidden="true"
            >
              {study.index}
            </span>
          </div>

          {/* Body */}
          <div className="p-6 md:p-7">
            <p className="font-mono-hud text-xs" style={{ color: `${study.accent}cc` }}>
              {study.hook}
            </p>
            <h3 className="font-display mt-2 text-2xl font-semibold text-white/95">
              {study.title}
            </h3>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">
              {study.description}
            </p>

            <div className="mt-5 flex gap-8">
              {study.metrics.map((m) => (
                <div key={m.label}>
                  <span style={{ color: study.accent }}>
                    <AnimatedNumber
                      value={m.value}
                      prefix={m.prefix}
                      suffix={m.suffix}
                      decimals={m.decimals ?? 0}
                      className="font-mono-hud text-2xl font-bold md:text-3xl"
                    />
                  </span>
                  <p className="font-mono-hud mt-1 max-w-[180px] text-[11px] leading-snug text-white/45">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {study.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono-hud rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-white/55"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p
              className="font-mono-hud mt-6 text-xs transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: study.accent }}
            >
              open_case_study() →
            </p>
          </div>
        </button>
      </div>
    </motion.article>
  );
}
