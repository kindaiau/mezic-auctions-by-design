import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import mezLogo from '@/assets/mez-logo-optimized.webp';

const Header = () => {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between">
        {/* Brand Logo - Left */}
        <img 
          src={mezLogo} 
          alt="MEZ" 
          className="h-8 md:h-10 w-auto"
          style={{ 
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)'
          }}
        />

        {/* Desktop Navigation */}
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#work"
              className="text-sm text-black hover:text-black/70 transition-colors"
            >
              Work
            </a>
            <a
              href="#about"
              className="text-sm text-black hover:text-black/70 transition-colors"
            >
              About
            </a>
            <a
              href="#auctions"
              className="text-sm text-black hover:text-black/70 transition-colors"
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
    </motion.header>
  );
};

export default Header;