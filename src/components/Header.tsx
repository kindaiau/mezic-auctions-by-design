import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import mezLogo from '@/assets/mez-logo-optimized.webp';

const Header = () => {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 bg-transparent"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between">
        {/* Brand Logo - Left */}
        <div className="bg-white p-1 rounded">
          <img 
            src={mezLogo} 
            alt="MEZ" 
            width="56"
            height="50"
            className="h-8 md:h-10 w-auto"
            style={{ 
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              filter: 'brightness(0)'
            }}
          />
        </div>

        {/* Contact Button */}
        <Button
          variant="gold-solid"
          className="text-xs uppercase tracking-tight px-6 py-2"
        >
          CONTACT
        </Button>
      </div>
    </motion.header>
  );
};

export default Header;