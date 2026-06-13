import { useEffect, useState } from 'react';

interface UseCounterOptions {
  duration?: number;
  startAnimation?: boolean;
  formatter?: (value: number) => string;
  prefix?: string;
  suffix?: string;
}

export function useCounter(
  target: number,
  options: UseCounterOptions = {}
) {
  const {
    duration = 2000,
    startAnimation = false,
    formatter = (v) => v.toString(),
    prefix = '',
    suffix = ''
  } = options;

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOut * target);

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [target, duration, startAnimation]);

  return `${prefix}${formatter(count)}${suffix}`;
}
