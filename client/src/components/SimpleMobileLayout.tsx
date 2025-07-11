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
  Sparkles
} from 'lucide-react';

interface SimpleMobileLayoutProps {
  children: React.ReactNode;
  title?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
  color?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard-mobile-simple', color: 'text-blue-600' },
  { id: 'inventory', label: 'Inventory', icon: Package, path: '/inventory', badge: 3, color: 'text-orange-600' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/orders', badge: 12, color: 'text-green-600' },
  { id: 'payments', label: 'Payments', icon: DollarSign, path: '/payments', color: 'text-purple-600' },
  { id: 'staff', label: 'Staff', icon: Users, path: '/staff', color: 'text-pink-600' },
  { id: 'stock', label: 'Stock', icon: Package, path: '/stock', color: 'text-yellow-600' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', color: 'text-gray-600' },
];

export default function SimpleMobileLayout({ children, title }: SimpleMobileLayoutProps) {
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
    // Here you would integrate with your actual chat system
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 pb-20">
      {/* Header */}
      {title && (
        <div className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b border-white/20 px-4 py-3 shadow-lg">
          <h1 className="text-lg font-semibold text-center playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>

      {/* Full Mobile Navigation with Scrollable Icons */}
      <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-t border-white/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-pink-500/5"></div>
        <div className="relative px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left scroll button */}
            <button
              onClick={() => handleScroll('left')}
              className={`p-2 rounded-full transition-all duration-300 ${
                scrollPosition > 0 
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 opacity-50'
              }`}
              disabled={scrollPosition <= 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Scrollable Navigation Items */}
            <div className="flex-1 mx-4">
              <div className="relative overflow-hidden">
                <div 
                  className="flex items-center transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${scrollPosition}px)` }}
                >
                  {navItems.map((item, index) => {
                    const IconComponent = item.icon;
                    const isActive = location === item.path;
                    
                    return (
                      <Link key={item.id} href={item.path}>
                        <div className="flex-shrink-0 mx-2">
                          <button
                            className={`
                              relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300
                              ${isActive 
                                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg scale-105' 
                                : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:scale-105'
                              }
                            `}
                          >
                            <IconComponent className="w-6 h-6 mb-1" />
                            <span className="text-xs font-medium">{item.label}</span>
                            
                            {/* Badge for notifications */}
                            {item.badge && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {item.badge}
                              </div>
                            )}
                          </button>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right scroll button */}
            <button
              onClick={() => handleScroll('right')}
              className={`p-2 rounded-full transition-all duration-300 ${
                scrollPosition < maxScroll 
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 opacity-50'
              }`}
              disabled={scrollPosition >= maxScroll}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Central AI ChatOps Button */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-8">
            <div className="relative">
              <button
                onClick={handleChatToggle}
                className={`
                  relative w-16 h-16 rounded-full p-0 border-4 border-white shadow-2xl overflow-hidden 
                  transition-all duration-300 hover:scale-110 hover:shadow-3xl group
                  ${isChatActive ? 'scale-110 shadow-3xl' : ''}
                `}
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)'
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
                {isChatActive && (
                  <div className="absolute inset-0 rounded-full border-2 border-white opacity-60 animate-ping" />
                )}
              </button>
              
              {/* AI label */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                ChatOps
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}