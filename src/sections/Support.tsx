import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import qrisImg from '../image/QRIS baru.jpg';

gsap.registerPlugin(ScrollTrigger);

export default function Support() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // GSAP scroll animations
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    if (headingRef.current) {
      const chars = headingRef.current.querySelectorAll('.char');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
      tl.fromTo(
        chars,
        { opacity: 0, filter: 'blur(8px)', y: 20 },
        { opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.03, duration: 0.7, ease: 'power2.out' }
      );
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    if (cardRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out', delay: 0.2 }
      );
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, []);

  const headingText = 'SUPPORT ME';

  return (
    <section
      ref={sectionRef}
      id="support"
      className="relative w-full"
      style={{
        paddingTop: '160px',
        paddingBottom: '160px',
        background: 'linear-gradient(to bottom, #0e0c08 0%, #0a0a0a 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }}
      />

      <div className="mx-auto px-6" style={{ maxWidth: '700px' }}>
        {/* Section label */}
        <div className="flex items-center gap-4 mb-12">
          <span className="text-label color-dim" style={{ letterSpacing: '0.2em' }}>— 06</span>
          <span className="text-label color-dim" style={{ letterSpacing: '0.15em' }}>DUKUNG KARYA</span>
        </div>

        {/* Heading */}
        <h2
          ref={headingRef}
          className="color-paper mb-6 text-center"
          style={{
            fontWeight: 200,
            fontSize: 'clamp(2.8rem, 10vw, 6.5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
          }}
        >
          {headingText.split('').map((char, i) => (
            <span key={i} className="char inline-block">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h2>

        {/* Description */}
        <p
          className="text-body color-dim text-center"
          style={{ maxWidth: '520px', margin: '0 auto 4rem auto', lineHeight: 1.8 }}
        >
          Jika karya saya bermanfaat, kamu bisa memberikan dukungan melalui QRIS.
          Scan QR di bawah menggunakan aplikasi e-wallet atau mobile banking apapun.
        </p>

        {/* QRIS Card */}
        <div
          ref={cardRef}
          className="relative mx-auto"
          style={{ maxWidth: '360px' }}
        >
          {/* Gold top line */}
          <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)', marginBottom: '0' }} />

          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(240,240,240,0.08)',
              borderTop: 'none',
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            {/* Badge */}
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#d4af37',
                  boxShadow: '0 0 8px rgba(212,175,55,0.7)',
                }}
              />
              <span className="text-label color-dim" style={{ letterSpacing: '0.2em' }}>
                QRIS · SCAN TO PAY
              </span>
            </div>

            {/* Merchant name */}
            <p className="color-paper" style={{ fontSize: '1rem', fontWeight: 400, letterSpacing: '0.05em' }}>
              Reihan
            </p>

            {/* QR Image frame */}
            <div
              style={{
                position: 'relative',
                padding: '1rem',
                background: '#ffffff',
                borderRadius: '4px',
                boxShadow: '0 0 40px rgba(212,175,55,0.12)',
              }}
            >
              {/* Corner accents */}
              {[
                { top: -1, left: -1, borderTop: '2px solid #d4af37', borderLeft: '2px solid #d4af37' },
                { top: -1, right: -1, borderTop: '2px solid #d4af37', borderRight: '2px solid #d4af37' },
                { bottom: -1, left: -1, borderBottom: '2px solid #d4af37', borderLeft: '2px solid #d4af37' },
                { bottom: -1, right: -1, borderBottom: '2px solid #d4af37', borderRight: '2px solid #d4af37' },
              ].map((style, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: '14px',
                    height: '14px',
                    ...style,
                  }}
                />
              ))}

              <img
                src={qrisImg}
                alt="QRIS R.dir Store — Scan untuk membayar"
                style={{
                  display: 'block',
                  width: '260px',
                  height: '260px',
                  objectFit: 'cover',
                  objectPosition: 'center 35%',
                  borderRadius: '2px',
                }}
              />
            </div>

            {/* Supported apps */}
            <div style={{ textAlign: 'center' }}>
              <p className="text-label color-dim mb-2" style={{ letterSpacing: '0.12em' }}>
                DIDUKUNG OLEH
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                {['GoPay', 'OVO', 'Dana', 'ShopeePay', 'BRI', 'BCA', 'Mandiri', 'BSI'].map((app) => (
                  <span
                    key={app}
                    className="text-label color-dim"
                    style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}
                  >
                    {app}
                  </span>
                ))}
              </div>
              <p className="color-dim mt-1" style={{ fontSize: '0.6rem', letterSpacing: '0.05em' }}>
                & semua aplikasi yang mendukung QRIS
              </p>
            </div>
          </div>

          {/* Bottom gold line */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)' }} />
        </div>

        {/* Footer note */}
        <p
          className="text-center color-dim mt-10"
          style={{ fontSize: '0.7rem', letterSpacing: '0.08em', lineHeight: 1.8 }}
        >
          QRIS terverifikasi Bank Indonesia · Aman & terenkripsi · Satu QRIS untuk semua
        </p>
      </div>
    </section>
  );
}
