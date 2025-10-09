import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import mezLogo from '@/assets/mez-logo.png';

const Header = () => {
  const { isAdmin, signOut } = useAuth();

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between">
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
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm text-gallery-white hover:text-gallery-white/70 transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          {isAdmin ? (
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="text-xs uppercase tracking-wider border-gallery-white/30 text-gallery-white hover:bg-gallery-white hover:text-gallery-black"
            >
              Sign Out
            </Button>
          ) : (
            <Link to="/auth">
              <Button
                variant="outline"
                size="sm"
                className="text-xs uppercase tracking-wider border-gallery-white/30 text-gallery-white hover:bg-gallery-white hover:text-gallery-black"
              >
                Admin Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;