import { Home, ShoppingCart, ClipboardList, User, Search } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useCartContext } from '@/contexts/CartContext';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

interface BottomNavigationProps {
  className?: string;
}

export function BottomNavigation({ className }: BottomNavigationProps) {
  const [location] = useLocation();
  const { getTotalItems } = useCartContext();
  
  const navItems: NavItem[] = [
    {
      icon: <Home className="h-5 w-5" />,
      label: 'Menu',
      href: '/mobileapp'
    },
    {
      icon: <Search className="h-5 w-5" />,
      label: 'Search',
      href: '/search'
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: 'Cart',
      href: '/cart',
      badge: getTotalItems()
    },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      label: 'Orders',
      href: '/order-status'
    },
    {
      icon: <User className="h-5 w-5" />,
      label: 'Profile',
      href: '/profile'
    }
  ];

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border",
      "px-4 py-2 safe-area-inset-bottom",
      className
    )}>
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200",
                "min-w-[60px] min-h-[60px] relative",
                isActive 
                  ? "bg-gradient-to-r from-orange-500/10 to-pink-500/10 text-orange-500" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}>
                <div className="relative">
                  {item.icon}
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-1 font-medium",
                  isActive ? "text-orange-500" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}