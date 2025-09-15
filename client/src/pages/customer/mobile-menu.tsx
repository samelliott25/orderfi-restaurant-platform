import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ShoppingCart, 
  ArrowLeft,
  User,
  Menu,
  Home
} from 'lucide-react';

import { MenuGrid } from '@/components/customer/MenuGrid';
import { CartDrawer } from '@/components/customer/CartDrawer';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  modifiers?: Modifier[];
}

interface Modifier {
  id: number;
  name: string;
  price_delta: number;
  required?: boolean;
}

export default function MobileMenu() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { cart, addToCart, updateQuantity, removeFromCart, getTotalItems } = useCart();

  // Check if user has session
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      navigate('/scan');
    }
  }, [navigate]);

  // Fetch menu items from API with fallback to mock data
  const { data: apiMenuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/restaurants/1/menu'],
    retry: false,
  });

  // Mock menu data for when API is not available
  const mockMenuItems: MenuItem[] = [
    {
      id: 1,
      name: "Classic Burger",
      description: "Juicy beef patty with lettuce, tomato, onion, and special sauce",
      price: 14.99,
      category: "Burgers",
      modifiers: [
        { id: 1, name: "Add Cheese", price_delta: 2.00 },
        { id: 2, name: "Add Bacon", price_delta: 3.50 },
        { id: 3, name: "Extra Patty", price_delta: 5.00 }
      ]
    },
    {
      id: 2,
      name: "Pepperoni Pizza",
      description: "Classic pizza with pepperoni and mozzarella cheese",
      price: 18.99,
      category: "Pizza",
      modifiers: [
        { id: 4, name: "Extra Cheese", price_delta: 2.50 },
        { id: 5, name: "Extra Pepperoni", price_delta: 3.00 }
      ]
    },
    {
      id: 3,
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with parmesan and croutons",
      price: 12.99,
      category: "Salads",
      modifiers: [
        { id: 6, name: "Add Chicken", price_delta: 4.00 },
        { id: 7, name: "Add Avocado", price_delta: 2.50 }
      ]
    },
    {
      id: 4,
      name: "Fish & Chips",
      description: "Beer battered fish with crispy fries",
      price: 16.99,
      category: "Mains"
    },
    {
      id: 5,
      name: "Chicken Wings",
      description: "Crispy wings with your choice of sauce",
      price: 13.99,
      category: "Starters",
      modifiers: [
        { id: 8, name: "Buffalo Sauce", price_delta: 0 },
        { id: 9, name: "BBQ Sauce", price_delta: 0 },
        { id: 10, name: "Honey Garlic", price_delta: 0 }
      ]
    },
    {
      id: 6,
      name: "Chocolate Cake",
      description: "Rich chocolate cake with berry compote",
      price: 8.99,
      category: "Desserts"
    }
  ];

  // Use API data if available, otherwise use mock data
  const menuItems = Array.isArray(apiMenuItems) && apiMenuItems.length > 0 ? 
    apiMenuItems.map(item => ({ 
      ...item, 
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price 
    })) : 
    mockMenuItems;

  // Extract categories from menu items
  const categories = [
    { id: 'all', name: 'All', icon: '🍽️' },
    ...Array.from(new Set(menuItems.map(item => item.category))).map(category => ({
      id: category.toLowerCase(),
      name: category,
      icon: getCategoryIcon(category)
    }))
  ];

  function getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'burgers': '🍔',
      'pizza': '🍕',
      'salads': '🥗',
      'mains': '🍖',
      'starters': '🥘',
      'desserts': '🍰',
      'drinks': '🍹'
    };
    return iconMap[category.toLowerCase()] || '🍽️';
  }

  const handleAddToCart = (item: MenuItem, modifiers: Modifier[] = [], quantity: number = 1) => {
    addToCart(item, modifiers, quantity);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your order`,
    });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  const sessionInfo = {
    tableName: localStorage.getItem('tableNumber') || 'Guest',
    venueName: localStorage.getItem('venueName') || 'OrderFi Restaurant'
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/scan')}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="font-bold text-lg orderfi-brand">OrderFi</h1>
                <p className="text-sm text-muted-foreground">{sessionInfo.tableName} • {sessionInfo.venueName}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCartOpen(true)}
              className="relative"
              data-testid="cart-button"
            >
              <ShoppingCart className="w-4 h-4" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="search-input"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                data-testid={`category-${category.id}`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading menu...</p>
            </div>
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

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}