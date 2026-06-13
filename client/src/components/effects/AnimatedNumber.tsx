import { useEffect, useRef } from 'react';
import {
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion as useFmReducedMotion,
} from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Spring duration feel; higher = heavier number. */
  mass?: number;
  className?: string;
}

/**
 * A number that counts up with spring physics the first time it scrolls
 * into view. Renders the final value immediately under reduced motion.
 * Writes textContent imperatively so the spring never re-renders React.
 */
export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  mass = 1,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduced = useFmReducedMotion();

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 55 / mass,
    damping: 18,
    mass,
  });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    const format = (v: number) =>
      `${prefix}${v.toFixed(decimals)}${suffix}`;
    if (reduced) {
      if (ref.current) ref.current.textContent = format(value);
      return;
    }
    const unsub = spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = format(Math.min(v, value));
    });
    return unsub;
  }, [spring, prefix, suffix, decimals, value, reduced]);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`}>
      {reduced ? `${prefix}${value.toFixed(decimals)}${suffix}` : `${prefix}0${suffix}`}
    </span>
  );
}
