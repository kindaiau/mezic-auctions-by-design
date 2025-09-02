import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gallery-black relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-gallery-white/[0.02] to-transparent bg-[length:100%_2px] animate-pulse" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="text-center"
      >
        <h1 
          className="font-bold tracking-tight text-gallery-white relative group cursor-default"
          style={{ 
            fontSize: 'clamp(48px, 12vw, 220px)',
            lineHeight: '0.9',
            letterSpacing: '-0.02em'
          }}
        >
          <span className="relative inline-block transition-all duration-300 group-hover:text-shadow-rgb">
            ARTIST
          </span>
        </h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className="mt-8 text-gallery-white/60 text-lg tracking-wider uppercase"
        >
          Contemporary Auctions
        </motion.p>
      </motion.div>

      {/* RGB split hover effect styles */}
      <style>{`
        .text-shadow-rgb {
          text-shadow: 
            2px 0 0 #ff0000,
            -2px 0 0 #00ff00,
            0 2px 0 #0000ff;
        }
      `}</style>
    </section>
  );
};

export default Hero;