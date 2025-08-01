import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden mobile-fixed no-horizontal-scroll">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden content-fit">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} showMenuButton={isMobile} />
        
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 w-full mobile-container prevent-zoom">
          <div className="max-w-7xl mx-auto animate-fade-in min-h-full w-full content-fit">
            {children}
            <Footer />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-80 p-0 border-r-0 bg-sidebar">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}