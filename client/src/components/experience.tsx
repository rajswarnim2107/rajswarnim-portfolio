import { resumeData } from '@/data/resume-data';
import { Check } from 'lucide-react';

export function Experience() {
  return (
    <section id="experience" className="py-16 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white slide-in-up">
          Experience
        </h2>
        
        <div className="space-y-8">
          {resumeData.experience.map((exp, index) => (
            <div key={exp.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 card-hover scroll-reveal transition-colors">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    <span className="ai-gradient-text">{exp.company}</span>
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300">{exp.title}</p>
                </div>
                <span className="text-sm text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full mt-2 md:mt-0">{exp.period}</span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">{exp.department}</p>
              
              <div className="text-gray-700 dark:text-gray-200 leading-relaxed">
                {exp.achievements.map((achievement, i) => (
                  <p key={i} className="mb-2">
                    {achievement}
                  </p>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {index === 0 && ['LLM', 'RAG', 'Personalization', 'Entity Extraction'].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                    {tech}
                  </span>
                ))}
                {index === 1 && ['Reinforcement Learning', 'Thompson Sampling', 'Real-time ML', 'Computer Vision'].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-tech-primary text-white rounded text-sm">
                    {tech}
                  </span>
                ))}
                {index === 2 && ['Anomaly Detection', 'Forecasting', 'Real-time Systems', 'Cache Optimization'].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-tech-primary text-white rounded text-sm">
                    {tech}
                  </span>
                ))}
                {index === 3 && ['Time Series', 'ARIMA', 'A/B Testing', 'ETA Prediction'].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-tech-primary text-white rounded text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
