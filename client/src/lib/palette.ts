/**
 * Canonical color system for the cinematic experience.
 * Deep-space near-black base with electric accent spectrum.
 * Every 3D material and DOM accent should pull from here.
 */
export const PALETTE = {
  /** Near-black page/scene background — hsl(240, 10%, 3.9%) */
  bg: '#09090f',
  /** Slightly lifted surface for glass panels */
  surface: '#0d0d16',
  purple: '#a855f7',
  blue: '#3b82f6',
  cyan: '#4facfe',
  magenta: '#f093fb',
  white: '#f8f8ff',
  /** Muted body text on dark */
  textDim: '#9b9bad',
} as const;

/** Aurora gradient stops used for the name + key headlines */
export const AURORA = [
  PALETTE.purple,
  PALETTE.blue,
  PALETTE.cyan,
  PALETTE.magenta,
] as const;

/** Per-section accent so each "station" has its own color identity */
export const SECTION_ACCENT = {
  hero: PALETTE.purple,
  about: PALETTE.blue,
  projects: PALETTE.cyan,
  stats: PALETTE.magenta,
  journey: PALETTE.blue,
  contact: PALETTE.purple,
} as const;
