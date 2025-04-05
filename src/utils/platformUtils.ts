
/**
 * Platform detection and iOS-specific utilities
 */

// Detect if running on iOS
export const isIOS = (): boolean => {
  // The MSStream property is used in this check to exclude IE11 which also contains "iPad" in navigator.userAgent
  // We'll add a proper type check to avoid the TypeScript error
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

// Check if app is running in standalone mode (installed on home screen)
export const isInStandaloneMode = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
    (window.navigator as any).standalone === true;
};

// Convert rem to points for iOS touch targets (rough approximation)
export const remToPoints = (rem: number): number => {
  // Base font size is typically 16px, and 1 point ≈ 1px on iOS
  return rem * 16;
};

// Ensure touch targets meet minimum size (44x44 points)
export const isValidTouchTarget = (width: number, height: number): boolean => {
  return width >= 44 && height >= 44;
};

// Haptic feedback simulation (would use native APIs in a real native app)
export const triggerHapticFeedback = (): void => {
  if (window.navigator && 'vibrate' in window.navigator) {
    window.navigator.vibrate(10); // Short vibration
  }
};
