import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedBorderProps {
  visible: boolean;
}

export function AnimatedBorder({ visible }: AnimatedBorderProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!visible) return;

    let animationFrame: number;
    let startTime: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      setRotation((elapsed / 20) % 360);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [visible]);

  return (
    <motion.div
      className="absolute inset-0 rounded-lg pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `
            conic-gradient(
              from ${rotation}deg at 50% 50%,
              transparent 0deg,
              rgba(168, 85, 247, 0.5) 90deg,
              transparent 180deg
            )
          `,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '2px'
        }}
      />
    </motion.div>
  );
}
