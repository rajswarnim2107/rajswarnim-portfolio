import { useState, useCallback, useRef } from 'react';

export function useCardTilt(intensity = 15) {
  const [transform, setTransform] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      setTransform(`
        perspective(1000px)
        rotateY(${x * intensity}deg)
        rotateX(${-y * intensity}deg)
        translateZ(20px)
      `);
    },
    [intensity]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform('');
  }, []);

  return { ref, transform, handleMouseMove, handleMouseLeave };
}
