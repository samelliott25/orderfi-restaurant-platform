import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Send, 
  Plus, 
  ShoppingCart, 
  Star, 
  Clock, 
  Truck,
  ChefHat,
  Menu,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight
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
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function ChatbotPrimaryPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hey there! I'm Mimi, your personal food assistant 🍕 What are you in the mood for today? You can tell me what you're craving or check out our menu below!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Pepperoni Pizza",
      description: "Classic pizza with a thin or thick crust, tomato sauce, mozzarella cheese, and spicy pepperoni sausage for that perfect savory kick.",
      price: 19.99,
      image: "🍕",
      category: "pizza",
      rating: 4.5,
      deliveryTime: "30-40 min",
      tags: ["Popular", "Free Delivery"]
    },
    {
      id: 2,
      name: "Margherita Pizza",
      description: "Traditional Italian pizza with fresh tomato sauce, mozzarella cheese, and fresh basil leaves on a crispy thin crust.",
      price: 17.99,
      image: "🍕",
      category: "pizza",
      rating: 4.3,
      deliveryTime: "30-40 min",
      tags: ["Vegetarian", "Classic"]
    },
    {
      id: 3,
      name: "Classic Burger",
      description: "Juicy beef patty with fresh lettuce, tomato, onion, pickles, and our signature sauce on a toasted sesame bun.",
      price: 12.99,
      image: "🍔",
      category: "burger",
      rating: 4.7,
      deliveryTime: "20-30 min",
      tags: ["Bestseller"]
    },
    {
      id: 4,
      name: "Chicken Burger",
      description: "Grilled chicken breast with lettuce, tomato, mayo, and avocado on a brioche bun. Light yet satisfying.",
      price: 13.99,
      image: "🍔",
      category: "burger",
      rating: 4.4,
      deliveryTime: "20-30 min",
      tags: ["Healthy"]
    },
    {
      id: 5,
      name: "Buffalo Wings",
      description: "Crispy chicken wings tossed in spicy buffalo sauce, served with celery sticks and blue cheese dip.",
      price: 14.99,
      image: "🍗",
      category: "appetizer",
      rating: 4.6,
      deliveryTime: "25-35 min",
      tags: ["Spicy", "Popular"]
    },
    {
      id: 6,
      name: "Mozzarella Sticks",
      description: "Golden fried mozzarella sticks with marinara dipping sauce. Perfect for sharing or as a starter.",
      price: 8.99,
      image: "🧀",
      category: "appetizer",
      rating: 4.2,
      deliveryTime: "15-20 min",
      tags: ["Vegetarian"]
    },
    {
      id: 7,
      name: "Caesar Salad",
      description: "Crisp romaine lettuce with parmesan cheese, croutons, and our house-made Caesar dressing.",
      price: 9.99,
      image: "🥗",
      category: "salad",
      rating: 4.2,
      deliveryTime: "15-25 min",
      tags: ["Healthy", "Light"]
    },
    {
      id: 8,
      name: "Greek Salad",
      description: "Fresh mixed greens with tomatoes, cucumbers, olives, feta cheese, and Greek dressing.",
      price: 11.99,
      image: "🥗",
      category: "salad",
      rating: 4.4,
      deliveryTime: "15-25 min",
      tags: ["Healthy", "Mediterranean"]
    },
    {
      id: 9,
      name: "Chocolate Cake",
      description: "Rich chocolate layer cake with chocolate ganache frosting and fresh berries on top.",
      price: 7.99,
      image: "🍰",
      category: "dessert",
      rating: 4.8,
      deliveryTime: "10-15 min",
      tags: ["Sweet", "Popular"]
    },
    {
      id: 10,
      name: "Cheesecake",
      description: "Creamy New York style cheesecake with graham cracker crust and berry compote.",
      price: 6.99,
      image: "🍰",
      category: "dessert",
      rating: 4.6,
      deliveryTime: "10-15 min",
      tags: ["Sweet", "Classic"]
    }
  ];

  const categories = [
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'burger', name: 'Burgers', icon: '🍔' },
    { id: 'appetizer', name: 'Appetizers', icon: '🍗' },
    { id: 'salad', name: 'Salads', icon: '🥗' },
    { id: 'dessert', name: 'Desserts', icon: '🍰' }
  ];

  const getItemsByCategory = (categoryId: string) => {
    return menuItems.filter(item => item.category === categoryId);
  };

  const currentCategoryItems = getItemsByCategory(categories[selectedCategory].id);
  const currentItem = currentCategoryItems[currentItemIndex];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Reset item index when category changes
    setCurrentItemIndex(0);
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

    // Enhanced bot responses
    setTimeout(() => {
      let botResponse = "I'd love to help you with that! Let me suggest some options.";
      let suggestMenu = false;
      
      if (inputMessage.toLowerCase().includes('pizza')) {
        botResponse = "Great choice! We have amazing pizzas. Check out our Pepperoni or Margherita - both are customer favorites! 🍕";
        setSelectedCategory(0); // Pizza category
        suggestMenu = true;
      } else if (inputMessage.toLowerCase().includes('burger')) {
        botResponse = "Perfect! Our burgers are made fresh daily. The Classic Burger is our bestseller, but the Chicken Burger is great too! 🍔";
        setSelectedCategory(1); // Burger category
        suggestMenu = true;
      } else if (inputMessage.toLowerCase().includes('healthy') || inputMessage.toLowerCase().includes('salad')) {
        botResponse = "Looking for something healthy? Our salads are fresh and delicious! The Caesar and Greek salads are both popular choices. 🥗";
        setSelectedCategory(3); // Salad category
        suggestMenu = true;
      } else if (inputMessage.toLowerCase().includes('dessert') || inputMessage.toLowerCase().includes('sweet')) {
        botResponse = "Time for something sweet! Our Chocolate Cake is absolutely divine, and the Cheesecake is a classic favorite. 🍰";
        setSelectedCategory(4); // Dessert category
        suggestMenu = true;
      } else if (inputMessage.toLowerCase().includes('appetizer') || inputMessage.toLowerCase().includes('starter')) {
        botResponse = "Great way to start your meal! Our Buffalo Wings are super popular, and the Mozzarella Sticks are perfect for sharing. 🍗";
        setSelectedCategory(2); // Appetizer category
        suggestMenu = true;
      } else if (inputMessage.toLowerCase().includes('menu') || inputMessage.toLowerCase().includes('food')) {
        botResponse = "I'd be happy to show you our menu! Tap the Menu button below to browse through all our delicious options. What type of food are you in the mood for?";
        suggestMenu = true;
      } else if (inputMessage.toLowerCase().includes('recommend') || inputMessage.toLowerCase().includes('popular')) {
        botResponse = "Our most popular items are the Pepperoni Pizza, Classic Burger, and Buffalo Wings! All are customer favorites. Want to see them in the menu?";
        suggestMenu = true;
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      if (suggestMenu && !isMenuExpanded) {
        setTimeout(() => {
          const menuSuggestion: ChatMessage = {
            id: (Date.now() + 2).toString(),
            type: 'bot',
            content: "👆 Tap the Menu button below to browse and swipe through our items!",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, menuSuggestion]);
        }, 1000);
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
      content: `Added ${item.name} to your cart! 🛒 Total items: ${getTotalItems() + 1}. Want to add anything else?`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMessage]);
  };

  const nextItem = () => {
    setCurrentItemIndex(prev => 
      prev < currentCategoryItems.length - 1 ? prev + 1 : 0
    );
  };

  const prevItem = () => {
    setCurrentItemIndex(prev => 
      prev > 0 ? prev - 1 : currentCategoryItems.length - 1
    );
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#fff0cc' }}>
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: '#e5cf97' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8b795e] flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg" style={{ color: '#654321' }}>Mimi Waitress</h1>
              <p className="text-sm" style={{ color: '#8b795e' }}>Your Food Assistant</p>
            </div>
          </div>
          <div className="relative">
            <ShoppingCart className="w-6 h-6" style={{ color: '#8b795e' }} />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-[#8b795e] text-white p-3 rounded-2xl rounded-br-sm">
                    {message.content}
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="max-w-[80%] bg-white p-3 rounded-2xl rounded-bl-sm border" style={{ borderColor: '#e5cf97', color: '#654321' }}>
                    {message.content}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Menu Toggle Button */}
      <div className="absolute bottom-20 left-4 right-4 z-10">
        <Button
          onClick={() => setIsMenuExpanded(!isMenuExpanded)}
          className="w-full bg-white border-2 shadow-lg flex items-center justify-center gap-2 py-3"
          style={{ borderColor: '#8b795e', color: '#654321' }}
        >
          <Menu className="w-5 h-5" />
          <span className="font-semibold">Menu</span>
          {isMenuExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronUp className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Menu Overlay */}
      {isMenuExpanded && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-20"
            onClick={() => setIsMenuExpanded(false)}
          />
          
          {/* Menu Card */}
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-4">
            {/* Menu Header */}
            <div className="p-4 border-b" style={{ borderColor: '#e5cf97' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl" style={{ color: '#654321' }}>Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuExpanded(false)}
                  className="p-2"
                >
                  <ChevronDown className="w-5 h-5" style={{ color: '#8b795e' }} />
                </Button>
              </div>
              
              {/* Category Tabs */}
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category, index) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(index)}
                    className={`whitespace-nowrap ${
                      selectedCategory === index 
                        ? 'bg-[#8b795e] text-white' 
                        : 'border-[#8b795e] text-[#654321] bg-white'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Swipeable Menu Item */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {currentItem && (
                <div className="relative">
                  {/* Navigation Arrows */}
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevItem}
                      className="p-2"
                      disabled={currentCategoryItems.length <= 1}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                      {currentCategoryItems.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentItemIndex ? 'bg-[#8b795e]' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextItem}
                      className="p-2"
                      disabled={currentCategoryItems.length <= 1}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Current Item Card */}
                  <Card className="border-2" style={{ borderColor: '#e5cf97' }}>
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="text-6xl mb-3">{currentItem.image}</div>
                        <h3 className="font-bold text-2xl mb-2" style={{ color: '#654321' }}>
                          {currentItem.name}
                        </h3>
                        <p className="text-lg font-bold" style={{ color: '#8b795e' }}>
                          ${currentItem.price}
                        </p>
                      </div>
                      
                      <p className="text-center mb-4" style={{ color: '#654321' }}>
                        {currentItem.description}
                      </p>
                      
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{currentItem.rating}</span>
                        </div>
                        <div className="flex items-center gap-1" style={{ color: '#8b795e' }}>
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{currentItem.deliveryTime}</span>
                        </div>
                        <div className="flex items-center gap-1" style={{ color: '#8b795e' }}>
                          <Truck className="w-4 h-4" />
                          <span className="text-sm">Delivery</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-center gap-2 mb-4">
                        {currentItem.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        onClick={() => addToCart(currentItem)}
                        className="w-full bg-[#8b795e] hover:bg-[#6d5d4f] text-white py-3 text-lg"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add to Cart - ${currentItem.price}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div className="p-4 border-t" style={{ borderColor: '#e5cf97' }}>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#fff0cc' }}>
                  <div>
                    <p className="font-semibold" style={{ color: '#654321' }}>
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
          </div>
        </>
      )}

      {/* Chat Input */}
      <div className="p-4 border-t" style={{ borderColor: '#e5cf97' }}>
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Tell me what you're craving..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            className="bg-[#8b795e] hover:bg-[#6d5d4f] text-white px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}