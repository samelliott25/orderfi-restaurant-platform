import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, Coins, Shield, Clock } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  processingTime: string;
  enabled: boolean;
}

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  specialInstructions?: string;
}

interface PaymentProcessorProps {
  cart: CartItem[];
  onPaymentComplete: (paymentResult: any) => void;
  onCancel: () => void;
}

export function PaymentProcessor({ cart, onPaymentComplete, onCancel }: PaymentProcessorProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    tableNumber: ''
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'credit',
      name: 'Credit Card',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Pay with your credit or debit card',
      processingTime: 'Instant',
      enabled: true
    },
    {
      id: 'usdc',
      name: 'USDC Crypto',
      icon: <Coins className="h-5 w-5" />,
      description: 'Pay with USDC and earn 2x MIMI tokens',
      processingTime: '1-2 minutes',
      enabled: true
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Quick payment with Touch ID',
      processingTime: 'Instant',
      enabled: false // Would be enabled based on device detection
    }
  ];

  const calculateSubtotal = (): number => {
    return cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  };

  const calculateTax = (): number => {
    return calculateSubtotal() * 0.08; // 8% tax rate
  };

  const calculateTotal = (): number => {
    return calculateSubtotal() + calculateTax();
  };

  const handlePayment = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      alert('Please fill in your name and email');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentResult = {
        paymentId: `payment_${Date.now()}`,
        method: selectedMethod,
        amount: calculateTotal(),
        customerInfo,
        timestamp: new Date().toISOString(),
        success: true
      };

      onPaymentComplete(paymentResult);
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium">{item.quantity}x {item.name}</p>
                {item.specialInstructions && (
                  <p className="text-xs text-gray-500">{item.specialInstructions}</p>
                )}
              </div>
              <p className="font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          
          <Separator />
          
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>${calculateTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your full name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="table">Table Number</Label>
            <Input
              id="table"
              value={customerInfo.tableNumber}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, tableNumber: e.target.value }))}
              placeholder="Optional - for dine-in orders"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                selectedMethod === method.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => method.enabled && setSelectedMethod(method.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {method.icon}
                  <div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-xs text-gray-500">{method.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {method.processingTime}
                    </Badge>
                  </div>
                  {method.id === 'usdc' && (
                    <p className="text-xs text-orange-600 mt-1">+2x MIMI tokens</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <Shield className="h-4 w-4" />
        <span>Your payment information is securely encrypted and processed.</span>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          disabled={isProcessing || !customerInfo.name || !customerInfo.email}
          className="flex-1 bg-orange-500 hover:bg-orange-600"
        >
          {isProcessing ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay ${calculateTotal().toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}