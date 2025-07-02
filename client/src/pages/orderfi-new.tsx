import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from 'next-themes';
import { useLocation } from 'wouter';
import { 
  Home, 
  Calendar, 
  Sparkles, 
  Mic, 
  MicOff, 
  Send,
  X
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  menuItems?: string[];
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

interface SpecialItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface RecentOrder {
  id: string;
  items: string;
  total: number;
  status: 'delivered' | 'in-progress' | 'preparing';
  date: string;
}

export default function OrderFiPage() {
  const [, setLocation] = useLocation();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsPageLoaded(true);
    
    // Add initial greeting message
    const initialMessage: ChatMessage = {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI assistant. How can I help you today? I can help you browse our menu, place orders, or answer any questions about our restaurant.",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const specialItems: SpecialItem[] = [
    { id: 1, name: "Chef's Special Pizza", description: "Artisanal sourdough with truffle oil", price: 24.99 },
    { id: 2, name: "Wagyu Burger", description: "Premium beef with aged cheddar", price: 32.99 },
    { id: 3, name: "Lobster Pasta", description: "Fresh Maine lobster in cream sauce", price: 38.99 },
  ];

  const recentOrders: RecentOrder[] = [
    { id: '1', items: 'Margherita Pizza, Caesar Salad', total: 28.50, status: 'delivered', date: '2024-03-15' },
    { id: '2', items: 'Chicken Sandwich, Fries', total: 16.99, status: 'in-progress', date: '2024-03-14' },
    { id: '3', items: 'Pasta Carbonara', total: 22.00, status: 'preparing', date: '2024-03-13' },
  ];

  const quickActions: QuickAction[] = [
    {
      icon: <Sparkles className="h-4 w-4" />,
      label: "Today's Specials",
      action: () => console.log('View specials')
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Quick Reorder",
      action: () => console.log('Quick reorder')
    },
    {
      icon: <Home className="h-4 w-4" />,
      label: "Browse Menu",
      action: () => console.log('Browse menu')
    }
  ];

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're looking for "${currentMessage}". Let me help you with that! Here are some recommendations from our menu.`,
        timestamp: new Date(),
        menuItems: ['Margherita Pizza', 'Caesar Salad', 'Garlic Bread']
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleVoiceToggle = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(!isListening);
    } else {
      console.log('Speech recognition not supported');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatToggle = () => {
    if (!isChatExpanded) {
      setIsAnimating(true);
      // Start animation, then show chat after animation completes
      setTimeout(() => {
        setIsChatExpanded(true);
        setIsAnimating(false);
      }, 800); // Animation duration
    } else {
      setIsChatExpanded(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background transition-opacity duration-700 ease-in-out overflow-x-hidden ${
      isPageLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sentient-orb-mini rounded-full flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              OrderFi
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Table 12
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="h-[calc(100vh-140px)] px-4 pb-2">
        <div className="space-y-6 py-6">
          {/* Welcome Message */}
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Welcome to OrderFi AI
            </h2>
            <p className="text-muted-foreground">
              Your intelligent dining companion
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950 dark:to-pink-950 border-orange-200 dark:border-orange-800 hover:shadow-md transition-all duration-200"
                onClick={action.action}
              >
                <div className="text-orange-600 dark:text-orange-400">
                  {action.icon}
                </div>
                <span className="text-xs font-medium text-center">
                  {action.label}
                </span>
              </Button>
            ))}
          </div>

          {/* Today's Specials */}
          <Card className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950 dark:to-pink-950 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                Today's Specials
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {specialItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600 dark:text-orange-400">
                      ${item.price}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                Recent Orders
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 rounded-lg bg-accent/50">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{order.items}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">${order.total}</p>
                    <Badge 
                      variant={
                        order.status === 'delivered' ? 'default' :
                        order.status === 'in-progress' ? 'secondary' : 'outline'
                      }
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* OrderFi Tokens Card */}
          <Card className="z-0 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950 dark:to-pink-950 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"></div>
                OrderFi Tokens
              </h3>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-foreground">1,247</p>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                </div>
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                >
                  Redeem
                </Button>
              </div>
            </CardContent>
          </Card>

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Morphing Orb Chat Interface */}
      {(isChatExpanded || isAnimating) && (
        <div className={`fixed inset-0 z-[9998] flex items-center justify-center pointer-events-auto ${
          isChatExpanded ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}>
          <div className={`w-full h-full max-w-4xl max-h-4xl rounded-3xl shadow-2xl border border-orange-200/20 backdrop-blur-sm flex flex-col m-8 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-orange-600 via-red-600 to-purple-900' 
              : 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500'
          }`}
          onClick={(e) => e.stopPropagation()}>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-white">AI Assistant</span>
                <Badge className="bg-white/20 text-white text-xs border-white/30">Online</Badge>
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
              {messages.map((message) => (
                <div key={message.id}>
                  {message.role === 'assistant' ? (
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                          <p className="text-xs text-white">{message.content}</p>
                        </div>
                        {message.menuItems && message.menuItems.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {message.menuItems.map((item) => (
                              <Badge key={item} variant="outline" className="text-xs border-white/30 text-white">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <div className="bg-white/30 backdrop-blur-sm rounded-lg px-3 py-2 max-w-xs">
                        <p className="text-xs text-white">{message.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            
              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-3 w-3 text-white animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                      <p className="text-xs text-white">Thinking...</p>
                      <div className="flex gap-1 mt-1">
                        <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          
            {/* Chat Input */}
            <div className="p-4 border-t border-white/20">
              <div className="flex gap-2 items-center bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className={`p-1 rounded-full text-white ${isListening ? 'bg-red-400/30 text-red-200' : 'hover:bg-white/20'}`}
                  onClick={handleVoiceToggle}
                >
                  {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                </Button>
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm text-white placeholder:text-white/70"
                />
                <Button
                  size="sm"
                  className="bg-white/30 hover:bg-white/40 text-white p-1 rounded-full backdrop-blur-sm"
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isLoading}
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-transparent pointer-events-none">
        {/* Sentient AI Orb - Fixed center position */}
        <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-auto z-[200]">
          <Button
            onClick={handleChatToggle}
            className={`relative -top-8 rounded-full z-[999] overflow-hidden sentient-orb border-0 p-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 !bg-transparent hover:!bg-transparent pointer-events-auto transition-all duration-700 ease-out ${
              isAnimating ? 'animate-morph-to-center' : ''
            }`}
            style={{ 
              width: isAnimating ? '100vw' : '76px', 
              height: isAnimating ? '100vh' : '76px',
              position: isAnimating ? 'fixed' : 'relative',
              top: isAnimating ? '0' : undefined,
              left: isAnimating ? '0' : undefined,
              transform: isAnimating ? 'translate(0, 0)' : undefined,
              zIndex: isAnimating ? 9999 : 999
            }}
          >
            {/* Tiny rotating stars positioned around the orb */}
            <div className="absolute inset-0 w-full h-full pointer-events-none text-white">
              <svg className="absolute ai-cascade-1" style={{ width: '1.5px', height: '1.5px', top: '25%', left: '15%', transform: 'rotate(45deg)', animationDelay: '0s' }} viewBox="0 0 24 24" fill="white">
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
        <div className="flex items-center justify-around bg-transparent pointer-events-auto py-4 px-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"
            onClick={() => setLocation('/orderfi-home')}
          >
            <Home className="h-4 w-4 text-orange-500" />
            <span className="text-xs">Home</span>
          </Button>
          
          <div className="w-16"></div> {/* Spacer for center orb */}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"
          >
            <Calendar className="h-4 w-4 text-orange-500" />
            <span className="text-xs">Orders</span>
          </Button>
        </div>
      </div>
    </div>
  );
}