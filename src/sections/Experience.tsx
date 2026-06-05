import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

function TimelineItem({ exp, index }: { exp: { date: string, role: string, company: string, description: string }; index: number }) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!itemRef.current) return;
    const dot = itemRef.current.querySelector('.timeline-dot');
    const children = itemRef.current.querySelectorAll('.animate-item');
    const tl = gsap.timeline({ scrollTrigger: { trigger: itemRef.current, start: 'top 85%', toggleActions: 'play none none none' } });
    
    if (dot) tl.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' });
    if (children) tl.fromTo(children, { opacity: 0, filter: 'blur(6px)', y: 15 }, { opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.05, duration: 0.6, ease: 'power2.out' }, '-=0.2');
    
    return () => { tl.scrollTrigger?.kill(); };
  }, []);

  const isEven = index % 2 === 0;

  return (
    <div ref={itemRef} className="relative pl-12 md:pl-0 group">
      {/* Center Line and Dot */}
      <div className="absolute left-0 top-0 bottom-0 md:left-1/2 md:-translate-x-px">
        {/* Base faint line */}
        <div className="w-px h-full" style={{ backgroundColor: 'rgba(240, 240, 240, 0.06)' }} />
        
        {/* Glow effect on hover for the line */}
        <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.5), transparent)' }} />
        
        {/* Glowing Dot */}
        <div 
          className="timeline-dot absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full animate-scale-in transition-all duration-500 group-hover:scale-125" 
          style={{ 
            top: '32px', // Align with p-8 padding
            backgroundColor: '#d4af37', 
            transform: 'translate(-50%, 0) scale(0)', 
            animationDelay: `${0.1 + index * 0.2}s`,
            boxShadow: '0 0 10px rgba(212,175,55,0.4)'
          }} 
        >
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: '#d4af37', animationDuration: '3s' }} />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="md:grid md:grid-cols-2 md:gap-16 relative z-10">
        <div 
          className={`
            relative p-8 rounded-sm
            transition-all duration-500
            hover:bg-white/[0.02] border border-transparent hover:border-white/[0.06]
            ${isEven ? 'md:pr-12 md:text-right md:col-start-1' : 'md:pl-12 md:text-left md:col-start-2'}
          `}
          style={{ backdropFilter: 'blur(10px)' }}
        >
          {/* Subtle gradient background on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.03) 0%, transparent 100%)' }} />

          <span className="animate-item text-mono color-gold block mb-3 animate-fade-in-up" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', animationDelay: `${0.2 + index * 0.2}s` }}>
            {exp.date}
          </span>
          <h3 className="animate-item color-paper mb-2 animate-fade-in-up" style={{ fontSize: '1.5rem', fontWeight: 300, letterSpacing: '0.02em', animationDelay: `${0.25 + index * 0.2}s` }}>
            {exp.role}
          </h3>
          <p className="animate-item text-label color-dim mb-5 animate-fade-in-up" style={{ letterSpacing: '0.1em', animationDelay: `${0.3 + index * 0.2}s` }}>
            {exp.company}
          </p>
          <p className="animate-item text-body color-dim animate-fade-in-up" style={{ lineHeight: 1.8, animationDelay: `${0.35 + index * 0.2}s` }}>
            {exp.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const { t } = useLanguage();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    const words = headingRef.current.querySelectorAll('.word');
    const tl = gsap.timeline({ scrollTrigger: { trigger: headingRef.current, start: 'top 85%', toggleActions: 'play none none none' } });
    tl.fromTo(words, { opacity: 0, filter: 'blur(6px) brightness(50%)', skewX: -5 }, { opacity: 1, filter: 'blur(0px) brightness(100%)', skewX: 0, stagger: 0.03, duration: 0.8, ease: 'power2.out' });
    return () => { tl.scrollTrigger?.kill(); };
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ paddingTop: '180px', paddingBottom: '180px', backgroundColor: '#0a0a0a' }}>
      {/* Background luxury elements */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 70%)' }} />
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(240,240,240,0.05), transparent)' }} />
      
      <div className="mx-auto px-6 relative z-10" style={{ maxWidth: '1000px' }}>
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="text-label color-dim" style={{ letterSpacing: '0.2em' }}>— 04</span>
          <span className="text-label color-dim" style={{ letterSpacing: '0.15em' }}>{t('experience.label')}</span>
        </div>

        <h2 ref={headingRef} className="text-display-l color-paper mb-24 text-center">
          <span className="word inline-block animate-blur-reveal">{t('experience.title').split(' ')[0]}</span>{' '}
          <span className="word inline-block animate-blur-reveal" style={{ animationDelay: '0.03s' }}>{t('experience.title').split(' ').slice(1).join(' ')}</span>
        </h2>
        
        <div className="flex flex-col gap-8">
          {(t('experience.items') as unknown as any[]).map((exp, index) => (
            <TimelineItem key={index} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
