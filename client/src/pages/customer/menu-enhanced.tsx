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
import { VoiceFirstOrchestrator } from '@/components/voice/VoiceFirstOrchestrator';
import { AIPersonalizationEngine } from '@/components/ai/AIPersonalizationEngine';
import { NudgeEngine } from '@/components/ai/NudgeEngine';
import { SpatialVoiceNav } from '@/components/SpatialVoiceNav';
import { GestureZones } from '@/components/GestureZones';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, ShoppingCart, Brain, Sparkles } from 'lucide-react';
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
  const [isVoiceFirstMode, setIsVoiceFirstMode] = useState(false);
  const [personalizationResult, setPersonalizationResult] = useState<any>(null);
  const [customerProfile, setCustomerProfile] = useState<any>(null);
  const [nudgeResults, setNudgeResults] = useState<any>(null);
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

  // Voice-first AI integration handlers
  const handleOrderUpdate = useCallback((orderData: any) => {
    console.log('Voice order update:', orderData);
    if (orderData.items) {
      orderData.items.forEach((item: any) => {
        addToCart(item);
      });
    }
  }, [addToCart]);

  const handleUIAdaptation = useCallback((adaptationData: any) => {
    console.log('UI adaptation:', adaptationData);
    // Apply UI adaptations based on voice interaction
    if (adaptationData.focusCategory) {
      setSelectedCategory(adaptationData.focusCategory);
    }
    if (adaptationData.searchQuery) {
      setSearchQuery(adaptationData.searchQuery);
    }
  }, []);

  const handlePersonalizationUpdate = useCallback((result: any) => {
    console.log('Personalization update:', result);
    setPersonalizationResult(result);
  }, []);

  const handleProfileUpdate = useCallback((profile: any) => {
    console.log('Profile update:', profile);
    setCustomerProfile(profile);
  }, []);

  const handleNudgeUpdate = useCallback((nudges: any) => {
    console.log('Nudge update:', nudges);
    setNudgeResults(nudges);
  }, []);

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
    <StandardLayout showSidebar={true} showHeader={false}>
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

      {/* Voice-First AI Integration */}
      <div className="px-4 py-2">
        <div className="flex items-center space-x-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVoiceFirstMode(!isVoiceFirstMode)}
            className={isVoiceFirstMode ? 'bg-orange-100 text-orange-800' : ''}
          >
            <Brain className="w-4 h-4 mr-1" />
            {isVoiceFirstMode ? 'Voice AI Active' : 'Enable Voice AI'}
          </Button>
        </div>
        
        {/* Voice-First Components */}
        {isVoiceFirstMode && (
          <div className="space-y-4 mb-6">
            <VoiceFirstOrchestrator
              onOrderUpdate={handleOrderUpdate}
              onUIAdaptation={handleUIAdaptation}
              className="shadow-lg"
            />
            
            <AIPersonalizationEngine
              customerId="customer-123"
              menuItems={menuItems}
              onPersonalizationUpdate={handlePersonalizationUpdate}
              onProfileUpdate={handleProfileUpdate}
              className="shadow-lg"
            />
            
            <NudgeEngine
              customerId="customer-123"
              currentCart={cart}
              menuItems={menuItems}
              onNudgeUpdate={handleNudgeUpdate}
              className="shadow-lg"
            />
          </div>
        )}
        
        {/* Personalized Recommendations */}
        {personalizationResult && personalizationResult.recommendations && (
          <Card className="mb-4 shadow-lg">
            <CardContent className="p-4">
              <h3 className="font-semibold playwrite-font mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-orange-500" />
                AI Recommendations for You
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {personalizationResult.recommendations.slice(0, 4).map((rec: any, index: number) => (
                  <div key={rec.id || index} className="p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{rec.item?.name || 'Unknown Item'}</h4>
                        <p className="text-xs text-muted-foreground">{rec.reasoning}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(rec.confidence * 100)}%
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => rec.item && addToCart(rec.item)}
                      className="w-full"
                    >
                      Add ${rec.item?.price || 0}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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

      {/* UI Innovation Components */}
      {isVoiceEnabled && (
        <div className="fixed bottom-20 left-4 z-50">
          <SpatialVoiceNav
            onVoiceCommand={handleSpatialVoiceCommand}
            onSpatialUpdate={setSpatialPosition}
            enableHaptics={true}
            spatialSensitivity={0.7}
          />
        </div>
      )}

      {/* Gesture Recognition Zone */}
      <GestureZones
        onGestureRecognized={handleGestureRecognized}
        onQuickAction={handleQuickAction}
        enableHaptics={true}
        sensitivity={0.6}
      />

      {/* Innovation Status Indicators */}
      {(gestureEvent || currentTranscript) && (
        <div className="fixed top-20 right-4 z-40 space-y-2">
          {gestureEvent && (
            <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/50 text-green-300 px-3 py-2 rounded-lg text-sm font-medium">
              {gestureEvent}
            </div>
          )}
          {currentTranscript && (
            <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/50 text-blue-300 px-3 py-2 rounded-lg text-sm font-medium">
              Voice: "{currentTranscript}"
            </div>
          )}
        </div>
      )}

      {/* Voice Toggle Button */}
      <button
        onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
        className={`fixed bottom-32 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
          isVoiceEnabled 
            ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-300' 
            : 'bg-gray-500/20 border-2 border-gray-500 text-gray-400'
        }`}
      >
        <Mic className="w-5 h-5" />
      </button>

      {/* Real-time speech transcript display */}
      {(isListening || currentTranscript) && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-muted-foreground">
              {isListening ? 'Listening...' : 'Processing...'}
            </span>
          </div>
          <div className="text-lg text-foreground">
            {currentTranscript || 'Say something...'}
            {interimTranscript && (
              <span className="text-muted-foreground italic">
                {interimTranscript}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </StandardLayout>
  );
}