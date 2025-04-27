import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHapticFeedback } from '@/utils/platformUtils';
import { Button } from '@/components/ui/button';
import { TouchFeedback } from '@/components/ui/ios-feedback';

interface NavigationBarProps {
  title: string;
  largeTitle?: boolean;
  showBackButton?: boolean;
  backButtonLabel?: string;
  onBackButtonClick?: () => void;
  rightElement?: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  className?: string;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  title,
  largeTitle = true,
  showBackButton = false,
  backButtonLabel,
  onBackButtonClick,
  rightElement,
  scrollContainerRef,
  className
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const { scrollY: scrollYProgress } = useScroll({ 
    container: scrollContainerRef 
  });
  
  // Transform values for animations
  const largeTitleOpacity = useTransform(
    scrollYProgress,
    [0, 60],
    [1, 0]
  );
  
  const smallTitleOpacity = useTransform(
    scrollYProgress,
    [0, 60],
    [0, 1]
  );
  
  const handleBackClick = () => {
    triggerHapticFeedback();
    if (onBackButtonClick) {
      onBackButtonClick();
    } else {
      navigate(-1);
    }
  };
  
  // Update scrollY for components that don't use a scroll container ref
  useEffect(() => {
    if (!scrollContainerRef) {
      const handleScroll = () => {
        setScrollY(window.scrollY);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [scrollContainerRef]);
  
  // Calculate opacity values when not using framer-motion's useScroll
  const calculateOpacity = (start: number, end: number, current: number) => {
    if (current <= start) return 0;
    if (current >= end) return 1;
    return (current - start) / (end - start);
  };
  
  const smallTitleOpacityValue = scrollContainerRef 
    ? smallTitleOpacity 
    : calculateOpacity(0, 60, scrollY);
    
  const largeTitleOpacityValue = scrollContainerRef
    ? largeTitleOpacity
    : 1 - calculateOpacity(0, 60, scrollY);

  return (
    <div className={cn(
      "sticky top-0 z-40 bg-white dark:bg-gray-900 pt-safe",
      className
    )}>
      {/* Standard height navigation bar */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          {showBackButton && (
            <TouchFeedback>
              <Button
                variant="ghost"
                size="sm"
                className="mr-2 -ml-2 flex items-center"
                onClick={handleBackClick}
              >
                <ChevronLeft className="h-5 w-5" />
                {backButtonLabel && (
                  <span className="text-sm">{backButtonLabel}</span>
                )}
              </Button>
            </TouchFeedback>
          )}
          
          <motion.h1
            className="text-lg font-semibold"
            style={{ opacity: smallTitleOpacityValue }}
          >
            {title}
          </motion.h1>
        </div>
        
        {rightElement || (
          <TouchFeedback>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </TouchFeedback>
        )}
      </div>
      
      {/* Large title section */}
      {largeTitle && (
        <motion.div
          className="px-4 pb-2 pt-1"
          style={{ opacity: largeTitleOpacityValue }}
        >
          <h1 className="text-3xl font-bold tracking-tight">
            {title}
          </h1>
        </motion.div>
      )}
    </div>
  );
};