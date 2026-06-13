import { motion } from 'framer-motion';

interface GlowTrailProps {
  mouseX: number;
  mouseY: number;
  color?: string;
  size?: number;
}

export function GlowTrail({
  mouseX,
  mouseY,
  color = 'rgba(168, 85, 247, 0.08)',
  size = 500
}: GlowTrailProps) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ${size}px circle at ${mouseX}px ${mouseY}px,
            ${color},
            transparent 40%
          )`
        }}
      />
    </motion.div>
  );
}
