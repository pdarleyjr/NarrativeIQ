import React from 'react';
import { Player, PlayerEvent } from '@lottiefiles/react-lottie-player';
import { cn } from '@/lib/utils';

// Animation URLs
const ANIMATIONS = {
  loading: 'https://assets8.lottiefiles.com/packages/lf20_qjosmr4w.json', // Simple dots loading
  success: 'https://assets6.lottiefiles.com/packages/lf20_ot5qzb.json',   // Checkmark success
  error: 'https://assets2.lottiefiles.com/packages/lf20_qpwbiyxf.json',   // Error X
  empty: 'https://assets9.lottiefiles.com/packages/lf20_wnqlfojb.json',   // Empty box
  generating: 'https://assets10.lottiefiles.com/packages/lf20_zzn6j9bi.json', // Text generating
};

export type LottieAnimationType = keyof typeof ANIMATIONS;

interface LottieLoaderProps {
  type?: LottieAnimationType;
  size?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  onComplete?: () => void;
  customAnimationUrl?: string;
}

export const LottieLoader: React.FC<LottieLoaderProps> = ({
  type = 'loading',
  size = 120,
  loop = true,
  autoplay = true,
  className,
  onComplete,
  customAnimationUrl
}) => {
  const animationUrl = customAnimationUrl || ANIMATIONS[type];
  
  const handleEvent = (event: PlayerEvent) => {
    if (event === 'complete' && onComplete) {
      onComplete();
    }
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Player
        src={animationUrl}
        className={cn("player", typeof size === 'number' ? `w-[${size}px] h-[${size}px]` : `w-[${size}] h-[${size}]`)}
        loop={loop}
        autoplay={autoplay}
        keepLastFrame={!loop}
        onEvent={handleEvent}
        style={{ 
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size
        }}
      />
    </div>
  );
};

// Specialized loaders for common use cases
export const GeneratingLoader: React.FC<Omit<LottieLoaderProps, 'type'>> = (props) => (
  <LottieLoader type="generating" {...props} />
);

export const SuccessAnimation: React.FC<Omit<LottieLoaderProps, 'type' | 'loop'>> = (props) => (
  <LottieLoader type="success" loop={false} {...props} />
);

export const ErrorAnimation: React.FC<Omit<LottieLoaderProps, 'type' | 'loop'>> = (props) => (
  <LottieLoader type="error" loop={false} {...props} />
);

export const EmptyStateAnimation: React.FC<Omit<LottieLoaderProps, 'type'>> = (props) => (
  <LottieLoader type="empty" {...props} />
);