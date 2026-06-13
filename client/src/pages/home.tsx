import { lazy, Suspense, useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useSceneStore } from '@/store/scene-store';
import { ScrollManager } from '@/components/ScrollManager';
import { Preloader } from '@/components/effects/Preloader';
import { CustomCursor } from '@/components/effects/CustomCursor';
import { ScrollRail } from '@/components/effects/ScrollRail';
import { TopBar } from '@/components/effects/TopBar';
import { HeroSection } from '@/sections/HeroSection';
import { AboutSection } from '@/sections/AboutSection';
import { ProjectsSection } from '@/sections/ProjectsSection';
import { StatsSection } from '@/sections/StatsSection';
import { JourneySection } from '@/sections/JourneySection';
import { ContactSection } from '@/sections/ContactSection';

// The entire WebGL world is code-split; the DOM renders instantly and the
// preloader covers the gap while three.js + the scene stream in.
const CinematicScene = lazy(() =>
  import('@/components/3d/CinematicScene').then((m) => ({
    default: m.CinematicScene,
  }))
);

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const introComplete = useSceneStore((s) => s.introComplete);
  const [showPreloader, setShowPreloader] = useState(true);

  // Mirror reduced-motion into the store so 3D code can read it per-frame,
  // and force dark styling for the cinematic layer.
  useEffect(() => {
    useSceneStore.getState().set({ reducedMotion: prefersReducedMotion });
    if (prefersReducedMotion) {
      // Skip the preloader entirely — static elegant layout, no autoplay 3D.
      useSceneStore.getState().set({ introComplete: true });
      setShowPreloader(false);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('cinematic-root');
    return () => document.body.classList.remove('cinematic-root');
  }, []);

  // Keep the preloader mounted briefly after completion so its exit
  // animation can play over the camera dolly-in.
  useEffect(() => {
    if (introComplete) {
      const t = window.setTimeout(() => setShowPreloader(false), 900);
      return () => window.clearTimeout(t);
    }
  }, [introComplete]);

  return (
    <div className="cinematic-root relative min-h-screen">
      <ScrollManager />
      <CustomCursor />

      {/* Persistent 3D world — skipped entirely under reduced motion */}
      {!prefersReducedMotion && (
        <Suspense fallback={null}>
          <CinematicScene />
        </Suspense>
      )}

      {showPreloader && <Preloader />}

      <TopBar />
      <ScrollRail />

      <main className="relative">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <StatsSection />
        <JourneySection />
        <ContactSection />
      </main>
    </div>
  );
}
