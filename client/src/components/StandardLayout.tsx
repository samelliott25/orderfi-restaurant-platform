import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HamburgerMenu } from '@/components/Navigation';
import { useTheme } from '@/components/theme-provider';
import { 
  Home, 
  Calendar,
  MessageCircle
} from 'lucide-react';

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
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const { theme } = useTheme();
  
  // Check if dark mode is active
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className={`min-h-screen bg-background transition-opacity duration-700 ease-in-out overflow-x-hidden ${className}`}>
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
                <svg className="w-1 h-1 absolute ai-cascade-2" style={{ top: '85%', left: '78%', transform: 'rotate(178deg)', animationDelay: '3.1s' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
              </div>
              {/* Main center star icon */}
              <svg className="w-5 h-5 text-white relative z-10 ai-star-pulse" viewBox="0 0 24 24" fill="white">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
              </svg>
            </div>
          </div>
          <div>
            <h1 className="font-semibold text-lg" style={{ fontFamily: 'Playwrite Australia Victoria' }}>{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <HamburgerMenu />
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1 px-4 pb-20 border-none" style={{ height: 'calc(100vh - 140px)' }}>
        <div className="space-y-4 py-4 pr-2">
          {children}
        </div>
      </ScrollArea>

      {showChatButton && (
        <>
          {/* Chat Interface */}
          {isChatExpanded && (
            <div className={`fixed inset-4 md:inset-8 lg:inset-12 rounded-3xl shadow-2xl border border-orange-200/20 z-50 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-300 flex flex-col ${
              isDarkMode 
                ? 'bg-gradient-to-br from-orange-600 via-red-600 to-purple-900' 
                : 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500'
            }`}>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium text-white">AI Assistant</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsChatExpanded(false)}
                  className="p-1 h-6 w-6 hover:bg-white/20 text-white"
                  title="Minimize chat"
                >
                  <span className="text-lg leading-none">×</span>
                </Button>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                      <p className="text-xs text-white">Hi! I'm your AI assistant. How can I help you today?</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chat Input */}
              <div className="p-6 border-t border-white/20">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-2">
                  <input
                    placeholder="Type your message..."
                    className="flex-1 border-0 bg-transparent focus:outline-none text-sm text-white placeholder:text-white/70"
                  />
                  <Button
                    size="sm"
                    className="bg-white/30 hover:bg-white/40 text-white p-1 rounded-full backdrop-blur-sm"
                  >
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0">
            {/* Sentient AI Orb - Fixed center position */}
            <div className="absolute top-0 left-0 right-0 flex justify-center">
              <Button
                onClick={() => setIsChatExpanded(true)}
                className="relative -top-8 w-16 h-16 rounded-full z-50 overflow-hidden sentient-orb border-0 p-0"
              >
                {/* Orb Core with liquid-like inner glow */}
                <div className="orb-core"></div>
                
                {/* Energy particles floating around */}
                <div className="orb-energy-particle" style={{ top: '20%', left: '15%', animationDelay: '0s' }}></div>
                <div className="orb-energy-particle" style={{ top: '70%', left: '25%', animationDelay: '0.7s' }}></div>
                <div className="orb-energy-particle" style={{ top: '30%', right: '20%', animationDelay: '1.4s' }}></div>
                <div className="orb-energy-particle" style={{ bottom: '25%', right: '15%', animationDelay: '2.1s' }}></div>
                <div className="orb-energy-particle" style={{ top: '50%', left: '45%', animationDelay: '1.2s' }}></div>
              </Button>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex items-center justify-between px-8 py-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex flex-col items-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"
                onClick={() => setLocation('/orderfi-home')}
              >
                <Home className="h-4 w-4 text-orange-500" />
                <span className="text-xs">Home</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex flex-col items-center gap-1 text-muted-foreground hover:text-orange-500"
                onClick={() => setLocation('/dashboard')}
              >
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Orders</span>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}