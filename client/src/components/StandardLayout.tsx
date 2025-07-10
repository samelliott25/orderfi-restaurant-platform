import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar } from '@/components/Sidebar';
import { CustomerAiChat } from '@/components/CustomerAiChat';
import { useChatContext } from '@/contexts/ChatContext';
import { OrderFiPageHeader } from '@/components/ui/design-system';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';

interface StandardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  showSidebar?: boolean; // Control whether to show sidebar
  showHeader?: boolean;  // Control whether to show header
}

export function StandardLayout({ 
  children, 
  title = "OrderFi", 
  subtitle = "Smart Restaurant Assistant",
  className = "",
  showSidebar = true,
  showHeader = true
}: StandardLayoutProps) {
  const { isOpen, setIsOpen } = useChatContext();

  if (!showSidebar) {
    // Customer/mobile layout - full width without sidebar
    return (
      <div className={`min-h-screen bg-background ${className}`}>
        {showHeader && title && (
          <OrderFiPageHeader 
            title={title}
            subtitle={subtitle}
          />
        )}
        {children}
        <CustomerAiChat isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      </div>
    );
  }

  // Admin layout - with sidebar
  return (
    <div className={`flex h-screen bg-background ${className}`}>
      {/* Sidebar - Fixed width component */}
      <Sidebar />
      
      {/* Main Content Area - Takes remaining space */}
      <main className="flex-1 overflow-auto bg-background">
        <div className="h-full">
          {/* Page Header */}
          {showHeader && title && (
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
    </div>
  );
}

export default StandardLayout;