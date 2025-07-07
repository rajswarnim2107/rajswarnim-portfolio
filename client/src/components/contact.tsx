import { resumeData } from '@/data/resume-data';
import { Mail, Phone, Linkedin, MapPin, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Contact() {
  const { personal } = resumeData;

  const handleDownloadResume = () => {
    // In a real application, this would trigger a download
    console.log('Download resume');
  };

  return (
    <section id="contact" className="py-16 bg-surface-elevated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Let's Build Something Amazing Together
              </h2>
              <p className="text-white/90 text-lg max-w-2xl mx-auto">
                Open to exciting opportunities in AI/ML research and technical architecture roles.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <a href={`mailto:${personal.email}`} className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 group">
                <Mail className="text-white text-xl mr-3 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-white/80 text-sm">Email</div>
                  <div className="text-white font-medium text-sm">{personal.email}</div>
                </div>
              </a>
              
              <a href={`tel:${personal.phone}`} className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 group">
                <Phone className="text-white text-xl mr-3 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-white/80 text-sm">Phone</div>
                  <div className="text-white font-medium text-sm">{personal.phone}</div>
                </div>
              </a>
              
              <a href="#" className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 group">
                <Linkedin className="text-white text-xl mr-3 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-white/80 text-sm">LinkedIn</div>
                  <div className="text-white font-medium text-sm">Connect</div>
                </div>
              </a>
              
              <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <MapPin className="text-white text-xl mr-3" />
                <div>
                  <div className="text-white/80 text-sm">Location</div>
                  <div className="text-white font-medium text-sm">{personal.location}</div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={handleDownloadResume}
                className="bg-white text-tech-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-tech text-lg"
              >
                <Download className="mr-3 h-5 w-5" />
                Download Resume
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
