
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { triggerHapticFeedback } from '@/utils/platformUtils';

interface TouchFeedbackProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'subtle';
  feedbackColor?: string;
}

export const TouchFeedback = React.forwardRef<HTMLButtonElement, TouchFeedbackProps>(
  ({ children, className, variant = 'default', feedbackColor, onClick, ...props }, ref) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleTouchStart = () => {
      setIsPressed(true);
      triggerHapticFeedback();
    };

    const handleTouchEnd = () => {
      setIsPressed(false);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <button
        ref={ref}
        className={cn(
          "ios-touch-target relative transition-opacity",
          isPressed && variant === 'default' && "opacity-80",
          isPressed && variant === 'subtle' && "bg-gray-100 dark:bg-gray-800",
          className
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={() => isPressed && setIsPressed(false)}
        onClick={handleClick}
        style={{
          minWidth: '44px',
          minHeight: '44px',
          touchAction: 'manipulation'
        }}
        {...props}
      >
        {children}
        {isPressed && feedbackColor && (
          <div 
            className="absolute inset-0 rounded-full opacity-20 pointer-events-none"
            style={{ backgroundColor: feedbackColor }}
          />
        )}
      </button>
    );
  }
);
TouchFeedback.displayName = "TouchFeedback";

interface FeedbackCircleProps {
  visible: boolean;
  x: number;
  y: number;
  color?: string;
  size?: number;
  duration?: number;
}

export const FeedbackCircle: React.FC<FeedbackCircleProps> = ({ 
  visible, 
  x, 
  y, 
  color = "rgba(0, 0, 0, 0.1)", 
  size = 100,
  duration = 500 
}) => {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (visible) {
      setIsActive(true);
      const timer = setTimeout(() => setIsActive(false), duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  if (!visible && !isActive) return null;
  
  return (
    <div 
      className="fixed pointer-events-none z-50 rounded-full animate-scale-fade"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${x - size/2}px`,
        top: `${y - size/2}px`,
        backgroundColor: color,
        opacity: isActive ? 0.2 : 0,
        transform: `scale(${isActive ? 1 : 0})`,
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`
      }}
    />
  );
};

// Add a simple animation to the global CSS (will be merged with existing CSS)
if (!document.querySelector('#ios-feedback-styles')) {
  const style = document.createElement('style');
  style.id = 'ios-feedback-styles';
  style.innerHTML = `
    @keyframes scale-fade {
      0% { transform: scale(0); opacity: 0.3; }
      100% { transform: scale(1); opacity: 0; }
    }
    .animate-scale-fade {
      animation: scale-fade 0.5s ease-out forwards;
    }
    .ios-touch-target {
      -webkit-tap-highlight-color: transparent;
    }
  `;
  document.head.appendChild(style);
}
