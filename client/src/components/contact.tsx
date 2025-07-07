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
    <section id="contact" className="py-20 bg-surface-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
          Get In Touch
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex items-center p-4 bg-surface-elevated rounded-lg border border-gray-100">
                <div className="p-3 bg-tech-primary/10 rounded-lg mr-4">
                  <Mail className="text-tech-primary text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <p className="text-muted">{personal.email}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-surface-elevated rounded-lg border border-gray-100">
                <div className="p-3 bg-tech-primary/10 rounded-lg mr-4">
                  <Phone className="text-tech-primary text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                  <p className="text-muted">{personal.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-surface-elevated rounded-lg border border-gray-100">
                <div className="p-3 bg-tech-primary/10 rounded-lg mr-4">
                  <Linkedin className="text-tech-primary text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">LinkedIn</h3>
                  <p className="text-muted">{personal.linkedin}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-surface-elevated rounded-lg border border-gray-100">
                <div className="p-3 bg-tech-primary/10 rounded-lg mr-4">
                  <MapPin className="text-tech-primary text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                  <p className="text-muted">{personal.location}</p>
                </div>
              </div>
            </div>
            
            {/* Resume Download */}
            <div className="bg-surface-elevated p-8 rounded-xl shadow-tech border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download Resume</h3>
              <p className="text-muted mb-8 leading-relaxed">
                Get a detailed overview of my experience, skills, and achievements.
              </p>
              <Button 
                onClick={handleDownloadResume}
                className="bg-tech-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-tech-primary-dark transition-all duration-300 w-full shadow-tech text-lg"
              >
                <Download className="mr-3 h-5 w-5" />
                Download PDF Resume
              </Button>
              <div className="mt-6 text-center">
                <p className="text-muted text-sm">Last updated: January 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
