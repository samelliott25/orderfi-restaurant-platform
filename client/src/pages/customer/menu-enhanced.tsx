import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/customer/Header';
import { CategoryTabs } from '@/components/customer/CategoryTabs';
import { MenuGrid } from '@/components/customer/MenuGrid';
import { CartDrawer } from '@/components/customer/CartDrawer';
import { QuickReorder } from '@/components/customer/QuickReorder';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, ShoppingCart } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  voice_aliases?: string[];
  modifiers?: Modifier[];
}

interface Modifier {
  id: number;
  name: string;
  price_delta: number;
  required?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  count?: number;
}

export default function EnhancedCustomerMenu() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  
  const { cart, addToCart, updateQuantity, removeFromCart, getTotalItems } = useCart();

  // Fetch menu items
  const { data: menuItems = [], isLoading, error } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu/1'],
    queryFn: async () => {
      const response = await fetch('/api/menu/1');
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      return response.json();
    },
  });

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase();
          handleVoiceCommand(transcript);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      } catch (error) {
        console.error('Voice recognition setup failed:', error);
      }
    }
  }, []);

  // Generate categories from menu items
  const categories: Category[] = [
    { id: 'all', name: 'All', icon: () => <span>🍽️</span>, count: menuItems.length },
    ...Array.from(new Set(menuItems.map(item => item.category))).map(category => ({
      id: category.toLowerCase(),
      name: category,
      icon: () => <span>🍽️</span>,
      count: menuItems.filter(item => item.category === category).length
    }))
  ];

  const handleVoiceCommand = (transcript: string) => {
    console.log('Voice command:', transcript);
    
    // Handle navigation commands
    if (transcript.includes('cart') || transcript.includes('checkout')) {
      setIsCartOpen(true);
      return;
    }
    
    if (transcript.includes('menu') || transcript.includes('back')) {
      setIsCartOpen(false);
      return;
    }
    
    // Handle category commands
    const categoryMatch = categories.find(cat => 
      transcript.includes(cat.name.toLowerCase())
    );
    
    if (categoryMatch) {
      setSelectedCategory(categoryMatch.id);
      return;
    }
    
    // Handle search commands
    if (transcript.includes('search') || transcript.includes('find')) {
      const searchTerms = transcript.replace(/search|find/g, '').trim();
      if (searchTerms) {
        setSearchQuery(searchTerms);
      }
      return;
    }
    
    // Handle direct item search
    setSearchQuery(transcript);
  };

  const toggleVoiceRecognition = () => {
    if (!recognition) {
      console.log('Voice recognition is not supported in this browser.');
      return;
    }

    try {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        recognition.start();
        setIsListening(true);
      }
    } catch (error) {
      console.error('Voice recognition error:', error);
      setIsListening(false);
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleAddToCart = (item: MenuItem, modifiers: Modifier[], quantity: number) => {
    addToCart(item, modifiers, quantity);
    
    // Show success feedback
    const itemsText = quantity === 1 ? 'item' : 'items';
    console.log(`Added ${quantity} ${itemsText} to cart`);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load menu items</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        venueName="OrderFi Restaurant"
        tableNumber="Table 12"
        cartItemCount={getTotalItems()}
        onSearchChange={handleSearchChange}
        onCartClick={() => setIsCartOpen(true)}
        onMenuClick={() => {}}
      />

      <CategoryTabs
        categories={categories}
        activeCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className="px-4 py-2">
        <QuickReorder />
      </div>

      <MenuGrid
        items={menuItems}
        onAddToCart={handleAddToCart}
        searchQuery={searchQuery}
        activeCategory={selectedCategory}
      />

      {/* Voice recognition button */}
      <div className="fixed bottom-6 left-6 z-40">
        <Button
          onClick={toggleVoiceRecognition}
          className={`h-14 w-14 rounded-full p-0 shadow-lg transition-all duration-300 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600'
          }`}
        >
          {isListening ? (
            <MicOff className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
        </Button>
        {isListening && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg px-3 py-1 shadow-lg">
            <p className="text-sm text-foreground">Listening...</p>
          </div>
        )}
      </div>

      {/* Cart drawer */}
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