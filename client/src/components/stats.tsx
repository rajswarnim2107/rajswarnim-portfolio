import { useCounter } from '@/hooks/use-counter';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { resumeData } from '@/data/resume-data';

export function Stats() {
  const { elementRef, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.5,
    freezeOnceVisible: true
  });

  return (
    <section ref={elementRef} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {resumeData.stats.map((stat, index) => (
            <StatCard 
              key={index}
              {...stat}
              startAnimation={hasBeenVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface StatCardProps {
  value: number;
  label: string;
  suffix: string;
  startAnimation: boolean;
}

function StatCard({ value, label, suffix, startAnimation }: StatCardProps) {
  const count = useCounter(value, 2000, startAnimation);

  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-tech-blue mb-2">
        {count}{suffix}
      </div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  );
}
