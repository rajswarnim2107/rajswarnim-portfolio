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
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Get In Touch
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-center">
                <Mail className="text-tech-blue text-xl mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">{personal.email}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="text-tech-blue text-xl mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">{personal.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Linkedin className="text-tech-blue text-xl mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">LinkedIn</h3>
                  <p className="text-gray-600">{personal.linkedin}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="text-tech-blue text-xl mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                  <p className="text-gray-600">{personal.location}</p>
                </div>
              </div>
            </div>
            
            {/* Resume Download */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Download Resume</h3>
              <p className="text-gray-600 mb-6">
                Get a detailed overview of my experience, skills, and achievements.
              </p>
              <Button 
                onClick={handleDownloadResume}
                className="bg-tech-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-tech-blue-dark transition-colors w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF Resume
              </Button>
              <div className="mt-4 text-center">
                <p className="text-gray-500 text-sm">Last updated: January 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
