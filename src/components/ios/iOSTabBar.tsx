import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, FileText, Settings, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHapticFeedback } from '@/utils/platformUtils';

interface TabItem {
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  label: string;
  path: string;
}

interface TabBarProps {
  className?: string;
}

export const iOSTabBar: React.FC<TabBarProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const tabs: TabItem[] = [
    {
      icon: <Home className="h-6 w-6" />,
      activeIcon: <Home className="h-6 w-6 fill-current" />,
      label: 'Home',
      path: '/'
    },
    {
      icon: <FileText className="h-6 w-6" />,
      activeIcon: <FileText className="h-6 w-6 fill-current" />,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      activeIcon: <BookOpen className="h-6 w-6 fill-current" />,
      label: 'Knowledge',
      path: '/knowledge-base'
    },
    {
      icon: <Settings className="h-6 w-6" />,
      activeIcon: <Settings className="h-6 w-6 fill-current" />,
      label: 'Settings',
      path: '/settings'
    }
  ];

  const handleTabClick = (path: string) => {
    triggerHapticFeedback();
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <div className={cn(
      "fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe",
      className
    )}>
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          
          return (
            <motion.button
              key={tab.path}
              className="flex flex-col items-center justify-center w-full h-full"
              onClick={() => handleTabClick(tab.path)}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 10
              }}
            >
              <div className="relative">
                {active ? tab.activeIcon || tab.icon : tab.icon}
                {active && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-ems-600 dark:bg-ems-400 rounded-full"
                    layoutId="tabIndicator"
                    transition={{
                      type: 'spring',
                      stiffness: 100,
                      damping: 10
                    }}
                  />
                )}
              </div>
              <span className={cn(
                "text-xs mt-1",
                active ? "text-ems-600 dark:text-ems-400 font-medium" : "text-gray-600 dark:text-gray-400"
              )}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default iOSTabBar;