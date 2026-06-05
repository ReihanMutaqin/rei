import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

function SkillCard({ skill, index }: { skill: { name: string, proficiency: number }; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !barRef.current) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: cardRef.current, start: 'top 85%', toggleActions: 'play none none none' } });
    tl.fromTo(cardRef.current, { opacity: 0, filter: 'blur(6px)', y: 30 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.8, ease: 'power2.out', delay: index * 0.08 });
    tl.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.out' }, '-=0.3');
    return () => { tl.scrollTrigger?.kill(); };
  }, [index]);

  return (
    <div ref={cardRef} className="relative p-8 transition-all duration-300 group cursor-default animate-fade-in-up" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(240, 240, 240, 0.06)', animationDelay: `${index * 0.08}s` }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.3)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.03)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240, 240, 240, 0.06)'; }}>
      <div className="w-12 h-12 mb-6 flex items-center justify-center transition-all duration-300" style={{ border: '1px solid #d4af37', borderRadius: '4px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
          <line x1="12" y1="22" x2="12" y2="15.5" />
          <polyline points="22 8.5 12 15.5 2 8.5" />
        </svg>
      </div>
      <h3 className="text-heading color-paper mb-6">{skill.name}</h3>
      <div className="relative w-full" style={{ height: '2px', backgroundColor: 'rgba(240, 240, 240, 0.12)' }}>
        <div ref={barRef} className="absolute top-0 left-0 h-full origin-left" style={{ width: `${skill.proficiency}%`, backgroundColor: '#d4af37', transform: 'scaleX(0)' }} />
      </div>
      <span className="text-mono color-gold mt-3 block" style={{ fontSize: '0.75rem' }}>{skill.proficiency}%</span>
    </div>
  );
}

export default function Skills() {
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
    <section className="relative w-full" style={{ paddingTop: '180px', paddingBottom: '180px', backgroundColor: '#0a0a0a' }}>
      <div className="mx-auto px-6" style={{ maxWidth: '1400px' }}>
        <h2 ref={headingRef} className="text-display-l color-paper mb-20">
          <span className="word inline-block animate-blur-reveal">{t('skills.title').split(' ')[0]}</span>{' '}
          <span className="word inline-block animate-blur-reveal" style={{ animationDelay: '0.03s' }}>{t('skills.title').split(' ').slice(1).join(' ')}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {(t('skills.items') as unknown as any[]).map((skill, index) => (
            <SkillCard key={index} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
