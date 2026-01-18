import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Mic, 
  MicOff,
  ChefHat,
  Receipt,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Menu as MenuIcon,
  X,
  MessageCircle
} from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  aliases?: string[];
  keywords?: string[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  items?: Array<{ name: string; price: number; quantity: number }>;
}

export default function ConversationalOrder() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBrowseMenu, setShowBrowseMenu] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check session
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      navigate('/scan');
    }
  }, [navigate]);

  // Fetch menu items
  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ['/api/restaurants/1/menu'],
    retry: false,
  });

  // Initial greeting
  useEffect(() => {
    const tableName = localStorage.getItem('tableNumber') || 'there';
    const greeting: ChatMessage = {
      id: 'greeting',
      role: 'assistant',
      content: `Hi ${tableName}! 👋 Welcome to OrderFi. I'm here to take your order.\n\nJust tell me what you'd like - for example:\n• "I'll have a burger with extra cheese"\n• "What's good today?"\n• "Show me the desserts"\n\nWhat can I get for you?`,
      timestamp: new Date()
    };
    setMessages([greeting]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Parse user message and find matching items
  const parseOrder = (userMessage: string): { items: MenuItem[], modifiers: string[] } => {
    const lowerMessage = userMessage.toLowerCase();
    const foundItems: MenuItem[] = [];
    const modifiers: string[] = [];

    // Common modifiers
    const modifierPatterns = [
      'extra cheese', 'no onions', 'well done', 'medium rare', 'spicy', 
      'mild', 'add bacon', 'no pickles', 'gluten free', 'dairy free'
    ];
    
    modifierPatterns.forEach(mod => {
      if (lowerMessage.includes(mod)) {
        modifiers.push(mod);
      }
    });

    // Search menu items
    menuItems.forEach(item => {
      const itemName = item.name.toLowerCase();
      const aliases = item.aliases?.map(a => a.toLowerCase()) || [];
      const keywords = item.keywords?.map(k => k.toLowerCase()) || [];
      
      // Check if message contains item name or aliases
      if (lowerMessage.includes(itemName) || 
          aliases.some(alias => lowerMessage.includes(alias)) ||
          keywords.some(keyword => lowerMessage.includes(keyword))) {
        foundItems.push(item);
      }
    });

    return { items: foundItems, modifiers };
  };

  // Generate AI response
  const generateResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Handle checkout intent
    if (lowerMessage.includes('checkout') || lowerMessage.includes('pay') || 
        lowerMessage.includes('done') || lowerMessage.includes("that's all") ||
        lowerMessage.includes('thats all')) {
      if (getTotalItems() === 0) {
        return "You haven't added anything yet! What would you like to order?";
      }
      return `Great! Your order total is $${getTotalPrice().toFixed(2)}.\n\nTap the "Pay Now" button below to complete your order, or tell me if you'd like to add anything else!`;
    }

    // Handle menu browsing
    if (lowerMessage.includes('menu') || lowerMessage.includes('what do you have') || 
        lowerMessage.includes('options') || lowerMessage.includes('show me')) {
      const categories = [...new Set(menuItems.map(item => item.category))];
      return `We have some great options today! Here are our categories:\n\n${categories.map(cat => `• ${cat}`).join('\n')}\n\nJust tell me what sounds good, or tap "Browse Menu" below to see everything!`;
    }

    // Handle recommendations
    if (lowerMessage.includes('recommend') || lowerMessage.includes('popular') || 
        lowerMessage.includes('what\'s good') || lowerMessage.includes('whats good') ||
        lowerMessage.includes('suggest')) {
      const topItems = menuItems.slice(0, 3);
      return `Great question! Here are some favorites:\n\n${topItems.map(item => `• ${item.name} - $${item.price.toFixed(2)}\n  ${item.description}`).join('\n\n')}\n\nWould you like any of these?`;
    }

    // Parse order from message
    const { items, modifiers } = parseOrder(userMessage);
    
    if (items.length > 0) {
      // Add items to cart
      items.forEach(item => {
        addToCart(item, [], 1);
      });
      
      const itemNames = items.map(i => i.name).join(', ');
      const modText = modifiers.length > 0 ? ` (${modifiers.join(', ')})` : '';
      
      return `Got it! I've added ${itemNames}${modText} to your order. 🍽️\n\nYour current total is $${(getTotalPrice() + items.reduce((sum, i) => sum + i.price, 0)).toFixed(2)}.\n\nAnything else?`;
    }

    // Default response
    return "I'm not quite sure what you'd like. Try telling me a dish name, or say 'show me the menu' to browse our options!";
  };

  // Handle send message - accepts optional direct message for voice input
  const handleSend = async (directMessage?: string) => {
    const messageToSend = directMessage || inputValue;
    if (!messageToSend.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Generate AI response
    const response = await generateResponse(messageToSend);
    
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsProcessing(false);
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({ title: "Voice not supported", description: "Your browser doesn't support voice input", variant: "destructive" });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const sessionInfo = {
    tableName: localStorage.getItem('tableNumber') || 'Guest',
    venueName: localStorage.getItem('venueName') || 'OrderFi Restaurant'
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div className="text-white">
              <h1 className="font-bold text-lg">OrderFi</h1>
              <p className="text-sm opacity-90">{sessionInfo.tableName} • {sessionInfo.venueName}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBrowseMenu(!showBrowseMenu)}
            className="text-white hover:bg-white/20"
          >
            <MenuIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content - Chat + Receipt */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleVoiceInput}
                className={isListening ? 'bg-red-100 text-red-600 border-red-300' : ''}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tell me what you'd like..."
                className="flex-1"
              />
              
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isProcessing}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2 mt-3 overflow-x-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBrowseMenu(true)}
                className="flex-shrink-0"
              >
                <MenuIcon className="w-4 h-4 mr-1" />
                Browse Menu
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputValue("What do you recommend?")}
                className="flex-shrink-0"
              >
                Recommendations
              </Button>
            </div>
          </div>
        </div>

        {/* Dynamic Receipt Sidebar */}
        <div className="w-80 flex-shrink-0 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col hidden md:flex">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-orange-500" />
              <h2 className="font-bold text-lg">Your Order</h2>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            {cart.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Your order is empty</p>
                <p className="text-sm mt-1">Just tell me what you'd like!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div key={item.id} className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          {/* Order Total & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold text-lg">{formatPrice(getTotalPrice())}</span>
              </div>
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Now
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Receipt Bar */}
      {cart.length > 0 && (
        <div className="md:hidden flex-shrink-0 p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <Button
            onClick={() => navigate('/cart')}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          >
            <Receipt className="w-4 h-4 mr-2" />
            View Order ({getTotalItems()} items) • {formatPrice(getTotalPrice())}
          </Button>
        </div>
      )}

      {/* Browse Menu Modal */}
      {showBrowseMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-900 w-full max-h-[80vh] rounded-t-2xl overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-lg">Menu</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowBrowseMenu(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <ScrollArea className="h-[60vh] p-4">
              <div className="space-y-4">
                {menuItems.map(item => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <p className="text-sm font-medium text-orange-500">{formatPrice(item.price)}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        addToCart(item, [], 1);
                        toast({ title: "Added!", description: `${item.name} added to your order` });
                      }}
                      className="bg-gradient-to-r from-orange-500 to-pink-500"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}