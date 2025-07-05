import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWallet } from "@/hooks/useWallet";
import { WalletConnectDialog } from "@/components/WalletConnectDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { useTheme } from "@/components/theme-provider";
import { 
  Home, 
  ShoppingCart, 
  Settings, 
  Menu, 
  ChefHat, 
  Sun, 
  Moon,
  Search,
  Wallet,
  LogOut,
  BarChart3,
  Users,
  FileText,
  CreditCard,
  TrendingUp,
  Package,
  Settings2
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

export function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

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
          
          {/* Scrollable Content */}
          <ScrollArea className="flex-1">
            <div className="p-4 bg-white dark:bg-gray-900">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start text-left font-medium transition-colors ${
                          isActive 
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600" 
                            : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </nav>
              
              {/* Wallet Connection Button */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-4">
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
                  className="w-full mb-3 text-sm border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
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
              </div>
            </div>
          </ScrollArea>
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