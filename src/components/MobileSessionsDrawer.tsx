
import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Search, 
  X, 
  Calendar,
  Clock,
  Edit2,
  Trash2,
  PlusCircle
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TouchFeedback } from "@/components/ui/ios-feedback";
import { format } from "date-fns";

interface Session {
  id: string;
  name: string;
  date: string;
  active?: boolean;
}

interface MobileSessionsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessions: Session[];
  activeSession: string | null;
  onNewSession: () => void;
  onSelectSession: (id: string) => void;
  onRenameSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

export function MobileSessionsDrawer({
  open,
  onOpenChange,
  sessions,
  activeSession,
  onNewSession,
  onSelectSession,
  onRenameSession,
  onDeleteSession
}: MobileSessionsDrawerProps) {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isMobile) return null;

  // Group sessions by date
  const groupedSessions = sessions.reduce((groups, session) => {
    const date = session.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(session);
    return groups;
  }, {} as Record<string, Session[]>);
  
  // Filter sessions based on search term
  const filteredGroups = Object.keys(groupedSessions).reduce((acc, date) => {
    let filtered = groupedSessions[date];
    
    // Apply text search
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        session => session.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filtered.length > 0) {
      acc[date] = filtered;
    }
    return acc;
  }, {} as Record<string, Session[]>);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="max-h-[85vh] overflow-auto">
          <DrawerHeader className="sticky top-0 z-10 bg-background pb-2">
            <div className="flex items-center justify-between">
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
            <div className="mb-4 mt-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-ems-600 to-purple-600 dark:from-ems-400 dark:to-purple-400 bg-clip-text text-transparent">
                EZ Narratives
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">NFIRS Reports and EMS Narratives</p>
            </div>
            <DrawerTitle>Sessions</DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-16">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sessions..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <TouchFeedback>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start mb-4"
                onClick={() => {
                  onNewSession();
                  onOpenChange(false);
                }}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Session
              </Button>
            </TouchFeedback>

            {Object.keys(filteredGroups).length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    No sessions found
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Try a different search term
                  </p>
                </div>
                {searchTerm && (
                  <Button 
                    variant="link" 
                    onClick={() => setSearchTerm('')}
                    className="text-xs"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              Object.entries(filteredGroups).map(([date, sessions]) => (
                <div key={date} className="mb-4">
                  <div className="flex items-center mb-1 px-1">
                    <Calendar className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className="text-xs font-medium text-muted-foreground">{date}</span>
                  </div>
                  
                  {sessions.map(session => (
                    <TouchFeedback key={session.id}>
                      <div
                        className={`mt-1 px-3 py-2.5 rounded-md cursor-pointer flex items-center justify-between group hover:bg-accent/50 ${
                          session.id === activeSession
                            ? 'bg-accent/70 text-accent-foreground'
                            : ''
                        }`}
                        onClick={() => {
                          onSelectSession(session.id);
                          onOpenChange(false);
                        }}
                      >
                        <div className="flex items-center">
                          <FileText className={`h-4 w-4 mr-2 ${
                            session.id === activeSession
                              ? 'text-accent-foreground'
                              : 'text-muted-foreground'
                          }`} />
                          
                          <div className="truncate">
                            <p className="truncate text-sm font-medium">{session.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(new Date(), 'hh:mm a')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRenameSession(session.id);
                            }}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession(session.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </TouchFeedback>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
