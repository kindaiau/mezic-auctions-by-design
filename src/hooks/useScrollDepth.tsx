import { useEffect, useRef } from 'react';
import { trackScrollDepth } from '@/lib/tracking';

/**
 * Hook to track scroll depth at 25%, 50%, 75%, and 100%
 */
export function useScrollDepth() {
  const depthsTracked = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

      // Track at specific milestones
      const milestones = [25, 50, 75, 100];
      
      milestones.forEach(milestone => {
        if (scrollPercentage >= milestone && !depthsTracked.current.has(milestone)) {
          depthsTracked.current.add(milestone);
          trackScrollDepth(milestone);
        }
      });
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);
}
