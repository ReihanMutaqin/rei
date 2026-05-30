import { useEffect, useRef } from 'react';
import akuImg from '../image/aku.png';
import gsap from 'gsap';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // GSAP takes over CSS animations for smoother experience
    const tl = gsap.timeline({ delay: 0.2 });

    if (titleRef.current) {
      const words = titleRef.current.querySelectorAll('.word');
      tl.fromTo(
        words,
        { opacity: 0, filter: 'blur(12px) brightness(30%)', y: 40 },
        { opacity: 1, filter: 'blur(0px) brightness(100%)', y: 0, stagger: 0.15, duration: 1.2, ease: 'power2.out' }
      );
    }

    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, filter: 'blur(8px)' },
        { opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.out' },
        '-=0.5'
      );
    }

    if (bottomRef.current) {
      tl.fromTo(
        bottomRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      );
    }

    return () => { tl.kill(); };
  }, []);

  // Particle background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 25000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity * 0.3})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${0.05 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();
    window.addEventListener('resize', () => { resize(); createParticles(); });
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section ref={heroRef} className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
      <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }} />

      {/* Ghost photo background */}
      <div className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }}>
        <img
          src={akuImg}
          alt=""
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: '95%',
            width: 'auto',
            objectFit: 'cover',
            objectPosition: 'top center',
            opacity: 0.08,
            filter: 'grayscale(100%) brightness(1.4) contrast(1.1)',
            mixBlendMode: 'luminosity',
          }}
        />
        {/* Radial vignette — fades photo into black on all sides */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: [
            'radial-gradient(ellipse 70% 80% at 50% 50%, transparent 30%, #0a0a0a 80%)',
          ].join(', '),
        }} />
        {/* Extra fade top & bottom */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, #0a0a0a 0%, transparent 20%, transparent 80%, #0a0a0a 100%)',
        }} />
      </div>

      <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212, 175, 55, 0.04) 0%, transparent 70%)' }} />
      <div className="relative z-10 text-center px-6">
        <h1 ref={titleRef} className="text-display-xl color-paper mb-6" style={{ fontWeight: 200 }}>
          <span className="word inline-block animate-hero-word">REIHAN</span>
          <br />
          <span className="word inline-block animate-hero-word-delay-1">MUTAQIN</span>
        </h1>
        <p ref={subtitleRef} className="text-body-large color-dim animate-fade-in-delay" style={{ letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 500 }}>
          App & Game Developer
        </p>
      </div>
      <div ref={bottomRef} className="absolute bottom-8 left-0 right-0 z-10 px-8 flex justify-between items-center animate-fade-in-delay">
        <span className="text-label color-dim">Scroll to explore</span>
        <div className="absolute left-8 right-8 bottom-full mb-4" style={{ height: '1px', backgroundColor: 'rgba(240, 240, 240, 0.12)' }} />
        <span className="text-label color-dim">2024</span>
      </div>
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 animate-fade-in-delay">
        <div className="w-px h-12 relative overflow-hidden" style={{ backgroundColor: 'rgba(240, 240, 240, 0.06)' }}>
          <div className="absolute top-0 left-0 w-full bg-gold" style={{ height: '40%', animation: 'scrollPulse 2s ease-in-out infinite' }} />
        </div>
      </div>
      <style>{`
        @keyframes scrollPulse {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(250%); }
        }
      `}</style>
    </section>
  );
}
