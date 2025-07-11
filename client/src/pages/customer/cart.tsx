import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, Mic } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price_cents: number;
  quantity: number;
  modifiers: Array<{
    id: number;
    name: string;
    price_delta: number;
  }>;
}

export default function CustomerCart() {
  const [, navigate] = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tipAmount, setTipAmount] = useState(0);
  const [tipPercent, setTipPercent] = useState(18);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Check authentication
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      navigate('/login');
    }
  }, [navigate]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (itemIndex: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(itemIndex);
      return;
    }
    
    const updatedCart = [...cart];
    updatedCart[itemIndex].quantity = newQuantity;
    setCart(updatedCart);
  };

  const removeItem = (itemIndex: number) => {
    const updatedCart = cart.filter((_, index) => index !== itemIndex);
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      const modifierTotal = item.modifiers.reduce((sum, mod) => sum + mod.price_delta, 0);
      return total + (item.price_cents + modifierTotal) * item.quantity;
    }, 0);
  };

  const getTaxAmount = () => {
    const subtotal = getSubtotal();
    return Math.round(subtotal * 0.08875); // 8.875% tax rate
  };

  const getTipAmount = () => {
    if (tipAmount > 0) return tipAmount;
    const subtotal = getSubtotal();
    return Math.round(subtotal * (tipPercent / 100));
  };

  const getTotal = () => {
    return getSubtotal() + getTaxAmount() + getTipAmount();
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleVoiceCommand = () => {
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
        
        if (transcript.includes('clear') || transcript.includes('empty')) {
          clearCart();
        } else if (transcript.includes('checkout') || transcript.includes('pay')) {
          navigate('/checkout');
        } else if (transcript.includes('back') || transcript.includes('menu')) {
          navigate('/menu');
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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="w-full max-w-md mx-4 relative overflow-hidden rounded-xl p-8 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10"></div>
          <div className="relative text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">
              Add some delicious items from our menu
            </p>
            <Button 
              onClick={() => navigate('/menu')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 hover:scale-105 transition-all duration-200"
            >
              Browse Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="sticky top-0 z-10 relative overflow-hidden p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border-b border-white/20 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10"></div>
        <div className="relative">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/menu')}
                  className="hover:bg-white/20 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Menu
                </Button>
                <h1 className="font-semibold text-lg playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Your Cart</h1>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={isVoiceEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  className="hover:bg-white/20 transition-colors"
                >
                  <Mic className="w-4 h-4 mr-1" />
                  Voice
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:bg-white/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5"></div>
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price_cents)} each
                      </p>
                      
                      {item.modifiers.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {item.modifiers.map((modifier) => (
                            <Badge key={modifier.id} variant="secondary" className="text-xs">
                              {modifier.name}
                              {modifier.price_delta > 0 && (
                                <span className="ml-1 text-green-600">
                                  +{formatPrice(modifier.price_delta)}
                                </span>
                              )}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {item.quantity} × {formatPrice(item.price_cents + item.modifiers.reduce((sum, mod) => sum + mod.price_delta, 0))}
                    </span>
                    <span className="font-semibold">
                      {formatPrice((item.price_cents + item.modifiers.reduce((sum, mod) => sum + mod.price_delta, 0)) * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 relative overflow-hidden rounded-xl p-6 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10"></div>
              <div className="relative">
                <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">Order Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(getSubtotal())}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax (8.875%)</span>
                    <span>{formatPrice(getTaxAmount())}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tip</Label>
                    <div className="flex space-x-2">
                      {[15, 18, 20, 25].map((percent) => (
                        <Button
                          key={percent}
                          variant={tipPercent === percent ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setTipPercent(percent);
                            setTipAmount(0);
                          }}
                          className="flex-1"
                        >
                          {percent}%
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="custom-tip" className="text-sm">Custom:</Label>
                      <Input
                        id="custom-tip"
                        type="number"
                        placeholder="0.00"
                        value={tipAmount > 0 ? (tipAmount / 100).toFixed(2) : ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          setTipAmount(Math.round(value * 100));
                          setTipPercent(0);
                        }}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tip Amount</span>
                      <span>{formatPrice(getTipAmount())}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(getTotal())}</span>
                  </div>
                  
                  <Button
                    onClick={() => navigate('/checkout')}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Command Button */}
      {isVoiceEnabled && (
        <Button
          onClick={handleVoiceCommand}
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
    </div>
  );
}