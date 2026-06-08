import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: {
      en: "Reihan delivered our AR education app with exceptional attention to detail. The 3D animations he created made learning genuinely fun for our students.",
      id: "Reihan mengerjakan aplikasi AR edukasi kami dengan perhatian luar biasa terhadap detail. Animasi 3D yang ia buat membuat belajar benar-benar menyenangkan bagi siswa kami.",
    },
    author: "Drs. Ahmad Fauzi",
    role: { en: "Principal, SMAN 3 Pandeglang", id: "Kepala Sekolah, SMAN 3 Pandeglang" },
    tag: "AR Education",
  },
  {
    quote: {
      en: "The game he built for us was polished, engaging, and completed ahead of schedule. Reihan truly understands how to merge game mechanics with educational goals.",
      id: "Game yang ia bangun untuk kami terasa halus, menarik, dan selesai lebih awal dari jadwal. Reihan benar-benar memahami cara menggabungkan mekanik game dengan tujuan edukasi.",
    },
    author: "Putri Rahayu",
    role: { en: "Content Creator, Edu-Games Studio", id: "Kreator Konten, Edu-Games Studio" },
    tag: "Game Dev",
  },
  {
    quote: {
      en: "Our e-commerce platform exceeded all expectations. Clean code, beautiful design, and flawless functionality. I'd hire him again without hesitation.",
      id: "Platform e-commerce kami melampaui semua ekspektasi. Kode bersih, desain indah, dan fungsionalitas sempurna. Saya akan mempekerjakannya lagi tanpa ragu.",
    },
    author: "Budi Santoso",
    role: { en: "Owner, Toko Santoso Online", id: "Pemilik, Toko Santoso Online" },
    tag: "Web Dev",
  },
  {
    quote: {
      en: "The ReLive AR app was exactly what I envisioned — intuitive, fast, and visually stunning. Reihan's communication throughout the project was impeccable.",
      id: "Aplikasi ReLive AR persis seperti yang saya bayangkan — intuitif, cepat, dan memukau secara visual. Komunikasi Reihan selama proyek berlangsung sangat baik.",
    },
    author: "Siti Nurhaliza",
    role: { en: "Photographer & Content Creator", id: "Fotografer & Kreator Konten" },
    tag: "Mobile AR",
  },
];

function StarRating() {
  return (
    <div style={{ display: 'flex', gap: '4px', marginBottom: '1.25rem' }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#d4af37" style={{ flexShrink: 0 }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
  language,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
  language: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
    tl.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out', delay: index * 0.12 }
    );
    return () => { tl.scrollTrigger?.kill(); };
  }, [index]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        padding: '2rem',
        background: hovered ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.025)',
        border: `1px solid ${hovered ? 'rgba(212, 175, 55, 0.3)' : 'rgba(240, 240, 240, 0.07)'}`,
        borderRadius: '2px',
        transition: 'all 0.4s ease',
        cursor: 'default',
        overflow: 'hidden',
      }}
    >
      {/* Accent line top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: hovered
          ? 'linear-gradient(90deg, transparent, #d4af37, transparent)'
          : 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)',
        transition: 'all 0.4s ease',
      }} />

      {/* Quote mark */}
      <div style={{
        position: 'absolute', top: '1.25rem', right: '1.5rem',
        fontSize: '4rem', fontWeight: 200, lineHeight: 1,
        color: 'rgba(212, 175, 55, 0.08)',
        fontFamily: 'Georgia, serif',
        userSelect: 'none',
      }}>"</div>

      <StarRating />

      {/* Tag */}
      <span style={{
        display: 'inline-block',
        padding: '3px 10px',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        color: '#d4af37',
        fontSize: '0.6rem',
        fontWeight: 500,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        marginBottom: '1.25rem',
        borderRadius: '2px',
      }}>
        {testimonial.tag}
      </span>

      <p style={{
        color: 'rgba(240, 240, 240, 0.72)',
        fontSize: '0.95rem',
        fontWeight: 300,
        lineHeight: 1.8,
        marginBottom: '1.5rem',
        fontStyle: 'italic',
      }}>
        "{language === 'id' ? testimonial.quote.id : testimonial.quote.en}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Avatar placeholder */}
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(212, 175, 55, 0.08)',
          fontSize: '0.85rem', color: '#d4af37', fontWeight: 300,
          flexShrink: 0,
        }}>
          {testimonial.author.charAt(0)}
        </div>
        <div>
          <div style={{ color: '#f0f0f0', fontSize: '0.875rem', fontWeight: 400 }}>
            {testimonial.author}
          </div>
          <div style={{ color: 'rgba(240, 240, 240, 0.4)', fontSize: '0.7rem', letterSpacing: '0.08em', marginTop: '2px' }}>
            {language === 'id' ? testimonial.role.id : testimonial.role.en}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { language } = useLanguage();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!headingRef.current) return;
    const words = headingRef.current.querySelectorAll('.word');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: headingRef.current, start: 'top 85%', toggleActions: 'play none none none' },
    });
    tl.fromTo(words,
      { opacity: 0, filter: 'blur(6px) brightness(50%)', skewX: -5 },
      { opacity: 1, filter: 'blur(0px) brightness(100%)', skewX: 0, stagger: 0.03, duration: 0.8, ease: 'power2.out' }
    );
    return () => { tl.scrollTrigger?.kill(); };
  }, []);

  // Auto-cycle active card on mobile
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative w-full"
      style={{ paddingTop: '180px', paddingBottom: '180px', backgroundColor: '#0a0a0a', overflow: 'hidden' }}
    >
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212, 175, 55, 0.025) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(240,240,240,0.05), transparent)',
        pointerEvents: 'none',
      }} />

      <div className="mx-auto px-6" style={{ maxWidth: '1400px', position: 'relative', zIndex: 1 }}>
        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <span className="text-label color-dim" style={{ letterSpacing: '0.2em' }}>— 05</span>
          <span className="text-label color-dim" style={{ letterSpacing: '0.15em' }}>
            {language === 'id' ? 'ULASAN KLIEN' : 'CLIENT REVIEWS'}
          </span>
        </div>

        <h2 ref={headingRef} className="text-display-l color-paper" style={{ marginBottom: '4rem' }}>
          <span className="word inline-block animate-blur-reveal">
            {language === 'id' ? 'KATA' : 'WHAT'}
          </span>{' '}
          <span className="word inline-block animate-blur-reveal" style={{ animationDelay: '0.03s' }}>
            {language === 'id' ? 'MEREKA' : 'THEY'}
          </span>{' '}
          <span className="word inline-block animate-blur-reveal" style={{ animationDelay: '0.06s' }}>
            {language === 'id' ? 'BERKATA' : 'SAY'}
          </span>
        </h2>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} index={i} language={language} />
          ))}
        </div>

        {/* Dots indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '3rem' }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: i === currentSlide ? '24px' : '6px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: i === currentSlide ? '#d4af37' : 'rgba(212, 175, 55, 0.25)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease',
              }}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </section>
  );
}
