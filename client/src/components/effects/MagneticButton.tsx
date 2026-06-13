import { useRef, type ReactNode, type ButtonHTMLAttributes } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from 'framer-motion';
import { useSceneStore } from '@/store/scene-store';
import { cn } from '@/lib/utils';

interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode;
  /** Pull strength: how far (px) the button leans toward the cursor. */
  strength?: number;
  variant?: 'primary' | 'ghost';
}

/**
 * Button that snaps toward the cursor while hovered (magnetic effect),
 * with the shared light-sweep hover. Falls back to a plain button under
 * reduced motion.
 */
export function MagneticButton({
  children,
  strength = 18,
  variant = 'primary',
  className,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 14, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 180, damping: 14, mass: 0.3 });

  const onMouseMove = (e: React.MouseEvent) => {
    if (useSceneStore.getState().reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Offset of cursor from button center, normalized to [-1, 1]
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
    <motion.button
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: springX, y: springY }}
      data-cursor-hover
      className={cn(
        'light-sweep relative rounded-lg px-7 py-3.5 font-display text-sm font-semibold tracking-wide transition-colors duration-300',
        variant === 'primary'
          ? 'bg-gradient-to-r from-[#a855f7] to-[#3b82f6] text-white shadow-[0_0_28px_rgba(168,85,247,0.35)] hover:shadow-[0_0_42px_rgba(168,85,247,0.55)]'
          : 'border border-white/15 bg-white/[0.03] text-white/90 backdrop-blur-sm hover:border-[#4facfe]/60 hover:text-white',
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
