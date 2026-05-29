import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 8, suffix: '+', label: 'Projects Completed' },
  { value: 3, suffix: '+', label: 'Years Freelancing' },
  { value: 3.96, suffix: '', label: 'GPA', isDecimal: true },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const triggers: ScrollTrigger[] = [];

    if (headingRef.current) {
      const words = headingRef.current.querySelectorAll('.word');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%', toggleActions: 'play none none none' },
      });
      tl.fromTo(words, { opacity: 0, filter: 'blur(6px) brightness(50%)', skewX: -5 }, { opacity: 1, filter: 'blur(0px) brightness(100%)', skewX: 0, stagger: 0.03, duration: 0.8, ease: 'power2.out' });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    if (textRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: textRef.current, start: 'top 85%', toggleActions: 'play none none none' },
      });
      tl.fromTo(textRef.current, { opacity: 0, filter: 'blur(6px) brightness(50%)', y: 20 }, { opacity: 1, filter: 'blur(0px) brightness(100%)', y: 0, duration: 1, ease: 'power2.out', delay: 0.2 });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    if (statsRef.current) {
      const statItems = statsRef.current.querySelectorAll('.stat-item');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: statsRef.current, start: 'top 85%', toggleActions: 'play none none none' },
      });
      statItems.forEach((item, index) => {
        const numberEl = item.querySelector('.stat-number');
        const target = stats[index];
        tl.fromTo(item, { opacity: 0, filter: 'blur(6px)', y: 20 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.8, ease: 'power2.out' }, 0.4 + index * 0.1);
        if (numberEl && target) {
          const obj = { val: 0 };
          tl.to(obj, { val: target.value, duration: 1.5, ease: 'power2.out', onUpdate: () => {
            if (target.isDecimal) numberEl.textContent = obj.val.toFixed(2);
            else numberEl.textContent = Math.round(obj.val) + target.suffix;
          }}, 0.4 + index * 0.1);
        }
      });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    return () => { triggers.forEach((st) => st.kill()); };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full" style={{ paddingTop: '180px', paddingBottom: '180px', backgroundColor: '#0a0a0a' }}>
      <div className="mx-auto px-6" style={{ maxWidth: '1400px' }}>
        <h2 ref={headingRef} className="text-display-l color-paper mb-20">
          <span className="word inline-block animate-blur-reveal">ABOUT</span>{' '}
          <span className="word inline-block animate-blur-reveal" style={{ animationDelay: '0.03s' }}>ME</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <p ref={textRef} className="text-body-large color-dim animate-fade-in-up" style={{ lineHeight: 1.8 }}>
              I'm a creative professional with a passion for building immersive digital experiences.
              From educational games to augmented reality applications, I blend technical precision
              with creative vision to craft tools that educate, engage, and inspire. With expertise
              spanning Unity 3D, web development, and AR technologies, I bring ideas to life through
              code and creativity.
            </p>
          </div>
          <div ref={statsRef} className="lg:col-span-5 flex flex-col gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item animate-fade-in-up" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                <div className="stat-number text-display-l color-gold mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>0</div>
                <div className="text-label color-dim">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
