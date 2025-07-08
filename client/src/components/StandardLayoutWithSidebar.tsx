import { useState } from 'react';
import { useLocation } from 'wouter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CustomerAiChat } from '@/components/CustomerAiChat';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Menu, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Users, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface StandardLayoutWithSidebarProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showChatButton?: boolean;
  className?: string;
}

export function StandardLayoutWithSidebar({ 
  children, 
  title = "OrderFi Venue Console", 
  subtitle = "Restaurant Management System",
  showChatButton = true,
  className = ""
}: StandardLayoutWithSidebarProps) {
  const [location, setLocation] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'text-slate-600' },
    { name: 'Menu & Items', href: '/inventory', icon: Menu, color: 'text-orange-600' },
    { name: 'Inventory', href: '/inventory-stock', icon: Package, color: 'text-blue-600' },
    { name: 'Orders', href: '/orders', icon: ShoppingCart, color: 'text-green-600' },
    { name: 'Payments', href: '/payments', icon: CreditCard, color: 'text-pink-600' },
    { name: 'Staff & Access', href: '/staff', icon: Users, color: 'text-purple-600' },
    { name: 'Reporting', href: '/reporting', icon: BarChart3, color: 'text-indigo-600' },
    { name: 'Settings', href: '/settings', icon: Settings, color: 'text-gray-600' },
  ];

  return (
    <div className={`h-screen bg-background transition-opacity duration-700 ease-in-out overflow-x-hidden flex ${className}`}>
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-card border-r border-border transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden ai-cosmic-glow relative">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 w-full h-full pointer-events-none text-white">
                  <svg className="w-1 h-1 absolute ai-cascade-1" style={{ top: '25%', left: '12%', transform: 'rotate(45deg)' }} viewBox="0 0 24 24" fill="white">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="w-1 h-1 absolute ai-cascade-2" style={{ top: '72%', left: '18%', transform: 'rotate(-67deg)' }} viewBox="0 0 24 24" fill="white">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                </div>
                {/* Central logo */}
                <svg className="w-3 h-3 text-white counter-rotate-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
              </div>
            </div>
            
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-normal rock-salt-font" style={{ color: 'hsl(25, 95%, 53%)' }}>
                  OrderFi
                </h1>
                <p className="text-xs text-muted-foreground">Venue Console</p>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full justify-start"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!sidebarCollapsed && <span className="ml-2">Collapse</span>}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-2">
          <nav className="space-y-1">
            {sidebarNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${isActive ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' : ''}`}
                  onClick={() => setLocation(item.href)}
                >
                  <Icon className={`h-4 w-4 ${sidebarCollapsed ? 'mx-auto' : 'mr-2'} ${isActive ? 'text-white' : item.color}`} />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Logout */}
        <div className="p-4 border-t border-border flex-shrink-0">
          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start mb-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setLocation('/customer')}
          >
            <LogOut className={`h-4 w-4 ${sidebarCollapsed ? 'mx-auto' : 'mr-2'}`} />
            {!sidebarCollapsed && <span>Log out</span>}
          </Button>
          
          {/* Version Info */}
          <div className="text-xs text-muted-foreground">
            {!sidebarCollapsed && (
              <div>
                <p>MVP Venue Console</p>
                <p>v1.0.0</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-card border-b border-border">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-normal rock-salt-font" style={{ color: 'hsl(25, 95%, 53%)' }}>
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Restaurant ID: <span className="font-mono">001</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <ScrollArea className="h-full bg-transparent">
            <div className="pb-2">
              {children}
            </div>
          </ScrollArea>
        </div>

        {/* AI Chat Button placeholder - functionality moved to StandardLayout */}
        {showChatButton && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[200]">
            {/* Chat functionality handled by main StandardLayout */}
          </div>
        )}
      </div>
    </div>
  );
}