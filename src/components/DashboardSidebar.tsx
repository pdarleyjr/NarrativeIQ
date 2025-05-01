import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Settings, 
  HelpCircle, 
  Search,
  PlusCircle,
  FolderOpen,
  Book,
  FileCheck,
  ChevronDown,
  Filter,
  Home,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Session {
  id: string;
  name: string;
  date: string;
  active?: boolean;
}

interface DashboardSidebarProps {
  visible: boolean;
  sessions: Session[];
  activeSession: string | null;
  onNewSession: () => void;
  onSelectSession: (id: string) => void;
  onRenameSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  navigate?: (path: string) => void;
  setIsSettingsOpen?: (open: boolean) => void;
  setIsCustomInstructionsOpen?: (open: boolean) => void;
}

const DashboardSidebar = ({
  visible,
  sessions,
  activeSession,
  onNewSession,
  onSelectSession,
  onRenameSession,
  onDeleteSession,
  navigate,
  setIsSettingsOpen,
  setIsCustomInstructionsOpen
}: DashboardSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [isResourcesOpen, setIsResourcesOpen] = useState(true);
  
  // Group sessions by date
  const groupedSessions = sessions.reduce((groups, session) => {
    const date = session.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(session);
    return groups;
  }, {} as Record<string, Session[]>);
  
  // Filter sessions based on search term and date filter
  const filteredGroups = Object.keys(groupedSessions).reduce((acc, date) => {
    let filtered = groupedSessions[date];
    
    // Apply text search
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        session => session.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const today = format(new Date(), 'MMM d, yyyy');
      if (dateFilter === 'today' && date !== today) {
        filtered = [];
      } else if (dateFilter === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        // Simple date comparison - would need better logic in a real app
        if (new Date(date) < oneWeekAgo) {
          filtered = [];
        }
      }
    }
    
    if (filtered.length > 0) {
      acc[date] = filtered;
    }
    return acc;
  }, {} as Record<string, Session[]>);

  return (
    <div
      className={`fixed inset-y-0 left-0 w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-16 z-10 transform transition-transform duration-300 ease-in-out ${
        visible ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-label="Dashboard sidebar"
      aria-hidden={!visible}
    >
      <div className="p-4 space-y-4 h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-ems-600 to-purple-600 dark:from-ems-400 dark:to-purple-400 bg-clip-text text-transparent">
            EZ Narratives
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">NFIRS Reports and EMS Narratives</p>
        </div>
        
        <div className="flex justify-between items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {}}
                  className="p-1"
                  aria-label="Go to home"
                >
                  <Home className="h-4 w-4 text-ems-600 dark:text-ems-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Go to home</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Sessions</h2>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  onClick={onNewSession}
                  className="h-8 w-8 p-0"
                  variant="ghost"
                  aria-label="Create new session"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Create new session</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search sessions..."
              className="pl-8 h-9 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search sessions"
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9"
                aria-label="Filter sessions"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" side="right">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Filter Sessions</h3>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Time Period</p>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sessions</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Past Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Session Type</p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="type-narrative" defaultChecked />
                      <label htmlFor="type-narrative" className="text-xs">Narrative</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="type-chat" defaultChecked />
                      <label htmlFor="type-chat" className="text-xs">Chat</label>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={onNewSession}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Session
        </Button>
        
        <ScrollArea className="flex-1 pr-3">
          {Object.keys(filteredGroups).length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <FileText className="h-10 w-10 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No sessions found
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Try a different search term or filter
                </p>
              </div>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('all');
                }}
                className="text-xs"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            Object.entries(filteredGroups).map(([date, sessions]) => (
              <div key={date} className="mb-4">
                <div className="flex items-center mb-1 px-1">
                  <Calendar className="h-3 w-3 text-gray-500 dark:text-gray-400 mr-1" />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{date}</span>
                  <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0 h-4">
                    {sessions.length}
                  </Badge>
                </div>
                {sessions.map(session => (
                  <div
                    key={session.id}
                    className={`mt-1 px-3 py-2.5 rounded-md cursor-pointer flex items-center group hover:bg-gray-100 dark:hover:bg-gray-700/50 ${
                      session.id === activeSession
                        ? 'bg-ems-50 dark:bg-ems-900/20 text-ems-600 dark:text-ems-400'
                        : ''
                    }`}
                    onClick={() => onSelectSession(session.id)}
                    aria-selected={session.id === activeSession}
                    role="option"
                  >
                    <FileText className={`h-4 w-4 mr-2 flex-shrink-0 ${
                      session.id === activeSession
                        ? 'text-ems-600 dark:text-ems-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`} />
                    
                    <div className="truncate flex-1">
                      <p className="truncate text-sm font-medium">{session.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {/* Would use actual session time in real app */}
                        {format(new Date(), 'hh:mm a')}
                      </p>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRenameSession(session.id);
                              }}
                              aria-label={`Rename session ${session.name}`}
                            >
                              <svg width="12" height="12" viewBox="0 0 15 15" fill="currentColor">
                                <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fillRule="evenodd" clipRule="evenodd" />
                              </svg>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>Rename</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSession(session.id);
                              }}
                              aria-label={`Delete session ${session.name}`}
                            >
                              <svg width="12" height="12" viewBox="0 0 15 15" fill="currentColor">
                                <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H3.5C3.22386 4 3 3.77614 3 3.5ZM3 5.5C3 5.22386 3.22386 5 3.5 5H11.5C11.7761 5 12 5.22386 12 5.5C12 5.77614 11.7761 6 11.5 6H3.5C3.22386 6 3 5.77614 3 5.5ZM3 7.5C3 7.22386 3.22386 7 3.5 7H11.5C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8H3.5C3.22386 8 3 7.77614 3 7.5ZM3 9.5C3 9.22386 3.22386 9 3.5 9H11.5C11.7761 9 12 9.22386 12 9.5C12 9.77614 11.7761 10 11.5 10H3.5C3.22386 10 3 9.77614 3 9.5ZM3 11.5C3 11.2239 3.22386 11 3.5 11H11.5C11.7761 11 12 11.2239 12 11.5C12 11.7761 11.7761 12 11.5 12H3.5C3.22386 12 3 11.7761 3 11.5ZM3 13.5C3 13.2239 3.22386 13 3.5 13H11.5C11.7761 13 12 13.2239 12 13.5C12 13.7761 11.7761 14 11.5 14H3.5C3.22386 14 3 13.7761 3 13.5Z" fillRule="evenodd" clipRule="evenodd" />
                              </svg>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </ScrollArea>
        
        <Collapsible 
          open={isResourcesOpen} 
          onOpenChange={setIsResourcesOpen} 
          className="border-t border-gray-200 dark:border-gray-700 pt-2"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Resources
            </h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isResourcesOpen ? '' : '-rotate-90'}`} />
                <span className="sr-only">Toggle resources</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="space-y-1 pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm h-9"
              aria-label="Knowledge Base"
              onClick={() => navigate && navigate('/knowledge-base')}
            >
              <Book className="h-4 w-4 mr-2" />
              Knowledge Base
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm h-9"
              aria-label="Custom Instructions"
              onClick={() => setIsCustomInstructionsOpen && setIsCustomInstructionsOpen(true)}
            >
              <FileCheck className="h-4 w-4 mr-2" />
              Custom Instructions
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm h-9"
              aria-label="Settings"
              onClick={() => setIsSettingsOpen && setIsSettingsOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm h-9"
              aria-label="Help & Support"
              onClick={() => window.open('https://eznarratives.com/support', '_blank')}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Help & Support
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default DashboardSidebar;
