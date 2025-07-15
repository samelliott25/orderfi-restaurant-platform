import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Loader2, CheckCircle } from 'lucide-react';
// Stripe integration for v2
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

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

export default function CustomerCheckout() {
  const [, navigate] = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [paymentError, setPaymentError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      navigate('/login');
      return;
    }
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      navigate('/menu');
    }
  }, [navigate]);

  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      const modifierTotal = item.modifiers.reduce((sum, mod) => sum + mod.price_delta, 0);
      return total + (item.price_cents + modifierTotal) * item.quantity;
    }, 0);
  };

  const getTaxAmount = () => {
    const subtotal = getSubtotal();
    return Math.round(subtotal * 0.08875);
  };

  const getTipAmount = () => {
    const savedTip = localStorage.getItem('tipAmount');
    return savedTip ? parseInt(savedTip) : 0;
  };

  const getTotal = () => {
    return getSubtotal() + getTaxAmount() + getTipAmount();
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    setPaymentError('');

    try {
      const sessionId = localStorage.getItem('sessionId');

      // For MVP, simulate payment processing
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          cart,
          customerInfo,
          paymentMethod,
          total: getTotal(),
          subtotal: getSubtotal(),
          tax: getTaxAmount(),
          tip: getTipAmount()
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const { orderId } = await response.json();

      // Clear cart and redirect to order status
      localStorage.removeItem('cart');
      localStorage.removeItem('tipAmount');
      navigate(`/order-status/${orderId}`);

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Card form for MVP (simplified without Stripe Elements)
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 relative overflow-hidden p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border-b border-white/20 shadow-lg">
        <div className="absolute inset-0 kleurvorm-accent opacity-10"></div>
        <div className="relative">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/cart')}
                className="hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
              </Button>
              <h1 className="font-semibold text-lg playwrite-font orderfi-gradient-text">Checkout</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="orderfi-glass-card">
            <div className="absolute inset-0 kleurvorm-accent opacity-10"></div>
            <div className="relative">
              <h3 className="text-xl font-bold orderfi-gradient-text mb-6">Payment Information</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Payment Method</Label>
                    <div className="flex space-x-2 mt-2">
                      <Button
                        type="button"
                        variant={paymentMethod === 'card' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPaymentMethod('card')}
                        className="flex-1"
                      >
                        Credit Card
                      </Button>
                      <Button
                        type="button"
                        variant={paymentMethod === 'cash' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPaymentMethod('cash')}
                        className="flex-1"
                      >
                        Pay at Counter
                      </Button>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          value={cardInfo.number}
                          onChange={(e) => setCardInfo(prev => ({ ...prev, number: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="expiry">Expiry</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={cardInfo.expiry}
                            onChange={(e) => setCardInfo(prev => ({ ...prev, expiry: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            value={cardInfo.cvc}
                            onChange={(e) => setCardInfo(prev => ({ ...prev, cvc: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cash' && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm">
                        Your order will be prepared and you can pay at the counter when you pick it up.
                      </p>
                    </div>
                  )}
                </div>

                {paymentError && (
                  <div className="text-red-600 text-sm">{paymentError}</div>
                )}

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-12 kleurvorm-secondary text-white font-medium"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      {paymentMethod === 'card' ? `Pay ${formatPrice(getTotal())}` : 'Place Order'}
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="orderfi-glass-card">
            <div className="absolute inset-0 kleurvorm-accent opacity-10"></div>
            <div className="relative">
              <h3 className="text-xl font-bold orderfi-gradient-text mb-4">Order Summary</h3>
                <div className="space-y-4">
                  <div className="space-y-3">
                    {cart.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × {formatPrice(item.price_cents)}
                          </p>
                          {item.modifiers.length > 0 && (
                            <div className="mt-1 space-x-1">
                              {item.modifiers.map((modifier) => (
                                <Badge key={modifier.id} variant="secondary" className="text-xs">
                                  {modifier.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="font-medium">
                          {formatPrice((item.price_cents + item.modifiers.reduce((sum, mod) => sum + mod.price_delta, 0)) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(getSubtotal())}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Tax (8.875%)</span>
                      <span>{formatPrice(getTaxAmount())}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Tip</span>
                      <span>{formatPrice(getTipAmount())}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(getTotal())}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

