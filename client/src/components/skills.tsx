import { useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { resumeData } from '@/data/resume-data';

export function Skills() {
  const { elementRef, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.3,
    freezeOnceVisible: true
  });

  return (
    <section id="skills" className="py-20 bg-surface-elevated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
          Technical Skills
        </h2>
        
        <div ref={elementRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(resumeData.skills).map(([category, skills]) => (
            <div key={category} className="bg-surface-card p-8 rounded-xl shadow-tech border border-gray-100">
              <h3 className="text-2xl font-bold mb-8 text-gray-900">{category}</h3>
              <div className="space-y-6">
                {skills.map((skill) => (
                  <SkillBar 
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    animate={hasBeenVisible}
                  />
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
