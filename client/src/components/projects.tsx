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
    <section id="projects" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Key Projects
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resumeData.projects.map((project) => {
            const IconComponent = iconMap[project.icon as keyof typeof iconMap];
            
            return (
              <div key={project.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <IconComponent className="text-tech-blue text-2xl mr-3" />
                  <h3 className="text-xl font-bold">{project.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="space-y-2 mb-4">
                  {project.metrics.map((metric, i) => {
                    const MetricIcon = iconMap[metric.icon as keyof typeof iconMap];
                    return (
                      <div key={i} className="flex items-center text-sm text-gray-700">
                        <MetricIcon className="text-tech-blue mr-2 h-4 w-4" />
                        <span>{metric.label}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-1 bg-tech-blue/10 text-tech-blue rounded text-xs"
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
