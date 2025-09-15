import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, Mic } from 'lucide-react';

export default function CustomerCart() {
  const [, navigate] = useLocation();
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [tipAmount, setTipAmount] = useState(0);
  const [tipPercent, setTipPercent] = useState(18);

  // Check authentication
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      navigate('/scan');
    }
  }, [navigate]);

  // Save tip to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('tipAmount', tipAmount.toString());
    localStorage.setItem('tipPercent', tipPercent.toString());
  }, [tipAmount, tipPercent]);

  const getSubtotal = () => {
    return getTotalPrice();
  };

  const getTaxAmount = () => {
    const subtotal = getSubtotal();
    return subtotal * 0.08875; // 8.875% tax rate
  };

  const getTipAmount = () => {
    if (tipAmount > 0) return tipAmount;
    const subtotal = getSubtotal();
    return subtotal * (tipPercent / 100);
  };

  const getTotal = () => {
    return getSubtotal() + getTaxAmount() + getTipAmount();
  };

  const formatPrice = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-4 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-4">
            Add some delicious items from our menu
          </p>
          <Button 
            onClick={() => navigate('/menu')}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            data-testid="browse-menu-button"
          >
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/menu')}
                className="p-2"
                data-testid="back-to-menu-button"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
              <h1 className="font-semibold text-lg orderfi-brand">Your Cart</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="text-red-600 border-red-200 hover:bg-red-50"
              data-testid="clear-cart-button"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <Card key={`${item.id}-${index}`} className="shadow-sm" data-testid={`cart-item-${index}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} each
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
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        data-testid={`decrease-quantity-${index}`}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium" data-testid={`quantity-${index}`}>
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        data-testid={`increase-quantity-${index}`}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        data-testid={`remove-item-${index}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {item.quantity} × {formatPrice(item.price + item.modifiers.reduce((sum, mod) => sum + mod.price_delta, 0))}
                    </span>
                    <span className="font-semibold" data-testid={`item-total-${index}`}>
                      {formatPrice((item.price + item.modifiers.reduce((sum, mod) => sum + mod.price_delta, 0)) * item.quantity)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-sm">
              <CardHeader>
                <CardTitle className="orderfi-gradient-text">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span data-testid="subtotal">{formatPrice(getSubtotal())}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax (8.875%)</span>
                  <span data-testid="tax">{formatPrice(getTaxAmount())}</span>
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
                        data-testid={`tip-${percent}`}
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
                      value={tipAmount > 0 ? tipAmount.toFixed(2) : ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setTipAmount(value);
                        setTipPercent(0);
                      }}
                      className="flex-1"
                      data-testid="custom-tip-input"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tip Amount</span>
                    <span data-testid="tip-amount">{formatPrice(getTipAmount())}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span data-testid="total">{formatPrice(getTotal())}</span>
                </div>
                
                <Button
                  onClick={() => navigate('/checkout')}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium"
                  data-testid="proceed-to-checkout-button"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}