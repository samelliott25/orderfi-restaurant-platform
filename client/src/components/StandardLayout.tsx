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

  // Listen for sidebar width changes from CSS custom property and localStorage
  useEffect(() => {
    const updateSidebarWidth = () => {
      const width = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width');
      const parsedWidth = parseInt(width) || 64;
      setSidebarWidth(parsedWidth);
    };
    
    // Initial update
    updateSidebarWidth();
    
    // Listen for CSS custom property changes
    const observer = new MutationObserver(() => {
      updateSidebarWidth();
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    
    // Listen for localStorage changes
    const handleStorageChange = () => {
      updateSidebarWidth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
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
          
          {/* Page Content - Add debug info */}
          <div className="pb-4 sm:pb-6" style={{ border: '1px solid red' }}>
            <div style={{ padding: '10px', background: '#f0f0f0', fontSize: '12px' }}>
              Debug: Sidebar width: {sidebarWidth}px, Main margin: {sidebarWidth}px
            </div>
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