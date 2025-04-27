
import { useState, useEffect } from 'react';

type Appearance = 'light' | 'dark' | 'auto';

export function useIOSAppearance() {
  const [appearance, setAppearance] = useState<Appearance>('auto');
  const [systemAppearance, setSystemAppearance] = useState<'light' | 'dark'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    // Listen for system appearance changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemAppearance(e.matches ? 'dark' : 'light');
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Older browsers
    else if ('addListener' in mediaQuery) {
      // @ts-ignore - For older browsers
      mediaQuery.addListener(handleChange);
      return () => {
        // @ts-ignore - For older browsers
        mediaQuery.removeListener(handleChange);
      };
    }
  }, []);

  // Apply the appearance to the document
  useEffect(() => {
    const effectiveAppearance = appearance === 'auto' ? systemAppearance : appearance;
    if (effectiveAppearance === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appearance, systemAppearance]);

  return {
    appearance,
    setAppearance,
    systemAppearance,
    effectiveAppearance: appearance === 'auto' ? systemAppearance : appearance
  };
}
