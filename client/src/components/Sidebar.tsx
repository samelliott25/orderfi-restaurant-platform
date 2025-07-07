import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useChatContext } from '@/contexts/ChatContext';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WalletConnectDialog } from '@/components/WalletConnectDialog';
import { 
  BarChart3, 
  ChefHat, 
  ShoppingCart, 
  Users,
  FileText,
  Sun,
  Moon,
  LogOut,
  CreditCard,
  TrendingUp,
  Package,
  Settings2,
  X,
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  Sparkles,
  Wallet
} from "lucide-react";

const menuItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: ChefHat, label: "Inventory", href: "/inventory" },
  { icon: ShoppingCart, label: "Orders", href: "/orders" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: TrendingUp, label: "Token Rewards", href: "/tokenrewards" },
  { icon: Package, label: "Stock", href: "/stock" },
  { icon: Users, label: "Staff", href: "/staff" },
  { icon: FileText, label: "Reporting", href: "/reporting" },
  { icon: Settings2, label: "Settings", href: "/settings" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { isOpen: isChatOpen, setIsOpen: setChatOpen } = useChatContext();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Mock wallet connection state
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '64px' : '256px');
    localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
  }, [isCollapsed]);

  return (
    <div className={`fixed left-0 top-0 z-40 h-screen transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={`border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${isCollapsed ? 'p-3' : 'px-6 py-4'}`}>
          <div className="flex items-center justify-between">
            {!isCollapsed ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white playwrite-font">OrderFi</h2>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted ${isCollapsed ? 'ml-0' : ''}`}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Navigation Items */}
        <div className={`flex-1 min-h-0 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          <nav className="space-y-1 h-full overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full font-medium transition-colors h-10 ${
                      isCollapsed 
                        ? 'justify-center p-2' 
                        : 'justify-start text-left px-3'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Footer Actions */}
        <div className={`shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${isCollapsed ? 'p-1 space-y-1' : 'p-2 space-y-1'}`}>
          {!isCollapsed ? (
            <>
              {/* AI Chat Button */}
              <Button
                onClick={() => setChatOpen(!isChatOpen)}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg transition-all duration-300 font-medium"
                size="sm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI Chat
              </Button>

              {/* Logout Button */}
              <Link href="/landing-page">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium border border-red-200 dark:border-red-800"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </Link>

              {/* Wallet Connection */}
              {!isConnected ? (
                <WalletConnectDialog>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg transition-all duration-300"
                    size="sm"
                    disabled={isConnecting}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </Button>
                </WalletConnectDialog>
              ) : (
                <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-300 dark:border-green-600">
                    Wallet Connected
                  </Badge>
                </div>
              )}

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 mr-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </Button>
            </>
          ) : (
            <>
              {/* Collapsed AI Chat */}
              <Button
                onClick={() => setChatOpen(!isChatOpen)}
                className="w-full h-8 p-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg transition-all duration-300"
                title="AI Chat"
              >
                <Sparkles className="h-4 w-4" />
              </Button>

              {/* Collapsed Logout */}
              <Link href="/landing-page">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full h-8 p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </Link>

              {/* Collapsed Wallet */}
              {!isConnected ? (
                <WalletConnectDialog>
                  <Button
                    className="w-full h-8 p-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg transition-all duration-300"
                    disabled={isConnecting}
                    title="Connect Wallet"
                  >
                    <Wallet className="h-4 w-4" />
                  </Button>
                </WalletConnectDialog>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 p-1 text-green-600 dark:text-green-400 border-green-300 dark:border-green-600"
                  title="Wallet Connected"
                >
                  <Wallet className="h-4 w-4" />
                </Button>
              )}

              {/* Collapsed Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-full h-8 p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Toggle Theme"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}