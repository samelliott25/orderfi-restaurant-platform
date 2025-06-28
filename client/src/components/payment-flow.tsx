import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, DollarSign, CheckCircle, AlertCircle } from "lucide-react";

interface PaymentFlowProps {
  orderId: number;
  amount: string;
  customerId: string;
  onPaymentComplete: (result: any) => void;
}

export function PaymentFlow({ orderId, amount, customerId, onPaymentComplete }: PaymentFlowProps) {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'crypto' | 'cash'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const initializePayment = async () => {
    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount,
          currency: paymentMethod === 'crypto' ? 'USDC' : 'USD',
          method: paymentMethod,
          customerWallet: walletAddress || undefined,
          customerId
        })
      });

      if (!response.ok) throw new Error('Payment initialization failed');
      return await response.json();
    } catch (error) {
      throw new Error('Failed to initialize payment');
    }
  };

  const processStripePayment = async (paymentId: string) => {
    const response = await fetch('/api/payments/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentId,
        stripeToken: `tok_${cardNumber.slice(-4)}` // Simplified for demo
      })
    });

    if (!response.ok) throw new Error('Stripe payment failed');
    return await response.json();
  };

  const processCryptoPayment = async (paymentId: string) => {
    const response = await fetch('/api/payments/crypto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentId,
        cryptoData: {
          walletAddress,
          amount,
          token: 'USDC',
          network: 'base',
          txHash: `0x${Date.now().toString(16)}${'a'.repeat(56)}` // Mock transaction hash
        }
      })
    });

    if (!response.ok) throw new Error('Crypto payment failed');
    return await response.json();
  };

  const processCashPayment = async (paymentId: string) => {
    const response = await fetch('/api/payments/cash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId })
    });

    if (!response.ok) throw new Error('Cash payment processing failed');
    return await response.json();
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Initialize payment
      const { paymentId } = await initializePayment();
      
      // Process payment based on method
      let result;
      switch (paymentMethod) {
        case 'stripe':
          result = await processStripePayment(paymentId);
          break;
        case 'crypto':
          result = await processCryptoPayment(paymentId);
          break;
        case 'cash':
          result = await processCashPayment(paymentId);
          break;
      }

      if (result.success) {
        setPaymentStatus('success');
        onPaymentComplete(result);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error: any) {
      setPaymentStatus('error');
      setErrorMessage(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
            <p className="text-gray-600">Your order has been confirmed and sent to the kitchen.</p>
            <Badge variant="secondary" className="mt-4">
              Order #{orderId} - ${amount}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Complete Payment
        </CardTitle>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Order #{orderId}</span>
          <span className="font-semibold">${amount}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {paymentStatus === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}

        <div>
          <Label className="text-base font-medium">Payment Method</Label>
          <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)} className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stripe" id="stripe" />
              <Label htmlFor="stripe" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Credit Card
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="crypto" id="crypto" />
              <Label htmlFor="crypto" className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                USDC (Crypto)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Cash (In-person)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMethod === 'stripe' && (
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength={19}
            />
          </div>
        )}

        {paymentMethod === 'crypto' && (
          <div>
            <Label htmlFor="walletAddress">Wallet Address</Label>
            <Input
              id="walletAddress"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Send {amount} USDC to complete payment
            </p>
          </div>
        )}

        {paymentMethod === 'cash' && (
          <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
            <p className="text-sm">
              Please have ${amount} ready for the server when your order arrives.
            </p>
          </div>
        )}

        <Button 
          onClick={handlePayment}
          disabled={isProcessing || paymentStatus === 'processing'}
          className="w-full"
        >
          {isProcessing ? (
            "Processing..."
          ) : (
            `Pay $${amount}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
}