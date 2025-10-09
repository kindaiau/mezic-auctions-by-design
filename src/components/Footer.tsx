const alternateColors = (text: string) => {
  return text.split('').map((char, index) => {
    const color = index % 2 === 0 
      ? 'hsl(var(--mez-red))' 
      : 'hsl(var(--mez-blush))';
    return <span key={index} style={{ color }}>{char}</span>;
  });
};

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          {alternateColors(`© ${new Date().getFullYear()} Mariana Mezic`)}
        </p>
        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com/marianamezic_artist"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 hover:bg-white/10"
            aria-label="Follow on Instagram"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
              style={{ color: 'hsl(var(--mez-red))' }}
            >
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6zM18.5 6.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
            {alternateColors('Instagram')}
          </a>
          <a
            href="https://www.facebook.com/therealmarianamezic"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 hover:bg-white/10"
            aria-label="Follow on Facebook"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
              style={{ color: '#1877F2' }}
            >
              <path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.35 2 1.87 6.48 1.87 12.07c0 4.99 3.65 9.13 8.43 9.93v-7.03H7.9v-2.9h2.4V9.87c0-2.38 1.42-3.7 3.58-3.7 1.04 0 2.13.19 2.13.19v2.34h-1.2c-1.19 0-1.56.74-1.56 1.5v1.8h2.66l-.43 2.9h-2.23V22c4.78-.8 8.43-4.94 8.43-9.93z" />
            </svg>
            {alternateColors('Facebook')}
          </a>
        </div>
      </div>
    </footer>
  );
}
