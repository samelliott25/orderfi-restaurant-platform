import React from 'react';
import { useLocation } from 'wouter';
import { Home, ShoppingCart, User, Settings, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/dashboard', icon: Activity, label: 'Dashboard' },
  { href: '/mobileapp', icon: ShoppingCart, label: 'Menu' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function KleurvormBottomNav() {
  const [location, navigate] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-kleurvorm-light-blue z-50">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 transition-all duration-200',
                isActive 
                  ? 'text-kleurvorm-blue' 
                  : 'text-kleurvorm-black/60 hover:text-kleurvorm-blue'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}