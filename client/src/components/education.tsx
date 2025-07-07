import { resumeData } from '@/data/resume-data';

export function Education() {
  return (
    <section id="education" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Education & Research
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Education */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Education</h3>
            <div className="space-y-6">
              {resumeData.education.map((edu) => (
                <div 
                  key={edu.degree}
                  className={`border-l-4 pl-4 ${
                    edu.primary ? 'border-tech-blue' : 'border-gray-400'
                  }`}
                >
                  <h4 className="text-lg font-semibold text-gray-900">{edu.degree}</h4>
                  <p className={`font-medium ${
                    edu.primary ? 'text-tech-blue' : 'text-gray-700'
                  }`}>
                    {edu.institution}
                  </p>
                  <p className="text-gray-600">{edu.period} | CGPA: {edu.cgpa}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Research & Publications */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Research & Publications</h3>
            <div className="space-y-6">
              {resumeData.research.map((research) => (
                <div 
                  key={research.title}
                  className={`border-l-4 pl-4 ${
                    research.primary ? 'border-tech-blue' : 'border-gray-400'
                  }`}
                >
                  <h4 className="text-lg font-semibold text-gray-900">{research.title}</h4>
                  <p className={`font-medium ${
                    research.primary ? 'text-tech-blue' : 'text-gray-700'
                  }`}>
                    {research.institution}
                  </p>
                  <p className="text-gray-600">{research.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
