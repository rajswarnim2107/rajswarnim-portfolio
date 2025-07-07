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
    <section id="home" className="pt-20 pb-20 bg-gradient-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="mb-10">
            <img 
              src={personal.photo}
              alt={`${personal.name} - Professional headshot`}
              className="w-40 h-40 rounded-full mx-auto shadow-tech-lg ring-4 ring-white/30 border-4 border-white/20"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in tracking-tight">
            {personal.name}
          </h1>
          
          <p className="text-xl md:text-3xl text-white/90 mb-12 animate-slide-up font-light">
            {personal.title}
          </p>
          
          <div className="mb-10">
            <span className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-lg font-medium backdrop-blur-sm">
              8+ Years Experience in AI/ML
            </span>
          </div>
          
          <div className="flex flex-col gap-6 justify-center items-center animate-slide-up">
            <span className="text-white/80 text-lg font-light">Specializing in:</span>
            <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
              {specializations.map((spec) => (
                <span 
                  key={spec}
                  className="px-6 py-3 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm hover:bg-white/30 transition-all duration-300 border border-white/20"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => scrollToSection('#contact')}
              className="bg-white text-tech-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-tech text-lg"
            >
              Get In Touch
            </Button>
            <Button 
              variant="outline"
              onClick={() => scrollToSection('#projects')}
              className="border-2 border-white/40 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-tech-primary transition-all duration-300 backdrop-blur-sm text-lg"
            >
              View Projects
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
