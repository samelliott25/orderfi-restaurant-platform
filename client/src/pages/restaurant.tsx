import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { OperationsAiChat } from "@/components/admin/operations-ai-chat";
import { OperationsAiProvider } from "@/contexts/OperationsAiContext";
import { 
  DollarSign, 
  Clock, 
  Users, 
  ShoppingCart, 
  Settings,
  Plus,
  Minus,
  CreditCard,
  Wallet,
  CheckCircle,
  AlertCircle,
  Star,
  Zap,
  Bot,
  MessageCircle
} from "lucide-react";

// Core ordering interface - zero friction, intelligent defaults
export default function RestaurantPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cart, setCart] = useState<any[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    table: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'usdc' | 'card' | 'cash'>('usdc');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  // Get menu items - intelligent categorization
  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: ['/api/menu-items', 1],
  });

  // Smart pricing calculation with Web3 benefits
  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const processingFee = paymentMethod === 'usdc' ? subtotal * 0.0001 : subtotal * 0.03; // 0.01% vs 3%
    const mimiRewards = paymentMethod === 'usdc' ? subtotal * 0.02 : subtotal * 0.01; // 2% vs 1%
    
    return {
      subtotal: subtotal.toFixed(2),
      processingFee: processingFee.toFixed(2),
      mimiRewards: Math.floor(mimiRewards * 100), // MIMI tokens
      total: (subtotal + processingFee).toFixed(2)
    };
  };

  // Intelligent order submission with workflow triggers
  const submitOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) throw new Error('Order failed');
      return response.json();
    },
    onSuccess: (data) => {
      setOrderSubmitted(true);
      setCart([]);
      toast({
        title: "Order Confirmed",
        description: `Order #${data.id} received. Estimated time: 15-20 minutes`,
      });
    }
  });

  const addToCart = (item: any) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? {...c, quantity: c.quantity + 1} : c));
    } else {
      setCart([...cart, {...item, quantity: 1}]);
    }
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return newQuantity === 0 ? null : {...item, quantity: newQuantity};
      }
      return item;
    }).filter(Boolean));
  };

  const submitOrder = () => {
    const totals = calculateTotal();
    
    submitOrderMutation.mutate({
      restaurantId: 1,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      tableNumber: customerInfo.table,
      items: JSON.stringify(cart),
      total: totals.total,
      paymentMethod,
      status: 'pending'
    });
  };

  if (orderSubmitted) {
    return (
      <div className="min-h-screen admin-bg flex items-center justify-center">
        <Card className="bg-white shadow-modern border-modern max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gradient mb-2">Order Confirmed!</h2>
            <p className="text-[#8b795e]/70 mb-4">
              Your order has been sent to the kitchen and payment processed automatically.
            </p>
            <div className="bg-[#ffe6b0]/20 rounded-lg p-4 mb-4">
              <p className="text-sm text-[#8b795e]">
                <Zap className="h-4 w-4 inline mr-1" />
                You earned {calculateTotal().mimiRewards} MIMI tokens!
              </p>
            </div>
            <Button 
              onClick={() => setOrderSubmitted(false)}
              className="gradient-bg text-white"
            >
              Order Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen admin-bg">
      <div className="container-modern max-w-6xl mx-auto p-6">
        {/* Header - Restaurant branding */}
        <div className="bg-white rounded-2xl p-6 shadow-modern-lg border border-[#8b795e]/10 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Mimi's Restaurant</h1>
              <p className="text-[#8b795e]/70">Web3-native dining experience • Instant USDC payments • Zero fees</p>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Zap className="h-3 w-3 mr-1" />
              Live Kitchen
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items - Intelligent categorization */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="popular" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="mains">Mains</TabsTrigger>
                <TabsTrigger value="drinks">Drinks</TabsTrigger>
                <TabsTrigger value="desserts">Desserts</TabsTrigger>
              </TabsList>

              <TabsContent value="popular" className="space-y-4 mt-6">
                {menuItems.slice(0, 6).map((item: any) => (
                  <Card key={item.id} className="bg-white shadow-modern hover-lift border-modern">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-[#8b795e]">{item.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          </div>
                          <p className="text-sm text-[#8b795e]/70 mb-2">{item.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-gradient">${item.price}</span>
                            <span className="text-xs text-green-600">
                              +{Math.floor(parseFloat(item.price) * 100)} MIMI
                            </span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => addToCart(item)}
                          className="gradient-bg text-white"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="mains" className="space-y-4 mt-6">
                {menuItems.filter((item: any) => item.category === 'Main Course').map((item: any) => (
                  <Card key={item.id} className="bg-white shadow-modern hover-lift border-modern">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#8b795e] mb-1">{item.name}</h3>
                          <p className="text-sm text-[#8b795e]/70 mb-2">{item.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-gradient">${item.price}</span>
                            <span className="text-xs text-green-600">
                              +{Math.floor(parseFloat(item.price) * 100)} MIMI
                            </span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => addToCart(item)}
                          className="gradient-bg text-white"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="drinks" className="space-y-4 mt-6">
                {menuItems.filter((item: any) => item.category === 'Beverage').map((item: any) => (
                  <Card key={item.id} className="bg-white shadow-modern hover-lift border-modern">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#8b795e] mb-1">{item.name}</h3>
                          <p className="text-sm text-[#8b795e]/70 mb-2">{item.description}</p>
                          <span className="font-bold text-gradient">${item.price}</span>
                        </div>
                        <Button 
                          onClick={() => addToCart(item)}
                          className="gradient-bg text-white"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="desserts" className="space-y-4 mt-6">
                {menuItems.filter((item: any) => item.category === 'Dessert').map((item: any) => (
                  <Card key={item.id} className="bg-white shadow-modern hover-lift border-modern">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#8b795e] mb-1">{item.name}</h3>
                          <p className="text-sm text-[#8b795e]/70 mb-2">{item.description}</p>
                          <span className="font-bold text-gradient">${item.price}</span>
                        </div>
                        <Button 
                          onClick={() => addToCart(item)}
                          className="gradient-bg text-white"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Smart Cart & Checkout */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card className="bg-white shadow-modern border-modern">
              <CardHeader>
                <CardTitle className="text-gradient">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Your name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                />
                <Input
                  placeholder="Table number"
                  value={customerInfo.table}
                  onChange={(e) => setCustomerInfo({...customerInfo, table: e.target.value})}
                />
                <Input
                  placeholder="Phone (optional)"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                />
              </CardContent>
            </Card>

            {/* Cart */}
            <Card className="bg-white shadow-modern border-modern">
              <CardHeader>
                <CardTitle className="text-gradient flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Your Order ({cart.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-[#8b795e]/70 text-center py-4">Add items to get started</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 rounded-lg border border-[#8b795e]/10">
                        <div className="flex-1">
                          <p className="font-medium text-[#8b795e] text-sm">{item.name}</p>
                          <p className="text-xs text-[#8b795e]/70">${item.price} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Smart Payment Selection */}
            {cart.length > 0 && (
              <Card className="bg-white shadow-modern border-modern">
                <CardHeader>
                  <CardTitle className="text-gradient">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => setPaymentMethod('usdc')}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        paymentMethod === 'usdc' 
                          ? 'border-[#8b795e] bg-[#ffe6b0]/10' 
                          : 'border-[#8b795e]/20 hover:border-[#8b795e]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Wallet className="h-5 w-5 text-[#8b795e]" />
                          <div>
                            <p className="font-medium text-[#8b795e]">USDC (Recommended)</p>
                            <p className="text-xs text-green-600">0.01% fee • 2x MIMI rewards</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Best</Badge>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        paymentMethod === 'card' 
                          ? 'border-[#8b795e] bg-[#ffe6b0]/10' 
                          : 'border-[#8b795e]/20 hover:border-[#8b795e]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-[#8b795e]" />
                        <div>
                          <p className="font-medium text-[#8b795e]">Credit Card</p>
                          <p className="text-xs text-orange-600">3% fee • Standard rewards</p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-[#8b795e]/10 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8b795e]/70">Subtotal</span>
                      <span className="text-[#8b795e]">${calculateTotal().subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8b795e]/70">Processing Fee</span>
                      <span className="text-[#8b795e]">${calculateTotal().processingFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">MIMI Rewards</span>
                      <span className="text-green-600">+{calculateTotal().mimiRewards}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-[#8b795e]/10 pt-2">
                      <span className="text-[#8b795e]">Total</span>
                      <span className="text-gradient">${calculateTotal().total}</span>
                    </div>
                  </div>

                  <Button
                    onClick={submitOrder}
                    disabled={!customerInfo.name || !customerInfo.table || submitOrderMutation.isPending}
                    className="w-full gradient-bg text-white"
                    size="lg"
                  >
                    {submitOrderMutation.isPending ? 'Processing...' : 'Place Order'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* AI Assistant Toggle */}
        <Button
          onClick={() => setShowAiAssistant(!showAiAssistant)}
          className="fixed bottom-6 left-6 h-14 w-14 rounded-full gradient-bg text-white shadow-lg hover:shadow-xl transition-all duration-300"
          size="sm"
        >
          <Bot className="h-6 w-6" />
        </Button>

        {/* Operations AI Assistant */}
        {showAiAssistant && (
          <div className="fixed bottom-24 left-6 w-96 z-40">
            <OperationsAiProvider>
              <Card className="shadow-2xl border-[#8b795e]/20">
                <CardHeader className="pb-3 bg-gradient-to-r from-[#8b795e] to-[#a08d6b] text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-[#8b795e]" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">Operations AI</CardTitle>
                        <p className="text-xs text-white/80">Business assistant</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setShowAiAssistant(false)}
                      variant="ghost"
                      size="sm"
                      className="text-white/80 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                    >
                      ×
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 h-96">
                  <OperationsAiChat />
                </CardContent>
              </Card>
            </OperationsAiProvider>
          </div>
        )}
      </div>
    </div>
  );
}