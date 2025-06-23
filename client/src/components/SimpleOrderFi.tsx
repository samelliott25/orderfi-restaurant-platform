import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CustomerAiChat } from "@/components/CustomerAiChat";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart,
  Star,
  Trophy,
  Zap,
  Coins,
  Clock,
  CheckCircle,
  ArrowRight,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
}

interface SimpleOrderFiProps {
  restaurantName: string;
  menuItems: any[];
}

export function SimpleOrderFi({ restaurantName, menuItems }: SimpleOrderFiProps) {
  const { toast } = useToast();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [orderTokens, setOrderTokens] = useState(147); // Starting tokens
  const [visitCount, setVisitCount] = useState(3);
  const [favoriteItems, setFavoriteItems] = useState<number[]>([]);
  const [orderStatus, setOrderStatus] = useState<'ordering' | 'placed' | 'ready'>('ordering');

  const currentItem = menuItems[currentItemIndex];

  const handleAddItem = () => {
    if (!currentItem) return;
    
    const existingItem = cart.find(item => item.id === currentItem.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === currentItem.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...currentItem, quantity: 1 }]);
    }
    
    toast({
      title: "Added to order! 🎉",
      description: `${currentItem.name} added to your cart`,
    });
    
    nextItem();
  };

  const handleSkipItem = () => {
    toast({
      title: "Skipped",
      description: "Tap the heart to add items you love!",
    });
    nextItem();
  };

  const nextItem = () => {
    if (currentItemIndex < menuItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else {
      setCurrentItemIndex(0);
    }
  };

  const prevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    } else {
      setCurrentItemIndex(menuItems.length - 1);
    }
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as OrderItem[]);
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const orderTokensEarned = Math.floor(subtotal * 10);
    return {
      subtotal: subtotal.toFixed(2),
      tokens: orderTokensEarned,
      total: subtotal.toFixed(2)
    };
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    
    setOrderStatus('placed');
    const earnedTokens = calculateTotal().tokens;
    setOrderTokens(orderTokens + earnedTokens);
    
    toast({
      title: "Order placed! 🚀",
      description: `You earned ${earnedTokens} $ORDER tokens`,
    });
    
    setTimeout(() => {
      setOrderStatus('ready');
      toast({
        title: "Order ready! 🍽️",
        description: "Your delicious food is ready for pickup",
      });
    }, 12000);
  };

  const toggleFavorite = (itemId: number) => {
    if (favoriteItems.includes(itemId)) {
      setFavoriteItems(favoriteItems.filter(id => id !== itemId));
    } else {
      setFavoriteItems([...favoriteItems, itemId]);
    }
  };

  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p>Loading delicious menu...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header with loyalty stats */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{restaurantName}</h1>
              <p className="text-sm text-gray-600">Visit #{visitCount} • Table 7</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4 text-orange-500" />
                  <span className="font-bold text-orange-600">{orderTokens}</span>
                </div>
                <p className="text-xs text-gray-500">$ORDER</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold text-yellow-600">#{Math.min(visitCount * 12, 50)}</span>
                </div>
                <p className="text-xs text-gray-500">Rank</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Current Item Card - OrderFi Style */}
        {orderStatus === 'ordering' && currentItem && (
          <Card className="bg-white rounded-2xl shadow-lg overflow-hidden relative">
            <div className="relative">
              <div className="h-48 bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center">
                <span className="text-6xl">🍽️</span>
              </div>
              <Button
                onClick={() => toggleFavorite(currentItem.id)}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              >
                <Heart 
                  className={`h-4 w-4 ${
                    favoriteItems.includes(currentItem.id) 
                      ? 'text-red-500 fill-current' 
                      : 'text-gray-400'
                  }`} 
                />
              </Button>
              
              {/* Navigation arrows */}
              <Button
                onClick={prevItem}
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={nextItem}
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">{currentItem.name}</h3>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  ${currentItem.price}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {currentItem.description || "Fresh, delicious, and made with love"}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>4.8 (124 reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <Coins className="h-4 w-4" />
                  <span>+{Math.floor(parseFloat(currentItem.price) * 10)} tokens</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Action buttons - OrderFi style */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSkipItem}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Skip
                </Button>
                <Button
                  onClick={handleAddItem}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Add to Order
                </Button>
              </div>
              
              <div className="text-center mt-2">
                <p className="text-xs text-gray-500">
                  {currentItemIndex + 1} of {menuItems.length} items
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Cart Summary */}
        {cart.length > 0 && (
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>Your Order</span>
                <Badge variant="outline">{cart.length} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">${item.price} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => updateQuantity(item.id, -1)}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      onClick={() => updateQuantity(item.id, 1)}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${calculateTotal().subtotal}</span>
                </div>
                <div className="flex justify-between text-orange-600">
                  <span className="flex items-center gap-1">
                    <Coins className="h-4 w-4" />
                    Tokens earned
                  </span>
                  <span>+{calculateTotal().tokens}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${calculateTotal().total}</span>
                </div>
              </div>
              
              <Button
                onClick={placeOrder}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                size="lg"
                disabled={orderStatus !== 'ordering'}
              >
                {orderStatus === 'ordering' && (
                  <>
                    Place Order
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
                {orderStatus === 'placed' && (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Preparing...
                  </>
                )}
                {orderStatus === 'ready' && (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Ready for pickup!
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Order Status Cards */}
        {orderStatus === 'placed' && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-bold text-blue-900 mb-1">Order in Progress</h3>
              <p className="text-sm text-blue-700">Estimated ready time: 10-12 minutes</p>
            </CardContent>
          </Card>
        )}

        {orderStatus === 'ready' && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-bold text-green-900 mb-1">Order Ready!</h3>
              <p className="text-sm text-green-700">Please pick up your order at the counter</p>
            </CardContent>
          </Card>
        )}

        {/* Loyalty Leaderboard */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-yellow-900">Today's Top Foodies</h3>
              <Trophy className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>1. Sarah M.</span>
                <span className="text-yellow-600 font-medium">2,340 tokens</span>
              </div>
              <div className="flex items-center justify-between">
                <span>2. Mike R.</span>
                <span className="text-yellow-600 font-medium">1,890 tokens</span>
              </div>
              <div className="flex items-center justify-between">
                <span>3. Alex K.</span>
                <span className="text-yellow-600 font-medium">1,245 tokens</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-medium text-orange-600">
                <span>#{Math.min(visitCount * 12, 50)}. You</span>
                <span>{orderTokens} tokens</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat with Mimi */}
        <Button
          onClick={() => setShowChat(true)}
          variant="outline"
          className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
        >
          💬 Chat with Mimi AI
        </Button>
      </div>

      {/* AI Chat Assistant */}
      <CustomerAiChat 
        isOpen={showChat}
        onToggle={() => setShowChat(!showChat)}
        onAddToCart={(item) => {
          const existingItem = cart.find(cartItem => cartItem.id === item.id);
          if (existingItem) {
            setCart(cart.map(cartItem => 
              cartItem.id === item.id 
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ));
          } else {
            setCart([...cart, { ...item, quantity: 1 }]);
          }
        }}
        currentCart={cart}
      />
    </div>
  );
}