import { useLenis } from './hooks/useLenis';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import About from './sections/About';
import GoldenFlow from './sections/GoldenFlow';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Support from './sections/Support';
import Footer from './sections/Footer';
import Cursor from './sections/Cursor';
import ScrollProgress from './sections/ScrollProgress';
import BackToTop from './sections/BackToTop';

import { LanguageProvider } from './context/LanguageContext';

function App() {
  useLenis();

  return (
    <LanguageProvider>
      {/* Global UI overlays */}
      <Cursor />
      <ScrollProgress />
      <BackToTop />

      <div className="relative" style={{ backgroundColor: '#0a0a0a' }}>
        <Navigation />
        <Hero />
        <div id="about">
          <About />
        </div>
        <GoldenFlow />
        <div id="projects">
          <Projects />
        </div>
        <div id="skills">
          <Skills />
        </div>
        <div id="experience">
          <Experience />
        </div>
        <div id="testimonials">
          <Testimonials />
        </div>
        <div id="contact">
          <Contact />
        </div>
        <div id="support">
          <Support />
        </div>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
