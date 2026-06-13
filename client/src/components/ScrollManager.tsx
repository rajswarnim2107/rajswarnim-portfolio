import { useEffect } from 'react';
import { useSceneStore, SECTION_IDS, type SectionId } from '@/store/scene-store';

// NOTE: deliberately does NOT import from lib/camera-path — that module
// pulls all of three.js, which must stay in the lazy CinematicScene chunk.
function nearestSection(t: number): SectionId {
  const idx = Math.min(
    Math.max(Math.round(t), 0),
    SECTION_IDS.length - 1
  );
  return SECTION_IDS[idx];
}

/**
 * Bridges native page scroll → scene state. The page keeps real DOM
 * sections (semantic HTML, anchor links, keyboard scrolling all work);
 * this component just measures where each section sits and converts
 * scrollY into a continuous station parameter for the camera.
 *
 * pathParam is piecewise-linear between section midpoints: when the
 * middle of section N is centered in the viewport, pathParam === N.
 */
export function ScrollManager() {
  useEffect(() => {
    const set = useSceneStore.getState().set;

    // Section center positions in document space, re-measured on resize.
    let centers: number[] = [];
    const measure = () => {
      centers = SECTION_IDS.map((id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return rect.top + window.scrollY + rect.height / 2;
      });
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const viewCenter = window.scrollY + window.innerHeight / 2;
      const doc = document.documentElement;
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);

      // Find segment containing viewCenter and interpolate within it.
      let t = 0;
      if (viewCenter <= centers[0]) {
        t = 0;
      } else if (viewCenter >= centers[centers.length - 1]) {
        t = centers.length - 1;
      } else {
        for (let i = 0; i < centers.length - 1; i++) {
          if (viewCenter >= centers[i] && viewCenter < centers[i + 1]) {
            t = i + (viewCenter - centers[i]) / (centers[i + 1] - centers[i]);
            break;
          }
        }
      }

      const state = useSceneStore.getState();
      const active = nearestSection(t);
      // Hot fields every tick; cold field only on change (avoids re-renders).
      set({ pathParam: t, scrollProgress: window.scrollY / maxScroll });
      if (state.activeSection !== active) set({ activeSection: active });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    // Sections mount with Suspense, so measure after first paint and again
    // shortly after in case lazy content changed layout.
    measure();
    update();
    const settleTimer = window.setTimeout(onResize, 600);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);

    return () => {
      window.clearTimeout(settleTimer);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, []);

  // Pointer → normalized device coords for camera parallax + node lean.
  useEffect(() => {
    const set = useSceneStore.getState().set;
    const onMove = (e: PointerEvent) => {
      set({
        pointer: {
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: -((e.clientY / window.innerHeight) * 2 - 1),
        },
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return null;
}

/** Smooth-scroll helper used by nav dots, CTAs, and the top bar. */
export function scrollToStation(id: (typeof SECTION_IDS)[number]) {
  document.getElementById(id)?.scrollIntoView({
    behavior: useSceneStore.getState().reducedMotion ? 'auto' : 'smooth',
    block: 'start',
  });
}
