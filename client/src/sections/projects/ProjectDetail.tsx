import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { CaseStudy } from '@/data/cinematic-data';
import { ProjectViz } from './ProjectViz';
import { AnimatedNumber } from '@/components/effects/AnimatedNumber';

interface ProjectDetailProps {
  study: CaseStudy;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Focused case-study view. The gallery renders a blurred backdrop behind
 * this (the "depth of field" over the 3D scene); this component is just
 * the dialog itself. Escape and backdrop-close are handled by the parent.
 */
export function ProjectDetail({ study, onClose }: ProjectDetailProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Auto-focus the close button on open.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Trap Tab/Shift+Tab within the dialog so keyboard users can't escape.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    dialog.addEventListener('keydown', onKeyDown);
    return () => dialog.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`detail-title-${study.id}`}
        className="space-glass space-glass-bright pointer-events-auto relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl"
        initial={{ scale: 0.92, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 16, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          data-cursor-hover
          aria-label="Close case study"
          className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-[#09090f]/60 p-2 text-white/70 backdrop-blur transition-colors hover:border-[#4facfe]/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4facfe]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Viz strip */}
        <div className="relative h-56 overflow-hidden border-b border-white/5">
          <ProjectViz type={study.viz} accent={study.accent} />
          <span
            className="font-mono-hud pointer-events-none absolute right-6 top-3 text-8xl font-bold text-white/[0.06]"
            aria-hidden="true"
          >
            {study.index}
          </span>
        </div>

        <div className="px-6 pb-8 pt-6 md:px-8">
          <p className="font-mono-hud text-xs" style={{ color: `${study.accent}cc` }}>
            {study.hook}
          </p>
          <h3
            id={`detail-title-${study.id}`}
            className="font-display mt-2 text-3xl font-semibold text-white/95 md:text-4xl"
          >
            {study.title}
          </h3>
          <p className="mt-4 leading-relaxed text-white/70">{study.description}</p>

          <div className="mt-8 flex flex-wrap gap-10">
            {study.metrics.map((m) => (
              <div key={m.label}>
                <span style={{ color: study.accent }}>
                  <AnimatedNumber
                    value={m.value}
                    prefix={m.prefix}
                    suffix={m.suffix}
                    decimals={m.decimals ?? 0}
                    className="font-mono-hud text-4xl font-bold"
                  />
                </span>
                <p className="font-mono-hud mt-1 max-w-[220px] text-xs leading-snug text-white/45">
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {study.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono-hud rounded-full border border-white/10 px-3 py-1 text-xs text-white/55"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 h-px bg-white/10" />
          <p className="font-mono-hud mt-4 text-xs text-white/40">
            stack :: {study.tags.join(' · ')}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
