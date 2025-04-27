import { useState, useEffect } from 'react';

export function useAddToHomeScreen() {
  const [installed, setInstalled] = useState(false);
  
  useEffect(() => {
    // Check if the app is already installed (running in standalone mode)
    if ('standalone' in navigator && (navigator as any).standalone) {
      setInstalled(true);
    }
    
    // Check if running in display-mode: standalone (for Android)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }
  }, []);
  
  return installed;
}