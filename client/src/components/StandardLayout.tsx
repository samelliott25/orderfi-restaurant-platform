import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar } from '@/components/Sidebar';
import { useChatContext } from '@/contexts/ChatContext';
import { OrderFiPageHeader } from '@/components/ui/design-system';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import MovingTexturedBackground from './MovingTexturedBackground';
import NovelMovingBackground from './NovelMovingBackground';

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
  const { isOpen, setIsOpen, isSidebarMode } = useChatContext();

  if (!showSidebar) {
    // Customer/mobile layout - full width without sidebar
    return (
      <div className={`min-h-screen bg-background ${className}`}>
        <NovelMovingBackground intensity="subtle" speed="slow" colorScheme="warm" />
        {showHeader && title && (
          <OrderFiPageHeader 
            title={title}
            subtitle={subtitle}
          />
        )}
        {children}
      </div>
    );
  }

  // Admin layout - with sidebar
  return (
    <div className={`flex h-screen bg-background ${className}`}>
      <NovelMovingBackground intensity="vibrant" speed="medium" colorScheme="warm" />
      {/* Sidebar - Fixed width component */}
      <Sidebar />
      
      {/* Main Content Area - Takes remaining space, adjusts for chat */}
      <main 
        className="flex-1 overflow-auto bg-background transition-all duration-300"
        style={{
          marginRight: isOpen && !isSidebarMode ? '384px' : isOpen && isSidebarMode ? '320px' : '0px' // 384px for floating dialog, 320px for sidebar mode
        }}
      >
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