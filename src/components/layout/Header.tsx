import { Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { NotificationDropdown } from "./NotificationDropdown";

export function Header() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects, tasks..."
            className="w-72 pl-9 bg-background border-border focus-visible:ring-primary"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <NotificationDropdown />
        {user && (
          <div className="flex items-center gap-3 border-l border-border pl-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Tatenda Soza
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
