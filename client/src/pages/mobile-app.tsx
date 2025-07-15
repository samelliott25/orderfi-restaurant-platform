import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import { StandardLayout } from "@/components/StandardLayout";
import { ItemCard } from "@/components/customer/ItemCard";
import { MenuGrid } from "@/components/customer/MenuGrid";
import { CartDrawer } from "@/components/customer/CartDrawer";
import { CustomerAiChat } from "@/components/CustomerAiChat";

import { 
  Search, 
  Heart, 
  User, 
  Home,
  Star,
  Clock,
  Truck,
  Filter,
  MapPin,
  Bell,
  ShoppingCart,
  Utensils,
  Plus,
  MessageCircle
} from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  rating?: number;
  deliveryTime?: string;
  tags?: string[];
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  modifiers: Array<{ name: string; price_delta: number }>;
}

interface Modifier {
  name: string;
  price_delta: number;
}

export default function MobileAppPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Get menu items from API
  const { data: apiMenuItems = [], isLoading } = useQuery({
    queryKey: ['/api/menu-items', 1],
  });

  // Sample menu items for demo
  const menuItems: MenuItem[] = apiMenuItems.length > 0 ? apiMenuItems : [
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
      id: 3,
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
      id: 4,
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
      id: 5,
      name: "Vegetable Pizza",
      description: "Fresh vegetables on crispy crust with premium mozzarella cheese and signature sauce.",
      price: 18.99,
      image: "🍕",
      category: "pizza",
      rating: 4.3,
      deliveryTime: "30-40 min",
      tags: ["Healthy", "Free Delivery"]
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
    { id: 'starters', name: 'Starters', icon: '🥗' },
    { id: 'mains', name: 'Mains', icon: '🍖' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
    { id: 'drinks', name: 'Drinks', icon: '🍹' }
  ];

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const handleAddToCart = (item: MenuItem, modifiers: Modifier[] = [], quantity: number = 1) => {
    const newItem: CartItem = {
      id: Date.now(),
      name: item.name,
      price: item.price,
      quantity,
      modifiers
    };
    setCart(prev => [...prev, newItem]);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your order`,
    });
  };

  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    if (quantity === 0) {
      setCart(prev => prev.filter(item => item.id !== itemId));
    } else {
      setCart(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const handleRemoveItem = (itemId: number) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const handleCheckout = () => {
    toast({
      title: "Order placed!",
      description: "Your order has been sent to the kitchen",
    });
    setCart([]);
    setIsCartOpen(false);
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <StandardLayout 
      title="Mobile App Preview" 
      subtitle="View and test the customer mobile ordering interface"
    >
      <div className="flex items-center justify-center h-full w-full p-4">
        {/* iPhone 15 Pro Mockup Container - Full Size */}
        <div className="relative h-full w-full max-w-[500px] flex items-center justify-center">
        {/* iPhone Frame with Titanium Finish - Scaled to fill */}
        <div className="relative w-full h-full max-w-[500px] max-h-[900px] bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-[60px] p-[12px] shadow-2xl border-[4px] border-gray-600" style={{ aspectRatio: '375/812' }}>
          {/* Volume Buttons */}
          <div className="absolute left-[-4px] top-[15%] w-[4px] h-[8%] bg-gray-600 rounded-l-sm"></div>
          <div className="absolute left-[-4px] top-[25%] w-[4px] h-[8%] bg-gray-600 rounded-l-sm"></div>
          <div className="absolute left-[-4px] top-[35%] w-[4px] h-[12%] bg-gray-600 rounded-l-sm"></div>
          
          {/* Power Button */}
          <div className="absolute right-[-4px] top-[30%] w-[4px] h-[12%] bg-gray-600 rounded-r-sm"></div>
          
          {/* Inner Frame */}
          <div className="relative w-full h-full bg-black rounded-[52px] overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-[2%] left-1/2 transform -translate-x-1/2 w-[35%] h-[5%] bg-black rounded-[19px] z-20 shadow-inner border border-gray-800"></div>
            
            {/* Screen Content */}
            <div className="absolute inset-0 bg-black rounded-[52px] overflow-hidden">
              {/* Status Bar */}
              <div className="absolute top-0 left-0 right-0 h-[7%] bg-black z-10">
                <div className="flex justify-between items-center px-8 pt-[16px] text-white text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                      <div className="w-1 h-1 bg-white rounded-full opacity-30"></div>
                    </div>
                    <span className="ml-2 text-xs">Verizon</span>
                  </div>
                  <div className="text-white font-semibold">9:41</div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                    </svg>
                    <svg className="w-4 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.24 0 1 1 0 01-1.415-1.415 5 5 0 017.07 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                    <div className="w-6 h-3 border border-white rounded-sm relative">
                      <div className="absolute inset-0.5 bg-white rounded-sm"></div>
                      <div className="absolute -right-0.5 top-1/2 transform -translate-y-1/2 w-0.5 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* App Content with proper offset for status bar */}
              <div className="absolute top-[7%] left-0 right-0 bottom-0 overflow-y-auto bg-white">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full kleurvorm-primary flex items-center justify-center">
                        <span className="text-white font-bold text-lg playwrite-font">O</span>
                      </div>
                      <div>
                        <h1 className="font-bold text-lg playwrite-font">OrderFi</h1>
                        <p className="text-sm text-muted-foreground">Smart Restaurant</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsChatOpen(true)}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsCartOpen(true)}
                        className="relative"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {cartItemsCount > 0 && (
                          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                            {cartItemsCount}
                          </Badge>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="mt-4 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search menu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Category Tabs */}
                <div className="sticky top-[140px] z-10 bg-white border-b border-gray-200 p-4">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-4">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Loading menu...</p>
                    </div>
                  ) : (
                    <MenuGrid 
                      items={menuItems}
                      onAddToCart={handleAddToCart}
                      searchQuery={searchQuery}
                      activeCategory={selectedCategory}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      
      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* AI Chat */}
      <CustomerAiChat
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
      
    </StandardLayout>
  );
}