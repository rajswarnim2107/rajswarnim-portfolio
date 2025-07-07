import { resumeData } from '@/data/resume-data';
import { Button } from '@/components/ui/button';

export function Hero() {
  const { personal, specializations } = resumeData;

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="pt-20 pb-16 bg-gradient-to-br from-tech-blue-light to-tech-blue-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <img 
              src={personal.photo}
              alt={`${personal.name} - Professional headshot`}
              className="w-32 h-32 rounded-full mx-auto shadow-lg ring-4 ring-white/20"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
            {personal.name}
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 animate-slide-up">
            {personal.title} | 8+ Years Experience
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <span className="text-blue-100 text-lg">Specializing in:</span>
            <div className="flex flex-wrap gap-2 justify-center">
              {specializations.map((spec) => (
                <span 
                  key={spec}
                  className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex justify-center space-x-4">
            <Button 
              onClick={() => scrollToSection('#contact')}
              className="bg-white text-tech-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get In Touch
            </Button>
            <Button 
              variant="outline"
              onClick={() => scrollToSection('#projects')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-tech-blue transition-colors"
            >
              View Projects
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
