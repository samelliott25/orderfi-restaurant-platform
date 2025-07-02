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
  Printer,
  Menu,
  Search,
  Wallet,
  Settings,
  HelpCircle,
  CreditCard,
  Moon,
  Sun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";



const menuItems = [
  { id: "home", path: "/orderfi-home", label: "Home", icon: Home },
  { id: "landing", path: "/landing-page", label: "Landing Page", icon: MessageCircle },
  { id: "dashboard", path: "/dashboard", label: "Restaurant Dashboard", icon: LayoutDashboard },
  { id: "rewards", path: "/tokenrewards", label: "Token Rewards", icon: Coins },
  { id: "network", path: "/network", label: "Network & Printing", icon: Printer },
  { id: "inventory", path: "/inventory", label: "Inventory Management", icon: Settings },
  { id: "orders", path: "/admin/orders", label: "Order History", icon: Search },
  { id: "payments", path: "/payments", label: "Payments", icon: CreditCard },
];



export function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [location] = useLocation();
  const { isConnected, walletInfo, isConnecting, connect, disconnect } = useWallet();
  const { theme, setTheme } = useTheme();

  return (
    <>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
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
                  className="wallet-orb-button w-full mb-3 text-white shadow-lg transition-all duration-300 transform hover:scale-105 sentient-orb relative overflow-hidden"
                  size="lg"
                  disabled={isConnecting}
                >
                  {/* Rotating stars around wallet button */}
                  <div className="wallet-star-field">
                    <svg className="absolute wallet-cascade-1" style={{ width: '1.5px', height: '1.5px', top: '20%', left: '15%', transform: 'rotate(45deg)', animationDelay: '0.5s' }} viewBox="0 0 24 24" fill="white">
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                    </svg>
                    <svg className="absolute wallet-cascade-2" style={{ width: '1.5px', height: '1.5px', top: '75%', left: '80%', transform: 'rotate(-67deg)', animationDelay: '1.8s' }} viewBox="0 0 24 24" fill="white">
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                    </svg>
                    <svg className="absolute wallet-cascade-3" style={{ width: '1.5px', height: '1.5px', top: '30%', left: '85%', transform: 'rotate(123deg)', animationDelay: '2.5s' }} viewBox="0 0 24 24" fill="white">
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                    </svg>
                    <svg className="absolute wallet-cascade-4" style={{ width: '1.5px', height: '1.5px', top: '10%', left: '70%', transform: 'rotate(-89deg)', animationDelay: '0.9s' }} viewBox="0 0 24 24" fill="white">
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                    </svg>
                  </div>
                  
                  {/* Orb Core */}
                  <div className="orb-core"></div>
                  
                  {/* Directional lighting overlay */}
                  <div className="orb-lighting-overlay"></div>
                  
                  <Wallet className="h-5 w-5 mr-2 relative z-20" />
                  <span className="relative z-20">{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
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
            
            <div className="space-y-2">
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
              
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="w-full gap-2 justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="ml-2">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
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