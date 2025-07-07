import { GitBranch, Star, Users, Code } from 'lucide-react';

const githubStats = [
  { icon: GitBranch, label: 'Repositories', value: '50+' },
  { icon: Star, label: 'Stars Earned', value: '200+' },
  { icon: Users, label: 'Followers', value: '150+' },
  { icon: Code, label: 'Commits', value: '2K+' }
];

const techStack = [
  'Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Docker', 'Kubernetes',
  'AWS', 'Apache Spark', 'MLflow', 'FastAPI', 'React', 'TypeScript'
];

export function GitHubStats() {
  return (
    <section id="github" className="py-16 bg-surface-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            GitHub Portfolio
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Building the future of AI/ML through open source contributions and innovative projects
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {githubStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.label} className="bg-surface-elevated p-6 rounded-xl border border-gray-100 text-center hover:shadow-tech transition-all duration-300">
                <IconComponent className="text-tech-primary text-3xl mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-muted">{stat.label}</div>
              </div>
            );
          })}
        </div>
        
        <div className="bg-surface-elevated p-8 rounded-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Tech Stack</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {techStack.map((tech) => (
              <span 
                key={tech}
                className="px-4 py-2 bg-tech-primary/10 text-tech-primary rounded-full text-sm font-medium hover:bg-tech-primary/20 transition-colors duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}