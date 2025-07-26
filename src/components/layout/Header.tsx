import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-header bg-card/95 backdrop-blur-sm border-b border-border shadow-mobile">
      <div className="w-full max-w-container mx-auto h-full">
        <div className="flex items-center justify-between h-full px-container-mobile sm:px-container-tablet lg:px-container-desktop">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-forest rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-base lg:text-lg">T</span>
            </div>
            <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground truncate">
              <span className="block sm:hidden">TrailGuard</span>
              <span className="hidden sm:block">TrailGuard AI</span>
            </h1>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 h-touch-target w-touch-target flex-shrink-0 hover:bg-muted/60 transition-colors"
            aria-label="设置"
          >
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;