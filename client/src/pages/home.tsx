import { Navigation } from '@/components/navigation';
import { Hero } from '@/components/hero';
import { Stats } from '@/components/stats';
import { Experience } from '@/components/experience';
import { Projects } from '@/components/projects';
import { Skills } from '@/components/skills';
import { Education } from '@/components/education';
import { Awards } from '@/components/awards';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Hero />
      <Stats />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Awards />
      <Contact />
      <Footer />
    </div>
  );
}
