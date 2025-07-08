import { useState } from 'react';
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

  return (
    <div className={`h-screen bg-background ${className}`}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div 
        className="h-full bg-background transition-all duration-300 relative" 
        style={{ 
          marginLeft: 'var(--sidebar-width, 256px)',
          marginRight: (isSidebarMode && isOpen) ? '320px' : '0px'
        }}
      >
        <ScrollArea className="h-full bg-transparent">
          <div className="p-6">
            {/* Page Content */}
            {children}
          </div>
        </ScrollArea>
      </div>
      
      {/* AI Chat Dialog - positioned outside main content but accounting for sidebar */}
      <CustomerAiChat isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />


    </div>
  );
}

export default StandardLayout;