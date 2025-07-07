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
    <section id="contact" className="py-16 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 card-hover scroll-reveal transition-colors">
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            Open to exciting opportunities in AI/ML research and technical architecture roles.
          </p>
          <Button 
            onClick={handleDownloadResume}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 button-hover mb-6"
          >
            View My Resume
          </Button>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            <p>📧 {personal.email}</p>
            <p>📍 {personal.location}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
