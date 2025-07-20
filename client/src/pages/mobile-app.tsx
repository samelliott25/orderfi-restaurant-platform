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
      <div className="flex items-center justify-center h-full w-full p-4 animate-fade-in-down">
        {/* iPhone 15 Pro Mockup Container - Full Size with Liquid Glass */}
        <div className="relative h-full w-full max-w-[500px] flex items-center justify-center">
        {/* iPhone Outline Frame with Liquid Glass styling */}
        <div className="relative w-full h-full max-w-[500px] max-h-[900px] liquid-glass-card border-[3px] border-white/20 dark:border-white/10 rounded-[60px] p-[8px] shadow-2xl" style={{ aspectRatio: '375/812' }}>
          {/* Volume Buttons - Outline with glass effect */}
          <div className="absolute left-[-3px] top-[15%] w-[3px] h-[8%] border-l-[2px] border-white/30 dark:border-white/20"></div>
          <div className="absolute left-[-3px] top-[25%] w-[3px] h-[8%] border-l-[2px] border-white/30 dark:border-white/20"></div>
          <div className="absolute left-[-3px] top-[35%] w-[3px] h-[12%] border-l-[2px] border-white/30 dark:border-white/20"></div>
          
          {/* Power Button - Outline with glass effect */}
          <div className="absolute right-[-3px] top-[30%] w-[3px] h-[12%] border-r-[2px] border-white/30 dark:border-white/20"></div>
          
          {/* Inner Frame with liquid glass */}
          <div className="relative w-full h-full liquid-glass-card border-[2px] border-white/10 dark:border-white/5 rounded-[52px] overflow-hidden">
            {/* Dynamic Island - Outline with glass effect */}
            <div className="absolute top-[2%] left-1/2 transform -translate-x-1/2 w-[35%] h-[5%] border-[2px] border-white/20 dark:border-white/10 rounded-[19px] z-20 liquid-glass-nav-item"></div>
            
            {/* Screen Content with liquid glass */}
            <div className="absolute inset-0 liquid-glass-card rounded-[52px] overflow-hidden">
              {/* Status Bar with liquid glass header */}
              <div className="absolute top-0 left-0 right-0 h-[7%] liquid-glass-header z-10">
                <div className="flex justify-between items-center px-8 pt-[16px] text-foreground text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-foreground rounded-full"></div>
                      <div className="w-1 h-1 bg-foreground rounded-full opacity-60"></div>
                      <div className="w-1 h-1 bg-foreground rounded-full opacity-30"></div>
                    </div>
                    <span className="ml-2 text-xs">Verizon</span>
                  </div>
                  <div className="text-foreground font-semibold">9:41</div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-3 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                    </svg>
                    <svg className="w-4 h-3 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.24 0 1 1 0 01-1.415-1.415 5 5 0 017.07 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                    <div className="w-6 h-3 border border-foreground rounded-sm relative">
                      <div className="absolute inset-0.5 bg-foreground rounded-sm"></div>
                      <div className="absolute -right-0.5 top-1/2 transform -translate-y-1/2 w-0.5 h-1 bg-foreground rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* App Content with proper offset for status bar and liquid glass */}
              <div className="absolute top-[7%] left-0 right-0 bottom-0 overflow-y-auto">
                {/* Header with liquid glass */}
                <div className="sticky top-0 z-10 liquid-glass-header border-b border-white/10 dark:border-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full liquid-glass-nav-item bg-gradient-to-r from-orderfi-start to-orderfi-end flex items-center justify-center">
                        <span className="text-white font-bold text-lg playwrite-font">O</span>
                      </div>
                      <div>
                        <h1 className="font-bold text-lg orderfi-brand gentle-glow">OrderFi</h1>
                        <p className="text-sm text-muted-foreground">Smart Restaurant</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setIsChatOpen(true)}
                        className="liquid-glass-nav-item flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setIsCartOpen(true)}
                        className="liquid-glass-nav-item flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 relative"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {cartItemsCount > 0 && (
                          <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gradient-to-r from-orderfi-start to-orderfi-end flex items-center justify-center text-xs text-white font-bold">
                            {cartItemsCount}
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Search Bar with liquid glass */}
                  <div className="mt-4 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <input
                      type="text"
                      placeholder="Search menu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 liquid-glass-nav-item border-white/10 dark:border-white/5 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30 dark:focus:border-white/20 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Category Tabs with liquid glass */}
                <div className="sticky top-[140px] z-10 liquid-glass-header border-b border-white/10 dark:border-white/5 p-4">
                  <div className="liquid-glass-card flex rounded-full p-2">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            selectedCategory === category.id
                              ? 'liquid-glass-nav-item-active'
                              : 'liquid-glass-nav-item hover:scale-105'
                          }`}
                        >
                          <span className="mr-2">{category.icon}</span>
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Menu Items with liquid glass */}
                <div className="p-4 space-y-4">
                  {isLoading ? (
                    <div className="liquid-glass-card text-center py-8 rounded-2xl">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gradient-to-r from-orderfi-start to-orderfi-end mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Loading menu...</p>
                    </div>
                  ) : (
                    <div className="liquid-glass-card p-4 rounded-2xl">
                      <MenuGrid 
                        items={menuItems}
                        onAddToCart={handleAddToCart}
                        searchQuery={searchQuery}
                        activeCategory={selectedCategory}
                      />
                    </div>
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