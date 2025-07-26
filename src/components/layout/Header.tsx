import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-header bg-card border-b border-border shadow-mobile">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-forest rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground">TrailGuard AI</h1>
        </div>
        
        <Button variant="ghost" size="sm" className="p-2 h-touch-target w-touch-target">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;