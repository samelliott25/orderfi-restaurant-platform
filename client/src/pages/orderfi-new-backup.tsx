import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { StandardLayout } from '@/components/StandardLayout';
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
import { MarbleOrb } from '@/components/MarbleOrb';
import type { Restaurant, MenuItem } from '@shared/schema';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  menuItems?: string[];
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

interface SpecialItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface RecentOrder {
  id: string;
  items: string;
  total: number;
  status: 'delivered' | 'in-progress' | 'preparing';
  date: string;
}

export default function OrderFiNew() {
  const [restaurantId] = useState(1);
  const [, setLocation] = useLocation();
  const [availableTokens] = useState(1250);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for today's specials
  const todaysSpecials: SpecialItem[] = [
    {
      id: 1,
      name: "Spicy Thai Curry",
      description: "Authentic Thai flavors with coconut milk",
      price: 12.99
    },
    {
      id: 2,
      name: "Buffalo Wings",
      description: "Crispy wings with spicy buffalo sauce",
      price: 9.99
    }
  ];

  // Mock data for recent orders
  const recentOrders: RecentOrder[] = [
    {
      id: "1",
      items: "Spicy Thai Curry, Buffalo Wings",
      total: 22.98,
      status: "delivered",
      date: "2025-01-05"
    },
    {
      id: "2",
      items: "Margherita Pizza",
      total: 14.99,
      status: "in-progress",
      date: "2025-01-04"
    }
  ];

  const quickActions: QuickAction[] = [
    {
      icon: <Search className="h-4 w-4" />,
      label: "Browse Menu",
      action: () => setLocation('/menu')
    },
    {
      icon: <ShoppingCart className="h-4 w-4" />,
      label: "My Cart",
      action: () => setLocation('/cart')
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Order History",
      action: () => setLocation('/orders')
    },
    {
      icon: <Gift className="h-4 w-4" />,
      label: "Rewards",
      action: () => setLocation('/rewards')
    }
  ];

  return (
    <StandardLayout>
      <div className={`transition-opacity duration-700 ease-in-out overflow-x-hidden ${
        isPageLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <ScrollArea className="flex-1 border-none pb-2">
          <div className="space-y-4 py-4 px-4">
            {/* Token Rewards */}
            <div>
              <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">OrderFi Tokens</h3>
                        <p className="text-sm text-orange-600">{availableTokens} available tokens</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                        ${(availableTokens * 0.1).toFixed(2)}
                      </p>
                      <p className="text-xs opacity-90">Earn tokens with every order • 1 token = $0.10</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Specials */}
            <div className="mt-8">
              <h3 className="section-heading mb-3">Today's Specials</h3>
              <div className="space-y-3">
                {todaysSpecials.map((special) => (
                  <Card key={special.id} className="bg-transparent border-orange-200/30 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-foreground">{special.name}</h4>
                          <p className="text-xs text-orange-700 mt-1">{special.description}</p>
                          <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 font-bold text-sm mt-2">${special.price}</p>
                        </div>
                        <Button size="sm" className="slick-button bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white">
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h3 className="section-heading mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="slick-button elevated-card relative flex flex-col items-center gap-2 h-16 bg-gradient-to-br from-background to-muted border-2 border-orange-200 hover:border-orange-300 transition-all duration-200 active:scale-95 overflow-hidden group"
                    onClick={action.action}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 to-orange-500/0 group-hover:from-orange-400/10 group-hover:to-orange-500/15 transition-all duration-300 rounded-md"></div>
                    <div className="relative z-10 text-orange-500 scale-110 group-hover:text-orange-600 transition-colors duration-200">
                      {action.icon}
                    </div>
                    <span className="relative z-10 text-xs font-semibold text-foreground group-hover:text-orange-700 transition-colors duration-200">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="mt-8">
              <h3 className="section-heading mb-3">Recent Orders</h3>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <Card key={order.id} className="bg-transparent border-orange-200/30 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-foreground">{order.items}</h4>
                          <p className="text-xs text-orange-700 mt-1">{order.date}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {order.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 font-bold text-sm">${order.total}</p>
                          <Button size="sm" variant="outline" className="mt-2 text-xs">
                            Reorder
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </StandardLayout>
  );
}