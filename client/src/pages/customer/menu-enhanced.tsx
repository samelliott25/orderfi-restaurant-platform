import { useState, useEffect, useCallback } from 'react';
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
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  
  const { cart, addToCart, updateQuantity, removeFromCart, getTotalItems } = useCart();

  // Fetch menu items
  const { data: menuItems = [], isLoading, error } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu/1'],
    queryFn: async () => {
      console.log('Fetching menu items...');
      const response = await fetch('/api/menu/1');
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      console.log('Menu items received:', data.length);
      return data;
    },
  });

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setInterimTranscript(interimTranscript);
          setCurrentTranscript(finalTranscript + interimTranscript);

          if (finalTranscript) {
            handleVoiceCommand(finalTranscript.toLowerCase());
          }
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
          setCurrentTranscript('');
          setInterimTranscript('');
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

  // Debug effect to track data loading
  useEffect(() => {
    console.log('Menu data state change:', {
      isLoading,
      error: error?.message,
      menuItemsCount: menuItems.length,
      menuItems: menuItems.slice(0, 2) // Show first 2 items
    });
  }, [isLoading, error, menuItems]);

  const handleVoiceCommand = useCallback((transcript: string) => {
    console.log('Voice command:', transcript);
    console.log('Menu items loaded:', menuItems.length);
    console.log('Current loading state:', isLoading);
    console.log('Current error:', error);
    
    // Process command even if menu items aren't loaded yet
    // This will at least set the search query for when data loads
    
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
    
    // Enhanced food item extraction for natural language
    const extractFoodKeywords = (text: string): string => {
      // Remove common ordering phrases and command words
      const cleanedText = text
        .replace(/\b(i want to|i'd like to|i would like to|can i have|give me|order|get|show me|find|search)\b/gi, '')
        .replace(/\b(a|an|the|some|one|two|three|four|five|all)\b/gi, '')
        .replace(/\b(please|thanks|thank you)\b/gi, '')
        .trim();
      
      console.log('Cleaned text:', cleanedText);
      
      // Extract food-related keywords by matching against menu items
      const foodKeywords: string[] = [];
      
      // Check for exact menu item matches first
      menuItems.forEach(item => {
        const itemName = item.name.toLowerCase();
        const itemWords = itemName.split(/\s+/);
        
        // Check if any words from the item name are in the transcript
        itemWords.forEach(word => {
          if (word.length > 2 && cleanedText.toLowerCase().includes(word)) {
            foodKeywords.push(word);
          }
        });
        
        // Check for partial matches
        if (cleanedText.toLowerCase().includes(itemName) || itemName.includes(cleanedText.toLowerCase())) {
          foodKeywords.push(itemName);
        }
        
        // Check voice aliases
        if (item.voice_aliases) {
          item.voice_aliases.forEach(alias => {
            if (cleanedText.toLowerCase().includes(alias.toLowerCase())) {
              foodKeywords.push(alias);
            }
          });
        }
      });
      
      // If no specific menu items found, extract potential food words
      if (foodKeywords.length === 0) {
        const commonFoodWords = ['burger', 'burgers', 'pizza', 'chicken', 'beef', 'fish', 'salad', 'sandwich', 'wings', 'fries', 'taco', 'tacos', 'pasta', 'soup', 'steak', 'rice', 'noodles', 'nachos'];
        const words = cleanedText.toLowerCase().split(/\s+/);
        
        words.forEach(word => {
          if (commonFoodWords.includes(word)) {
            foodKeywords.push(word);
          }
        });
      }
      
      const result = foodKeywords.length > 0 ? [...new Set(foodKeywords)].join(' ') : cleanedText;
      console.log('Food keywords extracted:', result);
      return result;
    };
    
    // Handle search commands with better extraction
    if (transcript.includes('search') || transcript.includes('find')) {
      const searchTerms = transcript.replace(/search|find/g, '').trim();
      if (searchTerms) {
        const keywords = extractFoodKeywords(searchTerms);
        setSearchQuery(keywords);
      }
      return;
    }
    
    // Handle natural language ordering
    if (transcript.includes('order') || transcript.includes('want') || transcript.includes('like')) {
      const keywords = extractFoodKeywords(transcript);
      console.log('Natural language keywords:', keywords);
      if (keywords && keywords.trim()) {
        setSearchQuery(keywords);
        console.log('Natural language search query set to:', keywords);
        return;
      }
    }
    
    // Handle direct item search with keyword extraction
    const keywords = extractFoodKeywords(transcript);
    console.log('Extracted keywords:', keywords);
    if (keywords && keywords.trim()) {
      setSearchQuery(keywords);
      console.log('Search query updated to:', keywords);
    } else {
      console.log('No keywords extracted, using full transcript');
      setSearchQuery(transcript);
    }
  }, [menuItems, isLoading, error]);

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

      {/* Real-time speech transcript display */}
      {(isListening || currentTranscript) && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isListening ? 'Listening...' : 'Processing...'}
            </span>
          </div>
          <div className="text-lg text-gray-900 dark:text-gray-100">
            {currentTranscript || 'Say something...'}
            {interimTranscript && (
              <span className="text-gray-500 dark:text-gray-400 italic">
                {interimTranscript}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}