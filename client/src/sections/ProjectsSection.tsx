import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { CASE_STUDIES, type CaseStudy } from '@/data/cinematic-data';
import { ProjectCard } from './projects/ProjectCard';
import { ProjectDetail } from './projects/ProjectDetail';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSceneStore } from '@/store/scene-store';

/**
 * "The Work" — the showpiece. On desktop, a 460vh scroll runway pins a
 * full-height viewport while vertical scroll drives the card track
 * horizontally through 3D-feeling space (each card scales/dims by its
 * distance from center). On mobile or under reduced motion this collapses
 * to a simple vertical stack — same content, zero trickery.
 */
export function ProjectsSection() {
  const isMobile = useIsMobile();
  const reducedMotion = useSceneStore((s) => s.reducedMotion);
  const [selected, setSelected] = useState<CaseStudy | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const open = (study: CaseStudy) => {
    lastTrigger.current = document.activeElement as HTMLElement;
    setSelected(study);
  };
  const close = () => {
    setSelected(null);
    // Return focus to the card that opened the dialog.
    lastTrigger.current?.focus();
  };

  // Escape closes; body scroll locks while the detail view is open.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const vertical = isMobile || reducedMotion;

  return (
    <>
      {vertical ? (
        <VerticalGallery onOpen={open} />
      ) : (
        <HorizontalGallery onOpen={open} />
      )}

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-[#09090f]/60 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={close}
              aria-hidden="true"
            />
            <ProjectDetail key="detail" study={selected} onClose={close} />
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SectionHeader({ hint }: { hint?: boolean }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6">
      <motion.p
        className="font-mono-hud text-xs text-[#4facfe]/70"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {'// 02·03 — the work'}
      </motion.p>
      <div className="mt-3 flex items-end justify-between">
        <motion.h2
          className="font-display text-4xl font-bold text-white md:text-6xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          Selected Systems
        </motion.h2>
        {hint && <ScrollHint />}
      </div>
    </div>
  );
}

/** "scroll →" affordance that disappears once the gallery starts moving. */
function ScrollHint() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const initial = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - initial) > 120) {
        setHidden(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <motion.span
      className="font-mono-hud hidden pb-2 text-xs text-white/40 md:block"
      animate={{ opacity: hidden ? 0 : [0.4, 0.8, 0.4] }}
      transition={hidden ? { duration: 0.4 } : { duration: 2.2, repeat: Infinity }}
      aria-hidden="true"
    >
      scroll →
    </motion.span>
  );
}

function HorizontalGallery({ onOpen }: { onOpen: (s: CaseStudy) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);

  // Measure how far the track must translate so the last card lands
  // centered: total track width minus one viewport, plus edge padding.
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setTravel(Math.max(track.scrollWidth - window.innerWidth + 40, 0));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const x = useTransform(smooth, [0, 1], [40, -travel]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative z-10"
      style={{ height: '460vh' }}
      aria-label="Selected projects"
    >
      <div className="pointer-events-none sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="pointer-events-auto">
          <SectionHeader hint />
        </div>
        <motion.div
          ref={trackRef}
          className="pointer-events-auto mt-10 flex items-stretch gap-10 px-[6vw] will-change-transform"
          style={{ x }}
        >
          {CASE_STUDIES.map((study, i) => (
            <ProjectCard
              key={study.id}
              study={study}
              onOpen={() => onOpen(study)}
              progress={smooth}
              index={i}
              total={CASE_STUDIES.length}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function VerticalGallery({ onOpen }: { onOpen: (s: CaseStudy) => void }) {
  return (
    <section id="projects" className="relative z-10 py-24" aria-label="Selected projects">
      <SectionHeader />
      <div className="mx-auto mt-10 flex w-full max-w-2xl flex-col gap-8 px-6">
        {CASE_STUDIES.map((study, i) => (
          <motion.div
            key={study.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <ProjectCard
              study={study}
              onOpen={() => onOpen(study)}
              progress={null}
              index={i}
              total={CASE_STUDIES.length}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
