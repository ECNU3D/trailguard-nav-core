import { NavLink } from "react-router-dom";
import { Book, Camera, Wrench, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    path: "/",
    label: "指南",
    icon: Book,
    id: "guide"
  },
  {
    path: "/identify",
    label: "识别", 
    icon: Camera,
    id: "identify"
  },
  {
    path: "/tools",
    label: "工具",
    icon: Wrench,
    id: "tools"
  },
  {
    path: "/settings",
    label: "设置",
    icon: Settings,
    id: "settings"
  }
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-bottom-nav bg-card border-t border-border shadow-nav">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center px-3 py-2 min-h-touch-target min-w-touch-target rounded-lg transition-nav",
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
                      "h-5 w-5 mb-1 transition-nav",
                      isActive ? "text-forest-primary" : ""
                    )} 
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;