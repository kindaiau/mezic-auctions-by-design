import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 px-6 bg-gallery-black text-gallery-white">
      <div className="container mx-auto max-w-4xl flex items-center justify-between">
        <div className="text-sm">© {new Date().getFullYear()} Mariana Mezic — All rights reserved</div>
        <div className="flex space-x-4">
          <a href="https://instagram.com/marianamezic_artist" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gallery-gold">
            {/* Instagram SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>

          <a href="https://facebook.com/MarianaMezicartist" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-gallery-gold">
            {/* Facebook SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3V2z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;