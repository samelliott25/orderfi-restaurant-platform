import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar } from '@/components/Sidebar';
import { useChatContext } from '@/contexts/ChatContext';
import { OrderFiPageHeader } from '@/components/ui/design-system';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { Footer } from '@/components/Footer';

import InteractiveStarryBackground from './InteractiveStarryBackground';

interface StandardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  showSidebar?: boolean; // Control whether to show sidebar
  showHeader?: boolean;  // Control whether to show header
  actions?: React.ReactNode; // Header actions (buttons, etc.)
}

export function StandardLayout({ 
  children, 
  title = "OrderFi", 
  subtitle = "Smart Restaurant Assistant",
  className = "",
  showSidebar = true,
  showHeader = true,
  actions
}: StandardLayoutProps) {
  const { isOpen, setIsOpen, isSidebarMode } = useChatContext();

  if (!showSidebar) {
    // Customer/mobile layout - full width without sidebar - Vintage Paper Style
    return (
      <div className={`min-h-screen vintage-paper flex flex-col ${className}`} style={{ background: 'hsl(var(--background))' }}>
        {showHeader && title && (
          <OrderFiPageHeader 
            title={title}
            subtitle={subtitle}
            actions={actions}
          />
        )}
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    );
  }

  // Admin layout - with sidebar - Vintage Paper Style
  return (
    <div className={`flex h-screen vintage-paper ${className}`} style={{ background: 'hsl(var(--background))' }}>
      {/* Sidebar - Fixed width component */}
      <div className="relative z-10">
        <Sidebar />
      </div>
    
    {/* Main Content Area - Takes remaining space, adjusts for chat */}
    <main 
      className="flex-1 overflow-auto transition-all duration-300 relative z-10 flex flex-col"
      style={{
        marginRight: isOpen && !isSidebarMode ? '384px' : isOpen && isSidebarMode ? '320px' : '0px',
        background: 'hsl(var(--background))'
      }}
    >
      <div className="flex-1">
        {/* Page Header */}
        {showHeader && title && (
          <OrderFiPageHeader 
            title={title}
            subtitle={subtitle}
            actions={actions}
          />
        )}
        
        {/* Page Content */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          {children}
        </div>
      </div>
      <Footer />
    </main>
    </div>
  );
}

export default StandardLayout;