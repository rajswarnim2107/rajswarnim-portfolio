import { useState } from 'react';
import { motion } from 'framer-motion';
import { resumeData } from '@/data/resume-data';
import { useCardTilt } from '@/hooks/use-card-tilt';
import { useMouseTracking } from '@/hooks/use-mouse-tracking';
import { GlowTrail, AnimatedBorder, MetricsPanel } from '@/components/effects';
import {
  Search,
  Bot,
  Brain,
  Video,
  Train,
  BarChart3,
  Users,
  ChartLine,
  Percent,
  Clock,
  ArrowUp,
  Zap,
  Database,
  Gauge
} from 'lucide-react';

const iconMap = {
  search: Search,
  robot: Bot,
  brain: Brain,
  video: Video,
  train: Train,
  'chart-area': BarChart3,
  users: Users,
  'chart-line': ChartLine,
  percentage: Percent,
  clock: Clock,
  'arrow-up': ArrowUp,
  stopwatch: Zap,
  database: Database,
  'tachometer-alt': Gauge
};

function ProjectCard({ project, index }: { project: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const { ref, transform, handleMouseMove, handleMouseLeave } = useCardTilt(5);
  const { x: mouseX, y: mouseY, isInside } = useMouseTracking(ref);
  const Icon = iconMap[project.icon as keyof typeof iconMap] || Brain;

  return (
    <motion.div
      ref={ref}
      layoutId={project.id}
      className="relative group overflow-hidden"
      style={{
        transform,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden'
      }}
      onMouseMove={(e) => {
        handleMouseMove(e);
      }}
      onMouseLeave={() => {
        handleMouseLeave();
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 15,
        delay: index * 0.08
      }}
    >
      {/* Effect 3: Glow Trail */}
      {isInside && <GlowTrail mouseX={mouseX} mouseY={mouseY} />}

      {/* Effect 3: Animated Border */}
      <AnimatedBorder visible={isHovered} />

      <div className="relative z-10 glass-card glass-hover p-6 rounded-lg transition-colors">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg">
            <Icon className="w-6 h-6" />
          </div>

          <motion.div layout className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              <span className="ai-gradient-text-purple">{project.title}</span>
            </h3>
          </motion.div>
        </div>

        <motion.p layout className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          {project.description}
        </motion.p>

        <motion.div layout className="flex flex-wrap gap-2">
          {project.technologies.map((tech: string) => (
            <motion.span
              key={tech}
              className="px-3 py-1 bg-gradient-to-r from-purple-400 to-indigo-400 text-white rounded-full text-sm shadow-sm hover:shadow-md transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Effect 4: Animated Metrics Panel */}
      {project.metrics && (
        <MetricsPanel metrics={project.metrics} visible={isHovered} />
      )}
    </motion.div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl font-bold mb-12 text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Projects
        </motion.h2>

        <div className="space-y-8">
          {resumeData.projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
