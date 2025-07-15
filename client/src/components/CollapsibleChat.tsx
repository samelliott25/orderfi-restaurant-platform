import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Send, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Star, 
  Clock, 
  Truck,
  ChefHat,
  X,
  MessageCircle,
  ArrowDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  deliveryTime: string;
  tags: string[];
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'menu' | 'item';
  content: string;
  timestamp: Date;
  menuItems?: MenuItem[];
  menuItem?: MenuItem;
}

interface CollapsibleChatProps {
  className?: string;
}

interface ProductViewRequest {
  productId: number;
  productName: string;
}

export function CollapsibleChat({ className }: CollapsibleChatProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm Mimi 🍕 What are you craving today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [highlightedProductId, setHighlightedProductId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  // Determine if we're in dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const updateTheme = () => {
      const darkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      console.log('Theme update:', { theme, darkMode, systemPreference: window.matchMedia('(prefers-color-scheme: dark)').matches });
      setIsDarkMode(darkMode);
    };
    
    updateTheme();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);
    
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Pepperoni Pizza",
      description: "Classic pizza with a thin or thick crust, tomato sauce, mozzarella cheese, and spicy pepperoni sausage.",
      price: 19.99,
      image: "🍕",
      category: "pizza",
      rating: 4.5,
      deliveryTime: "30-40 min",
      tags: ["Popular", "Free Delivery"]
    },
    {
      id: 2,
      name: "Vegetable Pizza",
      description: "Fresh vegetables on crispy crust with premium mozzarella cheese and our signature tomato sauce.",
      price: 18.99,
      image: "🍕",
      category: "pizza",
      rating: 4.3,
      deliveryTime: "30-40 min",
      tags: ["Healthy", "Free Delivery"]
    },
    {
      id: 3,
      name: "Classic Burger",
      description: "Juicy beef patty with fresh lettuce, tomato, onion, and our special sauce on a toasted bun.",
      price: 12.99,
      image: "🍔",
      category: "burger",
      rating: 4.7,
      deliveryTime: "20-30 min",
      tags: ["Bestseller"]
    },
    {
      id: 4,
      name: "Chicken Wings",
      description: "Crispy chicken wings with your choice of BBQ, buffalo, or honey mustard sauce.",
      price: 14.99,
      image: "🍗",
      category: "appetizer",
      rating: 4.6,
      deliveryTime: "25-35 min",
      tags: ["Spicy"]
    },
    {
      id: 5,
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with parmesan cheese, croutons, and our homemade Caesar dressing.",
      price: 9.99,
      image: "🥗",
      category: "salad",
      rating: 4.2,
      deliveryTime: "15-25 min",
      tags: ["Healthy", "Light"]
    },
    {
      id: 6,
      name: "Chocolate Cake",
      description: "Rich chocolate cake with layers of chocolate ganache and fresh berries.",
      price: 7.99,
      image: "🍰",
      category: "dessert",
      rating: 4.8,
      deliveryTime: "10-15 min",
      tags: ["Sweet", "Popular"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '🍽️' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'burger', name: 'Burgers', icon: '🍔' },
    { id: 'appetizer', name: 'Appetizers', icon: '🍗' },
    { id: 'salad', name: 'Salads', icon: '🥗' },
    { id: 'dessert', name: 'Desserts', icon: '🍰' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  useEffect(() => {
    if (isExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Enhanced bot responses with specific product navigation
    setTimeout(() => {
      let botResponse = "Let me show you some options! 📋";
      let showMenu = false;
      let highlightProduct: number | null = null;
      
      // Check for specific product mentions
      const lowerMessage = inputMessage.toLowerCase();
      
      // Specific product requests
      if (lowerMessage.includes('pepperoni') || lowerMessage.includes('pepperoni pizza')) {
        botResponse = "Perfect! Here's our popular Pepperoni Pizza:";
        setSelectedCategory('pizza');
        highlightProduct = 1;
        showMenu = true;
      } else if (lowerMessage.includes('vegetable pizza') || lowerMessage.includes('veggie pizza')) {
        botResponse = "Great choice! Here's our fresh Vegetable Pizza:";
        setSelectedCategory('pizza');
        highlightProduct = 2;
        showMenu = true;
      } else if (lowerMessage.includes('classic burger') || (lowerMessage.includes('burger') && !lowerMessage.includes('pizza'))) {
        botResponse = "Excellent! Here's our juicy Classic Burger:";
        setSelectedCategory('burger');
        highlightProduct = 3;
        showMenu = true;
      } else if (lowerMessage.includes('wings') || lowerMessage.includes('chicken wings')) {
        botResponse = "Tasty choice! Here are our crispy Chicken Wings:";
        setSelectedCategory('appetizer');
        highlightProduct = 4;
        showMenu = true;
      } else if (lowerMessage.includes('caesar') || lowerMessage.includes('salad')) {
        botResponse = "Healthy option! Here's our fresh Caesar Salad:";
        setSelectedCategory('salad');
        highlightProduct = 5;
        showMenu = true;
      } else if (lowerMessage.includes('pasta') || lowerMessage.includes('carbonara')) {
        botResponse = "Delicious! Here's our creamy Pasta Carbonara:";
        setSelectedCategory('pasta');
        highlightProduct = 6;
        showMenu = true;
      } else if (lowerMessage.includes('tiramisu') || lowerMessage.includes('dessert')) {
        botResponse = "Sweet ending! Here's our classic Tiramisu:";
        setSelectedCategory('dessert');
        highlightProduct = 7;
        showMenu = true;
      }
      // General category requests
      else if (lowerMessage.includes('pizza')) {
        botResponse = "Great choice! Here are our delicious pizzas:";
        setSelectedCategory('pizza');
        showMenu = true;
      } else if (lowerMessage.includes('menu') || lowerMessage.includes('food')) {
        botResponse = "Here's our full menu! Scroll through to see everything:";
        setSelectedCategory('all');
        showMenu = true;
      } else if (lowerMessage.includes('recommend') || lowerMessage.includes('popular')) {
        botResponse = "Our most popular items are right here:";
        showMenu = true;
      } else if (lowerMessage.includes('healthy')) {
        botResponse = "Here are our healthy options:";
        setSelectedCategory('salad');
        showMenu = true;
      }
      
      // Set highlighted product for auto-focus
      if (highlightProduct) {
        setHighlightedProductId(highlightProduct);
        // Clear highlight after 3 seconds
        setTimeout(() => setHighlightedProductId(null), 3000);
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      if (showMenu) {
        setTimeout(() => {
          const menuMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            type: 'menu',
            content: 'Tap any item to add it to your cart!',
            timestamp: new Date(),
            menuItems: filteredItems
          };
          setMessages(prev => [...prev, menuMessage]);
        }, 500);
      }
    }, 800);

    setInputMessage('');
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });

    // Add confirmation message
    const confirmMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'bot',
      content: `Added ${item.name}! 🛒 Anything else?`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMessage]);
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className={cn("fixed z-50", className)}>
      {/* Collapsed State - Floating Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center relative transition-all duration-300 hover:scale-110 active:scale-95 bg-gradient-to-br from-orange-400 to-white dark:from-orange-400 dark:to-slate-900"
        >
          <MessageCircle className="w-8 h-8 text-slate-900 dark:text-white" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {getTotalItems()}
            </span>
          )}
        </button>
      )}

      {/* Expanded State - Overlay Card */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          />
          
          {/* Chat Card */}
          <div 
            className={`fixed inset-4 rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-300 ${
              isDarkMode ? 'chat-gradient-dark' : 'chat-gradient-light'
            }`}
            style={{
              background: isDarkMode 
                ? 'linear-gradient(135deg, #fb923c 0%, #0f172a 100%)' 
                : 'linear-gradient(135deg, #fb923c 0%, #ffffff 100%)'
            }}
            data-testid="chat-gradient-container"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/30 dark:bg-slate-800/50 flex items-center justify-center backdrop-blur-sm">
                  <ChefHat className="w-6 h-6 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-slate-900 dark:text-white">AI Assistant</h2>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getTotalItems() > 0 && (
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6 text-slate-900 dark:text-white" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-white/20 dark:hover:bg-slate-700/50"
                >
                  <X className="w-5 h-5 text-slate-900 dark:text-white" />
                </Button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="p-3 border-b border-white/20 dark:border-slate-700/50">
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`whitespace-nowrap text-xs ${
                      selectedCategory === category.id 
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                        : 'border-slate-900/30 dark:border-white/30 text-slate-900 dark:text-white bg-white/20 dark:bg-slate-800/20'
                    }`}
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className="space-y-3">
                  {message.type === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-slate-900/80 dark:bg-white/90 text-white dark:text-slate-900 p-3 rounded-2xl rounded-br-sm text-sm backdrop-blur-sm">
                        {message.content}
                      </div>
                    </div>
                  ) : message.type === 'bot' ? (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] bg-white/80 dark:bg-slate-800/80 p-3 rounded-2xl rounded-bl-sm border border-white/30 dark:border-slate-600/50 text-sm text-slate-900 dark:text-white backdrop-blur-sm">
                        {message.content}
                      </div>
                    </div>
                  ) : message.type === 'menu' ? (
                    <div className="space-y-3">
                      <div className="flex justify-start">
                        <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-2xl rounded-bl-sm border border-white/30 dark:border-slate-600/50 text-sm text-slate-900 dark:text-white backdrop-blur-sm">
                          {message.content}
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {message.menuItems?.map((item) => {
                          const isHighlighted = highlightedProductId === item.id;
                          return (
                            <Card 
                              key={item.id} 
                              className={`bg-background border transition-all duration-500 ${
                                isHighlighted ? 'ring-2 ring-yellow-400 shadow-lg scale-105' : ''
                              }`} 
                              className={`${isHighlighted ? 'border-amber-500' : 'border-border'}`}
                            >
                              <CardContent className="p-3">
                                {isHighlighted && (
                                  <div className="mb-2 text-center">
                                    <Badge className="bg-yellow-400 text-yellow-900 text-xs">
                                      ⭐ Suggested for you!
                                    </Badge>
                                  </div>
                                )}
                                <div className="flex gap-3">
                                  <div className="text-2xl">{item.image}</div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-1">
                                      <h4 className="font-semibold text-sm truncate text-foreground">
                                        {item.name}
                                      </h4>
                                      <span className="font-bold text-sm ml-2 text-foreground">
                                        ${item.price}
                                      </span>
                                    </div>
                                    
                                    <p className="text-xs mb-2 line-clamp-2 text-foreground">
                                      {item.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3 text-xs text-foreground">
                                        <div className="flex items-center gap-1">
                                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                          <span>{item.rating}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          <span>{item.deliveryTime}</span>
                                        </div>
                                      </div>
                                      <Button 
                                        onClick={() => addToCart(item)}
                                        size="sm"
                                        className={`text-white text-xs px-3 py-1 ${
                                          isHighlighted 
                                            ? 'bg-yellow-500 hover:bg-yellow-600' 
                                            : 'bg-[#8b795e] hover:bg-[#6d5d4f]'
                                        }`}
                                      >
                                        <Plus className="w-3 h-3 mr-1" />
                                        {isHighlighted ? 'Add This!' : 'Add'}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div className="p-3 border-t border-border">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {getTotalItems()} items • ${getTotalPrice().toFixed(2)}
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-[#8b795e] hover:bg-[#6d5d4f] text-white"
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/20 dark:border-slate-700/50">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 text-sm bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-600/50 text-slate-900 dark:text-white placeholder-slate-600 dark:placeholder-slate-400 backdrop-blur-sm"
                />
                <Button 
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-slate-900/80 dark:bg-white/90 hover:bg-slate-900 dark:hover:bg-white text-white dark:text-slate-900 px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}