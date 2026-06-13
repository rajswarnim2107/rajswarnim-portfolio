import { motion, AnimatePresence } from 'framer-motion';
import { useCounter } from '@/hooks/use-counter';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Metric {
  icon: string;
  label: string;
}

interface MetricsPanelProps {
  metrics: Metric[];
  visible: boolean;
}

function MetricCounter({ icon, label, visible }: { icon: string; label: string; visible: boolean }) {
  const IconComponent = (Icons[icon as keyof typeof Icons] as LucideIcon) || Icons.Activity;

  return (
    <motion.div
      className="flex items-center gap-2 text-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <IconComponent className="w-4 h-4 text-cyan-400" />
      <span className="text-white font-medium">{label}</span>
    </motion.div>
  );
}

export function MetricsPanel({ metrics, visible }: MetricsPanelProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 rounded-b-lg backdrop-blur-sm"
        >
          <div className="flex flex-col gap-2">
            {metrics.map((metric, index) => (
              <MetricCounter
                key={index}
                icon={metric.icon}
                label={metric.label}
                visible={visible}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
