
import React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Menu, X, FileText, Settings, HelpCircle, History } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TouchFeedback } from "@/components/ui/ios-feedback";
import { useNavigate } from "react-router-dom";

interface MobileNavProps {
  activeSession?: string;
  onNewSession?: () => void;
  onOpenSessionDrawer?: () => void;
  onOpenSettingsDrawer?: () => void;
  userName?: string;
}

export function MobileNav({
  activeSession,
  onNewSession,
  onOpenSessionDrawer,
  onOpenSettingsDrawer,
  userName,
}: MobileNavProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  if (!isMobile) return null;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg border-2"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">EMS Narrative Pro</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="grid gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <TouchFeedback>
                <Button 
                  className="h-24 flex flex-col items-center justify-center gap-2 w-full"
                  variant="outline"
                  onClick={() => {
                    if (onNewSession) onNewSession();
                    setOpen(false);
                  }}
                >
                  <FileText className="h-6 w-6" />
                  <span>New Session</span>
                </Button>
              </TouchFeedback>
              
              <TouchFeedback>
                <Button 
                  className="h-24 flex flex-col items-center justify-center gap-2 w-full"
                  variant="outline"
                  onClick={() => {
                    if (onOpenSessionDrawer) onOpenSessionDrawer();
                    setOpen(false);
                  }}
                >
                  <History className="h-6 w-6" />
                  <span>Sessions</span>
                </Button>
              </TouchFeedback>
            </div>
          </div>
          
          <div className="grid gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">User</h3>
            <div className="grid gap-2">
              <TouchFeedback>
                <Button 
                  className="w-full justify-start"
                  variant="ghost"
                  onClick={() => {
                    if (onOpenSettingsDrawer) onOpenSettingsDrawer();
                    setOpen(false);
                  }}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </Button>
              </TouchFeedback>
              
              <TouchFeedback>
                <Button 
                  className="w-full justify-start"
                  variant="ghost"
                  onClick={() => {
                    navigate("/help");
                    setOpen(false);
                  }}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <span>Help & Support</span>
                </Button>
              </TouchFeedback>
            </div>
          </div>
          
          {userName && (
            <div className="border-t pt-4 mt-2">
              <p className="text-sm text-muted-foreground">Signed in as <span className="font-medium text-foreground">{userName}</span></p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
