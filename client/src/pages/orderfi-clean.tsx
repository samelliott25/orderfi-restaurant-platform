import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { HamburgerMenu } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mic, 
  MicOff, 
  Send, 
  Search, 
  Heart, 
  Gift, 
  Home, 
  Menu, 
  ShoppingCart,
  Calendar,
  Bell,
  User,
  Sparkles,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/theme-provider';
import { ThreeOrb } from '@/components/ThreeOrb';
import type { Restaurant, MenuItem } from '@shared/schema';

export default function OrderFiClean() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Mock data for development
  const cartItemCount = 3;

  const handleChatToggle = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    if (isChatExpanded) {
      setIsChatExpanded(false);
    } else {
      setIsChatExpanded(true);
    }
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleOrbTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsHolding(true);
    
    // Start recording after holding for 500ms
    const recordingTimer = setTimeout(() => {
      if (isHolding) {
        setIsRecording(true);
        // Haptic feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }
    }, 500);
    
    // Clean up timer if touch ends early
    const cleanup = () => {
      clearTimeout(recordingTimer);
    };
    
    // Store cleanup function for touch end
    (e.target as any).cleanup = cleanup;
  };

  const handleOrbTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    
    // Clean up recording timer
    if ((e.target as any).cleanup) {
      (e.target as any).cleanup();
    }
    
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setIsHolding(false);
      
      // Process voice recording here
      toast({
        title: "Voice message recorded",
        description: "Processing your voice input...",
      });
    } else if (isHolding) {
      // Quick tap - open text input
      setIsHolding(false);
      const input = prompt('Type your message:');
      if (input && input.trim()) {
        toast({
          title: "Message sent",
          description: input,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* OrderFi Header */}
      <div className="fixed top-0 left-0 right-0 z-[7000] bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-orange-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo with Animated Stars */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 flex items-center justify-center overflow-hidden">
              {/* Tiny rotating stars around mini orb */}
              <div className="absolute inset-0 w-full h-full pointer-events-none text-white">
                <svg className="absolute ai-cascade-1" style={{ width: '2px', height: '2px', top: '15%', left: '10%' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                <svg className="absolute ai-cascade-2" style={{ width: '2px', height: '2px', top: '75%', left: '80%' }} viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
              </div>
              <span className="text-white text-xs font-bold relative z-10">✦</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" style={{ fontFamily: 'Playwrite AU VIC, cursive' }}>
                OrderFi
              </h1>
            </div>
          </div>
          
          <HamburgerMenu />
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="h-screen pt-16 pb-2">
        <div className="px-4 space-y-6">
          {/* Welcome Section */}
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Welcome to OrderFi</h2>
            <p className="text-muted-foreground">Experience AI-powered ordering with our advanced conversational interface</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-orange-100 to-pink-100 border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">150+</div>
                <div className="text-sm text-orange-700">Menu Items</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-pink-100 to-purple-100 border-pink-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-pink-600">4.9★</div>
                <div className="text-sm text-pink-700">Customer Rating</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>

      {/* Clean Orb Chat Experience */}
      {isChatExpanded && (
        <div className={`fixed inset-0 z-[8000] flex items-center justify-center animate-in fade-in duration-300 ${isKeyboardOpen ? 'items-start pt-20' : 'items-center'}`}>
          {/* Blurred Background */}
          <div className="absolute inset-0 looking-glass-background"></div>
          
          {/* Close Button */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsChatExpanded(false)}
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
          >
            ×
          </Button>

          {/* Pure Three.js Orb */}
          <div className="relative">
            <ThreeOrb 
              onTouchStart={handleOrbTouchStart}
              onTouchEnd={handleOrbTouchEnd}
              className="animate-in zoom-in duration-500 delay-200 hover:scale-105 transition-transform"
            />
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-[999] bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-orange-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-around py-3 px-4">
          {/* Home */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/orderfi-home')}
            className="flex flex-col items-center gap-1 text-orange-600 hover:text-orange-700 hover:bg-orange-100"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>

          {/* AI Chat Button - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4">
            <Button
              onClick={handleChatToggle}
              disabled={isAnimating}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border-4 border-white dark:border-gray-800"
              style={{
                boxShadow: isAnimating 
                  ? '0 0 30px rgba(249, 115, 22, 0.8)' 
                  : '0 8px 25px rgba(0, 0, 0, 0.15)',
              }}
            >
              <Sparkles className="h-6 w-6" />
            </Button>
          </div>

          {/* Orders */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/admin/orders')}
            className="flex flex-col items-center gap-1 text-orange-600 hover:text-orange-700 hover:bg-orange-100 relative"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-xs">Orders</span>
            {cartItemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}