import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Home, Calendar, Star, ShoppingCart, Clock, DollarSign, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';

export default function OrderFiNew() {
  const [, setLocation] = useLocation();
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleChatToggle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsChatExpanded(!isChatExpanded);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-orange-50 to-pink-50 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-pink-100/20 to-purple-100/30"></div>
      
      {/* Main Content */}
      <ScrollArea className="h-screen relative z-10">
        <div className="container mx-auto px-4 py-8 pb-32">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Welcome to OrderFi
            </h1>
            <p className="text-gray-600 text-lg">
              Your AI-powered restaurant experience
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-orange-500" />
                  Quick Order
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white">
                  Order Now
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-50">
                  View Orders
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Featured Items */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Popular Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Signature Burger</span>
                    <Badge className="bg-orange-500 text-white">Popular</Badge>
                  </CardTitle>
                  <CardDescription>
                    Our most loved burger with premium ingredients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-500">$12.99</span>
                    <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Artisan Pizza</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">4.9</span>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Wood-fired pizza with fresh toppings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-500">$18.99</span>
                    <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Rewards Card */}
          <Card className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                OrderFi Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">Gold Member</p>
                  <p className="text-sm opacity-90">1,250 points available</p>
                </div>
                <Button variant="outline" className="border-white text-white hover:bg-white/20">
                  Redeem
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Revolutionary Sentient Orb Experience */}
      {isChatExpanded && (
        <div className="fixed inset-0 z-[8000] flex items-center justify-center" style={{
          background: 'radial-gradient(circle at center, rgb(255, 150, 0) 0%, rgb(255, 100, 100) 25%, rgb(200, 50, 255) 50%, rgb(100, 0, 200) 75%, rgb(0, 0, 0) 100%)'
        }}>
          {/* Close Button */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsChatExpanded(false)}
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
          >
            ×
          </Button>

          {/* Sentient Orb Core */}
          <div className="relative">
            {/* Main Orb */}
            <div 
              className="w-80 h-80 rounded-full relative overflow-hidden cursor-pointer"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 200, 100, 0.9) 0%, rgba(255, 150, 0, 0.8) 30%, rgba(255, 100, 100, 0.7) 60%, rgba(200, 50, 255, 0.6) 100%)',
                boxShadow: '0 0 100px rgba(255, 150, 0, 0.5), 0 0 200px rgba(255, 100, 100, 0.3), 0 0 300px rgba(200, 50, 255, 0.2)',
                animation: 'sentient-pulse 4s ease-in-out infinite'
              }}
            >
              {/* Liquid Interior */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orange-300/60 to-purple-500/60 animate-pulse"></div>
              
              {/* AI Consciousness Core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white font-medium">
                  <div className="text-4xl mb-2">🧠</div>
                  <div className="text-lg">I'm listening...</div>
                </div>
              </div>
              
              {/* Conversation Particles */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full opacity-70"
                    style={{
                      left: `${15 + i * 8}%`,
                      top: `${25 + (i % 4) * 15}%`,
                      animation: `float ${3 + i * 0.3}s ease-in-out infinite ${i * 0.5}s`
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Orbiting Interface Elements */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">💬</span>
              </div>
              <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 w-10 h-10 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm">🎤</span>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">🔮</span>
              </div>
              <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm">✨</span>
              </div>
            </div>
          </div>
          
          {/* Floating Message Display */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 max-w-md">
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <p className="text-white text-lg mb-4">
                Hi! I'm your AI assistant. What would you like to order today?
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white"
                  onClick={() => {
                    console.log('Voice interaction');
                  }}
                >
                  🎤 Speak
                </Button>
                <Button 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/20"
                  onClick={() => {
                    console.log('Type interaction');
                  }}
                >
                  ⌨️ Type
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-transparent pointer-events-none">
        {/* Sentient AI Orb - Fixed center position */}
        <div className={`absolute top-0 left-0 right-0 flex justify-center pointer-events-auto z-[200] ${
          isAnimating ? 'animate-morph-to-center' : ''
        }`}>
          <Button
            onClick={handleChatToggle}
            className={`w-16 h-16 rounded-full border-0 shadow-2xl relative overflow-hidden sentient-orb transition-all duration-300 ${
              isAnimating ? 'pointer-events-none' : ''
            }`}
            style={{ transform: 'translateY(-8px)' }}
          >
            {/* Tiny rotating stars positioned around the orb */}
            <div className="absolute inset-0 w-full h-full pointer-events-none text-white">
              <svg className="absolute ai-cascade-1" style={{ width: '1.5px', height: '1.5px', top: '20%', left: '15%', transform: 'rotate(45deg)' }} viewBox="0 0 24 24" fill="white">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
              </svg>
              <svg className="absolute ai-cascade-2" style={{ width: '1.5px', height: '1.5px', top: '75%', left: '80%', transform: 'rotate(-67deg)', animationDelay: '1.8s' }} viewBox="0 0 24 24" fill="white">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
              </svg>
              <svg className="absolute ai-cascade-3" style={{ width: '1.5px', height: '1.5px', top: '30%', left: '85%', transform: 'rotate(123deg)', animationDelay: '2.5s' }} viewBox="0 0 24 24" fill="white">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
              </svg>
              <svg className="absolute ai-cascade-4" style={{ width: '1.5px', height: '1.5px', top: '10%', left: '70%', transform: 'rotate(-89deg)', animationDelay: '0.9s' }} viewBox="0 0 24 24" fill="white">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
              </svg>
              <svg className="absolute ai-cascade-1" style={{ width: '1.5px', height: '1.5px', top: '60%', left: '5%', transform: 'rotate(156deg)', animationDelay: '3.2s' }} viewBox="0 0 24 24" fill="white">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
              </svg>
              <svg className="absolute ai-cascade-2" style={{ width: '1.5px', height: '1.5px', top: '90%', left: '50%', transform: 'rotate(-201deg)', animationDelay: '1.4s' }} viewBox="0 0 24 24" fill="white">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
              </svg>
            </div>
            
            {/* Orb Core */}
            <div className="orb-core w-full h-full"></div>
            
            {/* Energy particles */}
            <div className="orb-energy-particle" style={{ top: '20%', left: '15%', animationDelay: '0s' }}></div>
            <div className="orb-energy-particle" style={{ top: '70%', left: '25%', animationDelay: '0.7s' }}></div>
            <div className="orb-energy-particle" style={{ top: '30%', right: '20%', animationDelay: '1.4s' }}></div>
            <div className="orb-energy-particle" style={{ bottom: '25%', right: '15%', animationDelay: '2.1s' }}></div>
            <div className="orb-energy-particle" style={{ top: '50%', left: '45%', animationDelay: '1.2s' }}></div>
          </Button>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex items-center justify-around bg-transparent pointer-events-auto py-4 px-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"
            onClick={() => setLocation('/orderfi-home')}
          >
            <Home className="h-4 w-4 text-orange-500" />
            <span className="text-xs">Home</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600"
            onClick={() => setLocation('/dashboard')}
          >
            <Calendar className="h-4 w-4 text-orange-500" />
            <span className="text-xs">Orders</span>
          </Button>
        </div>
      </div>
    </div>
  );
}