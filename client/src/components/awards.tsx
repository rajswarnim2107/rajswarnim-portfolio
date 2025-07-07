import { resumeData } from '@/data/resume-data';
import { Trophy, Medal, Code, Star } from 'lucide-react';

const iconMap = {
  trophy: Trophy,
  medal: Medal,
  code: Code,
  star: Star
};

export function Awards() {
  return (
    <section className="py-20 bg-surface-elevated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
          Awards & Recognition
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {resumeData.awards.map((award) => {
            const IconComponent = iconMap[award.icon as keyof typeof iconMap];
            
            return (
              <div key={award.title} className="bg-surface-card p-8 rounded-xl shadow-tech text-center border border-gray-100 hover:shadow-tech-lg transition-all duration-300">
                <div className="p-4 bg-tech-primary/10 rounded-lg w-fit mx-auto mb-6">
                  <IconComponent className="text-tech-primary text-4xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{award.title}</h3>
                <p className="text-muted leading-relaxed">{award.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
