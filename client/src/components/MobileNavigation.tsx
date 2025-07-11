import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Settings,
  Brain,
  ChevronLeft,
  ChevronRight,
  Bot,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
  color?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard', color: 'text-blue-600' },
  { id: 'inventory', label: 'Inventory', icon: Package, path: '/inventory', badge: 3, color: 'text-orange-600' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/orders', badge: 12, color: 'text-green-600' },
  { id: 'payments', label: 'Payments', icon: DollarSign, path: '/payments', color: 'text-purple-600' },
  { id: 'staff', label: 'Staff', icon: Users, path: '/staff', color: 'text-pink-600' },
  { id: 'stock', label: 'Stock', icon: Package, path: '/stock', color: 'text-yellow-600' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', color: 'text-gray-600' },
];

// Animated AI orb component
const AIOrb = ({ isActive, onClick }: { isActive: boolean; onClick: () => void }) => {
  return (
    <div className="relative">
      <Button
        onClick={onClick}
        className={`
          relative w-16 h-16 rounded-full p-0 border-4 border-white shadow-lg overflow-hidden
          transition-all duration-300 ease-out
          ${isActive ? 'scale-110 shadow-2xl' : 'scale-100 hover:scale-105'}
        `}
        style={{
          background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)',
          animation: isActive ? 'pulse-glow 2s ease-in-out infinite' : 'none'
        }}
      >
        {/* Animated stars */}
        <div className="absolute inset-0 overflow-hidden">
          <Sparkles 
            className="absolute top-1 left-1 w-3 h-3 text-white animate-pulse" 
            style={{ animationDelay: '0s' }}
          />
          <Sparkles 
            className="absolute top-2 right-2 w-2 h-2 text-white animate-pulse" 
            style={{ animationDelay: '0.5s' }}
          />
          <Sparkles 
            className="absolute bottom-2 left-2 w-2 h-2 text-white animate-pulse" 
            style={{ animationDelay: '1s' }}
          />
        </div>
        
        {/* Central brain icon */}
        <Brain className="w-8 h-8 text-white z-10 relative" />
        
        {/* Pulsing ring */}
        {isActive && (
          <div className="absolute inset-0 rounded-full border-2 border-white opacity-60 animate-ping" />
        )}
      </Button>
      
      {/* AI label */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-orange-600">
        AI
      </div>
    </div>
  );
};

export default function MobileNavigation({ onChatToggle }: { onChatToggle: () => void }) {
  const [location] = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isChatActive, setIsChatActive] = useState(false);
  
  const maxScroll = Math.max(0, (navItems.length * 80) - 280); // Approximate scroll width
  
  const handleScroll = (direction: 'left' | 'right') => {
    const scrollAmount = 160; // Scroll by 2 icons
    if (direction === 'left') {
      setScrollPosition(Math.max(0, scrollPosition - scrollAmount));
    } else {
      setScrollPosition(Math.min(maxScroll, scrollPosition + scrollAmount));
    }
  };

  const handleChatToggle = () => {
    setIsChatActive(!isChatActive);
    onChatToggle();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg" />
      
      <div className="relative px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left scroll button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleScroll('left')}
            className={`p-2 rounded-full ${scrollPosition > 0 ? 'opacity-100' : 'opacity-30'}`}
            disabled={scrollPosition <= 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Scrollable navigation icons */}
          <div className="flex-1 overflow-hidden mx-3">
            <div 
              className="flex items-center gap-4 transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${scrollPosition}px)` }}
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                
                return (
                  <Link key={item.id} href={item.path}>
                    <div className="flex flex-col items-center min-w-[60px] group">
                      <div className="relative">
                        <div className={`
                          p-2 rounded-xl transition-all duration-200
                          ${isActive 
                            ? 'bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                          }
                        `}>
                          <Icon className={`
                            w-6 h-6 transition-colors duration-200
                            ${isActive ? 'text-white' : item.color || 'text-gray-600'}
                          `} />
                        </div>
                        
                        {/* Badge */}
                        {item.badge && (
                          <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      
                      <span className={`
                        text-xs mt-1 font-medium transition-colors duration-200
                        ${isActive ? 'text-orange-600' : 'text-gray-500'}
                      `}>
                        {item.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right scroll button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleScroll('right')}
            className={`p-2 rounded-full ${scrollPosition < maxScroll ? 'opacity-100' : 'opacity-30'}`}
            disabled={scrollPosition >= maxScroll}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Center AI ChatOps button */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-8">
          <AIOrb isActive={isChatActive} onClick={handleChatToggle} />
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.5); }
          50% { box-shadow: 0 0 30px rgba(249, 115, 22, 0.8); }
        }
      `}</style>
    </div>
  );
}