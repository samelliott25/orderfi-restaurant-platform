import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";
import { 
  BarChart3, 
  Menu, 
  Settings, 
  Users, 
  ShoppingCart, 
  Package, 
  CreditCard, 
  Megaphone, 
  TrendingUp, 
  Shield, 
  Plug,
  Bot,
  ChefHat,
  DollarSign,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import mimiDashboardLogo from "@assets/mimidashboardtext_1750333406399.webp";

const navigation = [
  {
    name: "Live Sales Dashboard",
    href: "/admin",
    icon: BarChart3,
    description: "Real-time sales & order tracking"
  },
  {
    name: "Menu Management", 
    href: "/admin/menu",
    icon: ChefHat,
    description: "Items, categories, modifiers"
  },
  {
    name: "AI Agent Training",
    href: "/admin/ai-training", 
    icon: Bot,
    description: "Voice, FAQs, upsell logic"
  },
  {
    name: "User & Staff Management",
    href: "/admin/users",
    icon: Users,
    description: "Roles, permissions, schedules"
  },
  {
    name: "Orders Management",
    href: "/admin/orders",
    icon: ShoppingCart,
    description: "Track, fulfill, customer service"
  },
  {
    name: "Inventory Management",
    href: "/admin/inventory",
    icon: Package,
    description: "Stock levels, suppliers, alerts"
  },
  {
    name: "Payments & Billing",
    href: "/admin/payments",
    icon: CreditCard,
    description: "Transactions, refunds, accounting"
  },
  {
    name: "Marketing & Promotions",
    href: "/admin/marketing",
    icon: Megaphone,
    description: "Campaigns, discounts, loyalty"
  },
  {
    name: "Analytics & Reports",
    href: "/admin/analytics",
    icon: TrendingUp,
    description: "Performance metrics, insights"
  },
  {
    name: "$MIMI Rewards",
    href: "/admin/rewards",
    icon: DollarSign,
    description: "Crypto earnings, network revenue"
  },
  {
    name: "Blockchain Database",
    href: "/admin/blockchain",
    icon: Database,
    description: "Decentralized menu storage & verification"
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "General configuration"
  },
  {
    name: "Security & Privacy",
    href: "/admin/security",
    icon: Shield,
    description: "Data protection, compliance"
  },
  {
    name: "Integrations",
    href: "/admin/integrations",
    icon: Plug,
    description: "Third-party connections"
  }
];

interface DashboardSidebarProps {
  className?: string;
}

const SIDEBAR_SCROLL_KEY = 'admin-sidebar-scroll-position';

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const [location] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Save scroll position to localStorage
  const saveScrollPosition = (scrollTop: number) => {
    localStorage.setItem(SIDEBAR_SCROLL_KEY, scrollTop.toString());
  };

  // Get saved scroll position from localStorage
  const getSavedScrollPosition = (): number => {
    const saved = localStorage.getItem(SIDEBAR_SCROLL_KEY);
    return saved ? parseInt(saved, 10) : 0;
  };

  // Restore scroll position after navigation
  useEffect(() => {
    const restoreScroll = () => {
      if (scrollContainerRef.current) {
        const savedPosition = getSavedScrollPosition();
        scrollContainerRef.current.scrollTop = savedPosition;
      }
    };

    // Multiple attempts to restore scroll position
    const timeouts = [0, 10, 50, 100, 200];
    const timeoutIds = timeouts.map(delay => 
      setTimeout(restoreScroll, delay)
    );

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [location]);

  // Handle scroll events to save position
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    saveScrollPosition(scrollTop);
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col border-r" style={{ backgroundColor: '#ffe6b0', borderColor: '#e5cf97' }}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-center px-6 border-b" style={{ borderColor: '#e5cf97' }}>
        <img 
          src={mimiDashboardLogo} 
          alt="Mimi Dashboard" 
          className="h-20 w-auto"
        />
      </div>

      {/* Navigation */}
      <div 
        className="flex-1 px-4 py-6 overflow-y-auto"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        <div className="mb-4">
          <span className="text-xs font-medium uppercase tracking-wider px-3" style={{ color: '#8b795e' }}>General</span>
        </div>
        <nav className="space-y-1 mb-6">
          {navigation.slice(0, 5).map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/admin" && location?.startsWith(item.href));
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className="group flex items-center rounded-lg p-3 text-sm font-medium transition-all hover:opacity-80"
                  style={{
                    backgroundColor: isActive ? '#8b795e' : 'transparent',
                    color: isActive ? 'white' : '#654321'
                  }}
                >
                  <item.icon className="h-5 w-5 shrink-0" style={{ color: isActive ? 'white' : '#8b795e' }} />
                  <span className="ml-3 truncate">{item.name.replace(' Dashboard', '').replace(' Management', '')}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mb-4">
          <span className="text-xs font-medium uppercase tracking-wider px-3" style={{ color: '#8b795e' }}>Tools</span>
        </div>
        <nav className="space-y-1">
          {navigation.slice(5).map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/admin" && location?.startsWith(item.href));
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className="group flex items-center rounded-lg p-3 text-sm font-medium transition-all hover:opacity-80"
                  style={{
                    backgroundColor: isActive ? '#8b795e' : 'transparent',
                    color: isActive ? 'white' : '#654321'
                  }}
                >
                  <item.icon className="h-5 w-5 shrink-0" style={{ color: isActive ? 'white' : '#8b795e' }} />
                  <span className="ml-3 truncate">{item.name.replace(' & ', ' & ').replace(' Management', '')}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="border-t p-4" style={{ borderColor: '#e5cf97' }}>
        <Button asChild variant="ghost" className="w-full justify-start hover:opacity-80" style={{ color: '#654321' }}>
          <Link href="/mobile-chat">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            Log out
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:block h-screen", className)}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="m-4">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}