
import React from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { WifiOff, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineNoticeProps {
  className?: string;
}

const OfflineNotice: React.FC<OfflineNoticeProps> = ({ className }) => {
  const { isOnline, hasReconnected } = useNetworkStatus();

  if (isOnline && !hasReconnected) return null;

  return (
    <div 
      className={cn(
        "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300",
        isOnline ? "bg-green-500 text-white" : "bg-red-500 text-white",
        isOnline ? "animate-fade-in" : "animate-pulse",
        className
      )}
      style={{ minWidth: '200px', maxWidth: '90%' }}
    >
      {isOnline ? (
        <>
          <Wifi className="h-5 w-5" />
          <span>Back online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-5 w-5" />
          <span>You're offline. Some features may be unavailable.</span>
        </>
      )}
    </div>
  );
};

export { OfflineNotice };
