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
  const [sidebarWidth, setSidebarWidth] = useState(64); // Default collapsed width

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for sidebar width changes from CSS custom property
  useEffect(() => {
    const updateSidebarWidth = () => {
      const width = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width');
      setSidebarWidth(parseInt(width) || 64);
    };
    
    updateSidebarWidth();
    
    // Listen for storage changes to update width
    const handleStorageChange = () => {
      updateSidebarWidth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className={`bg-background ${className}`}>
      {/* Sidebar - Fixed positioning, handled by Sidebar component */}
      <Sidebar />
      
      {/* Main Content Area - With left margin to account for fixed sidebar */}
      <main 
        className="min-h-screen overflow-auto bg-background transition-all duration-300" 
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <div className="h-full">
          {/* Page Header */}
          {title && (
            <OrderFiPageHeader 
              title={title}
              subtitle={subtitle}
            />
          )}
          
          {/* Page Content */}
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