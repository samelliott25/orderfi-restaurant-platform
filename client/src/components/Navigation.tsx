import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useWallet } from "@/hooks/useWallet";
import { WalletConnectDialog } from "@/components/WalletConnectDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { 
  Home, 
  MessageCircle, 
  LayoutDashboard, 
  Coins, 
  Menu,
  Search,
  Wallet,
  Settings,
  HelpCircle,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";



const menuItems = [
  { id: "home", path: "/", label: "Home", icon: Home },
  { id: "orderfi", path: "/orderfi", label: "Order with AI", icon: MessageCircle },
  { id: "dashboard", path: "/dashboard", label: "Restaurant Dashboard", icon: LayoutDashboard },
  { id: "rewards", path: "/orderfi", label: "Token Rewards", icon: Coins },
  { id: "menu", path: "/admin/menu", label: "Menu Management", icon: Settings },
  { id: "orders", path: "/admin/orders", label: "Order History", icon: Search },
  { id: "payments", path: "/admin/payments", label: "Payments", icon: CreditCard },
];



export function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [location] = useLocation();
  const { isConnected, walletInfo, isConnecting, connect, disconnect } = useWallet();

  return (
    <>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="fixed top-4 right-4 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">OrderFi </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              AI Restaurant Platform
            </p>
          </div>
          
          {/* Navigation Items */}
          <div className="flex-1 p-4 bg-white dark:bg-gray-900">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                
                return (
                  <Link key={item.id} href={item.path}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-12",
                        isActive 
                          ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            {/* Wallet Connection Button */}
            {!isConnected ? (
              <WalletConnectDialog>
                <Button
                  className="w-full mb-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
                  size="lg"
                  disabled={isConnecting}
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              </WalletConnectDialog>
            ) : (
              <div className="mb-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Wallet Connected
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 truncate">
                      {walletInfo?.address.slice(0, 6)}...{walletInfo?.address.slice(-4)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnect}
                  className="w-full mt-2 border-red-200 text-red-600 hover:bg-red-50"
                >
                  Disconnect
                </Button>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Help
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
    
    <SettingsDialog 
      isOpen={showSettings} 
      onClose={() => setShowSettings(false)} 
    />
    </>
  );
}

export function SearchBar() {
  // Search functionality moved to bottom chat interfaces on OrderFi and Dashboard pages
  return null;
}