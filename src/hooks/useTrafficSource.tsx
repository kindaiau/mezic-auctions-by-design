import { useEffect } from 'react';
import { initializeTracking } from '@/lib/tracking';

/**
 * Hook to initialize traffic source tracking on mount
 * Should be used once at the app level
 */
export function useTrafficSource() {
  useEffect(() => {
    // Initialize tracking on first load
    initializeTracking();
  }, []);
}
