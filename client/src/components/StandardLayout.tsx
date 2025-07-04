import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HamburgerMenu } from '@/components/Navigation';
import { useTheme } from '@/components/theme-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, Send } from 'lucide-react';

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

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, isUser: boolean}>>([]);

  const handleChatToggle = () => {
    if (!isChatExpanded) {
      setIsChatExpanded(true);
    } else {
      setIsChatExpanded(false);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
    
    // Simple AI response for admin pages
    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        text: "I'm here to help with restaurant operations. What would you like to know about your dashboard, inventory, or orders?",
        isUser: false
      };
      setChatMessages(prev => [...prev, response]);
    }, 1000);
  };
  
  // Check if dark mode is active
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

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
            <h1 className="font-semibold text-lg playwrite-font">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <HamburgerMenu />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full border-none">
          <div className="space-y-4 py-4 px-4 pb-20">
            {children}
          </div>
        </ScrollArea>
      </div>

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
          <div className="fixed bottom-6 left-0 right-0 bg-transparent pointer-events-none">
            {/* Sentient AI Orb - Fixed center position */}
            <div className="flex justify-center pointer-events-auto z-[200]">
              <Button
                onClick={handleChatToggle}
                className="w-20 h-20 rounded-full border-0 shadow-2xl relative overflow-hidden sentient-orb transition-all duration-300"
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
                  <svg className="absolute ai-cascade-1" style={{ width: '1.5px', height: '1.5px', top: '60%', left: '5%', transform: 'rotate(156deg)', animationDelay: '3.2s' }} viewBox="0 0 24 24" fill="white">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="absolute ai-cascade-2" style={{ width: '1.5px', height: '1.5px', top: '90%', left: '50%', transform: 'rotate(-201deg)', animationDelay: '1.4s' }} viewBox="0 0 24 24" fill="white">
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
              </Button>
            </div>
          </div>

          {/* Admin Chat Interface */}
          {isChatExpanded && (
            <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <Card className="w-full max-w-md h-[600px] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold playwrite-font">OrderFi Assistant</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleChatToggle}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-4 space-y-4">
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                      {chatMessages.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                          <div className="mb-2">👋</div>
                          <p>Hi! I'm your restaurant operations assistant.</p>
                          <p className="text-sm mt-1">Ask me about your dashboard, inventory, or orders.</p>
                        </div>
                      )}
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.isUser
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {message.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex space-x-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about your restaurant..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}