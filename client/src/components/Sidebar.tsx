import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWallet } from "@/hooks/useWallet";
import { WalletConnectDialog } from "@/components/WalletConnectDialog";

import { useTheme } from "@/components/theme-provider";
import { useChatContext } from "@/contexts/ChatContext";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
  Send,
  RefreshCw,
  Box
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
    // Persist sidebar state in localStorage
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });
  const [location, setLocation] = useLocation();
  const { isConnected, walletInfo, isConnecting, connect, disconnect } = useWallet();
  const { theme, setTheme } = useTheme();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const { toast } = useToast();
  
  // ChatOps state
  const [showChatOpsDialog, setShowChatOpsDialog] = useState(false);
  const [chatOpsMessage, setChatOpsMessage] = useState('');
  const [chatOpsLoading, setChatOpsLoading] = useState(false);
  const [chatOpsHistory, setChatOpsHistory] = useState<Array<{message: string, response: string, timestamp: string}>>([]);
  const [contextualSuggestions, setContextualSuggestions] = useState<string[]>([]);

  const handleExitApp = () => {
    setShowExitDialog(false);
    setLocation('/landing-page');
  };

  // Generate contextual suggestions based on current page
  const getContextualSuggestions = (currentPath: string) => {
    const pathSuggestions = {
      '/dashboard': [
        'Show me today\'s sales performance',
        'Generate daily revenue report',
        'Check order completion rates'
      ],
      '/inventory': [
        'Check for low stock items',
        'Create purchase orders for restocking',
        'Generate inventory valuation report'
      ],
      '/inventory-simplified': [
        'Check for low stock items',
        'Create purchase orders for restocking',
        'Generate inventory valuation report'
      ],
      '/orders': [
        'Show pending orders',
        'Process order refunds',
        'Generate order completion report'
      ],
      '/payments': [
        'Record supplier payment',
        'Generate payment summary',
        'Show outstanding invoices'
      ],
      '/tokenrewards': [
        'Check reward point balances',
        'Generate loyalty program report',
        'Process token redemptions'
      ],
      '/stock': [
        'Perform stock count verification',
        'Create purchase orders for low stock',
        'Generate supplier invoices'
      ],
      '/staff': [
        'Show staff performance metrics',
        'Generate payroll report',
        'Check staff scheduling'
      ],
      '/reporting': [
        'Generate comprehensive business report',
        'Show profit and loss analysis',
        'Create tax preparation summary'
      ]
    };
    
    return pathSuggestions[currentPath] || [
      'Show me today\'s business overview',
      'Generate daily operations report',
      'Check system status'
    ];
  };

  // ChatOps automation function
  const handleChatOps = async (message: string) => {
    setChatOpsLoading(true);
    
    try {
      const response = await fetch('/api/chatops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          restaurantId: 1
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const newEntry = {
          message,
          response: result.message || JSON.stringify(result.result),
          timestamp: new Date().toLocaleTimeString()
        };
        
        setChatOpsHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
        
        toast({
          title: "ChatOps Executed",
          description: result.action || "Command processed successfully",
        });
      } else {
        toast({
          title: "ChatOps Error",
          description: result.error || "Failed to process command",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to ChatOps system",
        variant: "destructive",
      });
    } finally {
      setChatOpsLoading(false);
      setChatOpsMessage('');
    }
  };

  const handleChatOpsSubmit = () => {
    if (chatOpsMessage.trim()) {
      handleChatOps(chatOpsMessage.trim());
    }
  };

  // Enhanced ChatOps button click handler
  const handleChatOpsClick = () => {
    setContextualSuggestions(getContextualSuggestions(location));
    setShowChatOpsDialog(true);
  };

  // Update CSS custom property for sidebar width and persist state
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '64px' : '256px');
    localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
  }, [isCollapsed]);

  return (
    <>
      <div className={`fixed left-0 top-0 z-40 h-screen h-[100dvh] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${isCollapsed ? 'p-3' : 'px-6 py-4'}`}>
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
                    <h2 className="text-xl font-normal text-gray-900 dark:text-white playwrite-font">
                      OrderFi
                    </h2>
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
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full font-normal transition-colors h-10 ${
                        isCollapsed 
                          ? 'justify-center p-2' 
                          : 'justify-start text-left px-3'
                      } ${
                        isActive 
                          ? "bg-[hsl(215,50%,68%)] text-white hover:bg-[hsl(215,50%,63%)]" 
                          : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      title={isCollapsed ? item.label : undefined}

                    >
                      <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
                      {!isCollapsed && <span className="font-normal">{item.label}</span>}
                    </Button>
                  </Link>
                );
              })}
            </nav>
            
            {/* AI Assistant Chat Orb */}
            <div className={`${isCollapsed ? 'px-2 py-3' : 'px-4 py-3'} border-t border-gray-200 dark:border-gray-800`}>
              <div className="flex items-center justify-center">
                <Button
                  onClick={handleChatOpsClick}
                  size={isCollapsed ? "sm" : "lg"}
                  className={`relative overflow-hidden border-0 shadow-lg transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${
                    isCollapsed ? 'w-8 h-8 p-0' : 'w-full'
                  } ${
                    showChatOpsDialog 
                      ? 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 hover:from-orange-500 hover:via-red-600 hover:to-pink-700' 
                      : 'bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 hover:from-orange-600 hover:via-red-700 hover:to-pink-800'
                  }`}
                  style={{
                    background: showChatOpsDialog 
                      ? 'conic-gradient(from 0deg, #F5A623, #f97316, #ec4899, #F5A623)' 
                      : 'linear-gradient(135deg, #F5A623 0%, #f97316 50%, #ec4899 100%)',
                    borderRadius: isCollapsed ? '50%' : '12px'
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
                </Button>
              </div>
            </div>
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
                        <p className="text-sm font-normal text-green-800 dark:text-green-200">
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
                
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-normal text-gray-700 dark:text-gray-300">Theme</span>
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

                {/* Exit App Button */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowExitDialog(true)}
                  className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <DoorOpen className="h-4 w-4 mr-2" />
                  Exit App
                </Button>
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

                {/* Collapsed Exit App */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowExitDialog(true)}
                  className="w-full h-10 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Exit App"
                >
                  <DoorOpen className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced ChatOps Dialog */}
      <Dialog open={showChatOpsDialog} onOpenChange={setShowChatOpsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot size={20} />
              ChatOps Automation
            </DialogTitle>
            <DialogDescription>
              Smart automation for {location === '/inventory' || location === '/inventory-simplified' ? 'inventory management' : 
                location === '/stock' ? 'stock operations' : 
                location === '/orders' ? 'order processing' : 
                location === '/payments' ? 'payment processing' : 
                location === '/dashboard' ? 'business operations' : 'restaurant operations'}. 
              Commands are contextual to your current page.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Contextual Suggestions */}
            {contextualSuggestions.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Bot size={16} />
                  Suggested for {location === '/inventory' || location === '/inventory-simplified' ? 'Inventory' : 
                    location === '/stock' ? 'Stock' : 
                    location === '/orders' ? 'Orders' : 
                    location === '/payments' ? 'Payments' : 
                    location === '/dashboard' ? 'Dashboard' : 'Current Page'}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {contextualSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleChatOps(suggestion)}
                      disabled={chatOpsLoading}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Command Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter automation command..."
                value={chatOpsMessage}
                onChange={(e) => setChatOpsMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatOpsSubmit()}
                disabled={chatOpsLoading}
              />
              <Button 
                onClick={handleChatOpsSubmit}
                disabled={chatOpsLoading || !chatOpsMessage.trim()}
              >
                {chatOpsLoading ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </Button>
            </div>

            {/* ChatOps History */}
            {chatOpsHistory.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <Label className="text-sm font-medium">Recent Commands</Label>
                {chatOpsHistory.map((entry, index) => (
                  <Card key={index} className="p-3">
                    <div className="text-sm">
                      <div className="font-medium text-blue-600 mb-1">
                        {entry.timestamp}: {entry.message}
                      </div>
                      <div className="text-muted-foreground">
                        {entry.response}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you sure you're leaving?</DialogTitle>
            <DialogDescription>
              You'll be taken back to the landing page and any unsaved changes may be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowExitDialog(false)}
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