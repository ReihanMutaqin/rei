import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { title: 'AR Book — Dasar Komputer', description: 'An Augmented Reality education application that brings computer basics to life through 3D interactive animations triggered by scanning physical textbook pages.', year: '2024', tags: ['AR', 'EDUCATION', 'UNITY'], image: '/images/project-ar-book.jpg' },
  { title: 'Petualangan Barudak', description: 'An educational adventure game that introduces Indonesian geography and 3D geometry concepts through exploration, interactive quizzes, and real-world building visualizations.', year: '2024', tags: ['GAME', 'EDUCATION'], image: '/images/project-petualangan.jpg' },
  { title: 'ReLive AR', description: 'An AR-based live photo application that transforms static images into interactive experiences using real-time 3D overlays and spatial tracking.', year: '2025', tags: ['AR', 'MOBILE'], image: '/images/project-relive.jpg' },
  { title: 'Game Edukasi Penyusun Kata', description: 'An interactive word-building educational game where players arrange scrambled letters into correct Indonesian words based on visual clues and hints.', year: '2025', tags: ['GAME', 'EDUCATION'], image: '/images/project-wordgame.jpg' },
  { title: '43 Berita Kita', description: 'A responsive news portal website with dynamic content management, category systems, and publication workflows — built as a platform for delivering local and general news.', year: '2024', tags: ['WEB', 'CMS'], image: '/images/project-berita.jpg' },
  { title: 'E-Commerce Platform', description: 'A full-featured online shop system with product catalog, search, category filtering, shopping cart, checkout automation, and admin dashboard for inventory management.', year: '2023', tags: ['WEB', 'E-COMMERCE'], image: '/images/project-ecommerce.jpg' },
];

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;
    const img = cardRef.current.querySelector('.project-img');
    const title = cardRef.current.querySelector('.project-title');
    const tags = cardRef.current.querySelector('.project-tags');
    const tl = gsap.timeline({ scrollTrigger: { trigger: cardRef.current, start: 'top 85%', toggleActions: 'play none none none' } });
    if (img) tl.fromTo(img, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.8, ease: 'power3.inOut' });
    if (title) tl.fromTo(title, { opacity: 0, filter: 'blur(6px) brightness(50%)', skewX: -5 }, { opacity: 1, filter: 'blur(0px) brightness(100%)', skewX: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
    if (tags) tl.fromTo(tags, { opacity: 0, filter: 'blur(4px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' }, '-=0.2');
    return () => { tl.scrollTrigger?.kill(); };
  }, []);

  const isOdd = index % 2 === 0;
  return (
    <div ref={cardRef} className="relative group cursor-pointer" style={{ transform: isOdd ? 'translateY(-60px)' : 'translateY(60px)' }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="relative overflow-hidden transition-all duration-500" style={{ backgroundColor: isHovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)', border: '1px solid rgba(240, 240, 240, 0.06)' }}>
        <span className="absolute top-4 right-4 z-10 text-mono color-gold" style={{ fontSize: '0.75rem' }}>{project.year}</span>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={project.image} alt={project.title} className="project-img w-full h-full object-cover transition-all duration-600 animate-clip-reveal" style={{ filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)', transform: isHovered ? 'scale(1.03)' : 'scale(1)' }} />
        </div>
        <div className="p-6">
          <div className="project-tags flex flex-wrap gap-2 mb-3 animate-blur-reveal" style={{ animationDelay: `${0.2 + index * 0.06}s` }}>
            {project.tags.map((tag, i) => (
              <span key={i} className="text-label color-dim">{tag}{i < project.tags.length - 1 && <span className="ml-2 color-dim">·</span>}</span>
            ))}
          </div>
          <h3 className="project-title text-heading color-paper mb-3 animate-blur-reveal" style={{ animationDelay: `${0.3 + index * 0.06}s` }}>{project.title}</h3>
          <div className="project-desc overflow-hidden transition-all duration-400" style={{ maxHeight: isHovered ? '120px' : '0px', opacity: isHovered ? 1 : 0, filter: isHovered ? 'blur(0px)' : 'blur(6px)' }}>
            <p className="text-body color-dim">{project.description}</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold transition-transform duration-500 origin-left" style={{ transform: isHovered ? 'scaleX(1)' : 'scaleX(0)' }} />
      </div>
    </div>
  );
}

export default function Projects() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    const words = headingRef.current.querySelectorAll('.word');
    const tl = gsap.timeline({ scrollTrigger: { trigger: headingRef.current, start: 'top 85%', toggleActions: 'play none none none' } });
    tl.fromTo(words, { opacity: 0, filter: 'blur(6px) brightness(50%)', skewX: -5 }, { opacity: 1, filter: 'blur(0px) brightness(100%)', skewX: 0, stagger: 0.03, duration: 0.8, ease: 'power2.out' });
    return () => { tl.scrollTrigger?.kill(); };
  }, []);

  return (
    <section className="relative w-full" style={{ paddingTop: '180px', paddingBottom: '180px', backgroundColor: '#0a0a0a' }}>
      <div className="mx-auto px-6" style={{ maxWidth: '1400px' }}>
        <h2 ref={headingRef} className="text-display-l color-paper mb-20">
          <span className="word inline-block animate-blur-reveal">SELECTED</span>{' '}
          <span className="word inline-block animate-blur-reveal" style={{ animationDelay: '0.03s' }}>WORKS</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
