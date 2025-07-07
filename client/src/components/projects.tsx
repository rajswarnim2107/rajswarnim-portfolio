import { resumeData } from '@/data/resume-data';
import { Button } from '@/components/ui/button';
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
    <section id="projects" className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white slide-in-up">
          Projects
        </h2>
        
        <div className="space-y-8">
          {resumeData.projects.map((project, index) => (
            <div key={project.id} className={`bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 card-hover scroll-reveal transition-colors`}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                <span className="ai-gradient-text-purple">{project.title}</span>
              </h3>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{project.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span 
                    key={tech}
                    className="px-3 py-1 bg-gradient-to-r from-purple-400 to-indigo-400 text-white rounded-full text-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            variant="outline"
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors button-hover"
          >
            View My Resume
          </Button>
        </div>
      </div>
    </section>
  );
}
