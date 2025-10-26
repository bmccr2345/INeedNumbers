import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive media queries
 * @param {string} query - Media query string (e.g., '(max-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client flag to prevent SSR issues
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Check if window.matchMedia is available (Safari compatibility)
    if (typeof window === 'undefined' || !window.matchMedia) {
      console.warn('[useMediaQuery] window.matchMedia not available');
      return;
    }

    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    // Create listener for changes
    const listener = (e) => {
      setMatches(e.matches);
    };

    // Use modern addEventListener if available, fallback to addListener for older Safari
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // Fallback for older browsers
      media.addListener(listener);
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query, isClient]);

  return matches;
}

/**
 * Predefined breakpoint hooks for common use cases
 */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
