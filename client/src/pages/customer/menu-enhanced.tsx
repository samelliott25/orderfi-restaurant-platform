import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/customer/Header';
import { CategoryTabs } from '@/components/customer/CategoryTabs';
import { MenuGrid } from '@/components/customer/MenuGrid';
import { CartDrawer } from '@/components/customer/CartDrawer';
import { QuickReorder } from '@/components/customer/QuickReorder';
import { FloatingActionButton } from '@/components/customer/FloatingActionButton';
import { SpatialVoiceNav } from '@/components/SpatialVoiceNav';
import { GestureZones } from '@/components/GestureZones';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, ShoppingCart } from 'lucide-react';
import StandardLayout from '@/components/StandardLayout';
import { BottomNavigation } from '@/components/ui/bottom-navigation';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string | number; // Handle both string and number prices
  category: string;
  image_url?: string;
  voice_aliases?: string[];
  modifiers?: Modifier[];
  aliases?: string[]; // Database uses aliases instead of voice_aliases
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
  const [gestureEvent, setGestureEvent] = useState<string>('');
  const [spatialPosition, setSpatialPosition] = useState<any>(null);
  const menuItemsRef = useRef<MenuItem[]>([]);
  
  const { cart, addToCart, updateQuantity, removeFromCart, getTotalItems } = useCart();

  // Fetch menu items from real database
  const { data: menuItems = [], isLoading, error } = useQuery<MenuItem[]>({
    queryKey: ['/api/restaurants/1/menu'],
    queryFn: async () => {
      console.log('Fetching menu items from database...');
      const response = await fetch('/api/restaurants/1/menu');
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      console.log('Menu items received from database:', data.length);
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

  // Update ref when menu items change
  useEffect(() => {
    menuItemsRef.current = menuItems;
  }, [menuItems]);

  const handleVoiceCommand = useCallback((transcript: string) => {
    console.log('Voice command:', transcript);
    console.log('Menu items available:', menuItemsRef.current.length);
    
    // Enhanced food item extraction for natural language
    const extractFoodKeywords = (text: string): string => {
      // Remove common ordering phrases and command words
      const cleanedText = text
        .replace(/\b(i want to|i'd like to|i would like to|can i have|give me|order|get|show me|find|search)\b/gi, '')
        .replace(/\b(a|an|the|some|one|two|three|four|five|all)\b/gi, '')
        .replace(/\b(please|thanks|thank you)\b/gi, '')
        .trim();
      
      console.log('Cleaned text:', cleanedText);
      
      // Handle pluralization - convert plural to singular for broader matching
      const normalizePlural = (word: string): string => {
        if (word.endsWith('s') && word.length > 3) {
          return word.slice(0, -1); // Remove 's' from end
        }
        return word;
      };
      
      // Extract food-related keywords by matching against menu items
      const foodKeywords: string[] = [];
      
      // Check for exact menu item matches first
      menuItemsRef.current.forEach(item => {
        const itemName = item.name.toLowerCase();
        const itemWords = itemName.split(/\s+/);
        
        // Check if any words from the item name are in the transcript
        itemWords.forEach(word => {
          const normalizedWord = normalizePlural(word);
          const normalizedCleanedText = cleanedText.toLowerCase();
          
          if (word.length > 2 && (
            normalizedCleanedText.includes(word) || 
            normalizedCleanedText.includes(normalizedWord) ||
            normalizePlural(normalizedCleanedText).includes(normalizedWord)
          )) {
            foodKeywords.push(normalizedWord);
          }
        });
        
        // Check for partial matches with pluralization handling
        const normalizedItemName = normalizePlural(itemName);
        const normalizedCleanedText = normalizePlural(cleanedText.toLowerCase());
        
        if (normalizedCleanedText.includes(normalizedItemName) || 
            normalizedItemName.includes(normalizedCleanedText)) {
          foodKeywords.push(normalizedItemName);
        }
        
        // Check voice aliases with pluralization (database uses 'aliases' field)
        const aliasesToCheck = item.voice_aliases || item.aliases || [];
        if (aliasesToCheck.length > 0) {
          aliasesToCheck.forEach(alias => {
            const normalizedAlias = normalizePlural(alias.toLowerCase());
            if (normalizedCleanedText.includes(normalizedAlias) || 
                cleanedText.toLowerCase().includes(alias.toLowerCase())) {
              foodKeywords.push(normalizedAlias);
            }
          });
        }
      });
      
      // If no specific menu items found, extract potential food words with pluralization
      if (foodKeywords.length === 0) {
        const commonFoodWords = ['burger', 'pizza', 'chicken', 'beef', 'fish', 'salad', 'sandwich', 'wing', 'fries', 'taco', 'pasta', 'soup', 'steak', 'rice', 'noodles', 'nacho'];
        const words = cleanedText.toLowerCase().split(/\s+/);
        
        words.forEach(word => {
          const normalizedWord = normalizePlural(word);
          if (commonFoodWords.includes(normalizedWord) || commonFoodWords.includes(word)) {
            foodKeywords.push(normalizedWord);
          }
        });
      }
      
      // Debug logging for burger search
      if (cleanedText.includes('burger') || cleanedText.includes('burgers')) {
        console.log('BURGER SEARCH DEBUG:');
        console.log('- Cleaned text:', cleanedText);
        console.log('- Food keywords found:', foodKeywords);
        console.log('- Available burger items:', menuItemsRef.current.filter(item => 
          item.name.toLowerCase().includes('burger')).map(item => item.name));
      }
      
      const result = foodKeywords.length > 0 ? [...new Set(foodKeywords)].join(' ') : cleanedText;
      console.log('Food keywords extracted:', result);
      return result;
    };
    
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
    
    // Handle search commands with better extraction
    if (transcript.includes('search') || transcript.includes('find')) {
      const searchTerms = transcript.replace(/search|find/g, '').trim();
      if (searchTerms) {
        const keywords = extractFoodKeywords(searchTerms);
        setSearchQuery(keywords);
        console.log('Search command, keywords:', keywords);
      }
      return;
    }
    
    // Handle natural language ordering and general search
    const keywords = extractFoodKeywords(transcript);
    console.log('Extracted keywords:', keywords);
    
    if (keywords && keywords.trim()) {
      setSearchQuery(keywords);
      console.log('Search query set to:', keywords);
    } else {
      console.log('No keywords extracted, using full transcript');
      setSearchQuery(transcript);
    }
  }, [categories]);

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

  // Enhanced voice command handler with spatial feedback
  const handleSpatialVoiceCommand = (command: string, confidence: number) => {
    console.log(`Spatial voice command: "${command}" (${Math.round(confidence * 100)}% confidence)`);
    setCurrentTranscript(command);
    
    // Trigger haptic feedback for successful commands
    if (confidence > 0.7 && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    handleVoiceCommand(command.toLowerCase());
  };

  // Gesture recognition handler
  const handleGestureRecognized = (gesture: any) => {
    setGestureEvent(`${gesture.type} ${gesture.direction || ''} gesture detected`);
    console.log('Gesture recognized:', gesture);
    
    // Handle different gesture types
    switch (gesture.type) {
      case 'swipe':
        if (gesture.direction === 'left') {
          // Quick add first visible item
          const firstItem = filteredItems[0];
          if (firstItem) {
            handleQuickAdd(firstItem);
          }
        } else if (gesture.direction === 'right') {
          // Open cart
          setIsCartOpen(true);
        } else if (gesture.direction === 'up') {
          // Navigate to previous category
          const currentIndex = categories.findIndex(cat => cat.id === selectedCategory);
          if (currentIndex > 0) {
            setSelectedCategory(categories[currentIndex - 1].id);
          }
        } else if (gesture.direction === 'down') {
          // Navigate to next category
          const currentIndex = categories.findIndex(cat => cat.id === selectedCategory);
          if (currentIndex < categories.length - 1) {
            setSelectedCategory(categories[currentIndex + 1].id);
          }
        }
        break;
      case 'longPress':
        // Open voice navigation
        setIsVoiceEnabled(true);
        break;
      case 'doubleTap':
        // Reorder last item
        if (cart.length > 0) {
          const lastItem = cart[cart.length - 1];
          addToCart(lastItem.item, lastItem.modifiers, 1);
        }
        break;
    }
    
    // Haptic feedback for gestures
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 50, 30]);
    }
  };

  // Quick action handler for gesture zones
  const handleQuickAction = (action: string) => {
    setGestureEvent(`Quick action: ${action}`);
    console.log('Quick action:', action);
    
    switch (action) {
      case 'addToCart':
        const firstItem = filteredItems[0];
        if (firstItem) {
          handleQuickAdd(firstItem);
        }
        break;
      case 'openCart':
        setIsCartOpen(true);
        break;
      case 'favorites':
        // Could integrate with favorites system
        console.log('Favorites action triggered');
        break;
      case 'voice':
        setIsVoiceEnabled(!isVoiceEnabled);
        break;
    }
  };

  // Quick add function for gesture integration
  const handleQuickAdd = (item: MenuItem) => {
    addToCart(item, [], 1);
    // Success haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
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
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#e8f5e9' }}>
      {/* Header - Mamo Style */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer" onClick={() => setIsCartOpen(true)}>
              <span className="text-white font-bold text-xs">{getTotalItems()}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ lineHeight: '1.1' }}>
            Hi! I'm OrderFi.
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Smart with food.<br />
            Easy on the taste buds.
          </p>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="bg-yellow-300 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition-colors"
          >
            Get started!
          </button>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            OrderFi helps you order,<br />
            pay, and enjoy<br />
            your food – step by<br />
            step, without the stress.
          </p>
        </div>
      </div>

      {/* How OrderFi Works */}
      <div className="px-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">How OrderFi works:</h2>
        
        <div className="space-y-4">
          {/* Step 1 - White Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm text-gray-500 font-medium">Step 1</span>
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="w-8 h-8 border-2 border-gray-800 rounded-lg flex items-center justify-center mb-3">
                <span className="text-gray-800 text-sm">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Browse our menu
              </h3>
            </div>
          </div>

          {/* Step 2 - Yellow Card */}
          <div className="bg-yellow-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm text-gray-700 font-medium">Step 2</span>
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="w-8 h-8 border-2 border-gray-800 rounded-lg flex items-center justify-center mb-3">
                <span className="text-gray-800 text-sm">🛒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Add to cart
              </h3>
            </div>
          </div>

          {/* Step 3 - Light Green Card */}
          <div className="bg-green-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm text-gray-700 font-medium">Step 3</span>
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="w-8 h-8 border-2 border-gray-800 rounded-lg flex items-center justify-center mb-3">
                <span className="text-gray-800 text-sm">🍽️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Enjoy your meal
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Preview Cards */}
      <div className="p-4 space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Popular dishes</h3>
        
        {/* Show real menu items in mamo style */}
        {menuItems.slice(0, 3).map((item, index) => (
          <div key={item.id} className={`rounded-3xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
            index === 0 ? 'bg-white border border-gray-100' : 
            index === 1 ? 'bg-yellow-100' : 'bg-green-100'
          }`} onClick={() => handleAddToCart(item, [], 1)}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                index === 0 ? 'bg-blue-100' : 
                index === 1 ? 'bg-yellow-200' : 'bg-green-200'
              }`}>
                <span className="text-2xl">{index === 0 ? '🍔' : index === 1 ? '🍕' : '🥗'}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">${item.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="p-4 mb-8">
        <div className="bg-gray-800 rounded-3xl p-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-gray-800">O</span>
          </div>
          <p className="text-white text-sm mb-6">
            OrderFi helps you track, order, and<br />
            enjoy your food – step by<br />
            step, without the stress.
          </p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-green-400 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-green-500 transition-colors"
            >
              View Cart ({getTotalItems()})
            </button>
            <button 
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className="bg-yellow-300 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition-colors"
            >
              {isVoiceEnabled ? 'Voice On' : 'Voice Off'}
            </button>
          </div>
        </div>
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

      {/* Voice Commands (simplified) */}
      {isVoiceEnabled && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={toggleVoiceRecognition}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isListening ? 'bg-red-500 text-white' : 'bg-gray-800 text-white'
            }`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
        </div>
      )}

      {/* Real-time speech transcript display */}
      {(isListening || currentTranscript) && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-white border border-gray-200 rounded-2xl shadow-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-600">
              {isListening ? 'Listening...' : 'Processing...'}
            </span>
          </div>
          <div className="text-lg text-gray-800">
            {currentTranscript || 'Say something...'}
            {interimTranscript && (
              <span className="text-gray-500 italic">
                {interimTranscript}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}