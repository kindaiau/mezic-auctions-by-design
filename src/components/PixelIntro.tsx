import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface PixelIntroProps {
  onDone?: () => void;
}

const PixelIntro = ({ onDone }: PixelIntroProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      onDone?.();
    }, 1600);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [onDone]);

  useEffect(() => {
    if (!isVisible) {
      const main = document.querySelector('main') as HTMLElement | null;

      if (!main) {
        return;
      }

      const previousTabIndex = main.getAttribute('tabindex');

      if (previousTabIndex === null) {
        main.setAttribute('tabindex', '-1');
      }

      main.focus({ preventScroll: true });

      const handleBlur = () => {
        if (previousTabIndex === null) {
          main.removeAttribute('tabindex');
        }
      };

      main.addEventListener('blur', handleBlur);

      return () => {
        main.removeEventListener('blur', handleBlur);

        if (previousTabIndex === null && document.activeElement !== main) {
          main.removeAttribute('tabindex');
        }
      };
    }
  }, [isVisible]);

  const handleSkip = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setIsVisible(false);
    onDone?.();
  };

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
    >
      <div className="relative h-full w-full">
        <div className="absolute inset-0 flex items-start justify-end p-4">
          <button
            type="button"
            className="rounded-full bg-[hsl(349,71%,80%)] text-[hsl(0,100%,35%)] font-black border-2 border-[hsl(0,100%,35%)] hover:bg-[hsl(349,71%,75%)] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6 py-2 text-xs uppercase tracking-tight"
            onClick={handleSkip}
          >
            SKIP
          </button>
        </div>
        <div className="grid h-full w-full grid-cols-12">
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
      </div>
    </motion.div>
  );
};

export default PixelIntro;