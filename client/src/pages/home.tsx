import { Navigation } from '@/components/navigation';
import { Hero } from '@/components/hero';
import { Stats } from '@/components/stats';
import { Experience } from '@/components/experience';
import { Projects } from '@/components/projects';
import { Skills } from '@/components/skills';
import { Education } from '@/components/education';
import { Awards } from '@/components/awards';
import { GitHubStats } from '@/components/github-stats';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
}
