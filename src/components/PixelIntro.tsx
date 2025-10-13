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

  // Brand color palette
  const colors = ['#FFA7BC', '#F8FF0A', '#2C4C3A'];

  // Create 12x12 grid (144 pixels) with random colors
  const pixels = Array.from({ length: 144 }, (_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-white"
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
            style={{ backgroundColor: pixel.color }}
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