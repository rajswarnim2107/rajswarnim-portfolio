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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Awards & Recognition
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resumeData.awards.map((award) => {
            const IconComponent = iconMap[award.icon as keyof typeof iconMap];
            
            return (
              <div key={award.title} className="bg-white p-6 rounded-lg shadow-md text-center">
                <IconComponent className="text-tech-blue text-3xl mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{award.title}</h3>
                <p className="text-gray-600 text-sm">{award.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
