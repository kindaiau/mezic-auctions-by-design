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

  // Vibrant color palette
  const colors = [
    'bg-pink-500', 'bg-pink-400', 'bg-fuchsia-500', 'bg-rose-500',
    'bg-blue-500', 'bg-blue-400', 'bg-cyan-500', 'bg-sky-500',
    'bg-green-500', 'bg-green-400', 'bg-emerald-500', 'bg-teal-500'
  ];

  // Create 12x12 grid (144 pixels) with random colors
  const pixels = Array.from({ length: 144 }, (_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

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
        {pixels.map((pixel) => (
          <motion.div
            key={pixel.id}
            className={pixel.color}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.4,
              delay: (pixel.id * 0.01) + Math.random() * 0.2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default PixelIntro;