import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';

const navItems = [
  { id: 'about', href: '#about' },
  { id: 'works', href: '#projects' },
  { id: 'skills', href: '#skills' },
  { id: 'experience', href: '#experience' },
  { id: 'contact', href: '#contact' },
  { id: 'support', href: '#support' },
];

function LogoR() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer gold ring */}
      <circle cx="16" cy="16" r="15" stroke="#d4af37" strokeWidth="1" opacity="0.6" />
      {/* Letter R */}
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fill="#d4af37"
        fontSize="18"
        fontFamily="Outfit, sans-serif"
        fontWeight="200"
        letterSpacing="-0.5"
      >
        R
      </text>
      {/* Inner subtle glow dot */}
      <circle cx="16" cy="16" r="14.5" stroke="url(#logoGrad)" strokeWidth="0.5" opacity="0.4" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
          <stop offset="50%" stopColor="#d4af37" stopOpacity="1" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const { language, setLanguage, t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.8;
      setIsVisible(scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!navRef.current) return;

    gsap.to(navRef.current, {
      y: isVisible ? 0 : -100,
      opacity: isVisible ? 1 : 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, [isVisible]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(href);
      setMobileOpen(false);
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 opacity-0"
        style={{
          transform: 'translateY(-100px)',
          backgroundColor: 'rgba(10, 10, 10, 0.92)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(240, 240, 240, 0.06)',
        }}
      >
        <div
          className="mx-auto px-8 h-16 flex items-center justify-between"
          style={{ maxWidth: '1400px' }}
        >
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 group"
            style={{ textDecoration: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]">
              <LogoR />
            </div>
            <span
              className="text-label color-dim transition-colors duration-300 group-hover:color-gold hidden sm:inline"
              style={{ letterSpacing: '0.2em', fontSize: '0.65rem' }}
            >
              REIHAN
            </span>
          </a>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className="text-label color-dim transition-colors duration-300 hover:color-paper relative group"
              >
                {t(`nav.${item.id}`)}
                <span
                  className="absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300"
                  style={{
                    width: activeSection === item.href ? '100%' : '0%',
                    background: '#d4af37',
                  }}
                />
              </a>
            ))}
          </div>

          {/* CTA & Language Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
              className="text-label color-dim transition-colors duration-300 hover:color-paper"
              style={{ fontWeight: 500 }}
            >
              {language === 'en' ? 'ID' : 'EN'}
            </button>

            <a
              href="#contact"
              onClick={(e) => handleClick(e, '#contact')}
              className="hidden md:inline text-label color-gold px-4 py-2 transition-all duration-300"
              style={{
                border: '1px solid rgba(212,175,55,0.6)',
                letterSpacing: '0.12em',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#d4af37';
                (e.currentTarget as HTMLElement).style.color = '#0a0a0a';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#d4af37';
              }}
            >
              {t('nav.hireMe')}
            </a>

            {/* Hamburger mobile */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span
                className="block w-5 h-px transition-all duration-300"
                style={{
                  backgroundColor: '#d4af37',
                  transform: mobileOpen ? 'rotate(45deg) translate(3.5px, 3.5px)' : 'none',
                }}
              />
              <span
                className="block w-5 h-px transition-all duration-300"
                style={{
                  backgroundColor: '#d4af37',
                  opacity: mobileOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-5 h-px transition-all duration-300"
                style={{
                  backgroundColor: '#d4af37',
                  transform: mobileOpen ? 'rotate(-45deg) translate(3.5px, -3.5px)' : 'none',
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className="md:hidden overflow-hidden transition-all duration-400"
          style={{
            maxHeight: mobileOpen ? '400px' : '0',
            borderTop: mobileOpen ? '1px solid rgba(240,240,240,0.06)' : 'none',
            backgroundColor: 'rgba(10, 10, 10, 0.98)',
          }}
        >
          <div className="px-8 py-6 flex flex-col gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className="text-label color-dim transition-colors duration-300 hover:color-paper"
                style={{ letterSpacing: '0.15em' }}
              >
                {t(`nav.${item.id}`)}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleClick(e, '#contact')}
              className="text-label color-gold px-4 py-3 text-center transition-all duration-300"
              style={{ border: '1px solid rgba(212,175,55,0.6)', letterSpacing: '0.12em' }}
            >
              {t('nav.hireMe')}
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
