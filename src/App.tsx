import { useLenis } from './hooks/useLenis';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import About from './sections/About';
import GoldenFlow from './sections/GoldenFlow';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Contact from './sections/Contact';
import Support from './sections/Support';
import Footer from './sections/Footer';

import { LanguageProvider } from './context/LanguageContext';

function App() {
  useLenis();

  return (
    <LanguageProvider>
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
