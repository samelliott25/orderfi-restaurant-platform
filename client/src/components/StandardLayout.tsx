import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar } from '@/components/Sidebar';
import { CustomerAiChat } from '@/components/CustomerAiChat';
import { useChatContext } from '@/contexts/ChatContext';

interface StandardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function StandardLayout({ 
  children, 
  title = "OrderFi", 
  subtitle = "Smart Restaurant Assistant",
  className = ""
}: StandardLayoutProps) {
  const [, setLocation] = useLocation();
  const { isSidebarMode, isOpen, setIsOpen } = useChatContext();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`flex h-screen bg-background ${className}`}>
      {/* Sidebar - Collapsed by default */}
      <aside className="flex-shrink-0 w-16">
        <Sidebar />
      </aside>
      
      {/* Main Content Area - Full width to screen edge */}
      <main className="flex-1 overflow-auto bg-background w-full">
        <div className="w-full min-w-0">
          {/* Page Header */}
          {title && (
            <div className="mb-6 px-4 sm:px-6 pt-4 sm:pt-6">
              <h1 className="text-2xl sm:text-3xl font-normal tracking-tight playwrite-font">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-muted-foreground mt-2">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          
          {/* Page Content */}
          {children}
        </div>
      </main>
      
      {/* AI Chat Dialog */}
      <CustomerAiChat isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
    </div>
  );
}

export default StandardLayout;