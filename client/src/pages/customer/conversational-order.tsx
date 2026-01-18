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

// Customer profile for proactive suggestions
interface CustomerProfile {
  visitCount: number;
  lastVisit: string;
  favoriteItems: string[];
  lastOrder: string[];
}

// Get time-based greeting and suggestions
function getTimeContext(): { greeting: string; mealType: string; suggestions: string[] } {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 11) {
    return {
      greeting: 'Good morning',
      mealType: 'breakfast',
      suggestions: ['coffee', 'breakfast', 'eggs', 'pancakes']
    };
  } else if (hour >= 11 && hour < 14) {
    return {
      greeting: 'Good afternoon',
      mealType: 'lunch',
      suggestions: ['sandwich', 'salad', 'burger', 'soup']
    };
  } else if (hour >= 14 && hour < 17) {
    return {
      greeting: 'Good afternoon',
      mealType: 'afternoon snack',
      suggestions: ['coffee', 'dessert', 'appetizer', 'drink']
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: 'Good evening',
      mealType: 'dinner',
      suggestions: ['steak', 'pasta', 'fish', 'wine']
    };
  } else {
    return {
      greeting: 'Hello',
      mealType: 'late night bite',
      suggestions: ['appetizer', 'dessert', 'drink']
    };
  }
}

// Load customer profile from localStorage with error handling
function loadCustomerProfile(): CustomerProfile {
  try {
    const stored = localStorage.getItem('customerProfile');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load customer profile:', e);
  }
  return {
    visitCount: 0,
    lastVisit: '',
    favoriteItems: [],
    lastOrder: []
  };
}

// Save customer profile to localStorage
function saveCustomerProfile(profile: CustomerProfile) {
  localStorage.setItem('customerProfile', JSON.stringify(profile));
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
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(loadCustomerProfile());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check session
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      navigate('/scan');
    }
  }, [navigate]);

  // Fetch menu items and convert prices to numbers
  const { data: rawMenuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ['/api/restaurants/1/menu'],
    retry: false,
  });
  
  // Ensure prices are numbers (PostgreSQL numeric type returns as string)
  const menuItems = rawMenuItems.map(item => ({
    ...item,
    price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
  }));

  // Initial greeting with proactivity
  useEffect(() => {
    const timeContext = getTimeContext();
    const tableName = localStorage.getItem('tableNumber') || 'there';
    const isReturning = customerProfile.visitCount > 0;
    const lastOrderItems = customerProfile.lastOrder;
    
    // Update visit count
    const updatedProfile = {
      ...customerProfile,
      visitCount: customerProfile.visitCount + 1,
      lastVisit: new Date().toISOString()
    };
    setCustomerProfile(updatedProfile);
    saveCustomerProfile(updatedProfile);
    
    // Generate greeting based on customer history
    let greetingContent: string;
    if (isReturning && lastOrderItems.length > 0) {
      const favoriteItem = lastOrderItems[0];
      greetingContent = `${timeContext.greeting}, ${tableName}! 👋 Great to see you again!\n\nLast time you enjoyed the **${favoriteItem}**. Would you like that again, or shall I suggest something new for ${timeContext.mealType}?\n\nJust tell me what sounds good!`;
    } else {
      greetingContent = `${timeContext.greeting}, ${tableName}! 👋 Welcome to OrderFi!\n\nI'm here to take your order. Perfect time for ${timeContext.mealType}!\n\nJust tell me what you'd like - for example:\n• "I'll have a burger with extra cheese"\n• "What's popular right now?"\n• "Surprise me!"\n\nWhat can I get for you?`;
    }
    
    const greeting: ChatMessage = {
      id: 'greeting',
      role: 'assistant',
      content: greetingContent,
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

  // Generate AI response with proactive suggestions
  const generateResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    const timeContext = getTimeContext();
    
    // Handle checkout intent - save order to profile
    if (lowerMessage.includes('checkout') || lowerMessage.includes('pay') || 
        lowerMessage.includes('done') || lowerMessage.includes("that's all") ||
        lowerMessage.includes('thats all')) {
      if (getTotalItems() === 0) {
        return "You haven't added anything yet! What would you like to order?";
      }
      
      // Save order to customer profile
      const orderedItems = cart.map(item => item.name);
      const updatedProfile = {
        ...customerProfile,
        lastOrder: orderedItems,
        favoriteItems: Array.from(new Set([...customerProfile.favoriteItems, ...orderedItems])).slice(0, 5)
      };
      setCustomerProfile(updatedProfile);
      saveCustomerProfile(updatedProfile);
      
      return `Great! Your order total is $${getTotalPrice().toFixed(2)}.\n\nTap the "Pay Now" button below to complete your order, or tell me if you'd like to add anything else!`;
    }

    // Handle "same as last time" / repeat order
    if ((lowerMessage.includes('same') || lowerMessage.includes('usual') || lowerMessage.includes('again') || lowerMessage.includes('last time')) && customerProfile.lastOrder.length > 0) {
      const lastItems = customerProfile.lastOrder;
      const matchingItems = menuItems.filter(item => 
        lastItems.some(lastItem => lastItem.toLowerCase() === item.name.toLowerCase())
      );
      
      if (matchingItems.length > 0) {
        matchingItems.forEach(item => addToCart(item, [], 1));
        return `Perfect! I've added your usual order: ${matchingItems.map(i => i.name).join(', ')}. 🎉\n\nYour total is $${getTotalPrice().toFixed(2)}.\n\nAnything else, or are you ready to pay?`;
      }
    }

    // Handle "surprise me" - time-appropriate random suggestion
    if (lowerMessage.includes('surprise') || lowerMessage.includes('random') || lowerMessage.includes('anything')) {
      const timeSuggestions = timeContext.suggestions;
      const relevantItems = menuItems.filter(item => 
        timeSuggestions.some(s => item.name.toLowerCase().includes(s) || item.category.toLowerCase().includes(s))
      );
      
      const selectedItem = relevantItems.length > 0 
        ? relevantItems[Math.floor(Math.random() * relevantItems.length)]
        : menuItems[Math.floor(Math.random() * menuItems.length)];
      
      if (selectedItem) {
        addToCart(selectedItem, [], 1);
        return `I love the adventurous spirit! 🎲\n\nHow about the **${selectedItem.name}** - ${selectedItem.description}\n\nI've added it to your order ($${selectedItem.price.toFixed(2)}). What else can I get you?`;
      }
    }

    // Handle menu browsing
    if (lowerMessage.includes('menu') || lowerMessage.includes('what do you have') || 
        lowerMessage.includes('options') || lowerMessage.includes('show me')) {
      const categories = Array.from(new Set(menuItems.map(item => item.category)));
      return `We have some great options today! Here are our categories:\n\n${categories.map(cat => `• ${cat}`).join('\n')}\n\nJust tell me what sounds good, or tap "Browse Menu" below to see everything!`;
    }

    // Handle recommendations with time context
    if (lowerMessage.includes('recommend') || lowerMessage.includes('popular') || 
        lowerMessage.includes('what\'s good') || lowerMessage.includes('whats good') ||
        lowerMessage.includes('suggest')) {
      const timeSuggestions = timeContext.suggestions;
      const relevantItems = menuItems.filter(item => 
        timeSuggestions.some(s => item.name.toLowerCase().includes(s) || item.category.toLowerCase().includes(s))
      );
      const topItems = relevantItems.length >= 3 ? relevantItems.slice(0, 3) : menuItems.slice(0, 3);
      
      return `Great question! For ${timeContext.mealType}, I'd suggest:\n\n${topItems.map(item => `• **${item.name}** - $${item.price.toFixed(2)}\n  ${item.description}`).join('\n\n')}\n\nWould you like any of these?`;
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
      
      // Contextual follow-up suggestion
      const followUp = cart.length === 0 
        ? "Would you like a drink with that?" 
        : "Anything else?";
      
      return `Got it! I've added ${itemNames}${modText} to your order. 🍽️\n\nYour current total is $${(getTotalPrice() + items.reduce((sum, i) => sum + i.price, 0)).toFixed(2)}.\n\n${followUp}`;
    }

    // Default response with helpful suggestions
    return `I'm not quite sure what you'd like. Try saying:\n\n• A dish name like "burger" or "pizza"\n• "Recommend something for ${timeContext.mealType}"\n• "Surprise me!"\n• Or tap "Browse Menu" to see all options`;
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

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${(numPrice || 0).toFixed(2)}`;
  };

  const sessionInfo = {
    tableName: localStorage.getItem('tableNumber') || 'Guest',
    venueName: localStorage.getItem('venueName') || 'OrderFi Restaurant'
  };

  return (
    <div className="h-screen flex flex-col vintage-paper" style={{ background: 'hsl(var(--background))' }}>
      {/* Header - Vintage Style */}
      <div className="flex-shrink-0 px-4 py-3 border-b-2" style={{ borderColor: 'var(--vintage-brown)', background: 'var(--vintage-brown)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(245, 240, 230, 0.2)' }}>
              <ChefHat className="w-5 h-5" style={{ color: 'var(--vintage-cream)' }} />
            </div>
            <div style={{ color: 'var(--vintage-cream)' }}>
              <h1 className="font-bold text-lg typewriter-heading">OrderFi</h1>
              <p className="text-sm opacity-90 typewriter-text">{sessionInfo.tableName} • {sessionInfo.venueName}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBrowseMenu(!showBrowseMenu)}
            className="hover:bg-white/20"
            style={{ color: 'var(--vintage-cream)' }}
          >
            <MenuIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content - Chat + Receipt */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages - Typewriter Style */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 ${
                      message.role === 'user'
                        ? 'rounded-lg border-2'
                        : 'rounded-lg border-2'
                    }`}
                    style={{
                      background: message.role === 'user' ? 'var(--vintage-brown)' : 'hsl(var(--card))',
                      color: message.role === 'user' ? 'var(--vintage-cream)' : 'hsl(var(--foreground))',
                      borderColor: message.role === 'user' ? 'var(--vintage-sepia)' : 'var(--vintage-brown)',
                      boxShadow: '3px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <p className="text-sm whitespace-pre-line typewriter-text" style={{ fontFamily: '"Courier Prime", "Courier New", monospace' }}>{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-4 py-3 border-2" style={{ background: 'hsl(var(--card))', borderColor: 'var(--vintage-brown)' }}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--vintage-brown)', animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--vintage-brown)', animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--vintage-brown)', animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area - Vintage Style */}
          <div className="flex-shrink-0 p-4 border-t-2" style={{ borderColor: 'var(--vintage-brown)', background: 'hsl(var(--background))' }}>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleVoiceInput}
                className={`vintage-input ${isListening ? 'bg-red-100 text-red-600 border-red-300' : ''}`}
                style={{ borderColor: 'var(--vintage-brown)' }}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tell me what you'd like..."
                className="flex-1 vintage-input typewriter-text"
                style={{ fontFamily: '"Courier Prime", "Courier New", monospace' }}
              />
              
              <Button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isProcessing}
                className="vintage-btn"
                style={{ 
                  background: 'var(--vintage-rust)', 
                  color: 'var(--vintage-cream)',
                  borderColor: 'var(--vintage-sepia)'
                }}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Quick Actions - Vintage Buttons */}
            <div className="flex gap-2 mt-3 overflow-x-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBrowseMenu(true)}
                className="flex-shrink-0 typewriter-text"
                style={{ borderColor: 'var(--vintage-brown)', fontFamily: '"Courier Prime", monospace' }}
              >
                <MenuIcon className="w-4 h-4 mr-1" />
                Browse Menu
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputValue("What do you recommend?")}
                className="flex-shrink-0 typewriter-text"
                style={{ borderColor: 'var(--vintage-brown)', fontFamily: '"Courier Prime", monospace' }}
              >
                Recommendations
              </Button>
            </div>
          </div>
        </div>

        {/* Dynamic Receipt Sidebar - Vintage Style */}
        <div className="w-80 flex-shrink-0 border-l-2 flex flex-col hidden md:flex" style={{ borderColor: 'var(--vintage-brown)', background: 'hsl(var(--card))' }}>
          <div className="p-4 border-b-2" style={{ borderColor: 'var(--vintage-brown)' }}>
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5" style={{ color: 'var(--vintage-rust)' }} />
              <h2 className="font-bold text-lg typewriter-heading">Your Order</h2>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            {cart.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 typewriter-text">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Your order is empty</p>
                <p className="text-sm mt-1">Just tell me what you'd like!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div key={item.id} className="rounded-lg p-3 border-2" style={{ background: 'hsl(var(--background))', borderColor: 'var(--vintage-brown)', boxShadow: '2px 2px 0 rgba(0,0,0,0.1)' }}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm typewriter-text">{item.name}</h4>
                        <p className="text-sm text-muted-foreground typewriter-text">{formatPrice(item.price)}</p>
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