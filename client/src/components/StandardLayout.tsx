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

  // Listen for sidebar state changes from localStorage
  useEffect(() => {
    const updateSidebarWidth = () => {
      const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
      setSidebarWidth(isCollapsed ? 64 : 256);
    };
    
    // Initial update
    updateSidebarWidth();
    
    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sidebar-collapsed') {
        updateSidebarWidth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from the sidebar component
    const handleSidebarToggle = () => {
      setTimeout(updateSidebarWidth, 0); // Wait for localStorage to update
    };
    
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
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