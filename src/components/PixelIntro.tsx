import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PixelIntroProps {
  onDone?: () => void;
}

const PixelIntro = ({ onDone }: PixelIntroProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onDone?.();
    }, 1600);

    return () => clearTimeout(timer);
  }, [onDone]);

  // Create 12x12 grid (144 pixels)
  const pixels = Array.from({ length: 144 }, (_, i) => i);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-gallery-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 1.3 }}
      style={{ pointerEvents: 'none' }}
    >
      <div className="grid grid-cols-12 h-full w-full">
        {pixels.map((index) => (
          <motion.div
            key={index}
            className="bg-gallery-white"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.4,
              delay: (index * 0.01) + Math.random() * 0.2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default PixelIntro;