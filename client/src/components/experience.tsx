import { resumeData } from '@/data/resume-data';
import { Check } from 'lucide-react';

export function Experience() {
  return (
    <section id="experience" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Professional Experience
        </h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-tech-blue"></div>
          
          {/* Timeline items */}
          <div className="space-y-12">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className="relative flex items-center">
                <div className={`absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full border-4 border-white shadow-lg ${
                  exp.current ? 'bg-tech-blue' : 
                  index === 1 ? 'bg-tech-blue-dark' : 
                  index === 2 ? 'bg-gray-600' : 'bg-gray-500'
                }`}></div>
                
                <div className={`ml-16 md:ml-0 ${
                  index % 2 === 0 ? 'md:w-1/2 md:pr-8' : 'md:w-1/2 md:pl-8 md:ml-auto'
                }`}>
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                      <span className="text-sm text-tech-blue font-medium">{exp.period}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{exp.department} | {exp.company}</p>
                    
                    <ul className="space-y-2 text-gray-600">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="text-tech-blue mt-1 mr-3 h-4 w-4 flex-shrink-0" />
                          <span>{achievement}</span>
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
