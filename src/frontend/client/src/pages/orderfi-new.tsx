import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
    scrollToBottom();
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
    <div className="min-h-screen bg-[#fcfcfc]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg" style={{ fontFamily: 'Playwrite Australia Victoria' }}>
              OrderFi AI
            </h1>
            <p className="text-sm text-gray-500">Smart Restaurant Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-gray-400" />
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gray-100">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 pb-20" style={{ height: 'calc(100vh - 140px)' }}>
        <div className="space-y-4 py-4">

          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-16 bg-white border-gray-200 hover:bg-gray-50"
                  onClick={action.action}
                >
                  {action.icon}
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Today's Specials */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Today's Specials</h3>
            <div className="space-y-3">
              {todaysSpecials.map((special) => (
                <Card key={special.id} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{special.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{special.description}</p>
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
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Orders</h3>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Card key={order.id} className="border-gray-200">
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
                        <p className="text-xs text-gray-600 mt-1">{order.items}</p>
                        <p className="font-bold text-sm mt-2">${order.total}</p>
                      </div>
                      <span className="text-xs text-gray-500">{order.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Floating AI Chat Interface */}
      {isChatExpanded && (
        <div className="fixed top-20 right-4 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">AI Assistant</span>
              <Badge className="bg-green-100 text-green-800 text-xs">Online</Badge>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsChatExpanded(false)}
              className="p-1 h-6 w-6 hover:bg-gray-100"
              title="Minimize chat"
            >
              <span className="text-lg leading-none">−</span>
            </Button>
          </div>
          
          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'assistant' ? (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-800">{message.content}</p>
                      </div>
                      {message.menuItems && message.menuItems.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.menuItems.map((item, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant="outline"
                              className="text-xs h-5 px-2"
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
                    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-lg px-3 py-2 max-w-[70%]">
                      <p className="text-xs">{message.content}</p>
                    </div>
                    <Avatar className="w-6 h-6 flex-shrink-0">
                      <AvatarFallback className="bg-gray-600 text-white text-xs">
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
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-2">
              <Button
                size="sm"
                variant="ghost"
                className={`p-1 rounded-full ${isListening ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'}`}
                onClick={handleVoiceToggle}
              >
                {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
              </Button>
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
              <Button
                size="sm"
                className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white p-1 rounded-full"
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
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
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-orange-500"
            onClick={() => setLocation('/dashboard')}
          >
            <Menu className="h-4 w-4" />
            <span className="text-xs">Menu</span>
          </Button>
          
          {/* AI Chatbot Icon - Center of navbar */}
          <Button
            onClick={() => setIsChatExpanded(true)}
            className="absolute left-1/2 transform -translate-x-1/2 -top-6 w-12 h-12 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white rounded-full shadow-lg z-50"
          >
            <Sparkles className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-orange-500"
            onClick={() => setLocation('/dashboard')}
          >
            <Calendar className="h-4 w-4" />
            <span className="text-xs">Orders</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-orange-500"
            onClick={() => setLocation('/tokenrewards')}
          >
            <Gift className="h-4 w-4" />
            <span className="text-xs">Rewards</span>
          </Button>
        </div>
      </div>
    </div>
  );
}