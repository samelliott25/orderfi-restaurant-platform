import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar } from '@/components/Sidebar';
import { CustomerAiChat } from '@/components/CustomerAiChat';
import { useChatContext } from '@/contexts/ChatContext';
import { OrderFiPageHeader } from '@/components/ui/design-system';

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
      <main className="flex-1 overflow-auto bg-background">
        <div className="h-full">
          {/* Page Header */}
          {title && (
            <OrderFiPageHeader 
              title={title}
              subtitle={subtitle}
            />
          )}
          
          {/* Page Content - No left/right padding so content extends to edges */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
            {children}
          </div>
        </div>
      </main>
      
      {/* AI Chat Dialog */}
      <CustomerAiChat isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
    </div>
  );
}

export default StandardLayout;