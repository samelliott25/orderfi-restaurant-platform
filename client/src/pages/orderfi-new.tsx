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
import { ThreeOrb } from '@/components/ThreeOrb';
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
  const [isRecording, setIsRecording] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0, time: 0 });
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

  const startVoiceRecording = () => {
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
        const userMessage = {
          id: Date.now().toString(),
          text: transcript,
          isUser: true,
          timestamp: new Date()
        };
        
        setChatMessages(prev => {
          const newMessages = [...prev, userMessage];
          setCurrentMessageIndex(newMessages.length - 1);
          return newMessages;
        });
        
        // Simulate AI response
        setTimeout(() => {
          const aiResponse = {
            id: (Date.now() + 1).toString(),
            text: "Thanks for your voice message! I heard: " + transcript,
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
      
      recognition.onerror = () => {
        setIsRecording(false);
        setIsHolding(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
        setIsHolding(false);
      };
      
      recognition.start();
    }
  };

  const handleOrbTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setTouchStart({ x: clientX, y: clientY, time: Date.now() });
    setIsHolding(true);
    
    // Start voice recording after 500ms hold
    setTimeout(() => {
      if (isHolding) {
        startVoiceRecording();
      }
    }, 500);
  };

  const handleOrbTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    
    const deltaX = clientX - touchStart.x;
    const deltaY = clientY - touchStart.y;
    const holdTime = Date.now() - touchStart.time;
    
    setIsHolding(false);
    
    if (holdTime > 500 && isRecording) {
      // Was a voice recording - let it finish naturally
      return;
    }
    
    if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
      // Handle swipe gestures
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY > 50) {
          // Swipe down - close chat
          setIsChatExpanded(false);
        } else if (deltaY < -50) {
          // Swipe up - show menu
          handleGestureAction('Show me the menu');
        }
      } else {
        if (deltaX > 50) {
          // Swipe right - add to cart
          handleGestureAction('Add this item to my cart');
        } else if (deltaX < -50) {
          // Swipe left - go back
          handleGestureAction('Go back to previous options');
        }
      }
    } else if (holdTime < 500) {
      // Quick tap - open text input
      openTextInput();
    }
  };

  const handleGestureAction = (action: string) => {
    const userMessage = {
      id: Date.now().toString(),
      text: action,
      isUser: true,
      timestamp: new Date()
    };
    
    setChatMessages(prev => {
      const newMessages = [...prev, userMessage];
      setCurrentMessageIndex(newMessages.length - 1);
      return newMessages;
    });
    
    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'Show me the menu': 'Here are our menu categories: Appetizers, Main Courses, Desserts, and Beverages.',
        'Add this item to my cart': 'Item added to your cart! Anything else you\'d like to order?',
        'Go back to previous options': 'Going back to the previous menu...'
      };
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: responses[action] || 'I understand your gesture. How can I help you?',
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

  const openTextInput = () => {
    const input = prompt('Type your message:');
    if (input && input.trim()) {
      const userMessage = {
        id: Date.now().toString(),
        text: input,
        isUser: true,
        timestamp: new Date()
      };
      
      setChatMessages(prev => {
        const newMessages = [...prev, userMessage];
        setCurrentMessageIndex(newMessages.length - 1);
        return newMessages;
      });
      
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
    }
  };

  const handleProactiveAction = (action: string) => {
    const actionResponses: Record<string, { userText: string; aiResponse: string }> = {
      'show-menu': {
        userText: 'Show me the menu',
        aiResponse: 'Here are our menu categories:\n\n🍕 Pizza & Pasta\n🥗 Fresh Salads\n🍖 Grilled Specialties\n🍰 Desserts\n🥤 Beverages\n\nWhat catches your eye?'
      },
      'recommend': {
        userText: 'Surprise me with a recommendation',
        aiResponse: 'Perfect! Based on what\'s popular today, I recommend our:\n\n🌟 Truffle Mushroom Risotto - creamy, aromatic, absolutely divine!\n\nIt pairs wonderfully with our house salad. Would you like to add it to your order?'
      },
      'specials': {
        userText: 'What\'s today\'s special?',
        aiResponse: 'Today\'s special is incredible!\n\n🔥 Grilled Salmon with Lemon Herb Butter\nServed with roasted vegetables and wild rice\n\nUsually $28, today only $22! It\'s flying out of the kitchen. Interested?'
      },
      'quick-order': {
        userText: 'I want to order quickly',
        aiResponse: 'Let\'s get you sorted fast! Here are our quickest options:\n\n⚡ Caesar Salad - 5 mins\n⚡ Margherita Pizza - 10 mins\n⚡ Grilled Chicken Wrap - 7 mins\n\nWhich sounds good?'
      },
      'dietary': {
        userText: 'Show me dietary options',
        aiResponse: 'I\'d love to help with your dietary needs!\n\n🌱 Vegan options available\n🥛 Gluten-free menu\n🥩 Keto-friendly dishes\n🚫 Allergen-free choices\n\nWhat dietary preferences should I focus on?'
      },
      'popular': {
        userText: 'What\'s popular here?',
        aiResponse: 'Great question! Our top crowd-pleasers are:\n\n🏆 #1 Chicken Parmesan\n🏆 #2 Beef Tacos (3-pack)\n🏆 #3 Vegetarian Buddha Bowl\n\nAll are chef-recommended and guest favorites!'
      }
    };

    const response = actionResponses[action];
    if (response) {
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        text: response.userText,
        isUser: true,
        timestamp: new Date()
      };
      
      setChatMessages(prev => {
        const newMessages = [...prev, userMessage];
        setCurrentMessageIndex(newMessages.length - 1);
        return newMessages;
      });
      
      // Add AI response after delay
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          text: response.aiResponse,
          isUser: false,
          timestamp: new Date()
        };
        setChatMessages(prev => {
          const newMessages = [...prev, aiResponse];
          setCurrentMessageIndex(newMessages.length - 1);
          return newMessages;
        });
      }, 1000);
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
            {/* Three.js Enhanced Orb */}
            <ThreeOrb 
              onTouchStart={handleOrbTouchStart}
              onTouchEnd={handleOrbTouchEnd}
              className="animate-in zoom-in duration-500 delay-200 hover:scale-105 transition-transform looking-glass-orb"
            />
            
            {/* CSS Overlay for Glass Effect */}
            <div 
              className="absolute inset-0 w-80 h-80 rounded-full pointer-events-none"
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
                  <div className="text-center transition-all duration-300">
                    <div className="mb-6">
                      <div className={`inline-block px-6 py-4 max-w-[240px] transition-all duration-300 ${
                        getCurrentMessage()?.isUser 
                          ? 'bg-white/20 border border-white/40 rounded-xl text-white backdrop-blur-sm' 
                          : 'bg-white/15 border border-white/30 rounded-xl text-white/95 backdrop-blur-md'
                      }`}>
                        <div className="text-sm leading-relaxed font-light tracking-wide">
                          {getCurrentMessage()?.text}
                        </div>
                      </div>
                      <div className="text-xs text-white/50 mt-2 font-light tracking-wider">
                        {getCurrentMessage()?.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-8">
                    <div className="text-white/90 text-2xl font-light tracking-wide looking-glass-text">
                      What brings you here?
                    </div>
                    
                    {/* Designer-grade action grid */}
                    <div className="grid grid-cols-2 gap-4 max-w-[220px] mx-auto">
                      <button
                        onClick={() => handleProactiveAction('show-menu')}
                        className="aspect-square bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white text-xs font-medium backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] flex flex-col items-center justify-center gap-1"
                      >
                        <span className="text-lg">🍽</span>
                        <span>Menu</span>
                      </button>
                      <button
                        onClick={() => handleProactiveAction('recommend')}
                        className="aspect-square bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white text-xs font-medium backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] flex flex-col items-center justify-center gap-1"
                      >
                        <span className="text-lg">✨</span>
                        <span>Surprise</span>
                      </button>
                      <button
                        onClick={() => handleProactiveAction('specials')}
                        className="aspect-square bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white text-xs font-medium backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] flex flex-col items-center justify-center gap-1"
                      >
                        <span className="text-lg">⭐</span>
                        <span>Special</span>
                      </button>
                      <button
                        onClick={() => handleProactiveAction('popular')}
                        className="aspect-square bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white text-xs font-medium backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] flex flex-col items-center justify-center gap-1"
                      >
                        <span className="text-lg">🔥</span>
                        <span>Popular</span>
                      </button>
                    </div>
                    
                    {/* Secondary actions */}
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleProactiveAction('quick-order')}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-white text-xs font-light backdrop-blur-sm transition-all duration-300"
                      >
                        Quick Order
                      </button>
                      <button
                        onClick={() => handleProactiveAction('dietary')}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-white text-xs font-light backdrop-blur-sm transition-all duration-300"
                      >
                        Dietary
                      </button>
                    </div>
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
              
              {/* Gesture Guide */}
              <div className="p-6 bg-black/20 backdrop-blur-sm border-t border-white/20">
                <div className="text-center space-y-4">
                  <div className="text-white/80 text-sm mb-4">Interact directly with the orb</div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-white/70">
                    <div className="p-2 bg-white/10 rounded-lg">
                      👆 Tap<br/>Type Message
                    </div>
                    <div className="p-2 bg-white/10 rounded-lg">
                      🔒 Hold<br/>Voice Record
                    </div>
                    <div className="p-2 bg-white/10 rounded-lg">
                      ↓ Swipe Down<br/>Close Chat
                    </div>
                    <div className="p-2 bg-white/10 rounded-lg">
                      → Swipe Right<br/>Add to Cart
                    </div>
                  </div>
                  {isRecording && (
                    <div className="text-orange-200 text-sm animate-pulse">
                      🎙️ Recording... speak now
                    </div>
                  )}
                  {isHolding && !isRecording && (
                    <div className="text-purple-200 text-sm animate-pulse">
                      Hold to start recording...
                    </div>
                  )}
                </div>
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
