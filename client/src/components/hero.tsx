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
    <section id="home" className="pt-24 pb-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/3">
            <img 
              src={personal.photo}
              alt={`${personal.name} - Professional headshot`}
              className="w-48 h-48 rounded-full mx-auto shadow-lg"
            />
          </div>
          
          <div className="md:w-2/3 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {personal.name}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {personal.title} at {personal.company}
            </p>
            
            <div className="prose prose-lg text-gray-700 leading-relaxed">
              <p>
                I am a seasoned AI/ML Engineer with <strong>8 years of experience</strong> in Applied AI Research & Data Science 
                from <strong>Indian Institute of Technology, Hyderabad</strong> with a specialisation in Machine Learning and Deep Learning Applications. 
                I have deep analytical expertise in designing and implementing AI/ML algorithms, including LLM-based applications.
              </p>
              <p className="mt-4">
                <strong>When I'm not building AI systems</strong>, you can find me mentoring junior engineers, 
                contributing to open source projects, or exploring the latest research in reinforcement learning and computer vision.
              </p>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => scrollToSection('#contact')}
                className="bg-tech-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-tech-primary-dark transition-colors"
              >
                Get In Touch
              </Button>
              <Button 
                variant="outline"
                onClick={() => scrollToSection('#projects')}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                View Projects
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
