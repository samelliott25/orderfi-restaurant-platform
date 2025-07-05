import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { WalletConnectDialog } from "@/components/WalletConnectDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { useTheme } from "@/components/theme-provider";
import React, { useState, useEffect } from "react";
import { 
  Home, 
  ShoppingCart, 
  Settings, 
  ChefHat, 
  Sun, 
  Moon,
  Wallet,
  LogOut,
  BarChart3,
  Users,
  FileText,
  CreditCard,
  TrendingUp,
  Package,
  Settings2,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const menuItems = [
  { icon: Home, label: "Home", href: "/orderfi-home" },
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
  const [showSettings, setShowSettings] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [location] = useLocation();
  const { isConnected, walletInfo, isConnecting, connect, disconnect } = useWallet();
  const { theme, setTheme } = useTheme();

  // Update CSS custom property for sidebar width
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '64px' : '320px');
  }, [isCollapsed]);

  return (
    <>
      <div className={`fixed left-0 top-0 z-40 h-screen transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isCollapsed ? 'w-16' : 'w-80'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${isCollapsed ? 'p-3' : 'p-6'}`}>
            <div className="flex items-center justify-between">
              {!isCollapsed ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden relative sentient-orb-mini">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="absolute inset-0 w-full h-full pointer-events-none text-white">
                        <svg className="w-1 h-1 absolute ai-cascade-1" style={{ top: '25%', left: '12%', transform: 'rotate(45deg)' }} viewBox="0 0 24 24" fill="white">
                          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                        </svg>
                        <svg className="w-1 h-1 absolute ai-cascade-2" style={{ top: '72%', left: '18%', transform: 'rotate(-67deg)' }} viewBox="0 0 24 24" fill="white">
                          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                        </svg>
                        <svg className="w-1 h-1 absolute ai-cascade-3" style={{ top: '15%', left: '50%', transform: 'rotate(123deg)', animationDelay: '1.5s' }} viewBox="0 0 24 24" fill="white">
                          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                        </svg>
                      </div>
                      <svg className="w-5 h-5 text-white relative z-10 ai-star-pulse star-no-rotate" viewBox="0 0 24 24" fill="white">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white playwrite-font">OrderFi</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      AI Restaurant Platform
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full flex justify-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden relative sentient-orb-mini">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="absolute inset-0 w-full h-full pointer-events-none text-white">
                        <svg className="w-0.5 h-0.5 absolute ai-cascade-1" style={{ top: '25%', left: '12%', transform: 'rotate(45deg)' }} viewBox="0 0 24 24" fill="white">
                          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                        </svg>
                        <svg className="w-0.5 h-0.5 absolute ai-cascade-2" style={{ top: '72%', left: '18%', transform: 'rotate(-67deg)' }} viewBox="0 0 24 24" fill="white">
                          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                        </svg>
                        <svg className="w-0.5 h-0.5 absolute ai-cascade-3" style={{ top: '15%', left: '50%', transform: 'rotate(123deg)', animationDelay: '1.5s' }} viewBox="0 0 24 24" fill="white">
                          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                        </svg>
                      </div>
                      <svg className="w-4 h-4 text-white relative z-10 ai-star-pulse star-no-rotate" viewBox="0 0 24 24" fill="white">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Collapse Button */}
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
          <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'p-2' : 'p-4'}`}>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full font-medium transition-colors ${
                        isCollapsed 
                          ? 'justify-center p-2 h-10' 
                          : 'justify-start text-left'
                      } ${
                        isActive 
                          ? "bg-[hsl(215,25%,65%)] text-white hover:bg-[hsl(215,25%,60%)]" 
                          : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
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
          <div className={`border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${isCollapsed ? 'p-2 space-y-2' : 'p-4 space-y-3'}`}>
            {!isCollapsed ? (
              <>
                {/* Wallet Connection Button */}
                {!isConnected ? (
                  <WalletConnectDialog>
                    <Button
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg transition-all duration-300"
                      size="lg"
                      disabled={isConnecting}
                    >
                      <Wallet className="h-5 w-5 mr-2" />
                      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                    </Button>
                  </WalletConnectDialog>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <Wallet className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          Wallet Connected
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {walletInfo?.address?.slice(0, 6)}...{walletInfo?.address?.slice(-4)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={disconnect}
                        className="h-8 w-8 p-0 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 hover:bg-green-100 dark:hover:bg-green-900/40"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Settings Button */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="w-full text-sm border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Collapsed Wallet Status */}
                {!isConnected ? (
                  <WalletConnectDialog>
                    <Button
                      className="w-full h-10 p-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg transition-all duration-300"
                      disabled={isConnecting}
                      title="Connect Wallet"
                    >
                      <Wallet className="h-5 w-5" />
                    </Button>
                  </WalletConnectDialog>
                ) : (
                  <div className="w-full h-10 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                )}
                
                {/* Collapsed Settings */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="w-full h-10 p-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  title="Settings"
                >
                  <Settings className="h-5 w-5" />
                </Button>
                
                {/* Collapsed Theme Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="w-full h-10 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  title="Toggle Theme"
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <SettingsDialog 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </>
  );
}