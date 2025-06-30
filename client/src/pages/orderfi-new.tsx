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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize page on load
  useEffect(() => {
    // Force scroll to top immediately
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Trigger fade-in animation
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

  // Only scroll to bottom when new messages are added by user interaction, not on page load
  useEffect(() => {
    if (messages.length > 1) { // Only scroll if there are user messages (more than just the initial AI greeting)
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

  return (
    <div className={`min-h-screen bg-background transition-opacity duration-700 ease-in-out ${
      isPageLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg" style={{ fontFamily: 'Playwrite Australia Victoria' }}>OrderFi </h1>
            <p className="text-sm text-muted-foreground">Smart Restaurant Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <HamburgerMenu />
        </div>
      </div>
      <ScrollArea className="flex-1 px-4 pb-20" style={{ height: 'calc(100vh - 140px)' }}>
        <div className="space-y-4 py-4">

          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-16 bg-gradient-to-br from-background to-muted border-2 border-orange-200 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100 hover:scale-105 transition-all duration-200 active:scale-95"
                  onClick={action.action}
                >
                  <div className="text-orange-500 scale-110">
                    {action.icon}
                  </div>
                  <span className="text-xs font-semibold text-foreground">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Today's Specials */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-foreground mb-3">Today's Specials</h3>
            <div className="space-y-3">
              {todaysSpecials.map((special) => (
                <Card key={special.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-foreground">{special.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{special.description}</p>
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 font-bold text-sm mt-2">${special.price}</p>
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white">
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
            <Card className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white border-0">
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
            <h3 className="text-sm font-semibold text-foreground mb-3">Recent Orders</h3>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Card key={order.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">Order {order.id}</span>
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
                        <p className="text-xs text-muted-foreground mt-1">{order.items}</p>
                        <p className="font-bold text-sm mt-2 text-foreground">${order.total}</p>
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
      {/* Chat Backdrop */}
      {isChatExpanded && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-40"
          onClick={() => setIsChatExpanded(false)}
        />
      )}

      {/* Floating AI Chat Interface */}
      {isChatExpanded && (
        <div className="fixed inset-4 md:inset-8 lg:inset-12 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl shadow-2xl border border-orange-200/20 z-50 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-300 flex flex-col">
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
                          {message.menuItems.map((item, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant="outline"
                              className="text-xs h-5 px-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                            >
                              {item}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 justify-end items-start">
                    <div className="bg-white/30 backdrop-blur-sm text-white rounded-lg px-3 py-2 max-w-[70%]">
                      <p className="text-xs">{message.content}</p>
                    </div>
                    <Avatar className="w-6 h-6 flex-shrink-0">
                      <AvatarFallback className="bg-white/20 text-white text-xs">
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white animate-pulse" />
                </div>
                <div className="bg-muted/50 rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="p-6 border-t border-white/20">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-2">
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
      )}
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="relative flex items-center justify-around py-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"
            onClick={() => setLocation('/')}
          >
            <Home className="h-4 w-4 text-orange-500" />
            <span className="text-xs">Home</span>
          </Button>
          
          {/* AI Chatbot Icon - Center of navbar */}
          <Button
            onClick={() => setIsChatExpanded(true)}
            className="absolute left-1/2 transform -translate-x-1/2 -top-8 w-16 h-16 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white rounded-full shadow-xl z-50 overflow-hidden ai-cosmic-glow"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Stars positioned across entire button surface */}
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Left third: 8-30% */}
                <svg className="w-1 h-1 absolute ai-cascade-1" style={{ top: '15%', left: '8%', transform: 'rotate(45deg)' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="w-1.5 h-1 absolute ai-cascade-2" style={{ top: '42%', left: '12%', transform: 'rotate(-67deg)' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="w-1 h-1.5 absolute ai-cascade-3" style={{ top: '68%', left: '18%', transform: 'rotate(123deg)' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="w-2 h-0.5 absolute ai-cascade-4" style={{ top: '88%', left: '25%', transform: 'rotate(-15deg)' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                
                {/* Center third: 35-65% */}
                <svg className="w-1 h-2 absolute ai-cascade-1" style={{ top: '22%', left: '38%', transform: 'rotate(89deg)', animationDelay: '1.5s' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="w-1.5 h-1.5 absolute ai-cascade-2" style={{ top: '52%', left: '48%', transform: 'rotate(234deg)', animationDelay: '0.8s' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="w-0.5 h-1 absolute ai-cascade-3" style={{ top: '78%', left: '58%', transform: 'rotate(-156deg)', animationDelay: '2.3s' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                
                {/* Right third: 70-92% */}
                <svg className="w-1 h-1 absolute ai-cascade-4" style={{ top: '12%', left: '75%', transform: 'rotate(178deg)', animationDelay: '3.1s' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="w-2 h-1 absolute ai-cascade-1" style={{ top: '35%', left: '82%', transform: 'rotate(-89deg)', animationDelay: '1.8s' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="w-1 h-1.5 absolute ai-cascade-2" style={{ top: '65%', left: '88%', transform: 'rotate(67deg)', animationDelay: '0.5s' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="w-1.5 h-0.5 absolute ai-cascade-3" style={{ top: '92%', left: '78%', transform: 'rotate(-234deg)', animationDelay: '2.7s' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
              </div>
            </div>
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
    </div>
  );
}