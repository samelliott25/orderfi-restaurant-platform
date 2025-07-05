import { useState } from 'react';
import { useLocation } from 'wouter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar } from '@/components/Sidebar';
import { CustomerAiChat } from '@/components/CustomerAiChat';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

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
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  return (
    <div className={`h-screen bg-background ${className}`}>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden relative sentient-orb-mini">
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white relative z-10 ai-star-pulse star-no-rotate" viewBox="0 0 24 24" fill="white">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
              </svg>
            </div>
          </div>
          <div>
            <h1 className="font-semibold text-sm playwrite-font">{title}</h1>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="p-2"
        >
          {showMobileSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowMobileSidebar(false)}>
          <div className="w-64 h-full bg-white dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
            <Sidebar isOpen={true} onClose={() => setShowMobileSidebar(false)} />
          </div>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="h-full bg-background transition-all duration-300 md:ml-[var(--sidebar-width,256px)] ml-0 pt-16 md:pt-0">
        <ScrollArea className="h-full bg-transparent">
          <div className="p-4 md:p-6">
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

      {/* AI Orb Chat Button */}
      {showChatButton && (
        <div className="fixed bottom-6 left-0 right-0 bg-transparent pointer-events-none">
          <div className="flex justify-center pointer-events-auto z-[200]">
            <button
              onClick={() => setShowAiChat(!showAiChat)}
              className="w-20 h-20 rounded-full border-0 shadow-2xl relative overflow-hidden sentient-orb transition-all duration-300 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500"
            >
              {/* Tiny rotating stars positioned around the orb */}
              <div className="absolute inset-0 w-full h-full pointer-events-none text-white">
                <svg className="absolute ai-cascade-1" style={{ width: '1.5px', height: '1.5px', top: '20%', left: '15%', transform: 'rotate(45deg)' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="absolute ai-cascade-2" style={{ width: '1.5px', height: '1.5px', top: '75%', left: '80%', transform: 'rotate(-67deg)', animationDelay: '1.8s' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="absolute ai-cascade-3" style={{ width: '1.5px', height: '1.5px', top: '30%', left: '85%', transform: 'rotate(123deg)', animationDelay: '2.5s' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="absolute ai-cascade-4" style={{ width: '1.5px', height: '1.5px', top: '10%', left: '70%', transform: 'rotate(-89deg)', animationDelay: '0.9s' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="absolute ai-cascade-5" style={{ width: '1.5px', height: '1.5px', top: '60%', left: '5%', transform: 'rotate(156deg)', animationDelay: '3.2s' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="absolute ai-cascade-6" style={{ width: '1.5px', height: '1.5px', top: '90%', left: '50%', transform: 'rotate(-201deg)', animationDelay: '1.4s' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
              </div>
              
              {/* Orb Core with Hollow Center */}
              <div className="orb-core w-full h-full"></div>
              
              {/* Energy particles */}
              <div className="orb-energy-particle" style={{ top: '20%', left: '15%', animationDelay: '0s' }}></div>
              <div className="orb-energy-particle" style={{ top: '70%', left: '25%', animationDelay: '0.7s' }}></div>
              <div className="orb-energy-particle" style={{ top: '30%', right: '20%', animationDelay: '1.4s' }}></div>
              <div className="orb-energy-particle" style={{ bottom: '25%', right: '15%', animationDelay: '2.1s' }}></div>
              <div className="orb-energy-particle" style={{ top: '50%', left: '45%', animationDelay: '1.2s' }}></div>
            </button>
          </div>
        </div>
      )}

      {/* AI Chat Dialog */}
      {showAiChat && (
        <CustomerAiChat isOpen={showAiChat} onToggle={() => setShowAiChat(!showAiChat)} />
      )}
    </div>
  );
}