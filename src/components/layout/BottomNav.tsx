import { NavLink } from "react-router-dom";
import { Book, Camera, Wrench, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const BottomNav = () => {
  const { t } = useLanguage();
  
  const navItems = [
    {
      path: "/",
      label: t("nav.guide"),
      icon: Book,
      id: "guide"
    },
    {
      path: "/identify",
      label: t("nav.identify"), 
      icon: Camera,
      id: "identify"
    },
    {
      path: "/tools",
      label: t("nav.tools"),
      icon: Wrench,
      id: "tools"
    },
    {
      path: "/settings",
      label: t("nav.settings"),
      icon: Settings,
      id: "settings"
    }
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-bottom-nav bg-card/95 backdrop-blur-sm border-t border-border shadow-nav">
      <div className="w-full max-w-container mx-auto h-full">
        <div className="flex items-center justify-around h-full px-2 sm:px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center px-2 py-2 sm:px-3 sm:py-2 min-h-touch-target min-w-0 flex-1 max-w-24 sm:max-w-28 rounded-lg transition-nav",
                    isActive
                      ? "text-forest-primary bg-nature-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      className={cn(
                        "h-5 w-5 sm:h-6 sm:w-6 mb-0.5 sm:mb-1 transition-nav flex-shrink-0",
                        isActive ? "text-forest-primary" : ""
                      )} 
                    />
                    <span className="text-xs sm:text-sm font-medium truncate w-full text-center leading-tight">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;