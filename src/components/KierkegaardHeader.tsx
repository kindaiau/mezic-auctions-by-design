import { Button } from '@/components/ui/button';

const KierkegaardHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="flex items-center justify-between">
        {/* Brand Name - Left */}
        <h1 className="text-xl font-bold tracking-tight uppercase text-gallery-white md:text-6xl">MEZ</h1>

        {/* Mobile Auction Label */}
        <span className="text-sm uppercase text-gallery-white md:hidden">auction</span>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-8">
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
            variant="mez"
            className="text-xs uppercase tracking-tight px-6 py-2"
          >
            CONTACT
          </Button>
        </div>
      </div>
    </header>
  );
};

export default KierkegaardHeader;
