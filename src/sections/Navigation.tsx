import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Works', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
  { label: 'Support', href: '#support' },
];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');

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
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 opacity-0"
      style={{
        transform: 'translateY(-100px)',
        backgroundColor: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(20px)',
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
          className="text-label color-paper tracking-widest"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          RM
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
              {item.label}
              <span
                className="absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300"
                style={{
                  width: activeSection === item.href ? '100%' : '0%',
                }}
              />
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#contact"
          onClick={(e) => handleClick(e, '#contact')}
          className="text-label color-gold px-4 py-2 transition-all duration-300 hover:bg-gold hover:text-black"
          style={{
            border: '1px solid #d4af37',
          }}
        >
          Hire Me
        </a>
      </div>
    </nav>
  );
}
