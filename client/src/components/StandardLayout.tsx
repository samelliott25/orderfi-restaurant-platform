import { useState } from 'react';
import { useLocation } from 'wouter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar } from '@/components/Sidebar';
import { CustomerAiChat } from '@/components/CustomerAiChat';

interface StandardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showChatButton?: boolean;
  className?: string;
}

export function StandardLayout({ 
  children, 
  title = "OrderFi", 
  subtitle = "Smart Restaurant Assistant",
  showChatButton = true,
  className = ""
}: StandardLayoutProps) {
  const [, setLocation] = useLocation();
  const [showAiChat, setShowAiChat] = useState(false);

  return (
    <div className={`h-screen bg-background flex ${className}`}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-80 bg-background">
        <ScrollArea className="h-full bg-transparent">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground playwrite-font">{title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            </div>
            
            {/* Page Content */}
            {children}
          </div>
        </ScrollArea>
      </div>

      {/* AI Chat Button */}
      {showChatButton && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[200]">
          <CustomerAiChat isOpen={showAiChat} onToggle={() => setShowAiChat(!showAiChat)} />
        </div>
      )}
    </div>
  );
}