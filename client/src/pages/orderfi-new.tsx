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
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, isUser: boolean, timestamp: Date}>>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1);
  const [inputMode, setInputMode] = useState<'voice' | 'gesture' | 'text'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [gestureInput, setGestureInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const orbChatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { theme } = useTheme();
  
  // Check if dark mode is active
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);



  // Initialize page on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsPageLoaded(true);
  }, []);

  // Mobile keyboard detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.screen.height;
      const keyboardThreshold = windowHeight * 0.75;
      
      setIsKeyboardOpen(viewportHeight < keyboardThreshold);
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleOrbChatMessage = () => {
    if (!currentInput.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      text: currentInput,
      isUser: true,
      timestamp: new Date()
    };
    
    setChatMessages(prev => {
      const newMessages = [...prev, userMessage];
      setCurrentMessageIndex(newMessages.length - 1);
      return newMessages;
    });
    setCurrentInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'm here to help you with your order.",
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => {
        const newMessages = [...prev, aiResponse];
        setCurrentMessageIndex(newMessages.length - 1);
        return newMessages;
      });
    }, 1000);
  };

  const handlePreviousMessage = () => {
    if (currentMessageIndex > 0) {
      setCurrentMessageIndex(currentMessageIndex - 1);
    }
  };

  const handleNextMessage = () => {
    if (currentMessageIndex < chatMessages.length - 1) {
      setCurrentMessageIndex(currentMessageIndex + 1);
    }
  };

  const getCurrentMessage = () => {
    if (chatMessages.length === 0 || currentMessageIndex === -1) {
      return null;
    }
    return chatMessages[currentMessageIndex];
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsRecording(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentInput(transcript);
        handleOrbChatMessage();
      };
      
      recognition.onerror = () => {
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognition.start();
    } else {
      // Fallback to text input
      setInputMode('text');
    }
  };

  const handleGestureInput = (gesture: string) => {
    const gestureCommands: Record<string, string> = {
      'swipe-up': 'Show me the menu',
      'swipe-down': 'What are today\'s specials?',
      'tap-double': 'I want to order',
      'circle': 'Surprise me with a recommendation',
      'hold': 'Help me choose something'
    };
    
    const command = gestureCommands[gesture];
    if (command) {
      setCurrentInput(command);
      handleOrbChatMessage();
    }
  };

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
    }`} style={{ backgroundColor: 'rgb(252, 248, 238)' }}>
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

      <ScrollArea className="flex-1 border-none" style={{ height: 'calc(100vh - 80px)' }}>
        <div className="space-y-4 py-4 px-4">
          {/* Token Rewards */}
          <div>
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

          {/* Quick Actions */}
          <div className="mt-8">
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
        <div className={`fixed inset-0 z-[8000] flex items-center justify-center animate-in fade-in duration-300 ${isKeyboardOpen ? 'items-start pt-20' : 'items-center'}`}>
          {/* Blurred Background */}
          <div className="absolute inset-0 looking-glass-background"></div>
          
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
              className="w-80 h-80 rounded-full relative overflow-hidden cursor-pointer animate-in zoom-in duration-500 delay-200 hover:scale-105 transition-transform looking-glass-orb"
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
              {/* Tiny rotating stars around the large orb */}
              <div className="absolute inset-0 w-full h-full pointer-events-none text-white">
                <svg className="absolute ai-cascade-1" style={{ width: '3px', height: '3px', top: '15%', left: '10%', transform: 'rotate(45deg)' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="absolute ai-cascade-2" style={{ width: '3px', height: '3px', top: '85%', left: '85%', transform: 'rotate(-67deg)', animationDelay: '1.8s' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="absolute ai-cascade-3" style={{ width: '3px', height: '3px', top: '25%', left: '90%', transform: 'rotate(123deg)', animationDelay: '2.5s' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="absolute ai-cascade-4" style={{ width: '3px', height: '3px', top: '5%', left: '65%', transform: 'rotate(-89deg)', animationDelay: '0.9s' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="absolute ai-cascade-1" style={{ width: '3px', height: '3px', top: '60%', left: '5%', transform: 'rotate(156deg)', animationDelay: '3.2s' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="absolute ai-cascade-2" style={{ width: '3px', height: '3px', top: '95%', left: '50%', transform: 'rotate(-201deg)', animationDelay: '1.4s' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
              </div>
              
              {/* Orb Core with inner glow */}
              <div className="orb-core w-full h-full"></div>
              
              {/* Energy particles floating around */}
              <div className="orb-energy-particle" style={{ top: '20%', left: '15%', animationDelay: '0s' }}></div>
              <div className="orb-energy-particle" style={{ top: '70%', left: '25%', animationDelay: '0.7s' }}></div>
              <div className="orb-energy-particle" style={{ top: '30%', right: '20%', animationDelay: '1.4s' }}></div>
              <div className="orb-energy-particle" style={{ bottom: '25%', right: '15%', animationDelay: '2.1s' }}></div>
              <div className="orb-energy-particle" style={{ top: '50%', left: '45%', animationDelay: '1.2s' }}></div>
              <div className="orb-energy-particle" style={{ top: '80%', left: '60%', animationDelay: '2.8s' }}></div>
              <div className="orb-energy-particle" style={{ top: '10%', left: '80%', animationDelay: '3.5s' }}></div>
              <div className="orb-energy-particle" style={{ top: '40%', left: '5%', animationDelay: '4.2s' }}></div>
            </div>
            
            {/* Full-Orb Message Display */}
            <div className="absolute inset-0 flex flex-col pointer-events-auto z-[300]">
              {/* Current Message Display - Takes Full Orb */}
              <div className="flex-1 flex items-center justify-center p-8 relative">
                {getCurrentMessage() ? (
                  <div className={`text-center transition-all duration-500 ${getCurrentMessage()?.isUser ? 'animate-pulse' : ''}`}>
                    <div className={`text-lg font-bold mb-4 ${getCurrentMessage()?.isUser ? 'text-orange-200' : 'text-white'} looking-glass-text`}>
                      {getCurrentMessage()?.isUser ? 'You said:' : 'OrderFi AI:'}
                    </div>
                    <div className={`text-base leading-relaxed ${getCurrentMessage()?.isUser ? 'text-orange-100' : 'text-white'} looking-glass-text max-w-[250px]`}>
                      {getCurrentMessage()?.text}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-white">
                    <div className="text-lg font-bold mb-2 looking-glass-text">Welcome to OrderFi</div>
                    <div className="text-sm opacity-90 looking-glass-text">Your AI restaurant assistant</div>
                    <div className="text-xs mt-3 opacity-80 looking-glass-text">What would you like to order today?</div>
                  </div>
                )}
                
                {/* Navigation Arrows */}
                {chatMessages.length > 1 && (
                  <>
                    {currentMessageIndex > 0 && (
                      <Button
                        onClick={handlePreviousMessage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white p-0 text-lg"
                      >
                        ↑
                      </Button>
                    )}
                    {currentMessageIndex < chatMessages.length - 1 && (
                      <Button
                        onClick={handleNextMessage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white p-0 text-lg"
                      >
                        ↓
                      </Button>
                    )}
                  </>
                )}
                
                {/* Message Counter */}
                {chatMessages.length > 0 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-xs">
                    {currentMessageIndex + 1} of {chatMessages.length}
                  </div>
                )}
              </div>
              
              {/* Revolutionary Input Interface */}
              <div className="p-6 bg-black/20 backdrop-blur-sm border-t border-white/20">
                {inputMode === 'voice' && (
                  <div className="text-center space-y-4">
                    <div className="text-white/80 text-sm mb-4">Speak to the orb or try gestures</div>
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={handleVoiceInput}
                        disabled={isRecording}
                        className={`w-16 h-16 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-orange-500 hover:bg-orange-600'} text-white flex items-center justify-center text-2xl`}
                      >
                        {isRecording ? '🎙️' : '🎤'}
                      </Button>
                      <Button
                        onClick={() => setInputMode('gesture')}
                        className="w-16 h-16 rounded-full bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center text-2xl"
                      >
                        ✋
                      </Button>
                      <Button
                        onClick={() => setInputMode('text')}
                        className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center text-xl"
                      >
                        💬
                      </Button>
                    </div>
                    {isRecording && (
                      <div className="text-orange-200 text-sm animate-pulse">
                        Listening... speak now
                      </div>
                    )}
                  </div>
                )}

                {inputMode === 'gesture' && (
                  <div className="text-center space-y-4">
                    <div className="text-white/80 text-sm mb-4">Try these gestures on the orb</div>
                    <div className="grid grid-cols-2 gap-3 text-xs text-white/70">
                      <div className="p-2 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20" onClick={() => handleGestureInput('swipe-up')}>
                        ↑ Swipe Up<br/>Show Menu
                      </div>
                      <div className="p-2 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20" onClick={() => handleGestureInput('swipe-down')}>
                        ↓ Swipe Down<br/>Today's Specials
                      </div>
                      <div className="p-2 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20" onClick={() => handleGestureInput('tap-double')}>
                        👆👆 Double Tap<br/>I Want to Order
                      </div>
                      <div className="p-2 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20" onClick={() => handleGestureInput('circle')}>
                        ○ Circle<br/>Surprise Me
                      </div>
                    </div>
                    <Button
                      onClick={() => setInputMode('voice')}
                      className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm"
                    >
                      Back to Voice
                    </Button>
                  </div>
                )}

                {inputMode === 'text' && (
                  <div className="space-y-3">
                    <div className="text-white/80 text-sm text-center">Fallback text mode</div>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleOrbChatMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <Button
                        onClick={handleOrbChatMessage}
                        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-sm font-medium"
                      >
                        Send
                      </Button>
                    </div>
                    <Button
                      onClick={() => setInputMode('voice')}
                      className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm"
                    >
                      Switch to Voice & Gestures
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-0 right-0 bg-transparent pointer-events-none">
        {/* Sentient AI Orb - Fixed center position */}
        <div className={`flex justify-center pointer-events-auto z-[200] ${
          isAnimating ? 'animate-morph-to-center' : ''
        }`}>
          <Button
            onClick={handleChatToggle}
            className={`w-20 h-20 rounded-full border-0 shadow-2xl relative overflow-hidden sentient-orb transition-all duration-300 ${
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
