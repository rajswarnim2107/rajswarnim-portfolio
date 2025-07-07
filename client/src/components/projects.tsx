import { resumeData } from '@/data/resume-data';
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

export function Projects() {
  return (
    <section id="projects" className="py-20 bg-surface-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
          Key Projects
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resumeData.projects.map((project) => {
            const IconComponent = iconMap[project.icon as keyof typeof iconMap];
            
            return (
              <div key={project.id} className="bg-surface-elevated rounded-xl p-8 hover:shadow-tech-lg transition-all duration-300 border border-gray-100 group">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-tech-primary/10 rounded-lg mr-4 group-hover:bg-tech-primary/20 transition-colors duration-300">
                    <IconComponent className="text-tech-primary text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">{project.description}</p>
                
                <div className="space-y-3 mb-6">
                  {project.metrics.map((metric, i) => {
                    const MetricIcon = iconMap[metric.icon as keyof typeof iconMap];
                    return (
                      <div key={i} className="flex items-center text-sm text-gray-700">
                        <MetricIcon className="text-tech-accent mr-3 h-4 w-4" />
                        <span className="font-medium">{metric.label}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="px-3 py-1 bg-tech-primary/10 text-tech-primary rounded-full text-sm font-medium hover:bg-tech-primary/20 transition-colors duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
