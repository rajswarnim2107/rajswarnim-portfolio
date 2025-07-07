import { resumeData } from '@/data/resume-data';
import { Check } from 'lucide-react';

export function Experience() {
  return (
    <section id="experience" className="py-20 bg-surface-elevated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
          Professional Experience
        </h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-tech-primary to-tech-secondary rounded-full"></div>
          
          {/* Timeline items */}
          <div className="space-y-16">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className="relative flex items-center">
                <div className={`absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-10 h-10 rounded-full border-4 border-white shadow-tech ${
                  exp.current ? 'bg-tech-primary' : 
                  index === 1 ? 'bg-tech-secondary' : 
                  index === 2 ? 'bg-tech-accent' : 'bg-gray-500'
                }`}></div>
                
                <div className={`ml-20 md:ml-0 ${
                  index % 2 === 0 ? 'md:w-1/2 md:pr-8' : 'md:w-1/2 md:pl-8 md:ml-auto'
                }`}>
                  <div className="bg-surface-card p-8 rounded-xl shadow-tech hover:shadow-tech-lg transition-all duration-300 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">{exp.title}</h3>
                      <span className="text-sm text-tech-primary font-semibold bg-tech-primary/10 px-3 py-1 rounded-full">{exp.period}</span>
                    </div>
                    
                    <p className="text-muted mb-6 text-lg font-medium">{exp.department} | {exp.company}</p>
                    
                    <ul className="space-y-3 text-gray-700">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="text-tech-accent mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                          <span className="leading-relaxed">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
