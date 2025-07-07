import { useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { resumeData } from '@/data/resume-data';

export function Skills() {
  const { elementRef, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.3,
    freezeOnceVisible: true
  });

  return (
    <section id="skills" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Technical Skills
        </h2>
        
        <div ref={elementRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(resumeData.skills).map(([category, skills]) => (
            <div key={category} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-6 text-gray-900">{category}</h3>
              <div className="space-y-4">
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
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700">{name}</span>
        <span className="text-tech-blue font-medium">{level}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-tech-blue h-2 rounded-full transition-all duration-2000 ease-out"
          style={{ width: `${animatedLevel}%` }}
        />
      </div>
    </div>
  );
}
