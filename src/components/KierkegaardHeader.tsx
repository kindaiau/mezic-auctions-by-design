import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const KierkegaardHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="flex items-center justify-between">
        {/* Brand Name - Left */}
        <div className="text-gallery-white">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight uppercase">
            MEZ
          </h1>
        </div>

        {/* Navigation - Right */}
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#work"
              className="text-sm text-gallery-white hover:text-gallery-white/70 transition-colors"
            >
              Work
            </a>
            <a
              href="#about"
              className="text-sm text-gallery-white hover:text-gallery-white/70 transition-colors"
            >
              About
            </a>
            <a
              href="#auctions"
              className="text-sm text-gallery-white hover:text-gallery-white/70 transition-colors"
            >
              Auctions
            </a>
          </nav>
          
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs uppercase tracking-wider border-gallery-white/30 text-gallery-white hover:bg-gallery-white hover:text-gallery-black"
          >
            Contact
          </Button>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm"
            className="md:hidden text-gallery-white"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default KierkegaardHeader;
