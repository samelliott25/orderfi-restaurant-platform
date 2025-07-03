import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { HamburgerMenu } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mic, 
  MicOff, 
  Send, 
  Search, 
  Heart, 
  Gift, 
  Home, 
  Menu, 
  ShoppingCart,
  Calendar,
  Bell,
  User,
  Sparkles,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/theme-provider';
import type { Restaurant, MenuItem } from '@shared/schema';

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

export default function OrderFiNew() {
  const [restaurantId] = useState(1);
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI assistant. What would you like to order today?",
      timestamp: new Date(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableTokens] = useState(1250);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { theme } = useTheme();
  
  // Check if dark mode is active
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Initialize page on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsPageLoaded(true);
  }, []);

  // Get menu items and restaurant data
  const { data: menuItems = [] } = useQuery({
    queryKey: [`/api/restaurants/${restaurantId}/menu`],
    staleTime: 5 * 60 * 1000,
  });

  const { data: restaurants = [] } = useQuery({
    queryKey: ['/api/restaurants'],
    staleTime: 5 * 60 * 1000,
  });

  const restaurant = Array.isArray(restaurants) ? restaurants.find((r: any) => r.id === restaurantId) : null;

  // Mock data for today's specials
  const todaysSpecials: SpecialItem[] = [
    {
      id: 1,
      name: "Spicy Thai Curry",
      description: "Authentic Thai flavors with coconut milk",
      price: 12.99
    },
    {
      id: 2,
      name: "Buffalo Wings",
      description: "Crispy wings with spicy buffalo sauce",
      price: 9.99
    }
  ];

  // Mock data for recent orders
  const recentOrders: RecentOrder[] = [
    {
      id: "#1234",
      items: "2x Spicy Thai Curry, 1x Buffalo Wings",
      total: 35.97,
      status: "delivered",
      date: "Today"
    },
    {
      id: "#1233",
      items: "1x Pad Thai, 1x Spring Rolls",
      total: 18.50,
      status: "in-progress",
      date: "Yesterday"
    }
  ];

  const quickActions: QuickAction[] = [
    {
      icon: <Search className="h-5 w-5" />,
      label: "Browse Menu",
      action: () => toast({ title: "Browse Menu", description: "Opening menu browser..." })
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Track Order",
      action: () => toast({ title: "Track Order", description: "Opening order tracking..." })
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "Favorites",
      action: () => toast({ title: "Favorites", description: "Opening your favorites..." })
    },
    {
      icon: <Gift className="h-5 w-5" />,
      label: "Rewards",
      action: () => toast({ title: "Rewards", description: "Opening rewards program..." })
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentMessage,
          restaurantId,
          sessionId: 'orderfi-session'
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        menuItems: data.menuItems || []
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (!isListening) {
      if ('speechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = (window as any).speechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setCurrentMessage(transcript);
        };

        recognition.start();
      } else {
        toast({
          title: "Voice not supported",
          description: "Speech recognition is not supported in this browser.",
          variant: "destructive"
        });
      }
    } else {
      setIsListening(false);
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
      setTimeout(() => {
        setIsChatExpanded(true);
        setIsAnimating(false);
      }, 1000);
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
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden relative sentient-orb-mini">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 w-full h-full pointer-events-none text-white">
                <svg className="w-1 h-1 absolute ai-cascade-1" style={{ top: '25%', left: '12%', transform: 'rotate(45deg)' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="w-1 h-1 absolute ai-cascade-2" style={{ top: '72%', left: '18%', transform: 'rotate(-67deg)' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="w-1 h-1 absolute ai-cascade-3" style={{ top: '15%', left: '50%', transform: 'rotate(123deg)', animationDelay: '1.5s' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
              </div>
              <svg className="w-5 h-5 text-white relative z-10 ai-star-pulse star-no-rotate" viewBox="0 0 24 24" fill="white">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
              </svg>
            </div>
          </div>
          <div>
            <h1 className="font-semibold text-lg" style={{ fontFamily: 'Playwrite Australia Victoria' }}>OrderFi</h1>
            <p className="text-sm text-orange-600">Smart Restaurant Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <HamburgerMenu />
        </div>
      </div>

      <ScrollArea className="flex-1 pb-2 border-none" style={{ height: 'calc(100vh - 140px)' }}>
        <div className="space-y-4 py-4 px-4">
          {/* Quick Actions */}
          <div>
            <h3 className="section-heading mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="slick-button elevated-card relative flex flex-col items-center gap-2 h-16 bg-gradient-to-br from-background to-muted border-2 border-orange-200 hover:border-orange-300 transition-all duration-200 active:scale-95 overflow-hidden group"
                  onClick={action.action}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 to-orange-500/0 group-hover:from-orange-400/10 group-hover:to-orange-500/15 transition-all duration-300 rounded-md"></div>
                  <div className="relative z-10 text-orange-500 scale-110 group-hover:text-orange-600 transition-colors duration-200">
                    {action.icon}
                  </div>
                  <span className="relative z-10 text-xs font-semibold text-foreground group-hover:text-orange-700 transition-colors duration-200">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Today's Specials */}
          <div className="mt-8">
            <h3 className="section-heading mb-3">Today's Specials</h3>
            <div className="space-y-3">
              {todaysSpecials.map((special) => (
                <Card key={special.id} className="bg-transparent border-orange-200/30 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-foreground">{special.name}</h4>
                        <p className="text-xs text-orange-700 mt-1">{special.description}</p>
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 font-bold text-sm mt-2">${special.price}</p>
                      </div>
                      <Button size="sm" className="slick-button bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white">
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Token Rewards */}
          <div className="mt-8">
            <Card 
              className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white border-0 cursor-pointer hover:scale-105 transition-transform duration-200 relative z-0"
              onClick={() => setLocation('/tokenrewards')}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">OrderFi Tokens</h3>
                    <p className="text-2xl font-bold mt-1">{availableTokens.toLocaleString()}</p>
                    <p className="text-xs opacity-90 mt-1">Available Tokens</p>
                  </div>
                  <div className="text-right">
                    <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                      Redeem
                    </Button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <p className="text-xs opacity-90">Earn tokens with every order • 1 token = $0.10</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <div className="mt-8">
            <h3 className="section-heading mb-3">Recent Orders</h3>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Card key={order.id} className="bg-transparent border-orange-200/30 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">Order {order.id}</span>
                          <Badge 
                            className={`text-xs ${
                              order.status === 'delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : order.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.status === 'delivered' ? 'Delivered' : 
                             order.status === 'in-progress' ? 'In Progress' : 'Preparing'}
                          </Badge>
                        </div>
                        <p className="text-xs text-orange-700 mt-1">{order.items}</p>
                        <p className="font-bold text-sm mt-2">${order.total}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{order.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Revolutionary Sentient Orb Experience */}
      {isChatExpanded && (
        <div className="fixed inset-0 z-[8000] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-300">
          {/* Close Button */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsChatExpanded(false)}
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
          >
            ×
          </Button>

          {/* Sentient Orb Core */}
          <div className="relative">
            {/* Main Orb */}
            <div 
              className="w-80 h-80 rounded-full relative overflow-hidden cursor-pointer animate-in zoom-in duration-500 delay-200 hover:scale-105 transition-transform"
              style={{
                background: `
                  radial-gradient(circle at 20% 30%, #f97316 0%, transparent 40%),
                  radial-gradient(circle at 80% 70%, #ec4899 0%, transparent 35%),
                  radial-gradient(circle at 60% 20%, #fb923c 0%, transparent 45%),
                  radial-gradient(circle at 30% 80%, #db2777 0%, transparent 30%),
                  conic-gradient(
                    from 45deg at 40% 60%,
                    #f97316 0deg,
                    #fb923c 60deg,
                    #ec4899 120deg,
                    #db2777 180deg,
                    #be185d 240deg,
                    #ec4899 300deg,
                    #f97316 360deg
                  ),
                  linear-gradient(
                    135deg,
                    #f97316 0%,
                    #fb923c 25%,
                    #ec4899 50%,
                    #db2777 75%,
                    #be185d 100%
                  )
                `,
                backgroundSize: '300% 300%, 250% 250%, 400% 400%, 350% 350%, 200% 200%, 150% 150%',
                boxShadow: `
                  inset 0 0 20px rgba(255, 255, 255, 0.3),
                  0 0 40px rgba(249, 115, 22, 0.8),
                  0 0 80px rgba(236, 72, 153, 0.6),
                  0 0 120px rgba(219, 39, 119, 0.4)
                `,
                animation: 'sentient-pulse 4s ease-in-out infinite, marble-flow 12s ease-in-out infinite, fluid-shift 8s linear infinite, planetary-rotation 20s linear infinite'
              }}
            >
              

              

            </div>
            

          </div>
          

        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-transparent pointer-events-none">
        {/* Sentient AI Orb - Fixed center position */}
        <div className={`absolute top-0 left-0 right-0 flex justify-center pointer-events-auto z-[200] ${
          isAnimating ? 'animate-morph-to-center' : ''
        }`}>
          <Button
            onClick={handleChatToggle}
            className={`w-16 h-16 rounded-full border-0 shadow-2xl relative overflow-hidden sentient-orb transition-all duration-300 ${
              isAnimating ? 'pointer-events-none' : ''
            }`}
            style={{ transform: 'translateY(-8px)' }}
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
            
            {/* Orb Core */}
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
    </div>
  );
}
