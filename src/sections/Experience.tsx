import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  { date: '2024 – Present', role: 'Freelance Developer', company: 'Self-Employed', description: 'Building games, AR experiences, and web applications for clients across education and entertainment sectors.' },
  { date: '2022 – 2024', role: 'Lead Developer', company: 'Himpunan Mahasiswa PTI', description: 'Led a 12-person technical team in developing educational software and organizing technology workshops for 200+ students.' },
  { date: '2020 – 2024', role: 'Computer Science Student', company: 'Universitas Bina Bangsa', description: 'Studied at Universitas Bina Bangsa with a focus on game development, graduating with a 3.96 GPA.' },
];

function TimelineItem({ exp, index }: { exp: (typeof experiences)[0]; index: number }) {
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

  return (
    <div ref={itemRef} className="relative pl-12 md:pl-0">
      <div className="absolute left-0 top-0 bottom-0 md:left-1/2 md:-translate-x-px">
        <div className="w-px h-full" style={{ backgroundColor: 'rgba(240, 240, 240, 0.12)' }} />
        <div className="timeline-dot absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full animate-scale-in" style={{ backgroundColor: '#d4af37', transform: 'translate(-50%, 0) scale(0)', animationDelay: `${0.1 + index * 0.2}s` }} />
      </div>
      <div className={`md:grid md:grid-cols-2 md:gap-16 ${index % 2 === 0 ? '' : 'md:text-right'}`}>
        <div className={index % 2 === 0 ? 'md:pr-16' : 'md:order-2 md:pl-16'}>
          <span className="animate-item text-mono color-gold block mb-2 animate-fade-in-up" style={{ fontSize: '0.75rem', animationDelay: `${0.2 + index * 0.2}s` }}>{exp.date}</span>
          <h3 className="animate-item text-heading color-paper mb-1 animate-fade-in-up" style={{ animationDelay: `${0.25 + index * 0.2}s` }}>{exp.role}</h3>
          <p className="animate-item text-body-large color-dim mb-3 animate-fade-in-up" style={{ animationDelay: `${0.3 + index * 0.2}s` }}>{exp.company}</p>
          <p className="animate-item text-body color-dim animate-fade-in-up" style={{ animationDelay: `${0.35 + index * 0.2}s` }}>{exp.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
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
      <div className="mx-auto px-6" style={{ maxWidth: '800px' }}>
        <h2 ref={headingRef} className="text-display-l color-paper mb-20 text-center">
          <span className="word inline-block animate-blur-reveal">THE</span>{' '}
          <span className="word inline-block animate-blur-reveal" style={{ animationDelay: '0.03s' }}>PATH</span>
        </h2>
        <div className="flex flex-col gap-20">
          {experiences.map((exp, index) => (
            <TimelineItem key={index} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
