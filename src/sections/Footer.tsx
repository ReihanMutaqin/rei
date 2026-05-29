export default function Footer() {
  return (
    <footer
      className="relative w-full"
      style={{
        height: '80px',
        borderTop: '1px solid rgba(240, 240, 240, 0.12)',
        backgroundColor: '#0a0a0a',
      }}
    >
      <div
        className="mx-auto px-8 h-full flex items-center justify-between"
        style={{ maxWidth: '1400px' }}
      >
        <span className="text-label color-dim">© 2024 Reihan Mutaqin</span>

        <div
          className="w-4 h-4 rounded-full"
          style={{ border: '1px solid rgba(240, 240, 240, 0.12)' }}
        />

        <span className="text-label color-dim">Built with passion</span>
      </div>
    </footer>
  );
}
