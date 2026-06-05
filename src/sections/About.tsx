import { useEffect, useRef } from 'react';
import akuImg from '../image/aku.png';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const statsTemplate = [
  { value: 8, suffix: '+', key: 'projects' },
  { value: 3, suffix: '+', key: 'years' },
  { value: 3.96, suffix: '', key: 'gpa', isDecimal: true },
];

export default function About() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

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
        const target = statsTemplate[index];
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

    if (photoRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: photoRef.current, start: 'top 85%', toggleActions: 'play none none none' },
      });
      tl.fromTo(photoRef.current, { opacity: 0, filter: 'blur(12px) brightness(40%)', scale: 0.95 }, { opacity: 1, filter: 'blur(0px) brightness(100%)', scale: 1, duration: 1.2, ease: 'power2.out', delay: 0.1 });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    return () => { triggers.forEach((st) => st.kill()); };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full" style={{ paddingTop: '180px', paddingBottom: '180px', backgroundColor: '#0a0a0a' }}>
      <div className="mx-auto px-6" style={{ maxWidth: '1400px' }}>
        <h2 ref={headingRef} className="text-display-l color-paper mb-20">
          <span className="word inline-block animate-blur-reveal">{t('about.label')}</span>{' '}
          <span className="word inline-block animate-blur-reveal" style={{ animationDelay: '0.03s' }}>{t('about.title')}</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Photo Column */}
          <div ref={photoRef} className="lg:col-span-4 flex justify-center lg:justify-start">
            <div style={{
              position: 'relative',
              width: '280px',
              height: '340px',
              flexShrink: 0,
            }}>
              {/* Gold border frame */}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '4px',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                zIndex: 2,
                pointerEvents: 'none',
              }} />
              {/* Corner accents */}
              <div style={{ position: 'absolute', top: '-4px', left: '-4px', width: '20px', height: '20px', borderTop: '2px solid #d4af37', borderLeft: '2px solid #d4af37', zIndex: 3 }} />
              <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '20px', height: '20px', borderTop: '2px solid #d4af37', borderRight: '2px solid #d4af37', zIndex: 3 }} />
              <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: '20px', height: '20px', borderBottom: '2px solid #d4af37', borderLeft: '2px solid #d4af37', zIndex: 3 }} />
              <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '20px', height: '20px', borderBottom: '2px solid #d4af37', borderRight: '2px solid #d4af37', zIndex: 3 }} />
              <img
                src={akuImg}
                alt="Reihan Mutaqin"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  borderRadius: '4px',
                  display: 'block',
                  filter: 'brightness(0.92) contrast(1.05)',
                }}
              />
              {/* Subtle gold overlay at bottom */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '40%',
                background: 'linear-gradient(to top, rgba(212, 175, 55, 0.08) 0%, transparent 100%)',
                borderRadius: '0 0 4px 4px',
                zIndex: 1,
              }} />
            </div>
          </div>
          {/* Text Column */}
          <div className="lg:col-span-4">
            <p ref={textRef} className="text-body-large color-dim animate-fade-in-up" style={{ lineHeight: 1.8 }}>
              {t('about.desc')}
            </p>
          </div>
          {/* Stats Column */}
          <div ref={statsRef} className="lg:col-span-4 flex flex-col gap-12">
            {statsTemplate.map((stat, index) => (
              <div key={index} className="stat-item animate-fade-in-up" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                <div className="stat-number text-display-l color-gold mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>0</div>
                <div className="text-label color-dim">{t(`about.stats.${stat.key}`)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
