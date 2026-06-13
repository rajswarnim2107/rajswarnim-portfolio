import { useEffect, useRef } from 'react';
import { useSceneStore, SECTION_IDS, type SectionId } from '@/store/scene-store';
import { scrollToStation } from '@/components/ScrollManager';

/** Short evocative names shown in the hover tooltips. */
const SECTION_TITLES: Record<SectionId, string> = {
  hero: 'Mind',
  about: 'Architect',
  projects: 'Work',
  stats: 'Scale',
  journey: 'Journey',
  contact: 'Build',
};

/**
 * Right-edge journey rail: a hairline track whose gradient fill mirrors
 * page scroll, plus one dot per station. Fill height is written inside a
 * rAF loop reading the hot `scrollProgress` field via getState() —
 * subscribing with a hook would re-render every scroll tick.
 */
export function ScrollRail() {
  const activeSection = useSceneStore((s) => s.activeSection);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let last = -1;
    const loop = () => {
      const p = useSceneStore.getState().scrollProgress;
      // Skip the style write when nothing moved (idle frames are free).
      if (p !== last && fillRef.current) {
        fillRef.current.style.height = `${(p * 100).toFixed(2)}%`;
        last = p;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    // !important variants: the .scroll-rail rules live AFTER @tailwind
    // utilities in index.css, so plain `hidden` would lose the cascade.
    <nav aria-label="Sections" className="scroll-rail !hidden md:!flex">
      <div className="scroll-rail-line" aria-hidden="true" />
      <div ref={fillRef} className="scroll-rail-fill" aria-hidden="true" />

      {SECTION_IDS.map((id, i) => (
        <button
          key={id}
          type="button"
          data-cursor-hover
          aria-label={`Go to ${SECTION_TITLES[id]} section`}
          aria-current={activeSection === id ? 'true' : undefined}
          onClick={() => scrollToStation(id)}
          className={`rail-dot group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4facfe] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090f] ${
            activeSection === id ? 'active' : ''
          }`}
        >
          <span
            className="font-mono-hud pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap text-[10px] tracking-widest text-white/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
            aria-hidden="true"
          >
            {String(i).padStart(2, '0')} {SECTION_TITLES[id]}
          </span>
        </button>
      ))}
    </nav>
  );
}
