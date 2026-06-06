import { useLanguage } from '../context/LanguageContext';

function LogoR() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" stroke="#d4af37" strokeWidth="1" opacity="0.4" />
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fill="#d4af37"
        fontSize="18"
        fontFamily="Outfit, sans-serif"
        fontWeight="200"
      >
        R
      </text>
    </svg>
  );
}

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      className="relative w-full"
      style={{
        height: '80px',
        borderTop: '1px solid rgba(240, 240, 240, 0.06)',
        backgroundColor: '#0a0a0a',
      }}
    >
      <div
        className="mx-auto px-8 h-full flex items-center justify-between"
        style={{ maxWidth: '1400px' }}
      >
        <span className="text-label color-dim">© {new Date().getFullYear()} Reihan Mutaqin</span>

        {/* Center logo */}
        <div className="opacity-40 hover:opacity-70 transition-opacity duration-300">
          <LogoR />
        </div>

        <span className="text-label color-dim">{t('footer.builtWith')}</span>
      </div>
    </footer>
  );
}
