import { ReactNode } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-header pb-bottom-nav overflow-y-auto">
        <div className="w-full max-w-container mx-auto min-h-full">
          <div className="px-container-mobile sm:px-container-tablet lg:px-container-desktop py-4 sm:py-6 lg:py-8">
            {children}
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default MobileLayout;