'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current device is mobile
 * Combines screen width detection with device type detection for reliability
 * 
 * @param breakpoint - Screen width breakpoint (default: 768px)
 * @returns boolean - true if mobile device or small screen
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // Check screen width
      const isSmallScreen = window.innerWidth <= breakpoint;
      
      // Check device type via user agent
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        navigator.userAgent.toLowerCase()
      );
      
      // Consider mobile if either condition is true
      setIsMobile(isSmallScreen || isMobileDevice);
    };

    // Initial check
    checkIsMobile();

    // Listen for resize events
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);

  return isMobile;
}

