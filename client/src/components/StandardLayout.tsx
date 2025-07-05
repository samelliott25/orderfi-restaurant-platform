import { useState } from 'react';
import { useLocation } from 'wouter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HamburgerMenu } from '@/components/Navigation';
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
    <div className={`h-screen bg-background transition-opacity duration-700 ease-in-out overflow-x-hidden flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden ai-cosmic-glow relative">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Stars positioned across entire icon surface */}
              <div className="absolute inset-0 w-full h-full pointer-events-none text-white">
                {/* Left side */}
                <svg className="w-1 h-1 absolute ai-cascade-1" style={{ top: '25%', left: '12%', transform: 'rotate(45deg)' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="w-1 h-1 absolute ai-cascade-2" style={{ top: '72%', left: '18%', transform: 'rotate(-67deg)' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                
                {/* Center */}
                <svg className="w-1 h-1 absolute ai-cascade-3" style={{ top: '15%', left: '50%', transform: 'rotate(123deg)', animationDelay: '1.5s' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="w-1 h-1 absolute ai-cascade-4" style={{ top: '65%', left: '52%', transform: 'rotate(-15deg)', animationDelay: '0.8s' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                
                {/* Right side */}
                <svg className="w-1 h-1 absolute ai-cascade-1" style={{ top: '35%', left: '82%', transform: 'rotate(89deg)', animationDelay: '2.3s' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="w-1 h-1 absolute ai-cascade-2" style={{ top: '85%', left: '88%', transform: 'rotate(-278deg)', animationDelay: '1.2s' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
              </div>
              
              {/* Central logo */}
              <svg className="w-4 h-4 text-white counter-rotate-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
              </svg>
            </div>
          </div>
          <div>
            <h1 className={`text-xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent playwrite-font`}>
              {title}
            </h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        <HamburgerMenu />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full bg-transparent">
          <div className="px-4 pb-2">
            {children}
          </div>
        </ScrollArea>
      </div>

      {/* AI Chat Component */}
      {showChatButton && (
        <CustomerAiChat 
          isOpen={showAiChat}
          onToggle={() => setShowAiChat(!showAiChat)}
          onAddToCart={() => {}}
          currentCart={[]}
        />
      )}
    </div>
  );
}