import { useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { resumeData } from '@/data/resume-data';

export function Skills() {
  const { elementRef, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.3,
    freezeOnceVisible: true
  });

  return (
    <section id="skills" className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white slide-in-up">
          Skills
        </h2>
        
        <div ref={elementRef} className="grid md:grid-cols-2 gap-12">
          {Object.entries(resumeData.skills).map(([category, skills], index) => (
            <div key={category} className={`bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 card-hover scroll-reveal transition-colors`}>
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                <span className="ai-gradient-text-purple">{category}</span>
              </h3>
              <div className="space-y-1">
                {skills.map((skill) => (
                  <div key={skill.name} className="text-gray-700 dark:text-gray-300 flex items-center">
                    <span className="ai-gradient-text mr-2">•</span>
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface SkillBarProps {
  name: string;
  level: number;
  animate: boolean;
}

function SkillBar({ name, level, animate }: SkillBarProps) {
  const [animatedLevel, setAnimatedLevel] = useState(0);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimatedLevel(level);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [animate, level]);

  return (
    <div className="skill-item">
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-800 font-medium">{name}</span>
        <span className="text-tech-primary font-semibold text-sm">{level}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-tech-primary to-tech-secondary h-3 rounded-full transition-all duration-2000 ease-out shadow-sm"
          style={{ width: `${animatedLevel}%` }}
        />
      </div>
    </div>
  );
}
