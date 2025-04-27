
import React from 'react';
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, MenuIcon, HelpCircle, Settings, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TouchFeedback } from '@/components/ui/ios-feedback';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardHeaderProps {
  toggleSidebar: () => void;
  toggleSettings: () => void;
  sidebarVisible: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  userName?: string;
}

const DashboardHeader = ({ 
  toggleSidebar, 
  toggleSettings, 
  sidebarVisible,
  isDarkMode,
  toggleDarkMode,
  userName = "User"
}: DashboardHeaderProps) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TouchFeedback
            onClick={toggleSidebar}
            feedbackColor="#6366f1"
            aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
          >
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </TouchFeedback>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TouchFeedback 
                  onClick={toggleDarkMode} 
                  feedbackColor="#6366f1"
                  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                  </Button>
                </TouchFeedback>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isDarkMode ? "Switch to light mode" : "Switch to dark mode"}</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <TouchFeedback 
                  feedbackColor="#6366f1"
                  aria-label="Help and support"
                >
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TouchFeedback>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help and support</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <TouchFeedback 
                  onClick={toggleSettings}
                  feedbackColor="#6366f1"
                  aria-label="Open settings"
                >
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Settings className="h-5 w-5" />
                  </Button>
                </TouchFeedback>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <TouchFeedback 
                  feedbackColor="#6366f1"
                  aria-label="View profile"
                >
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </TouchFeedback>
              </TooltipTrigger>
              <TooltipContent>
                <p>Profile: {userName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
