import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, ShoppingCart, Mic, MicOff } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  position: number;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price_cents: number;
  image_url?: string;
  voice_aliases?: string[];
  modifiers?: Modifier[];
}

interface Modifier {
  id: number;
  name: string;
  price_delta: number;
}

interface CartItem {
  id: number;
  name: string;
  price_cents: number;
  quantity: number;
  modifiers: Modifier[];
}

export default function CustomerMenu() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);

  // Check authentication
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      navigate('/login');
    }
  }, [navigate]);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    select: (data) => data.sort((a, b) => a.position - b.position)
  });

  const { data: menuItems } = useQuery<MenuItem[]>({
    queryKey: ['/api/categories', selectedCategory, 'items'],
    enabled: !!selectedCategory
  });

  // Auto-select first category
  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const handleAddToCart = (item: MenuItem, modifiers: Modifier[] = []) => {
    const existingIndex = cart.findIndex(cartItem => 
      cartItem.id === item.id && 
      JSON.stringify(cartItem.modifiers) === JSON.stringify(modifiers)
    );

    if (existingIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart(prev => [...prev, {
        id: item.id,
        name: item.name,
        price_cents: item.price_cents,
        quantity: 1,
        modifiers
      }]);
    }
    setSelectedItem(null);
    setSelectedModifiers([]);
  };

  const handleVoiceOrder = () => {
    if (!isVoiceEnabled) return;
    
    setIsListening(true);
    
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Voice command:', transcript);
        
        // Simple voice command matching (expand in v2)
        if (transcript.includes('cart') || transcript.includes('checkout')) {
          navigate('/cart');
        } else {
          // Match against menu items and voice aliases
          const matchedItem = menuItems?.find(item => 
            item.name.toLowerCase().includes(transcript) ||
            item.voice_aliases?.some(alias => transcript.includes(alias.toLowerCase()))
          );
          
          if (matchedItem) {
            handleAddToCart(matchedItem);
          }
        }
      };

      recognition.onerror = () => {
        console.error('Voice recognition error');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Voice recognition not supported in this browser');
      setIsListening(false);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const modifierTotal = item.modifiers.reduce((sum, mod) => sum + mod.price_delta, 0);
      return total + (item.price_cents + modifierTotal) * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const calculateItemPrice = (item: MenuItem) => {
    const modifierTotal = selectedModifiers.reduce((sum, mod) => sum + mod.price_delta, 0);
    return item.price_cents + modifierTotal;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl rock-salt-font">OrderFi Menu</h1>
            <div className="flex items-center space-x-2">
              <Button
                variant={isVoiceEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              >
                {isVoiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                Voice
              </Button>
              <Button
                onClick={() => navigate('/cart')}
                className="relative bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {getCartItemCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={selectedCategory?.toString()} onValueChange={(value) => setSelectedCategory(parseInt(value))}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            {categories?.map((category) => (
              <TabsTrigger key={category.id} value={category.id.toString()}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories?.map((category) => (
            <TabsContent key={category.id} value={category.id.toString()}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems?.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      {item.image_url && (
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-md mb-3"
                        />
                      )}
                      <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-600">
                          {formatPrice(item.price_cents)}
                        </span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm"
                              onClick={() => setSelectedItem(item)}
                              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>{item.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                {item.description}
                              </p>
                              
                              {item.modifiers && item.modifiers.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Customize your order:</h4>
                                  <div className="space-y-2">
                                    {item.modifiers.map((modifier) => (
                                      <div key={modifier.id} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`modifier-${modifier.id}`}
                                          checked={selectedModifiers.some(m => m.id === modifier.id)}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              setSelectedModifiers(prev => [...prev, modifier]);
                                            } else {
                                              setSelectedModifiers(prev => prev.filter(m => m.id !== modifier.id));
                                            }
                                          }}
                                        />
                                        <label
                                          htmlFor={`modifier-${modifier.id}`}
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                          {modifier.name}
                                          {modifier.price_delta > 0 && (
                                            <span className="text-green-600 ml-1">
                                              +{formatPrice(modifier.price_delta)}
                                            </span>
                                          )}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between pt-4 border-t">
                                <span className="text-lg font-bold">
                                  Total: {formatPrice(calculateItemPrice(item))}
                                </span>
                                <Button 
                                  onClick={() => handleAddToCart(item, selectedModifiers)}
                                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                                >
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Voice Order Button */}
      {isVoiceEnabled && (
        <Button
          onClick={handleVoiceOrder}
          disabled={isListening}
          className="fixed bottom-4 right-4 w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg"
        >
          {isListening ? (
            <div className="animate-pulse">
              <Mic className="w-6 h-6 text-white" />
            </div>
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </Button>
      )}

      {/* Cart Summary */}
      {getCartItemCount() > 0 && (
        <div className="fixed bottom-4 left-4 right-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {getCartItemCount()} items
              </p>
              <p className="font-bold">
                Total: {formatPrice(getCartTotal())}
              </p>
            </div>
            <Button 
              onClick={() => navigate('/cart')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              View Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}