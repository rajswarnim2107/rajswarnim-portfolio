import { resumeData } from '@/data/resume-data';

export function Education() {
  return (
    <section id="education" className="py-20 bg-surface-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
          Education & Research
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Education */}
          <div className="bg-surface-elevated p-8 rounded-xl shadow-tech border border-gray-100">
            <h3 className="text-3xl font-bold mb-8 text-gray-900">Education</h3>
            <div className="space-y-8">
              {resumeData.education.map((edu) => (
                <div 
                  key={edu.degree}
                  className={`border-l-4 pl-6 ${
                    edu.primary ? 'border-tech-primary' : 'border-gray-400'
                  }`}
                >
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{edu.degree}</h4>
                  <p className={`font-semibold text-lg mb-1 ${
                    edu.primary ? 'text-tech-primary' : 'text-gray-700'
                  }`}>
                    {edu.institution}
                  </p>
                  <p className="text-muted">{edu.period} | CGPA: {edu.cgpa}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Research & Publications */}
          <div className="bg-surface-elevated p-8 rounded-xl shadow-tech border border-gray-100">
            <h3 className="text-3xl font-bold mb-8 text-gray-900">Research & Publications</h3>
            <div className="space-y-8">
              {resumeData.research.map((research) => (
                <div 
                  key={research.title}
                  className={`border-l-4 pl-6 ${
                    research.primary ? 'border-tech-primary' : 'border-gray-400'
                  }`}
                >
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{research.title}</h4>
                  <p className={`font-semibold text-lg mb-2 ${
                    research.primary ? 'text-tech-primary' : 'text-gray-700'
                  }`}>
                    {research.institution}
                  </p>
                  <p className="text-gray-700 leading-relaxed">{research.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
