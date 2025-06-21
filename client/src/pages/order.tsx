import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Plus, Minus, Wallet, CreditCard, Smartphone, DollarSign, Clock, CheckCircle } from "lucide-react";
import type { MenuItem } from "@shared/schema";

interface CartItem extends MenuItem {
  quantity: number;
  specialInstructions?: string;
}

interface PaymentMethod {
  type: 'usdc' | 'credit' | 'cash';
  label: string;
  icon: any;
  fees: string;
  description: string;
}

export default function OrderPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    tableNumber: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod['type']>('usdc');
  const [walletConnected, setWalletConnected] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'cart' | 'payment' | 'processing' | 'confirmed'>('cart');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const paymentMethods: PaymentMethod[] = [
    {
      type: 'usdc',
      label: 'USDC (Web3)',
      icon: Wallet,
      fees: '$0.01',
      description: 'Instant settlement, lowest fees'
    },
    {
      type: 'credit',
      label: 'Credit Card',
      icon: CreditCard,
      fees: '3.0%',
      description: 'Traditional payment'
    },
    {
      type: 'cash',
      label: 'Pay at Counter',
      icon: DollarSign,
      fees: 'Free',
      description: 'Pay when you pick up'
    }
  ];

  const { data: menuItems = {} } = useQuery({
    queryKey: ['/api/restaurants/1/menu/categorized'],
  }) as { data: Record<string, MenuItem[]> };

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) throw new Error('Order failed');
      return response.json();
    },
    onSuccess: () => {
      setOrderStatus('confirmed');
      setCart([]);
      toast({
        title: "Order Confirmed!",
        description: "Your order has been submitted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Order Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  });

  const processPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      if (!response.ok) throw new Error('Payment failed');
      return response.json();
    },
    onSuccess: (paymentResult) => {
      setOrderStatus('processing');
      // Create the order after successful payment
      const orderData = {
        restaurantId: 1,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        tableNumber: customerInfo.tableNumber,
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions
        })),
        paymentMethod,
        paymentId: paymentResult.paymentId,
        total: calculateTotal()
      };
      
      createOrderMutation.mutate(orderData);
    }
  });

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: number, change: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const calculateFees = () => {
    const subtotal = calculateSubtotal();
    switch (paymentMethod) {
      case 'usdc': return 0.01;
      case 'credit': return subtotal * 0.03;
      case 'cash': return 0;
      default: return 0;
    }
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateFees();
  };

  const connectWallet = async () => {
    try {
      // Simulate wallet connection
      setWalletConnected(true);
      toast({
        title: "Wallet Connected",
        description: "Ready for USDC payments",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const processOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and phone number",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === 'usdc' && !walletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet for USDC payments",
        variant: "destructive",
      });
      return;
    }

    setOrderStatus('payment');

    if (paymentMethod === 'cash') {
      // Skip payment processing for cash orders
      createOrderMutation.mutate({
        restaurantId: 1,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        tableNumber: customerInfo.tableNumber,
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions
        })),
        paymentMethod: 'cash',
        total: calculateTotal()
      });
    } else {
      // Process payment for USDC/credit card
      processPaymentMutation.mutate({
        amount: calculateTotal(),
        paymentMethod,
        customerInfo,
        orderItems: cart
      });
    }
  };

  if (orderStatus === 'confirmed') {
    return (
      <div className="min-h-screen admin-bg flex items-center justify-center p-6">
        <Card className="bg-white shadow-modern-lg border-glow max-w-md w-full text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gradient mb-2">Order Confirmed!</h2>
            <p className="text-[#8b795e]/70 mb-6">
              Thank you {customerInfo.name}! Your order has been submitted and the kitchen has been notified.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-[#8b795e]/70">
                <Clock className="h-4 w-4" />
                Estimated pickup time: 15-20 minutes
              </div>
            </div>
            <Button 
              onClick={() => {
                setOrderStatus('cart');
                setCustomerInfo({ name: '', phone: '', email: '', tableNumber: '' });
              }}
              className="w-full gradient-bg-secondary text-white hover:opacity-90"
            >
              Place Another Order
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen admin-bg">
      <div className="container-modern p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-modern-lg border border-[#8b795e]/10 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Order from Mimi's Kitchen</h1>
              <p className="text-[#8b795e]/70">Web3-powered ordering • Instant payments • Zero fees</p>
            </div>
            {cart.length > 0 && (
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-[#ffe6b0]/20 text-[#8b795e] border-[#8b795e]/20">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                </Badge>
                <div className="text-right">
                  <p className="text-sm text-[#8b795e]/70">Total</p>
                  <p className="text-xl font-bold text-gradient">${calculateTotal().toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(menuItems as Record<string, MenuItem[]>).map(([category, items]) => (
              <Card key={category} className="bg-white shadow-modern border-modern">
                <CardHeader>
                  <CardTitle className="text-gradient">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {items.map((item: MenuItem) => (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-[#8b795e]/10 hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#8b795e] mb-1">{item.name}</h3>
                          <p className="text-sm text-[#8b795e]/70 mb-2">{item.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gradient">${item.price}</span>
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex gap-1">
                                {item.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {cart.find(cartItem => cartItem.id === item.id) ? (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-semibold">
                                {cart.find(cartItem => cartItem.id === item.id)?.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => addToCart(item)}
                              className="gradient-bg-secondary text-white hover:opacity-90"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cart & Checkout */}
          <div className="space-y-6">
            <Card className="bg-white shadow-modern border-modern sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient">
                  <ShoppingCart className="h-5 w-5" />
                  Your Order
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-[#8b795e]/70 text-center py-8">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-[#8b795e]">{item.name}</h4>
                          <p className="text-sm text-[#8b795e]/70">
                            ${item.price} × {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Separator />

                    {/* Payment Method Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-[#8b795e]">Payment Method</Label>
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                          <div
                            key={method.type}
                            onClick={() => setPaymentMethod(method.type)}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              paymentMethod === method.type
                                ? 'border-[#8b795e] bg-[#ffe6b0]/10'
                                : 'border-[#8b795e]/20 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4 text-[#8b795e]" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-[#8b795e]">{method.label}</span>
                                  <span className="text-sm font-semibold text-[#8b795e]">
                                    {method.fees}
                                  </span>
                                </div>
                                <p className="text-xs text-[#8b795e]/70">{method.description}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {paymentMethod === 'usdc' && !walletConnected && (
                      <Button
                        onClick={connectWallet}
                        variant="outline"
                        className="w-full border-orange-200 text-orange-800 hover:bg-orange-50"
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Connect Wallet
                      </Button>
                    )}

                    <Separator />

                    {/* Order Summary */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#8b795e]/70">Subtotal</span>
                        <span className="text-[#8b795e]">${calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#8b795e]/70">Fees</span>
                        <span className="text-[#8b795e]">${calculateFees().toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span className="text-[#8b795e]">Total</span>
                        <span className="text-gradient">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-[#8b795e]">Customer Information</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Input
                            placeholder="Name*"
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Phone*"
                            value={customerInfo.phone}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <Input
                        placeholder="Email (optional)"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="text-sm"
                      />
                      <Input
                        placeholder="Table number (optional)"
                        value={customerInfo.tableNumber}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, tableNumber: e.target.value }))}
                        className="text-sm"
                      />
                    </div>

                    <Button
                      onClick={processOrder}
                      disabled={cart.length === 0 || createOrderMutation.isPending || processPaymentMutation.isPending}
                      className="w-full gradient-bg-secondary text-white hover:opacity-90"
                    >
                      {createOrderMutation.isPending || processPaymentMutation.isPending
                        ? 'Processing...'
                        : `Place Order • $${calculateTotal().toFixed(2)}`
                      }
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}