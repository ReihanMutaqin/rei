import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    if (headingRef.current) {
      const chars = headingRef.current.querySelectorAll('.char');
      const tl = gsap.timeline({ scrollTrigger: { trigger: headingRef.current, start: 'top 85%', toggleActions: 'play none none none' } });
      tl.fromTo(chars, { opacity: 0, filter: 'blur(8px)', y: 20 }, { opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.02, duration: 0.6, ease: 'power2.out' });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    if (textRef.current) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: textRef.current, start: 'top 85%', toggleActions: 'play none none none' } });
      tl.fromTo(textRef.current, { opacity: 0, filter: 'blur(6px)', y: 20 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.8, ease: 'power2.out', delay: 0.3 });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    if (emailRef.current) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: emailRef.current, start: 'top 85%', toggleActions: 'play none none none' } });
      tl.fromTo(emailRef.current, { opacity: 0, filter: 'blur(6px)', y: 20 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.8, ease: 'power2.out', delay: 0.5 });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    if (socialsRef.current) {
      const links = socialsRef.current.querySelectorAll('a');
      const tl = gsap.timeline({ scrollTrigger: { trigger: socialsRef.current, start: 'top 90%', toggleActions: 'play none none none' } });
      tl.fromTo(links, { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out', delay: 0.7 });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    return () => { triggers.forEach((st) => st.kill()); };
  }, []);

  const headingText = "LET'S CONNECT";

  return (
    <section className="relative w-full" style={{ paddingTop: '180px', paddingBottom: '180px', background: 'linear-gradient(to bottom, #0a0a0a 0%, #0e0c08 100%)' }}>
      <div className="mx-auto px-6 text-center" style={{ maxWidth: '900px', width: '100%' }}>
        <h2
          ref={headingRef}
          className="color-paper mb-12"
          style={{
            fontWeight: 200,
            fontSize: 'clamp(2.8rem, 10vw, 7rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {headingText.split('').map((char, i) => (
            <span key={i} className="char inline-block animate-fade-in-up" style={{ animationDelay: `${i * 0.02}s` }}>{char === ' ' ? '\u00A0' : char}</span>
          ))}
        </h2>
        <p ref={textRef} className="text-body-large color-dim mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          Have a project in mind or want to collaborate? I'm always open to discussing new opportunities in game development, AR experiences, or web applications.
        </p>
        <a ref={emailRef} href="mailto:reyhanmutakin1@gmail.com" className="text-display-l color-paper mb-12 inline-block relative group animate-fade-in-up" style={{ fontWeight: 300, animationDelay: '0.5s' }}>
          <span className="relative z-10 transition-colors duration-300 group-hover:color-gold">reyhanmutakin1@gmail.com</span>
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-gold transition-all duration-500 origin-center" style={{ width: '0%' }}
            ref={(el) => {
              if (!el) return;
              const parent = el.parentElement;
              if (!parent) return;
              parent.addEventListener('mouseenter', () => { el.style.width = '100%'; });
              parent.addEventListener('mouseleave', () => { el.style.width = '0%'; });
            }} />
        </a>
        <div ref={socialsRef} className="flex items-center justify-center gap-4">
          {['GITHUB', 'LINKEDIN', 'INSTAGRAM'].map((name, i) => (
            <span key={name} className="flex items-center gap-4">
              <a href="#" className="text-label color-dim transition-colors duration-300 hover:color-paper animate-fade-in" style={{ animationDelay: `${0.7 + i * 0.1}s` }} onClick={(e) => e.preventDefault()}>{name}</a>
              {i < 2 && <span className="color-dim">·</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
