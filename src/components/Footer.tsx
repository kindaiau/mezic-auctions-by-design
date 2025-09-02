import { Button } from '@/components/ui/button';
import { Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-16 md:py-24 bg-gallery-black border-t border-gallery-white/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-gallery-white mb-4" style={{ color: 'hsl(var(--mez-blush))' }}>
              MEZ
            </h3>
            <p className="text-gallery-white/60 mb-4">
              Contemporary artist pioneering social media art auctions in Adelaide.
            </p>
            <p className="text-gallery-white/40 text-sm">
              Adelaide, Australia
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-medium text-gallery-white/80 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <div className="space-y-2">
              <a href="#auctions" className="block text-gallery-white/60 hover:text-gallery-white transition-colors">
                Current Auctions
              </a>
              <a href="#about" className="block text-gallery-white/60 hover:text-gallery-white transition-colors">
                About
              </a>
              <a href="#alerts" className="block text-gallery-white/60 hover:text-gallery-white transition-colors">
                Auction Alerts
              </a>
              <a href="#contact" className="block text-gallery-white/60 hover:text-gallery-white transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-medium text-gallery-white/80 uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="space-y-4">
              <p className="text-gallery-white/60">
                <a href="mailto:hello@mezauctions.com" className="hover:text-gallery-white transition-colors">
                  hello@mezauctions.com
                </a>
              </p>
              
              <Button
                variant="outline"
                size="sm"
                className="border-gallery-white/30 text-gallery-white hover:bg-gallery-white hover:text-gallery-black"
                asChild
              >
                <a 
                  href="https://instagram.com/marianamezic_artist" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Instagram size={16} />
                  Follow on Instagram
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gallery-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gallery-white/40 text-sm">
            © 2024 Mez Auctions. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#privacy" className="text-gallery-white/40 hover:text-gallery-white/60 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-gallery-white/40 hover:text-gallery-white/60 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;