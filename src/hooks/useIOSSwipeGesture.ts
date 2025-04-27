import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { triggerHapticFeedback } from '@/utils/platformUtils';

interface SwipeOptions {
  threshold?: number;
  minDistance?: number;
  maxTime?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeState {
  startX: number;
  startY: number;
  startTime: number;
  endX: number;
  endY: number;
  endTime: number;
}

export function useIOSSwipeGesture(options: SwipeOptions = {}) {
  const {
    threshold = 50,
    minDistance = 50,
    maxTime = 500,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown
  } = options;

  const [swiping, setSwiping] = useState(false);
  const swipeState = useRef<SwipeState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    endX: 0,
    endY: 0,
    endTime: 0
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    swipeState.current = {
      ...swipeState.current,
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now()
    };
    setSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swiping) return;
    
    const touch = e.touches[0];
    swipeState.current = {
      ...swipeState.current,
      endX: touch.clientX,
      endY: touch.clientY,
      endTime: Date.now()
    };
  };

  const handleTouchEnd = () => {
    if (!swiping) return;
    
    const { startX, startY, startTime, endX, endY, endTime } = swipeState.current;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const deltaTime = endTime - startTime;
    
    // Only process swipe if it happened within the time threshold
    if (deltaTime <= maxTime) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      
      // Horizontal swipe
      if (absX > absY && absX > minDistance) {
        if (deltaX > threshold && onSwipeRight) {
          triggerHapticFeedback();
          onSwipeRight();
        } else if (deltaX < -threshold && onSwipeLeft) {
          triggerHapticFeedback();
          onSwipeLeft();
        }
      } 
      // Vertical swipe
      else if (absY > absX && absY > minDistance) {
        if (deltaY > threshold && onSwipeDown) {
          triggerHapticFeedback();
          onSwipeDown();
        } else if (deltaY < -threshold && onSwipeUp) {
          triggerHapticFeedback();
          onSwipeUp();
        }
      }
    }
    
    setSwiping(false);
  };

  const handlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchEnd
  };

  return {
    swiping,
    handlers
  };
}

// Helper hook for swipe-to-go-back functionality
export function useIOSSwipeToGoBack() {
  const navigate = useNavigate();
  
  return useIOSSwipeGesture({
    onSwipeRight: () => navigate(-1),
    threshold: 100
  });
}

// Helper hook for pull-to-refresh functionality
export function useIOSPullToRefresh(onRefresh: () => void) {
  const [refreshing, setRefreshing] = useState(false);
  const pullStartY = useRef(0);
  const pullMoveY = useRef(0);
  const refreshThreshold = 150; // Pixels to pull down to trigger refresh
  const distanceRef = useRef(0);
  
  const handleTouchStart = (e: TouchEvent) => {
    const touchY = e.touches[0].clientY;
    pullStartY.current = touchY;
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    const touchY = e.touches[0].clientY;
    pullMoveY.current = touchY;
    
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    
    // Only allow pull-to-refresh when at the top of the page
    if (scrollTop === 0) {
      const distance = pullMoveY.current - pullStartY.current;
      
      if (distance > 0) {
        // Prevent default to disable native scroll
        e.preventDefault();
        
        // Apply resistance to make the pull feel more natural
        distanceRef.current = distance * 0.5;
      }
    }
  };
  
  const handleTouchEnd = () => {
    if (distanceRef.current >= refreshThreshold && !refreshing) {
      // Trigger refresh
      setRefreshing(true);
      triggerHapticFeedback();
      
      // Call the refresh callback
      onRefresh();
      
      // Reset after some time to simulate the refresh completing
      setTimeout(() => {
        setRefreshing(false);
        distanceRef.current = 0;
      }, 2000);
    } else {
      // Reset without refreshing
      distanceRef.current = 0;
    }
  };
  
  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [refreshing, onRefresh]);
  
  return {
    refreshing,
    pullDistance: distanceRef.current
  };
}