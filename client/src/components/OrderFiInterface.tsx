import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CustomerAiChat } from "@/components/CustomerAiChat";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
// Simple swipe simulation without complex gesture handling
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
  Minus
} from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image?: string;
}

interface OrderFiInterfaceProps {
  restaurantName: string;
  menuItems: any[];
}

export function OrderFiInterface({ restaurantName, menuItems }: OrderFiInterfaceProps) {
  const { toast } = useToast();
  const { wallet, connectWallet } = useWallet();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showChat, setShowChat] = useState(true);
  const [orderTokens, setOrderTokens] = useState(0);
  const [visitCount, setVisitCount] = useState(1);
  const [favoriteItems, setFavoriteItems] = useState<number[]>([]);
  const [orderStatus, setOrderStatus] = useState<'ordering' | 'placed' | 'ready'>('ordering');

  // Swipe-to-confirm UX for menu items
  const handleSwipe = (direction: SwipeDirection) => {
    const currentItem = menuItems[currentItemIndex];
    
    if (direction === 'right') {
      // Add to cart
      addToCart(currentItem);
      toast({
        title: "Added to order!",
        description: `${currentItem.name} added to your cart`,
      });
    } else if (direction === 'left') {
      // Skip item
      toast({
        title: "Skipped",
        description: "Swipe right to add items you like!",
      });
    }
    
    // Move to next item
    if (currentItemIndex < menuItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else {
      setCurrentItemIndex(0); // Loop back
    }
  };

  const addToCart = (item: any) => {
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
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
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
    const orderTokensEarned = Math.floor(subtotal * 10); // 10 tokens per dollar
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
      title: "Order placed!",
      description: `You earned ${earnedTokens} $ORDER tokens`,
    });
    
    // Simulate order preparation
    setTimeout(() => {
      setOrderStatus('ready');
      toast({
        title: "Order ready!",
        description: "Your delicious food is ready for pickup",
      });
    }, 15000);
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
            <p>Loading menu...</p>
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
              <p className="text-sm text-gray-600">Visit #{visitCount}</p>
            </div>
            <div className="flex items-center gap-3">
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
                  <span className="font-bold text-yellow-600">#{Math.min(visitCount * 3, 50)}</span>
                </div>
                <p className="text-xs text-gray-500">Rank</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Current Item Swipe Card */}
        {orderStatus === 'ordering' && (
          <SwipeableCard
            onSwipe={handleSwipe}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="relative">
              <div className="h-48 bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center">
                <span className="text-6xl">🍽️</span>
              </div>
              <Button
                onClick={() => toggleFavorite(menuItems[currentItemIndex]?.id)}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              >
                <Heart 
                  className={`h-4 w-4 ${
                    favoriteItems.includes(menuItems[currentItemIndex]?.id) 
                      ? 'text-red-500 fill-current' 
                      : 'text-gray-400'
                  }`} 
                />
              </Button>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">{menuItems[currentItemIndex]?.name}</h3>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  ${menuItems[currentItemIndex]?.price}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {menuItems[currentItemIndex]?.description || "Delicious and fresh"}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>4.8 (124 reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <Coins className="h-4 w-4" />
                  <span>+{Math.floor(parseFloat(menuItems[currentItemIndex]?.price || '0') * 10)} tokens</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Swipe right to add • Swipe left to skip</p>
                <div className="flex justify-center gap-4">
                  <div className="flex items-center gap-1 text-gray-400">
                    <span>👈</span>
                    <span className="text-xs">Skip</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <span>👉</span>
                    <span className="text-xs">Add</span>
                  </div>
                </div>
              </div>
            </div>
          </SwipeableCard>
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

        {/* Order Status */}
        {orderStatus === 'placed' && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-bold text-blue-900 mb-1">Order in Progress</h3>
              <p className="text-sm text-blue-700">Estimated ready time: 12-15 minutes</p>
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

        {/* Loyalty Leaderboard Preview */}
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
              <div className="flex items-center justify-between font-medium text-orange-600">
                <span>#{Math.min(visitCount * 3, 50)}. You</span>
                <span>{orderTokens} tokens</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Chat Assistant */}
      <CustomerAiChat 
        isOpen={showChat}
        onToggle={() => setShowChat(!showChat)}
        onAddToCart={addToCart}
        currentCart={cart}
      />
    </div>
  );
}