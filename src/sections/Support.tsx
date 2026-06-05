import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import QRCode from 'qrcode';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// QRIS Dinamis Generator
// Sumber  : decoded langsung dari QR asli merchant
// Merchant: R.dir Store  |  NMID: ID1025409810336
// Acquirer: DANA (ID.DANA.WWW)
// ─────────────────────────────────────────────

/**
 * QRIS statis asli yang di-decode dari gambar QR merchant.
 * Field 01 = "11" (statis) → akan diubah ke "12" (dinamis).
 * CRC lama dihapus dan dihitung ulang setelah modifikasi.
 */
const QRIS_STATIC_BASE =
  '00020101021126570011ID.DANA.WWW011893600915392698070102099269807010303UMI51440014ID.CO.QRIS.WWW0215ID10254098103360303UMI5204737253033605802ID5911RDir Studio6015Kab. Pandeglang6105422726304';

/**
 * Hitung CRC-16/CCITT-FALSE untuk string QRIS
 * Polynomial: 0x1021, Init: 0xFFFF
 */
function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Generate QRIS Dinamis dari QRIS statis asli merchant.
 * Langkah:
 *  1. Ubah Point of Initiation Method: "010211" → "010212" (dinamis)
 *  2. Sisipkan field 54 (nominal) sebelum "5802ID" (field 58 Country Code)
 *  3. Hitung ulang CRC-16
 */
function generateDynamicQRIS(amount: number): string {
  // Hapus CRC placeholder lama (4 char terakhir)
  const base = QRIS_STATIC_BASE.slice(0, -4);

  // 1. Ubah mode statis (11) ke dinamis (12)
  const withDynamic = base.replace('010211', '010212');

  // 2. Buat field 54 (Transaction Amount)
  const amountStr = amount.toFixed(0);
  const field54 = `54${String(amountStr.length).padStart(2, '0')}${amountStr}`;

  // 3. Sisipkan field 54 tepat sebelum "5802ID" (field 58 = Country Code)
  const withAmount = withDynamic.replace('5802ID', `${field54}5802ID`);

  // 4. Hitung CRC baru
  const crc = crc16(withAmount + '6304');

  return withAmount + '6304' + crc;
}

// ─────────────────────────────────────────────
// Preset nominal
// ─────────────────────────────────────────────
const PRESET_AMOUNTS = [
  { label: 'Rp 5.000', value: 5000 },
  { label: 'Rp 10.000', value: 10000 },
  { label: 'Rp 25.000', value: 25000 },
  { label: 'Rp 50.000', value: 50000 },
  { label: 'Rp 100.000', value: 100000 },
  { label: 'Rp 250.000', value: 250000 },
];

function formatRupiah(num: number): string {
  return 'Rp ' + num.toLocaleString('id-ID');
}

export default function Support() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [amount, setAmount] = useState<number>(0);
  const [inputValue, setInputValue] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate QR code ke canvas
  const generateQR = useCallback(async (amt: number) => {
    if (!canvasRef.current) return;
    setIsGenerating(true);
    setError('');
    try {
      const qrisString = generateDynamicQRIS(amt);
      await QRCode.toCanvas(canvasRef.current, qrisString, {
        width: 280,
        margin: 2,
        color: { dark: '#0a0a0a', light: '#f8f5ec' },
        errorCorrectionLevel: 'M',
      });
      setQrGenerated(true);
    } catch (err) {
      setError(t('support.error') || 'Gagal generate QR Code. Silakan coba lagi.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handlePreset = (value: number) => {
    setSelectedPreset(value);
    setAmount(value);
    setInputValue(value.toLocaleString('id-ID'));
    setQrGenerated(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = parseInt(raw) || 0;
    setInputValue(raw ? num.toLocaleString('id-ID') : '');
    setAmount(num);
    setSelectedPreset(null);
    setQrGenerated(false);
  };

  const handleGenerate = () => {
    if (amount < 1000) { setError(t('support.minNominal')); return; }
    if (amount > 50_000_000) { setError(t('support.maxNominal')); return; }
    setError('');
    generateQR(amount);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `qris-rdir-${amount}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(amount.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // GSAP scroll animations
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    if (headingRef.current) {
      const chars = headingRef.current.querySelectorAll('.char');
      const tl = gsap.timeline({ scrollTrigger: { trigger: headingRef.current, start: 'top 85%', toggleActions: 'play none none none' } });
      tl.fromTo(chars, { opacity: 0, filter: 'blur(8px)', y: 20 }, { opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.03, duration: 0.7, ease: 'power2.out' });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    if (cardRef.current) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: cardRef.current, start: 'top 85%', toggleActions: 'play none none none' } });
      tl.fromTo(cardRef.current, { opacity: 0, y: 40, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out', delay: 0.2 });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    return () => { triggers.forEach((st) => st.kill()); };
  }, []);

  const headingText = t('support.title');

  return (
    <section
      ref={sectionRef}
      id="support"
      className="relative w-full"
      style={{ paddingTop: '160px', paddingBottom: '160px', background: 'linear-gradient(to bottom, #0e0c08 0%, #0a0a0a 100%)', overflow: 'hidden' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 70%)' }} />
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }} />

      <div className="mx-auto px-6" style={{ maxWidth: '900px' }}>
        {/* Section label */}
        <div className="flex items-center gap-4 mb-12">
          <span className="text-label color-dim" style={{ letterSpacing: '0.2em' }}>— 06</span>
          <span className="text-label color-dim" style={{ letterSpacing: '0.15em' }}>{t('support.label')}</span>
        </div>

        {/* Heading */}
        <h2 ref={headingRef} className="color-paper mb-6 text-center" style={{ fontWeight: 200, fontSize: 'clamp(2.8rem, 10vw, 6.5rem)', lineHeight: 1.05, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
          {(headingText || '').split('').map((char: string, i: number) => (
            <span key={i} className="char inline-block">{char === ' ' ? '\u00A0' : char}</span>
          ))}
        </h2>

        {/* Description */}
        <p className="text-body color-dim text-center" style={{ maxWidth: '560px', margin: '0 auto 4rem auto', lineHeight: 1.8 }}>
          {t('support.desc')}
        </p>

        {/* Main Card */}
        <div ref={cardRef} className="relative" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(240,240,240,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
          {/* Gold top accent */}
          <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {/* ── LEFT: Input panel ── */}
            <div className="flex flex-col" style={{ padding: '2.5rem', borderRight: '1px solid rgba(240,240,240,0.06)' }}>
              {/* Badge + merchant */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#d4af37', boxShadow: '0 0 8px rgba(212,175,55,0.6)' }} />
                  <span className="text-label color-dim" style={{ letterSpacing: '0.15em' }}>QRIS DINAMIS</span>
                </div>
                <p className="color-paper" style={{ fontSize: '1.1rem', fontWeight: 400 }}>Reihan</p>
              </div>

              {/* Preset amounts */}
              <div className="mb-6">
                <p className="text-label color-dim mb-3" style={{ letterSpacing: '0.12em' }}>{t('support.presetTitle')}</p>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => handlePreset(preset.value)}
                      style={{
                        padding: '0.5rem 0.25rem', fontSize: '0.7rem', fontWeight: 500,
                        letterSpacing: '0.05em', textTransform: 'uppercase', borderRadius: '2px',
                        border: `1px solid ${selectedPreset === preset.value ? '#d4af37' : 'rgba(240,240,240,0.1)'}`,
                        backgroundColor: selectedPreset === preset.value ? 'rgba(212,175,55,0.12)' : 'transparent',
                        color: selectedPreset === preset.value ? '#d4af37' : 'rgba(240,240,240,0.45)',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => { if (selectedPreset !== preset.value) { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; e.currentTarget.style.color = 'rgba(240,240,240,0.8)'; } }}
                      onMouseLeave={(e) => { if (selectedPreset !== preset.value) { e.currentTarget.style.borderColor = 'rgba(240,240,240,0.1)'; e.currentTarget.style.color = 'rgba(240,240,240,0.45)'; } }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom input */}
              <div className="mb-6">
                <p className="text-label color-dim mb-3" style={{ letterSpacing: '0.12em' }}>{t('support.customTitle')}</p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 color-dim" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Rp</span>
                  <input
                    type="text" value={inputValue} onChange={handleInput} placeholder="0"
                    style={{ width: '100%', paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.875rem', paddingBottom: '0.875rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(240,240,240,0.1)', borderRadius: '2px', color: '#f0f0f0', fontSize: '1.1rem', fontWeight: 300, fontFamily: 'Outfit, sans-serif', outline: 'none', transition: 'border-color 0.2s ease', boxSizing: 'border-box' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(240,240,240,0.1)'; }}
                  />
                </div>
                {amount > 0 && <p className="color-dim mt-2" style={{ fontSize: '0.75rem' }}>{formatRupiah(amount)}</p>}
              </div>

              {/* Error */}
              {error && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginBottom: '1rem' }}>⚠ {error}</p>}

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || amount < 1}
                style={{ width: '100%', padding: '1rem', background: amount > 0 ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${amount > 0 ? '#d4af37' : 'rgba(240,240,240,0.1)'}`, color: amount > 0 ? '#d4af37' : 'rgba(240,240,240,0.3)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: amount > 0 ? 'pointer' : 'not-allowed', borderRadius: '2px', transition: 'all 0.3s ease', fontFamily: 'Outfit, sans-serif', marginTop: 'auto' }}
                onMouseEnter={(e) => { if (amount > 0) e.currentTarget.style.background = 'rgba(212,175,55,0.25)'; }}
                onMouseLeave={(e) => { if (amount > 0) e.currentTarget.style.background = 'rgba(212,175,55,0.15)'; }}
              >
                {isGenerating ? t('support.btnGenerating') : t('support.btnGenerate')}
              </button>

              <p className="color-dim text-center mt-4" style={{ fontSize: '0.65rem', letterSpacing: '0.05em', lineHeight: 1.6 }}>
                {t('support.note')}
              </p>
            </div>

            {/* ── RIGHT: QR Display panel ── */}
            <div className="flex flex-col items-center justify-center" style={{ padding: '2.5rem' }}>
              {/* QR Frame */}
              <div style={{ position: 'relative', padding: '1.5rem', background: qrGenerated ? '#f8f5ec' : 'rgba(255,255,255,0.02)', border: `1px solid ${qrGenerated ? 'rgba(212,175,55,0.6)' : 'rgba(240,240,240,0.06)'}`, borderRadius: '4px', transition: 'all 0.4s ease', marginBottom: '1.5rem' }}>
                {/* Corner accents */}
                {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
                  <div key={i} className={`absolute ${pos}`} style={{ width: '12px', height: '12px', borderTop: i < 2 ? '2px solid #d4af37' : 'none', borderBottom: i >= 2 ? '2px solid #d4af37' : 'none', borderLeft: i % 2 === 0 ? '2px solid #d4af37' : 'none', borderRight: i % 2 !== 0 ? '2px solid #d4af37' : 'none', opacity: qrGenerated ? 1 : 0.3, transition: 'opacity 0.4s ease' }} />
                ))}

                {/* Canvas */}
                <canvas ref={canvasRef} width={280} height={280} style={{ display: 'block', opacity: qrGenerated ? 1 : 0, transition: 'opacity 0.4s ease' }} />

                {/* Placeholder */}
                {!qrGenerated && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ padding: '1.5rem' }}>
                    {isGenerating ? (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '40px', height: '40px', border: '2px solid rgba(212,175,55,0.2)', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
                        <p className="text-label color-dim">{t('support.btnGenerating')}</p>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '120px', height: '120px', margin: '0 auto 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '3px', opacity: 0.15 }}>
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} style={{ borderRadius: '2px', backgroundColor: Math.random() > 0.4 ? '#d4af37' : 'transparent', border: '1px solid rgba(212,175,55,0.3)' }} />
                          ))}
                        </div>
                        <p className="text-label color-dim mb-2" style={{ letterSpacing: '0.1em' }}>QRIS DINAMIS</p>
                        <p className="color-dim" style={{ fontSize: '0.75rem', lineHeight: 1.5 }}>
                          <span className="color-gold">{t('support.btnGenerate')}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Amount display */}
              {qrGenerated && (
                <div style={{ textAlign: 'center', marginBottom: '1.5rem', animation: 'fadeIn 0.4s ease-out' }}>
                  <button
                    onClick={handleCopyAmount}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '2px', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,175,55,0.08)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                  >
                    <p className="color-paper" style={{ fontSize: '1.75rem', fontWeight: 300, letterSpacing: '-0.02em' }}>{formatRupiah(amount)}</p>
                    <p className="text-label color-dim mt-1" style={{ letterSpacing: '0.1em' }}>{copied ? t('support.copied') : t('support.tapCopy')}</p>
                  </button>
                </div>
              )}

              {/* Action buttons */}
              {qrGenerated && (
                <div className="flex gap-3" style={{ animation: 'fadeInUp 0.4s ease-out 0.1s both' }}>
                  <button
                    onClick={() => { setQrGenerated(false); setAmount(0); setInputValue(''); setSelectedPreset(null); }}
                    style={{ padding: '0.625rem 1.25rem', border: '1px solid rgba(240,240,240,0.1)', background: 'transparent', color: 'rgba(240,240,240,0.45)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(240,240,240,0.3)'; e.currentTarget.style.color = '#f0f0f0'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(240,240,240,0.1)'; e.currentTarget.style.color = 'rgba(240,240,240,0.45)'; }}
                  >{t('support.btnReset')}</button>
                  <button
                    onClick={handleDownload}
                    style={{ padding: '0.625rem 1.25rem', border: '1px solid rgba(212,175,55,0.4)', background: 'rgba(212,175,55,0.08)', color: '#d4af37', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,175,55,0.18)'; e.currentTarget.style.borderColor = '#d4af37'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212,175,55,0.08)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; }}
                  >{t('support.btnDownload')}</button>
                </div>
              )}

              {/* Supported apps */}
              {!qrGenerated && (
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <p className="text-label color-dim mb-3" style={{ letterSpacing: '0.12em' }}>{t('support.methodsTitle')}</p>
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                    {['GoPay', 'OVO', 'Dana', 'ShopeePay', 'BRI', 'BCA', 'Mandiri', 'BSI'].map((app) => (
                      <span key={app} className="text-label color-dim" style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}>{app}</span>
                    ))}
                  </div>
                  <p className="color-dim mt-1" style={{ fontSize: '0.6rem', letterSpacing: '0.05em' }}>{t('support.methodsDesc')}</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)' }} />
        </div>

        <p className="text-center color-dim mt-10" style={{ fontSize: '0.7rem', letterSpacing: '0.08em', lineHeight: 1.8 }}>
          {t('support.footerDesc')}
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
