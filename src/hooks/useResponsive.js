import { useState, useEffect } from 'react';

// We define "mobile" as anything less than 1024px (the "lg" breakpoint)
const MOBILE_BREAKPOINT = 1024; 

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isMobile };
}