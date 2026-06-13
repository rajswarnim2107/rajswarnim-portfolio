import { useRef, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  type Variants,
} from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { CONTACT } from '@/data/cinematic-data';
import { useSceneStore } from '@/store/scene-store';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

interface MagneticAnchorProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  /** Pull strength: how far (px) the link leans toward the cursor. */
  strength?: number;
  external?: boolean;
  ariaLabel?: string;
  className?: string;
}

/**
 * Anchor twin of MagneticButton — real <a> semantics (mailto / external
 * links stay keyboard- and middle-click-friendly) with the same magnetic
 * lean + light-sweep treatment. Inert under reduced motion.
 */
function MagneticAnchor({
  href,
  children,
  variant = 'primary',
  strength = 18,
  external = false,
  ariaLabel,
  className,
}: MagneticAnchorProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 14, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 180, damping: 14, mass: 0.3 });

  const onMouseMove = (e: React.MouseEvent) => {
    if (useSceneStore.getState().reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Cursor offset from element center normalized to [-1, 1], scaled to px.
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: springX, y: springY }}
      data-cursor-hover
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={cn(
        'light-sweep relative inline-flex items-center justify-center gap-2.5 rounded-lg px-7 py-3.5 font-display text-sm font-semibold tracking-wide transition-colors duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4facfe] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090f]',
        variant === 'primary'
          ? 'bg-gradient-to-r from-[#a855f7] to-[#3b82f6] text-white shadow-[0_0_28px_rgba(168,85,247,0.35)] hover:shadow-[0_0_42px_rgba(168,85,247,0.55)]'
          : 'border border-white/15 bg-white/[0.03] text-white/90 backdrop-blur-sm hover:border-[#4facfe]/60 hover:text-white',
        className
      )}
    >
      {children}
    </motion.a>
  );
}

/**
 * Final station — "Let's Build" transmission panel over the CalmCore set
 * piece, doubling as the site footer.
 */
export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="station-section flex-col justify-between pb-8 pt-32"
    >
      {/* CENTER — grows to vertically center the transmission panel */}
      <div className="flex w-full grow items-center">
        <motion.div
          className="mx-auto w-full max-w-3xl px-6 text-center"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-15%' }}
        >
          {/* a. mono kicker */}
          <motion.p
            variants={item}
            className="font-mono-hud text-sm text-[#a855f7]/70"
          >
            {'// 06 — transmission open'}
          </motion.p>

          {/* b. heading — "Let's " white + "Build" aurora */}
          <motion.h2
            id="contact-heading"
            variants={item}
            className="font-display mt-4 text-5xl font-bold text-white/90 md:text-7xl"
          >
            {"Let's "}
            <span className="aurora-text">Build</span>
          </motion.h2>

          {/* c. supporting line */}
          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-xl text-white/60"
          >
            {CONTACT.line}
          </motion.p>

          {/* d. glass contact card */}
          <motion.div
            variants={item}
            className="space-glass space-glass-bright mt-10 inline-block w-full p-8 md:p-10"
          >
            <MagneticAnchor
              href={`mailto:${CONTACT.email}`}
              variant="primary"
              ariaLabel={`Email Raj Swarnim at ${CONTACT.email}`}
              className="w-full px-6 text-base sm:w-auto md:text-lg"
            >
              <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="break-all">{CONTACT.email}</span>
            </MagneticAnchor>

            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MagneticAnchor
                href={CONTACT.linkedin}
                variant="ghost"
                external
                strength={14}
                ariaLabel="Raj Swarnim on LinkedIn (opens in a new tab)"
                className="w-full sm:w-auto"
              >
                <Linkedin className="h-4 w-4 shrink-0" aria-hidden="true" />
                LinkedIn
              </MagneticAnchor>
              <MagneticAnchor
                href={CONTACT.github}
                variant="ghost"
                external
                strength={14}
                ariaLabel="Raj Swarnim on GitHub (opens in a new tab)"
                className="w-full sm:w-auto"
              >
                <Github className="h-4 w-4 shrink-0" aria-hidden="true" />
                GitHub
              </MagneticAnchor>
            </div>
          </motion.div>

          {/* e. mono micro-line */}
          <motion.p
            variants={item}
            className="font-mono-hud mt-6 text-xs text-white/35"
          >
            {'$ uptime — 8 years in applied AI · response_time < 24h'}
          </motion.p>
        </motion.div>
      </div>

      {/* FOOTER strip */}
      <footer className="mx-auto w-full max-w-6xl px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="font-mono-hud flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/35 sm:flex-row">
          <p>
            © 2026 Raj Swarnim — built with React · Three.js · too much coffee
          </p>
          <p className="flex items-center gap-2">
            designed as an experience
            <motion.span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-[#4facfe]"
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </p>
        </div>
      </footer>
    </section>
  );
}
