import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between">
        {/* Brand Name - Left */}
        <h1 
          className="text-xl font-bold tracking-tight uppercase md:text-2xl text-gallery-white"
          style={{ 
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
            fontWeight: '700'
          }}
        >
          MEZ
        </h1>

        {/* Desktop Navigation */}
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
        </div>
      </div>
    </motion.header>
  );
};

export default Header;