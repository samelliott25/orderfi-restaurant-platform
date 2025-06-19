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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Simple bot responses based on keywords
    setTimeout(() => {
      let botResponse = "Let me show you some options! 📋";
      let showMenu = false;
      
      if (inputMessage.toLowerCase().includes('pizza')) {
        botResponse = "Great choice! Here are our delicious pizzas:";
        setSelectedCategory('pizza');
        showMenu = true;
      } else if (inputMessage.toLowerCase().includes('burger')) {
        botResponse = "Perfect! Check out our juicy burgers:";
        setSelectedCategory('burger');
        showMenu = true;
      } else if (inputMessage.toLowerCase().includes('menu') || inputMessage.toLowerCase().includes('food')) {
        botResponse = "Here's our full menu! Scroll through to see everything:";
        setSelectedCategory('all');
        showMenu = true;
      } else if (inputMessage.toLowerCase().includes('recommend') || inputMessage.toLowerCase().includes('popular')) {
        botResponse = "Our most popular items are right here:";
        showMenu = true;
      } else if (inputMessage.toLowerCase().includes('healthy')) {
        botResponse = "Here are our healthy options:";
        setSelectedCategory('salad');
        showMenu = true;
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
          className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center relative transition-all duration-300 hover:scale-110 active:scale-95"
          style={{ backgroundColor: '#8b795e' }}
        >
          <MessageCircle className="w-8 h-8 text-white" />
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
            className="fixed inset-4 rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-300"
            style={{ backgroundColor: '#fff0cc' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#e5cf97' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8b795e] flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg" style={{ color: '#654321' }}>Mimi Waitress</h2>
                  <p className="text-sm" style={{ color: '#8b795e' }}>Order Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getTotalItems() > 0 && (
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6" style={{ color: '#8b795e' }} />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="p-2"
                >
                  <X className="w-5 h-5" style={{ color: '#8b795e' }} />
                </Button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="p-3 border-b" style={{ borderColor: '#e5cf97' }}>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`whitespace-nowrap text-xs ${
                      selectedCategory === category.id 
                        ? 'bg-[#8b795e] text-white' 
                        : 'border-[#8b795e] text-[#654321] bg-white'
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
                      <div className="max-w-[80%] bg-[#8b795e] text-white p-3 rounded-2xl rounded-br-sm text-sm">
                        {message.content}
                      </div>
                    </div>
                  ) : message.type === 'bot' ? (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] bg-white p-3 rounded-2xl rounded-bl-sm border text-sm" style={{ borderColor: '#e5cf97', color: '#654321' }}>
                        {message.content}
                      </div>
                    </div>
                  ) : message.type === 'menu' ? (
                    <div className="space-y-3">
                      <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl rounded-bl-sm border text-sm" style={{ borderColor: '#e5cf97', color: '#654321' }}>
                          {message.content}
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {message.menuItems?.map((item) => (
                          <Card key={item.id} className="bg-white border" style={{ borderColor: '#e5cf97' }}>
                            <CardContent className="p-3">
                              <div className="flex gap-3">
                                <div className="text-2xl">{item.image}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-1">
                                    <h4 className="font-semibold text-sm truncate" style={{ color: '#654321' }}>
                                      {item.name}
                                    </h4>
                                    <span className="font-bold text-sm ml-2" style={{ color: '#654321' }}>
                                      ${item.price}
                                    </span>
                                  </div>
                                  
                                  <p className="text-xs mb-2 line-clamp-2" style={{ color: '#8b795e' }}>
                                    {item.description}
                                  </p>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-xs" style={{ color: '#8b795e' }}>
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
                                      className="bg-[#8b795e] hover:bg-[#6d5d4f] text-white text-xs px-3 py-1"
                                    >
                                      <Plus className="w-3 h-3 mr-1" />
                                      Add
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div className="p-3 border-t" style={{ borderColor: '#e5cf97' }}>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white border" style={{ borderColor: '#e5cf97' }}>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#654321' }}>
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
            <div className="p-4 border-t" style={{ borderColor: '#e5cf97' }}>
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="What would you like to order?"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 text-sm"
                />
                <Button 
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-[#8b795e] hover:bg-[#6d5d4f] text-white px-3"
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