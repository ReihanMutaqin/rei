import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
      rafId = requestAnimationFrame(animate);
    };

    const onEnterLink = () => {
      dot.style.opacity = '0';
      ring.style.width = '52px';
      ring.style.height = '52px';
      ring.style.borderColor = '#d4af37';
      ring.style.backgroundColor = 'rgba(212, 175, 55, 0.08)';
      ring.style.marginLeft = '-7px';
      ring.style.marginTop = '-7px';
    };

    const onLeaveLink = () => {
      dot.style.opacity = '1';
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(212, 175, 55, 0.6)';
      ring.style.backgroundColor = 'transparent';
      ring.style.marginLeft = '0px';
      ring.style.marginTop = '0px';
    };

    const addLinkListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input, select, textarea').forEach((el) => {
        el.addEventListener('mouseenter', onEnterLink);
        el.addEventListener('mouseleave', onLeaveLink);
      });
    };

    window.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(animate);
    addLinkListeners();

    // Re-add on DOM mutations
    const observer = new MutationObserver(addLinkListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '8px', height: '8px',
          borderRadius: '50%',
          backgroundColor: '#d4af37',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'opacity 0.2s ease',
          boxShadow: '0 0 6px rgba(212, 175, 55, 0.8)',
          mixBlendMode: 'normal',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '36px', height: '36px',
          borderRadius: '50%',
          border: '1px solid rgba(212, 175, 55, 0.6)',
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'width 0.3s ease, height 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
        }}
      />
    </>
  );
}
