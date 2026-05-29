import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useBlurReveal(selector: string, options?: { stagger?: number; start?: string; childSelector?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const elements = ref.current.querySelectorAll(selector);
    const triggers: ScrollTrigger[] = [];

    elements.forEach((el) => {
      const targets = options?.childSelector ? el.querySelectorAll(options.childSelector) : [el];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: options?.start || 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      tl.fromTo(
        targets,
        {
          opacity: 0,
          filter: 'blur(6px) brightness(50%)',
          skewX: -5,
          willChange: 'filter, transform',
        },
        {
          ease: 'power2.out',
          opacity: 1,
          skewX: 0,
          filter: 'blur(0px) brightness(100%)',
          stagger: options?.stagger || 0.03,
          duration: 0.8,
        }
      );

      if (tl.scrollTrigger) {
        triggers.push(tl.scrollTrigger);
      }
    });

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, [selector, options]);

  return ref;
}
