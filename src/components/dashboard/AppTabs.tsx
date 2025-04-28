import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Stethoscope, FileText } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AppTabs: React.FC<AppTabsProps> = ({ activeTab, onTabChange }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-center py-2 px-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 flex w-full max-w-md">
        <TabButton 
          isActive={activeTab === 'chat'} 
          onClick={() => onTabChange('chat')}
          icon={<MessageSquare className="h-4 w-4 mr-2" />}
          label="Chat"
        />
        <TabButton 
          isActive={activeTab === 'ems'} 
          onClick={() => onTabChange('ems')}
          icon={<Stethoscope className="h-4 w-4 mr-2" />}
          label="EMS"
        />
        <TabButton 
          isActive={activeTab === 'nfirs'} 
          onClick={() => onTabChange('nfirs')}
          icon={<FileText className="h-4 w-4 mr-2" />}
          label="NFIRS"
        />
      </div>
    </div>
  );
};

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, icon, label }) => {
  return (
    <button
      className={`relative flex-1 flex items-center justify-center py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
      }`}
      onClick={onClick}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-indigo-600 rounded-full"
          layoutId="tab-indicator"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
      <span className="relative flex items-center">
        {icon}
        {label}
      </span>
    </button>
  );
};

export default AppTabs;