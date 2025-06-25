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
  Search,
  Heart,
  User,
  Home
} from "lucide-react";

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

export default function HybridChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "🍕 I'm here to help you discover delicious food. You can browse our menu below or tell me what you're craving!",
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
      description: "Classic pizza with a thin or thick crust, tomato sauce, mozzarella cheese, and spicy pepperoni sausage for meat topping. It's known for its savory and slightly spicy flavor.",
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Add menu items as initial chat message
    const menuMessage: ChatMessage = {
      id: '2',
      type: 'menu',
      content: 'Here\'s our menu! Scroll through to see all items:',
      timestamp: new Date(),
      menuItems: filteredItems
    };
    
    setMessages(prev => {
      const filtered = prev.filter(msg => msg.type !== 'menu');
      return [...filtered, menuMessage];
    });
  }, [selectedCategory]);

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
      let botResponse = "I'd be happy to help you with that! Is there a specific item you'd like to know more about?";
      
      if (inputMessage.toLowerCase().includes('pizza')) {
        botResponse = "Great choice! Our pizzas are made fresh daily. Would you like to try our popular Pepperoni Pizza or the healthy Vegetable Pizza?";
      } else if (inputMessage.toLowerCase().includes('burger')) {
        botResponse = "Our Classic Burger is a customer favorite! It comes with a juicy beef patty and fresh toppings. Would you like to add it to your cart?";
      } else if (inputMessage.toLowerCase().includes('recommend')) {
        botResponse = "I recommend our Pepperoni Pizza and Classic Burger - they're our most popular items! Both have excellent ratings from customers.";
      } else if (inputMessage.toLowerCase().includes('healthy')) {
        botResponse = "For healthy options, try our Vegetable Pizza or Caesar Salad. Both are fresh and nutritious!";
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);

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
      content: `Added ${item.name} to your cart! 🛒 Anything else you'd like to try?`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMessage]);
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfcfc' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 border-b" style={{ backgroundColor: '#fcfcfc', borderColor: '#e5cf97' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8b795e] flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg" style={{ color: '#8b795e' }}>OrderFi AI</h1>
              <p className="text-sm" style={{ color: '#8b795e' }}>Interactive Menu Chat</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Search className="w-6 h-6" style={{ color: '#8b795e' }} />
            <Heart className="w-6 h-6" style={{ color: '#8b795e' }} />
            <div className="relative">
              <ShoppingCart className="w-6 h-6" style={{ color: '#8b795e' }} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </div>
            <User className="w-6 h-6" style={{ color: '#8b795e' }} />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-[88px] z-10 p-4 border-b" style={{ backgroundColor: '#fcfcfc', borderColor: '#e5cf97' }}>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`whitespace-nowrap ${
                selectedCategory === category.id 
                  ? 'bg-[#8b795e] text-white' 
                  : 'border-[#8b795e] text-[#8b795e] bg-white'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 pb-32">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-4">
              {message.type === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-xs bg-[#8b795e] text-white p-3 rounded-lg">
                    {message.content}
                  </div>
                </div>
              ) : message.type === 'bot' ? (
                <div className="flex justify-start">
                  <div className="max-w-xs bg-white p-3 rounded-lg border" style={{ borderColor: '#e5cf97' }}>
                    <p style={{ color: '#8b795e' }}>{message.content}</p>
                  </div>
                </div>
              ) : message.type === 'menu' ? (
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-lg border" style={{ borderColor: '#e5cf97' }}>
                      <p style={{ color: '#8b795e' }}>{message.content}</p>
                    </div>
                  </div>
                  
                  {/* Scrollable Menu Items */}
                  <div className="space-y-4">
                    {message.menuItems?.map((item) => (
                      <Card key={item.id} className="bg-white border" style={{ borderColor: '#e5cf97' }}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="text-4xl">{item.image}</div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-lg" style={{ color: '#8b795e' }}>
                                  {item.name}
                                </h3>
                                <div className="text-right">
                                  <p className="font-bold text-lg" style={{ color: '#8b795e' }}>
                                    ${item.price}
                                  </p>
                                </div>
                              </div>
                              
                              <p className="text-sm mb-3" style={{ color: '#8b795e' }}>
                                {item.description}
                              </p>
                              
                              <div className="flex items-center gap-4 mb-3">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">{item.rating}</span>
                                </div>
                                <div className="flex items-center gap-1" style={{ color: '#8b795e' }}>
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm">{item.deliveryTime}</span>
                                </div>
                                <div className="flex items-center gap-1" style={{ color: '#8b795e' }}>
                                  <Truck className="w-4 h-4" />
                                  <span className="text-sm">Free Delivery</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                  {item.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <Button 
                                  onClick={() => addToCart(item)}
                                  className="bg-[#8b795e] hover:bg-[#6d5d4f] text-white"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add to Cart
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
      </div>

      {/* Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t" style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
        <div className="max-w-4xl mx-auto">
          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="mb-4 p-3 rounded-lg bg-white border" style={{ borderColor: '#e5cf97' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ color: '#8b795e' }}>
                    {getTotalItems()} items in cart
                  </p>
                  <p className="text-sm" style={{ color: '#8b795e' }}>
                    Total: ${getTotalPrice().toFixed(2)}
                  </p>
                </div>
                <Button className="bg-[#8b795e] hover:bg-[#6d5d4f] text-white">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Checkout
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me about our menu or tell me what you're craving..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-[#8b795e] hover:bg-[#6d5d4f] text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-20 left-0 right-0">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-full border p-2 flex justify-center gap-8" style={{ borderColor: '#e5cf97' }}>
            <Button variant="ghost" size="sm" className="rounded-full">
              <Home className="w-5 h-5" style={{ color: '#8b795e' }} />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full">
              <Heart className="w-5 h-5" style={{ color: '#8b795e' }} />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full">
              <Search className="w-5 h-5" style={{ color: '#8b795e' }} />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full">
              <User className="w-5 h-5" style={{ color: '#8b795e' }} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}