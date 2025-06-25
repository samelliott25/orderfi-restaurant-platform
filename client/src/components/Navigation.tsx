import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Home, 
  MessageCircle, 
  LayoutDashboard, 
  Coins, 
  Menu,
  Search,
  User,
  Settings,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";



const menuItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/orderfi", label: "Order with AI", icon: MessageCircle },
  { path: "/dashboard", label: "Restaurant Dashboard", icon: LayoutDashboard },
  { path: "/web3-order", label: "Token Rewards", icon: Coins },
  { path: "/admin/menu", label: "Menu Management", icon: Settings },
  { path: "/admin/orders", label: "Order History", icon: Search },
  { path: "/admin/payments", label: "Payments", icon: User },
];



export function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="fixed top-4 left-4 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 p-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Mimi Waitress
            </h2>
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
                  <Link key={item.path} href={item.path}>
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
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Restaurant Admin
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Loose Moose
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <Button variant="ghost" size="sm" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Help
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="fixed top-4 right-4 left-16 z-40">
      <div className="max-w-md ml-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu, orders, settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}