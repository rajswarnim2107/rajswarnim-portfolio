import { create } from 'zustand';

export const SECTION_IDS = [
  'hero',
  'about',
  'projects',
  'stats',
  'journey',
  'contact',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export interface SceneState {
  /**
   * Continuous "station index" along the camera path: 0 = hero, 1 = about, …
   * Written by ScrollManager on every scroll tick.
   *
   * HOT FIELD — updated up to 60×/s. 3D components must read it with
   * `useSceneStore.getState().pathParam` inside useFrame, never subscribe
   * to it with a hook (that would re-render React every scroll tick).
   */
  pathParam: number;
  /** Raw page scroll 0..1 (hot field, same rule as pathParam). */
  scrollProgress: number;
  /** Pointer in normalized device coords, -1..1 each axis (hot field). */
  pointer: { x: number; y: number };
  /** Preloader particle assembly: 0 = scattered cloud, 1 = formed sphere (hot field). */
  assembly: number;

  /** Flips true once the preloader finishes; camera then dollies into the hero. */
  introComplete: boolean;
  /** Nearest section to the camera — drives nav dots / top bar (cold field). */
  activeSection: SectionId;
  /** Device performance tier; 'low' halves particle counts and drops bloom. */
  quality: 'high' | 'low';
  /** Mirror of prefers-reduced-motion so non-React code can read it. */
  reducedMotion: boolean;
  /** Skill cluster currently hovered in the About panel (syncs DOM → 3D). */
  focusedCluster: string | null;
  /** Ambient hum toggle. */
  soundOn: boolean;

  set: (partial: Partial<Omit<SceneState, 'set'>>) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  pathParam: 0,
  scrollProgress: 0,
  pointer: { x: 0, y: 0 },
  assembly: 0,
  introComplete: false,
  activeSection: 'hero',
  quality: 'high',
  reducedMotion: false,
  focusedCluster: null,
  soundOn: false,
  set: (partial) => set(partial),
}));
