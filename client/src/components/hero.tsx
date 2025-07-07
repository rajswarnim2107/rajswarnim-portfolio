import { resumeData } from '@/data/resume-data';
import { Button } from '@/components/ui/button';

export function Hero() {
  const { personal, specializations, stats } = resumeData;

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="pt-24 pb-16 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="slide-in-left">
            <div className="mb-4">
              <span className="text-lg text-gray-600 dark:text-gray-400">Hello(); I'm</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="ai-gradient-text-purple">Raj Swarnim.</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              I design & code for <span className="ai-gradient-text">AI/ML systems.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 slide-in-left animate-delay-200">
              Technical Architect with 8+ years of experience building ML systems that serve millions of users daily. 
              I love transforming complex AI research into scalable products.
            </p>
            <div className="space-y-4 slide-in-left animate-delay-400">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <span>I value clean architecture, innovative solutions, and impactful AI applications.</span>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 slide-in-left animate-delay-600">
              <Button 
                onClick={() => scrollToSection('#contact')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 button-hover"
              >
                Let's Talk!
              </Button>
              <Button 
                variant="outline"
                onClick={() => scrollToSection('#projects')}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors button-hover"
              >
                View Projects
              </Button>
            </div>
          </div>
          
          {/* Profile Image */}
          <div className="flex justify-center slide-in-right">
            <div className="relative">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 p-1 float-animation pulse-glow">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                  <div className="w-56 h-56 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 flex items-center justify-center">
                    <span className="text-6xl font-bold ai-gradient-text-purple">RS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 fade-in animate-delay-800">
          {stats.map((stat, index) => (
            <div key={index} className="text-center card-hover">
              <div className="text-2xl md:text-3xl font-bold ai-gradient-text mb-2">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
