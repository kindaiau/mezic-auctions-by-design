import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gallery-black/95 backdrop-blur-sm border-b border-artist-gold/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gallery-white">
              Mariana <span className="text-artist-gold">Mezic</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#auctions" className="text-gallery-white hover:text-artist-gold transition-colors">
              Current Auctions
            </a>
            <a href="#about" className="text-gallery-white hover:text-artist-gold transition-colors">
              About
            </a>
            <a href="#subscribe" className="text-gallery-white hover:text-artist-gold transition-colors">
              Stay Updated
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <Button 
            variant="minimal" 
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-artist-gold/20">
            <div className="flex flex-col space-y-4">
              <a 
                href="#auctions" 
                className="text-gallery-white hover:text-artist-gold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Current Auctions
              </a>
              <a 
                href="#about" 
                className="text-gallery-white hover:text-artist-gold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="#subscribe" 
                className="text-gallery-white hover:text-artist-gold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Stay Updated
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;