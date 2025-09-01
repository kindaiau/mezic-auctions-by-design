import { Instagram, Facebook, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gallery-black py-16 px-4 border-t border-artist-gold/20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gallery-white">
              Mariana <span className="text-artist-gold">Mezic</span>
            </h3>
            <p className="text-gallery-white/70 leading-relaxed">
              Contemporary artist pioneering social media art auctions from Adelaide, Australia.
            </p>
            <div className="flex items-center space-x-2 text-gallery-white/60">
              <MapPin className="w-4 h-4" />
              <span>Adelaide, South Australia</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gallery-white">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <a href="#auctions" className="text-gallery-white/70 hover:text-artist-gold transition-colors">
                Current Auctions
              </a>
              <a href="#about" className="text-gallery-white/70 hover:text-artist-gold transition-colors">
                About the Artist
              </a>
              <a href="#subscribe" className="text-gallery-white/70 hover:text-artist-gold transition-colors">
                Auction Alerts
              </a>
              <a href="#contact" className="text-gallery-white/70 hover:text-artist-gold transition-colors">
                Contact
              </a>
            </nav>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gallery-white">Connect</h4>
            <div className="space-y-3">
              <a 
                href="mailto:hello@marianamezic.com" 
                className="flex items-center space-x-3 text-gallery-white/70 hover:text-artist-gold transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>hello@marianamezic.com</span>
              </a>
              
              <div className="flex space-x-4 mt-4">
                <a 
                  href="https://instagram.com/mariana.mezic" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-charcoal rounded-full flex items-center justify-center text-gallery-white hover:text-artist-gold hover:bg-artist-gold/20 transition-all duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://facebook.com/mariana.mezic" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-charcoal rounded-full flex items-center justify-center text-gallery-white hover:text-artist-gold hover:bg-artist-gold/20 transition-all duration-300"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-artist-gold/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gallery-white/60 text-sm">
            © 2024 Mariana Mezic. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#privacy" className="text-gallery-white/60 hover:text-artist-gold text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-gallery-white/60 hover:text-artist-gold text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;