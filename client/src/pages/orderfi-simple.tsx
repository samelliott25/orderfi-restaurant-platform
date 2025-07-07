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
import type { Restaurant, MenuItem } from '@shared/schema';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  menuItems?: string[];
}

export default function OrderFiSimple() {
  const [, setLocation] = useLocation();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Simple fade-in effect
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen bg-background transition-opacity duration-500 ease-in-out ${
      isPageLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg rock-salt-font">OrderFi</h1>
            <p className="text-sm text-muted-foreground">Smart Restaurant Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <HamburgerMenu />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Welcome to OrderFi!</h2>
          <p className="text-muted-foreground mb-6">Your AI-powered restaurant assistant is ready to help.</p>
          
          <Button 
            onClick={() => setLocation('/dashboard')}
            className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white"
          >
            Go Back Home
          </Button>
        </div>
      </div>
    </div>
  );
}