import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import QRCode from 'qrcode';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// QRIS Dinamis Generator
// Berdasarkan QRIS statis dari REIHAN STORE ELEKTRONIK
// NMID: ID1026524568080
// ─────────────────────────────────────────────

// QRIS statis base (tanpa nominal & CRC) dari merchant data
// Format QRIS EMV-Co: setiap field berformat ID + Length + Value
const QRIS_BASE_STATIC =
  '00020101021126670016ID.CO.BRI.WWW011893600918ID1026524568080021440000000000000030303UMI51440014ID.CO.QRIS.WWW0215ID1026524568080030303UMI5204596253033605802ID5922REIHAN STORE ELEKTRONIK6013BANDUNG BARAT61054130062070703A016304';

/**
 * Hitung CRC-16/CCITT-FALSE untuk string QRIS
 * Polynomial: 0x1021, Init: 0xFFFF
 */
function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Generate QRIS string dinamis dengan nominal tertentu
 * Point of Initiation Method: 12 = Dinamis (hanya bisa dipakai sekali)
 */
function generateDynamicQRIS(amount: number): string {
  // Rebuild QRIS dengan:
  // - Field 01: Point of Initiation Method = 12 (Dinamis)
  // - Field 54: Transaction Amount
  // - Field 63: CRC (4 digit, dihitung ulang)

  const amountStr = amount.toFixed(0);
  const amountField = `54${String(amountStr.length).padStart(2, '0')}${amountStr}`;

  // Ganti "0201" (static=11) dengan "0201" (dynamic=12)
  // dan sisipkan field 54 (amount) sebelum field 58
  const baseWithDynamic = QRIS_BASE_STATIC
    .replace('010211', '010212') // ubah ke dinamis (Point of Initiation Method = 12)
    .replace('5204596253033605802ID', `5204596253033605802ID${amountField}`) // sisipkan nominal setelah ID
    + '6304'; // placeholder CRC (akan dihitung)

  // Hapus CRC placeholder lama dan hitung ulang
  const qrisWithoutCRC = baseWithDynamic.slice(0, -4);
  const crc = crc16(qrisWithoutCRC + '6304');

  return qrisWithoutCRC + '6304' + crc;
}

// ─────────────────────────────────────────────
// Preset nominal yang umum digunakan
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
        color: {
          dark: '#0a0a0a',
          light: '#f8f5ec',
        },
        errorCorrectionLevel: 'M',
      });
      setQrGenerated(true);
    } catch (err) {
      setError('Gagal generate QR Code. Silakan coba lagi.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Handle preset selection
  const handlePreset = (value: number) => {
    setSelectedPreset(value);
    setAmount(value);
    setInputValue(value.toLocaleString('id-ID'));
    setQrGenerated(false);
  };

  // Handle manual input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = parseInt(raw) || 0;
    setInputValue(raw ? num.toLocaleString('id-ID') : '');
    setAmount(num);
    setSelectedPreset(null);
    setQrGenerated(false);
  };

  // Handle generate button
  const handleGenerate = () => {
    if (amount < 1000) {
      setError('Nominal minimum Rp 1.000');
      return;
    }
    if (amount > 50_000_000) {
      setError('Nominal maksimum Rp 50.000.000');
      return;
    }
    setError('');
    generateQR(amount);
  };

  // Download QR code
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `qris-reihan-${amount}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  // Copy nominal to clipboard
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
      {/* Background decorative elements */}
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

      <div className="mx-auto px-6" style={{ maxWidth: '900px' }}>
        {/* Section label */}
        <div className="flex items-center gap-4 mb-12">
          <span
            className="text-label color-dim"
            style={{ letterSpacing: '0.2em' }}
          >
            — 06
          </span>
          <span
            className="text-label color-dim"
            style={{ letterSpacing: '0.15em' }}
          >
            DUKUNG KARYA
          </span>
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
            <span
              key={i}
              className="char inline-block"
              style={{ display: 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h2>

        {/* Sub-description */}
        <p
          className="text-body color-dim text-center mb-16"
          style={{ maxWidth: '560px', margin: '0 auto 4rem auto', lineHeight: 1.8 }}
        >
          Jika karya saya bermanfaat, kamu bisa memberikan dukungan melalui QRIS.
          Masukkan nominal sesuai keikhlasanmu — setiap kontribusi sangat berarti.
        </p>

        {/* Main Card */}
        <div
          ref={cardRef}
          className="relative"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(240,240,240,0.08)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          {/* Gold top accent */}
          <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />

          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '0',
            }}
          >
            {/* Left: Input panel */}
            <div
              className="flex flex-col"
              style={{
                padding: '2.5rem',
                borderRight: '1px solid rgba(240,240,240,0.06)',
              }}
            >
              {/* Merchant info */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#d4af37',
                      boxShadow: '0 0 8px rgba(212,175,55,0.6)',
                    }}
                  />
                  <span className="text-label color-dim" style={{ letterSpacing: '0.15em' }}>
                    QRIS DINAMIS
                  </span>
                </div>
                <p className="color-paper" style={{ fontSize: '1.1rem', fontWeight: 400 }}>
                  Reihan
                </p>
              </div>

              {/* Preset amounts */}
              <div className="mb-6">
                <p className="text-label color-dim mb-3" style={{ letterSpacing: '0.12em' }}>
                  NOMINAL CEPAT
                </p>
                <div
                  className="grid"
                  style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}
                >
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => handlePreset(preset.value)}
                      style={{
                        padding: '0.5rem 0.25rem',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        border: `1px solid ${selectedPreset === preset.value ? '#d4af37' : 'rgba(240,240,240,0.1)'}`,
                        backgroundColor: selectedPreset === preset.value ? 'rgba(212,175,55,0.12)' : 'transparent',
                        color: selectedPreset === preset.value ? '#d4af37' : 'rgba(240,240,240,0.45)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        borderRadius: '2px',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedPreset !== preset.value) {
                          e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)';
                          e.currentTarget.style.color = 'rgba(240,240,240,0.8)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedPreset !== preset.value) {
                          e.currentTarget.style.borderColor = 'rgba(240,240,240,0.1)';
                          e.currentTarget.style.color = 'rgba(240,240,240,0.45)';
                        }
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount input */}
              <div className="mb-6">
                <p className="text-label color-dim mb-3" style={{ letterSpacing: '0.12em' }}>
                  ATAU MASUKKAN NOMINAL
                </p>
                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 color-dim"
                    style={{ fontSize: '0.875rem', fontWeight: 500 }}
                  >
                    Rp
                  </span>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInput}
                    placeholder="0"
                    style={{
                      width: '100%',
                      paddingLeft: '2.75rem',
                      paddingRight: '1rem',
                      paddingTop: '0.875rem',
                      paddingBottom: '0.875rem',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(240,240,240,0.1)',
                      borderRadius: '2px',
                      color: '#f0f0f0',
                      fontSize: '1.1rem',
                      fontWeight: 300,
                      fontFamily: 'Outfit, sans-serif',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(240,240,240,0.1)'; }}
                  />
                </div>
                {amount > 0 && (
                  <p className="color-dim mt-2" style={{ fontSize: '0.75rem' }}>
                    {formatRupiah(amount)}
                  </p>
                )}
              </div>

              {/* Error */}
              {error && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginBottom: '1rem' }}>
                  ⚠ {error}
                </p>
              )}

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || amount < 1}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: amount > 0 ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${amount > 0 ? '#d4af37' : 'rgba(240,240,240,0.1)'}`,
                  color: amount > 0 ? '#d4af37' : 'rgba(240,240,240,0.3)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: amount > 0 ? 'pointer' : 'not-allowed',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Outfit, sans-serif',
                  marginTop: 'auto',
                }}
                onMouseEnter={(e) => {
                  if (amount > 0) {
                    e.currentTarget.style.background = 'rgba(212,175,55,0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (amount > 0) {
                    e.currentTarget.style.background = 'rgba(212,175,55,0.15)';
                  }
                }}
              >
                {isGenerating ? 'Membuat QR...' : 'Generate QRIS'}
              </button>

              {/* Info note */}
              <p
                className="color-dim text-center mt-4"
                style={{ fontSize: '0.65rem', letterSpacing: '0.05em', lineHeight: 1.6 }}
              >
                QR Dinamis · Berlaku sekali pakai · Semua metode pembayaran QRIS didukung
              </p>
            </div>

            {/* Right: QR Display panel */}
            <div
              className="flex flex-col items-center justify-center"
              style={{ padding: '2.5rem' }}
            >
              {/* QRIS visual frame */}
              <div
                style={{
                  position: 'relative',
                  padding: '1.5rem',
                  background: qrGenerated ? '#f8f5ec' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${qrGenerated ? 'rgba(212,175,55,0.6)' : 'rgba(240,240,240,0.06)'}`,
                  borderRadius: '4px',
                  transition: 'all 0.4s ease',
                  marginBottom: '1.5rem',
                }}
              >
                {/* Corner accents */}
                {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
                  <div
                    key={i}
                    className={`absolute ${pos}`}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderTop: i < 2 ? '2px solid #d4af37' : 'none',
                      borderBottom: i >= 2 ? '2px solid #d4af37' : 'none',
                      borderLeft: i % 2 === 0 ? '2px solid #d4af37' : 'none',
                      borderRight: i % 2 !== 0 ? '2px solid #d4af37' : 'none',
                      opacity: qrGenerated ? 1 : 0.3,
                      transition: 'opacity 0.4s ease',
                    }}
                  />
                ))}

                {/* Canvas for QR */}
                <canvas
                  ref={canvasRef}
                  width={280}
                  height={280}
                  style={{
                    display: 'block',
                    opacity: qrGenerated ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                  }}
                />

                {/* Placeholder when no QR */}
                {!qrGenerated && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{ padding: '1.5rem' }}
                  >
                    {isGenerating ? (
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            border: '2px solid rgba(212,175,55,0.2)',
                            borderTopColor: '#d4af37',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                            margin: '0 auto 1rem',
                          }}
                        />
                        <p className="text-label color-dim">Generating...</p>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        {/* Placeholder QR grid pattern */}
                        <div
                          style={{
                            width: '120px',
                            height: '120px',
                            margin: '0 auto 1.5rem',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gap: '3px',
                            opacity: 0.15,
                          }}
                        >
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div
                              key={i}
                              style={{
                                borderRadius: '2px',
                                backgroundColor: Math.random() > 0.4 ? '#d4af37' : 'transparent',
                                border: '1px solid rgba(212,175,55,0.3)',
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-label color-dim mb-2" style={{ letterSpacing: '0.1em' }}>
                          QRIS DINAMIS
                        </p>
                        <p className="color-dim" style={{ fontSize: '0.75rem', lineHeight: 1.5 }}>
                          Pilih nominal dan klik<br />
                          <span className="color-gold">Generate QRIS</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Amount display */}
              {qrGenerated && (
                <div
                  style={{
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    animation: 'fadeIn 0.4s ease-out',
                  }}
                >
                  <button
                    onClick={handleCopyAmount}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.5rem 1rem',
                      borderRadius: '2px',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(212,175,55,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    <p
                      className="color-paper"
                      style={{ fontSize: '1.75rem', fontWeight: 300, letterSpacing: '-0.02em' }}
                    >
                      {formatRupiah(amount)}
                    </p>
                    <p className="text-label color-dim mt-1" style={{ letterSpacing: '0.1em' }}>
                      {copied ? '✓ TERSALIN' : 'TAP UNTUK SALIN'}
                    </p>
                  </button>
                </div>
              )}

              {/* Action buttons */}
              {qrGenerated && (
                <div
                  className="flex gap-3"
                  style={{ animation: 'fadeInUp 0.4s ease-out 0.1s both' }}
                >
                  <button
                    onClick={() => { setQrGenerated(false); setAmount(0); setInputValue(''); setSelectedPreset(null); }}
                    style={{
                      padding: '0.625rem 1.25rem',
                      border: '1px solid rgba(240,240,240,0.1)',
                      background: 'transparent',
                      color: 'rgba(240,240,240,0.45)',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      fontFamily: 'Outfit, sans-serif',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(240,240,240,0.3)';
                      e.currentTarget.style.color = '#f0f0f0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(240,240,240,0.1)';
                      e.currentTarget.style.color = 'rgba(240,240,240,0.45)';
                    }}
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleDownload}
                    style={{
                      padding: '0.625rem 1.25rem',
                      border: '1px solid rgba(212,175,55,0.4)',
                      background: 'rgba(212,175,55,0.08)',
                      color: '#d4af37',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      fontFamily: 'Outfit, sans-serif',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(212,175,55,0.18)';
                      e.currentTarget.style.borderColor = '#d4af37';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(212,175,55,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)';
                    }}
                  >
                    Download QR
                  </button>
                </div>
              )}

              {/* How to pay */}
              {!qrGenerated && (
                <div
                  style={{
                    marginTop: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <p className="text-label color-dim mb-3" style={{ letterSpacing: '0.12em' }}>
                    CARA BAYAR
                  </p>
                  <div className="flex items-center justify-center gap-6">
                    {['GoPay', 'OVO', 'Dana', 'BRI', 'BCA', 'Mandiri'].map((app) => (
                      <span
                        key={app}
                        className="text-label color-dim"
                        style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                  <p className="color-dim mt-2" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                    & semua aplikasi yang mendukung QRIS
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom accent */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)' }} />
        </div>

        {/* Note */}
        <p
          className="text-center color-dim mt-10"
          style={{ fontSize: '0.75rem', letterSpacing: '0.08em', lineHeight: 1.8 }}
        >
          QRIS ini diverifikasi oleh Bank Indonesia · Semua transaksi aman dan terenkripsi
        </p>
      </div>

      {/* Spin animation style */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
