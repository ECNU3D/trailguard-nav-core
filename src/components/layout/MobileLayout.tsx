import { ReactNode } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-header pb-bottom-nav min-h-screen overflow-y-auto">
        <div className="px-4 py-6">
          {children}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default MobileLayout;