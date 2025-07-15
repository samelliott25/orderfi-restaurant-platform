import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWallet } from "@/hooks/useWallet";
import { WalletConnectDialog } from "@/components/WalletConnectDialog";
// Remove RealTimeStatusIndicator import for now to avoid context issues

import { useTheme } from "@/components/theme-provider";
import { useChatContext } from "@/contexts/ChatContext";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  ShoppingCart, 
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
  ChevronRight,
  DoorOpen,
  Bot,
  Box,
  Smartphone,
  MapPin,
  Brain,
  Activity,
  Mic,
  Timer,
  Clock
} from "lucide-react";

const menuItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Smartphone, label: "Mobile App", href: "/mobileapp" },
  { icon: ShoppingCart, label: "Orders", href: "/orders" },
  { icon: Timer, label: "KDS", href: "/kds" },
  { icon: MapPin, label: "Tables", href: "/tables" },
  { icon: Package, label: "Inventory", href: "/inventory" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: Box, label: "Stock", href: "/stock" },
  { icon: Users, label: "Staff", href: "/staff" },
  { icon: FileText, label: "Reporting", href: "/reporting" },
  { icon: Settings2, label: "Settings", href: "/settings" },
  { icon: TrendingUp, label: "Token Rewards", href: "/tokenrewards" },

];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { isOpen: isChatOpen, setIsOpen: setChatOpen, setIsSidebarMode } = useChatContext();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Persist sidebar state in localStorage
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });
  const [location, setLocation] = useLocation();
  const { isConnected, walletInfo, isConnecting, connect, disconnect } = useWallet();
  const { theme, setTheme } = useTheme();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [metrics, setMetrics] = useState({
    pendingOrders: 23,
    lowStock: 8,
    notifications: 5
  });
  
  // Ref to maintain scroll position
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(prev => ({
        pendingOrders: Math.max(0, prev.pendingOrders + Math.floor(Math.random() * 6) - 3),
        lowStock: Math.max(0, prev.lowStock + Math.floor(Math.random() * 4) - 2),
        notifications: Math.max(0, prev.notifications + Math.floor(Math.random() * 3) - 1)
      }));
    };

    const interval = setInterval(updateMetrics, 15000);
    return () => clearInterval(interval);
  }, []);
  


  const handleExitApp = () => {
    setShowExitDialog(false);
    setLocation('/landing-page');
  };



  // ChatOps button click handler
  const handleChatOpsClick = () => {
    if (!isChatOpen) {
      // Set sidebar mode when opening from sidebar
      setIsSidebarMode(true);
    }
    // Toggle the chat interface
    setChatOpen(!isChatOpen);
  };

  // Update CSS custom property for sidebar width and persist state
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '64px' : '256px');
    localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
    
    // Dispatch custom event to notify StandardLayout of sidebar state change
    window.dispatchEvent(new CustomEvent('sidebarToggle'));
  }, [isCollapsed]);

  // Navigation handler that preserves scroll position
  const handleNavItemClick = React.useCallback((href: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Save current scroll position
    const currentScrollTop = scrollContainerRef.current?.scrollTop || 0;
    
    // Navigate to new page
    setLocation(href);
    
    // Restore scroll position after navigation
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = currentScrollTop;
      }
    });
  }, [setLocation]);

  return (
    <>
      <div className={`flex-shrink-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 relative z-40 shadow-xl ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`border-b border-gray-200/30 dark:border-gray-700/30 backdrop-blur-sm ${isCollapsed ? 'p-3' : 'px-6 py-5'}`}>
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
                    <h2 className="text-2xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent playwrite-font">
                      OrderFi
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100/50 dark:bg-gray-800/50 px-2 py-1 rounded-full backdrop-blur-sm">
                        {currentTime.toLocaleTimeString()}
                      </span>
                      <div className="w-2 h-2 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                    </div>
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
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`h-9 w-9 p-0 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 flex items-center justify-center backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20 ${isCollapsed ? 'ml-0' : ''}`}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {/* Navigation Items */}
          <div 
            ref={scrollContainerRef}
            className={`flex-1 overflow-y-auto ${isCollapsed ? 'p-2' : 'p-4'}`}
          >
            <nav className="space-y-1 sidebar-nav">
              {menuItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={(event) => handleNavItemClick(item.href, event)}
                    className={`w-full font-medium transition-all duration-200 h-11 flex items-center ${
                      isCollapsed 
                        ? 'justify-center p-2' 
                        : 'justify-start text-left px-4'
                    } ${
                      isActive 
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 shadow-lg shadow-blue-500/20 border border-blue-200/50 dark:border-blue-700/50" 
                        : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-blue-900/20 hover:shadow-md"
                    } rounded-xl backdrop-blur-sm`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
                    {!isCollapsed && <span className="font-medium text-current">{item.label}</span>}
                    {!isCollapsed && item.label === 'Orders' && metrics.pendingOrders > 0 && (
                      <Badge variant="secondary" className="ml-auto text-xs bg-orange-100 text-orange-800">
                        {metrics.pendingOrders}
                      </Badge>
                    )}
                    {!isCollapsed && item.label === 'Inventory' && metrics.lowStock > 0 && (
                      <Badge variant="secondary" className="ml-auto text-xs bg-red-100 text-red-800">
                        {metrics.lowStock}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* AI Assistant Chat Orb - Fixed Position */}
          <div className={`${isCollapsed ? 'px-2 py-4' : 'px-4 py-4'}`}>
            <div className="flex items-center justify-center">
              <button
                onClick={handleChatOpsClick}
                className={`relative overflow-hidden border-0 shadow-xl transition-all duration-300 ease-out hover:scale-105 active:scale-95 backdrop-blur-sm ${
                  isCollapsed ? 'w-10 h-10 p-0' : 'w-full h-12'
                } ${
                  isChatOpen 
                    ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600' 
                    : 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700'
                }`}
                style={{
                  background: isChatOpen 
                    ? 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)' 
                    : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                  borderRadius: isCollapsed ? '50%' : '16px',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
                }}
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                </div>
                
                {/* Floating particles - only for expanded mode */}
                {!isCollapsed && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-1 h-1 absolute bg-white/80 rounded-full animate-pulse" 
                         style={{ top: '25%', left: '15%', animationDelay: '0s', animationDuration: '2s' }}></div>
                    <div className="w-1 h-1 absolute bg-white/60 rounded-full animate-pulse" 
                         style={{ top: '60%', left: '75%', animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
                    <div className="w-0.5 h-0.5 absolute bg-white/70 rounded-full animate-pulse" 
                         style={{ top: '40%', left: '85%', animationDelay: '1s', animationDuration: '3s' }}></div>
                    <div className="w-1 h-1 absolute bg-white/50 rounded-full animate-pulse" 
                         style={{ top: '75%', left: '20%', animationDelay: '1.5s', animationDuration: '2.2s' }}></div>
                  </div>
                )}
                
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                  {!isCollapsed && (
                    <span className="text-white font-normal text-sm mr-2">ChatOps</span>
                  )}
                  {/* Use only the essential orb elements */}
                  {isCollapsed ? (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden relative">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="animate-spin" style={{ animationDuration: '8s' }}>
                          <svg className="w-4 h-4 text-white relative z-10" viewBox="0 0 24 24" fill="white">
                            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-5 h-5">
                      {/* Single rotating star with fixed center axis */}
                      <div className="absolute inset-0 flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
                        <svg className="w-5 h-5 text-white drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
          
          {/* Footer Actions - Fixed to Bottom */}
          <div className={`mt-auto border-t border-gray-200/30 dark:border-gray-700/30 bg-gray-50 dark:bg-gray-800 ${isCollapsed ? 'p-2 space-y-2' : 'p-4 space-y-3'} sidebar-nav`}>
            {!isCollapsed ? (
              <>
                {/* Wallet Connection Button */}
                {!isConnected ? (
                  <WalletConnectDialog>
                    <button
                      className="w-full h-11 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-sm hover:shadow-md"
                      disabled={isConnecting}
                    >
                      <Wallet className="h-5 w-5 mr-2" />
                      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                    </button>
                  </WalletConnectDialog>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <Wallet className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-normal text-green-800 dark:text-green-200">
                          Wallet Connected
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {walletInfo?.address?.slice(0, 6)}...{walletInfo?.address?.slice(-4)}
                        </p>
                      </div>
                      <button
                        onClick={disconnect}
                        className="h-8 w-8 p-0 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-md transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="w-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-blue-900/20 rounded-xl p-2 transition-all duration-200 flex items-center justify-center backdrop-blur-sm hover:shadow-md"
                >
                  <div className="relative mr-2">
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute inset-0 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </div>
                  <span className="dark:hidden">Light Mode</span>
                  <span className="hidden dark:inline">Dark Mode</span>
                </button>

                {/* Exit App Button */}
                <button 
                  onClick={() => setShowExitDialog(true)}
                  className="w-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-blue-900/20 rounded-xl p-2 transition-all duration-200 flex items-center justify-center backdrop-blur-sm hover:shadow-md"
                >
                  <DoorOpen className="h-4 w-4 mr-2" />
                  Exit App
                </button>
              </>
            ) : (
              <>
                {/* Collapsed Wallet Status */}
                {!isConnected ? (
                  <WalletConnectDialog>
                    <button
                      className="w-full h-11 p-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-sm hover:shadow-md"
                      disabled={isConnecting}
                      title="Connect Wallet"
                    >
                      <Wallet className="h-5 w-5" />
                    </button>
                  </WalletConnectDialog>
                ) : (
                  <div className="w-full h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                )}
                
                {/* Collapsed Theme Toggle */}
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="w-full h-11 p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-blue-900/20 rounded-xl transition-all duration-200 flex items-center justify-center backdrop-blur-sm hover:shadow-md"
                  title="Toggle Theme"
                >
                  <div className="relative">
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute inset-0 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </div>
                </button>

                {/* Collapsed Exit App */}
                <button 
                  onClick={() => setShowExitDialog(true)}
                  className="w-full h-11 p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 flex items-center justify-center backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20"
                  title="Exit App"
                >
                  <DoorOpen className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>



      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Are you sure you're leaving?</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              You'll be taken back to the landing page and any unsaved changes may be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowExitDialog(false)}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExitApp}
              className="bg-gradient-to-r from-[#F5A623] via-orange-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white"
            >
              Yes, Exit App
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}