import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import { VoiceGuideOverlay } from "@/components/VoiceGuideOverlay";
import { CustomerAiChat } from "@/components/CustomerAiChat";
import { 
  Wallet, 
  ShoppingCart, 
  ArrowRight,
  Copy,
  ExternalLink,
  AlertCircle,
  Zap,
  Plus,
  Minus,
  DollarSign,
  Loader2,
  CheckCircle,
  HelpCircle,
  Bot,
  MessageCircle
} from "lucide-react";

// True Web3 dApp ordering - DEX-style interface for food
export default function Web3DappPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  
  const [cart, setCart] = useState<any[]>([]);
  const [transactionHash, setTransactionHash] = useState('');
  const [orderStatus, setOrderStatus] = useState<'idle' | 'pending' | 'confirming' | 'confirmed'>('idle');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);

  // Get menu items from API
  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: ['/api/menu-items', 1],
  });

  // Handle wallet connection
  const handleConnect = async (walletType: string) => {
    try {
      await connectWallet(walletType);
      toast({
        title: "Wallet Connected",
        description: "Ready to order food on-chain",
      });
    } catch (error) {
      toast({
        title: "Connection Failed", 
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setCart([]);
    setTransactionHash('');
    setOrderStatus('idle');
  };

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

  const calculateOrder = () => {
    const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const networkFee = 0.001; // Base network fee
    const protocolFee = subtotal * 0.0001; // 0.01% protocol fee
    const mimiRewards = Math.floor(subtotal * 100); // 1 MIMI per $0.01
    
    return {
      subtotal: subtotal.toFixed(2),
      networkFee: networkFee.toFixed(3),
      protocolFee: protocolFee.toFixed(4),
      total: (subtotal + networkFee + protocolFee).toFixed(2),
      mimiRewards
    };
  };

  // Submit order as blockchain transaction
  const submitOrder = async () => {
    if (!wallet.connected || cart.length === 0) return;
    
    setOrderStatus('pending');
    
    try {
      // Generate mock transaction hash
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      setTransactionHash(mockTxHash);
      
      // Submit to backend
      const orderData = {
        restaurantId: 1,
        customerName: 'Web3 User',
        walletAddress: wallet.address,
        items: JSON.stringify(cart),
        total: calculateOrder().total,
        paymentMethod: 'usdc',
        transactionHash: mockTxHash,
        status: 'pending'
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setOrderStatus('confirming');
        
        // Simulate blockchain confirmation
        setTimeout(() => {
          setOrderStatus('confirmed');
          setCart([]);
          toast({
            title: "Order Confirmed On-Chain",
            description: `Transaction confirmed. ${calculateOrder().mimiRewards} MIMI tokens earned!`,
          });
          
          // Reset after 5 seconds
          setTimeout(() => {
            setOrderStatus('idle');
            setTransactionHash('');
          }, 5000);
        }, 3000);
      }
    } catch (error) {
      setOrderStatus('idle');
      toast({
        title: "Transaction Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Show wallet connection screen if not connected
  if (!wallet.connected) {
    return (
      <div className="min-h-screen admin-bg">
        <div className="container-modern max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-2xl p-8 shadow-modern-lg border border-[#8b795e]/10 mb-8 wallet-section">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gradient mb-4">Web3 Food Ordering dApp</h1>
              <p className="text-[#8b795e]/70 mb-6">
                Connect your wallet to order food on-chain with USDC
              </p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Zap className="h-3 w-3 mr-1" />
                  Base Network
                </Badge>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  USDC Payments
                </Badge>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  MIMI Rewards
                </Badge>
              </div>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => setShowTutorial(true)}
                  variant="outline"
                  className="border-[#8b795e]/30 text-[#8b795e] hover:bg-[#ffe6b0]/10"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Start Voice Tutorial
                </Button>
                <Button
                  onClick={() => setShowAiChat(true)}
                  variant="outline"
                  className="border-[#8b795e]/30 text-[#8b795e] hover:bg-[#ffe6b0]/10"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Chat with Mimi AI
                </Button>
              </div>
            </div>
          </div>

          <Card className="bg-white shadow-modern border-modern max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-gradient flex items-center justify-center gap-2">
                <Wallet className="h-6 w-6" />
                Connect Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 wallet-buttons">
              <Button
                onClick={() => handleConnect('metamask')}
                disabled={wallet.isConnecting}
                className="w-full flex items-center justify-between p-4 border border-[#8b795e]/20 hover:bg-[#ffe6b0]/10 bg-white text-[#8b795e]"
                variant="outline"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <span>MetaMask</span>
                </div>
                {wallet.isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              </Button>

              <Button
                onClick={() => handleConnect('coinbase')}
                disabled={wallet.isConnecting}
                className="w-full flex items-center justify-between p-4 border border-[#8b795e]/20 hover:bg-[#ffe6b0]/10 bg-white text-[#8b795e]"
                variant="outline"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">C</span>
                  </div>
                  <span>Coinbase Wallet</span>
                </div>
                {wallet.isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              </Button>

              <Button
                onClick={() => handleConnect('walletconnect')}
                disabled={wallet.isConnecting}
                className="w-full flex items-center justify-between p-4 border border-[#8b795e]/20 hover:bg-[#ffe6b0]/10 bg-white text-[#8b795e]"
                variant="outline"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">W</span>
                  </div>
                  <span>WalletConnect</span>
                </div>
                {wallet.isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main dApp interface (wallet connected) - DEX-style layout
  return (
    <div className="min-h-screen admin-bg">
      <div className="container-modern max-w-7xl mx-auto p-6">
        {/* Header with wallet info - DEX style */}
        <div className="bg-white rounded-2xl p-6 shadow-modern-lg border border-[#8b795e]/10 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Food Ordering dApp</h1>
              <div className="flex items-center gap-4 text-sm text-[#8b795e]/70">
                <span>Network: {wallet.network}</span>
                <span>•</span>
                <span>USDC Balance: ${wallet.balance}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowTutorial(true)}
                variant="outline"
                size="sm"
                className="border-[#8b795e]/30 text-[#8b795e] hover:bg-[#ffe6b0]/10"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Voice Tutorial
              </Button>
              <Button
                onClick={() => setShowAiChat(true)}
                variant="outline"
                size="sm"
                className="border-[#8b795e]/30 text-[#8b795e] hover:bg-[#ffe6b0]/10"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask Mimi AI
              </Button>
              <div className="text-right wallet-info">
                <p className="text-sm text-[#8b795e]/70">Connected Wallet</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-mono text-sm">{formatAddress(wallet.address)}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigator.clipboard.writeText(wallet.address)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleDisconnect}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-modern border border-[#8b795e]/10 menu-section">
              <h2 className="text-xl font-bold text-gradient mb-6">Select Items</h2>
              
              {menuLoading ? (
                <div className="space-y-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 menu-items">
                  {(Array.isArray(menuItems) ? menuItems : []).map((item: any) => (
                    <div key={item.id} className="border border-[#8b795e]/10 rounded-lg p-4 hover:bg-[#ffe6b0]/5 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#8b795e] mb-1">{item.name}</h3>
                          <p className="text-sm text-[#8b795e]/70 mb-2">{item.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-gradient">${item.price}</span>
                            <Badge variant="secondary" className="text-xs">
                              +{Math.floor(parseFloat(item.price) * 100)} MIMI
                            </Badge>
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary & Transaction */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-modern border border-[#8b795e]/10 order-summary">
              <h3 className="text-lg font-bold text-gradient mb-4 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </h3>

              {cart.length === 0 ? (
                <p className="text-[#8b795e]/70 text-center py-8">
                  Add items to start your order
                </p>
              ) : (
                <div className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-[#ffe6b0]/10 border border-[#8b795e]/10">
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

                  {/* Transaction Breakdown */}
                  <div className="border-t border-[#8b795e]/10 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8b795e]/70">Subtotal</span>
                      <span className="text-[#8b795e]">${calculateOrder().subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8b795e]/70">Network Fee</span>
                      <span className="text-[#8b795e]">${calculateOrder().networkFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8b795e]/70">Protocol Fee (0.01%)</span>
                      <span className="text-[#8b795e]">${calculateOrder().protocolFee}</span>
                    </div>
                    <div className="flex justify-between text-sm rewards-section">
                      <span className="text-green-600">MIMI Rewards</span>
                      <span className="text-green-600">+{calculateOrder().mimiRewards}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-[#8b795e]/10 pt-2">
                      <span className="text-[#8b795e]">Total</span>
                      <span className="text-gradient">${calculateOrder().total} USDC</span>
                    </div>
                  </div>

                  {/* Submit Transaction */}
                  <Button
                    onClick={submitOrder}
                    disabled={orderStatus !== 'idle' || parseFloat(wallet.balance) < parseFloat(calculateOrder().total)}
                    className="w-full gradient-bg text-white place-order-button"
                    size="lg"
                  >
                    {orderStatus === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting Transaction...
                      </div>
                    )}
                    {orderStatus === 'confirming' && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Confirming On-Chain...
                      </div>
                    )}
                    {orderStatus === 'confirmed' && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Order Confirmed!
                      </div>
                    )}
                    {orderStatus === 'idle' && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Place Order
                      </div>
                    )}
                  </Button>

                  {/* Transaction Status */}
                  {transactionHash && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        {orderStatus === 'confirming' && <Loader2 className="h-3 w-3 animate-spin text-blue-600" />}
                        {orderStatus === 'confirmed' && <CheckCircle className="h-3 w-3 text-green-600" />}
                        <span className="text-sm text-blue-800">
                          {orderStatus === 'confirming' ? 'Transaction Pending' : 'Transaction Confirmed'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-blue-600 font-mono">{formatAddress(transactionHash)}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0"
                          onClick={() => window.open(`https://basescan.org/tx/${transactionHash}`, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Insufficient Balance Warning */}
                  {parseFloat(wallet.balance) < parseFloat(calculateOrder().total) && (
                    <div className="bg-red-50 rounded-lg p-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-800">Insufficient USDC balance</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Voice Tutorial Overlay */}
      <VoiceGuideOverlay 
        isVisible={showTutorial} 
        onClose={() => setShowTutorial(false)} 
      />

      {/* AI Chat Assistant */}
      <CustomerAiChat 
        isOpen={showAiChat}
        onToggle={() => setShowAiChat(!showAiChat)}
        onAddToCart={addToCart}
        currentCart={cart}
      />
    </div>
  );
}