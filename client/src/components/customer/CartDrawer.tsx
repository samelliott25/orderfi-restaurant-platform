import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  modifiers: {
    id: number;
    name: string;
    price_delta: number;
  }[];
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
  children?: React.ReactNode;
}

export function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  children 
}: CartDrawerProps) {
  const [tipPercent, setTipPercent] = useState(18);
  const [customTip, setCustomTip] = useState('');

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const itemPrice = item.price + item.modifiers.reduce((modSum, mod) => modSum + mod.price_delta, 0);
      return sum + (itemPrice * item.quantity);
    }, 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.08; // 8% tax
  };

  const calculateTip = (subtotal: number) => {
    if (customTip) {
      return parseFloat(customTip) || 0;
    }
    return subtotal * (tipPercent / 100);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const tip = calculateTip(subtotal);
    return subtotal + tax + tip;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const tip = calculateTip(subtotal);
  const total = calculateTotal();

  const handleTipPercentChange = (percent: number) => {
    setTipPercent(percent);
    setCustomTip('');
  };

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value);
    setTipPercent(0);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Your Order</span>
              <Badge variant="secondary">{cartItems.length} items</Badge>
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart items */}
          <div className="flex-1 overflow-y-auto py-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">Your cart is empty</p>
                <p className="text-sm text-muted-foreground text-center">Add some items to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <span className="font-medium text-sm">
                          {formatPrice((item.price + item.modifiers.reduce((sum, mod) => sum + mod.price_delta, 0)) * item.quantity)}
                        </span>
                      </div>
                      
                      {item.modifiers.length > 0 && (
                        <div className="space-y-1">
                          {item.modifiers.map((modifier) => (
                            <div key={modifier.id} className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>• {modifier.name}</span>
                              {modifier.price_delta > 0 && (
                                <span>+{formatPrice(modifier.price_delta)}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium min-w-[2ch] text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order summary and checkout */}
          {cartItems.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              {/* Tip selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Tip</Label>
                <div className="flex space-x-2">
                  {[15, 18, 20, 25].map((percent) => (
                    <Button
                      key={percent}
                      variant={tipPercent === percent ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTipPercentChange(percent)}
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
                    value={customTip}
                    onChange={(e) => handleCustomTipChange(e.target.value)}
                    className="flex-1 h-8"
                  />
                </div>
              </div>

              <Separator />

              {/* Order totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tip</span>
                  <span>{formatPrice(tip)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout button */}
              <Button
                onClick={onCheckout}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium"
              >
                Continue to Checkout
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}