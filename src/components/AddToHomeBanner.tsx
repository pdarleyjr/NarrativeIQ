import React, { useState } from 'react';
import { useAddToHomeScreen } from '@/hooks/useAddToHomeScreen';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isIOS } from '@/utils/platformUtils';

export const AddToHomeBanner: React.FC = () => {
  const installed = useAddToHomeScreen();
  const [dismissed, setDismissed] = useState(() => {
    const saved = localStorage.getItem('pwa-banner-dismissed');
    return saved ? JSON.parse(saved) : false;
  });

  // Don't show if already installed or dismissed
  if (installed || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  const handleShowInstructions = () => {
    if (isIOS()) {
      alert('To install this app on your iPhone:\n\n1. Tap the Share button at the bottom of the screen\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top right corner');
    } else {
      alert('To install this app on your device:\n\n1. Tap the menu button (three dots) in your browser\n2. Tap "Install App" or "Add to Home Screen"\n3. Follow the on-screen instructions');
    }
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 bg-ems-600/90 backdrop-blur-sm text-white shadow-lg animate-fadeIn">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 mr-4">
          <p className="font-medium">Install EZ Narratives for a native app experience</p>
          <p className="text-sm opacity-90 mt-1">Access offline, faster loading, and full-screen mode</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-white/20"
            onClick={handleShowInstructions}
          >
            Install
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={handleDismiss}
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};