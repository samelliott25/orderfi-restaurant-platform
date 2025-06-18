import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
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
  ChefHat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
    description: "Queue, history, routing"
  },
  {
    name: "Inventory Management", 
    href: "/admin/inventory",
    icon: Package,
    description: "Stock tracking, alerts"
  },
  {
    name: "Payments & Transactions",
    href: "/admin/payments",
    icon: CreditCard,
    description: "Gateway, refunds, tips"
  },
  {
    name: "Marketing & Loyalty",
    href: "/admin/marketing",
    icon: Megaphone,
    description: "Promos, campaigns, QR codes"
  },
  {
    name: "Analytics & Reports",
    href: "/admin/analytics",
    icon: TrendingUp,
    description: "Insights, heatmaps, trends"
  },
  {
    name: "Settings & Config",
    href: "/admin/settings",
    icon: Settings,
    description: "Restaurant, hours, branding"
  },
  {
    name: "Security & Audit",
    href: "/admin/security",
    icon: Shield,
    description: "Logs, access, sessions"
  },
  {
    name: "Integrations",
    href: "/admin/integrations",
    icon: Plug,
    description: "APIs, webhooks, sync"
  }
];

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const [location] = useLocation();

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#1a1a1a] text-white">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Bot className="h-8 w-8 text-purple-400" />
        <span className="ml-3 text-xl font-bold">mimi</span>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="mb-4">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3">General</span>
        </div>
        <nav className="space-y-1 mb-6">
          {navigation.slice(0, 5).map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/admin" && location?.startsWith(item.href));
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "group flex items-center rounded-lg p-3 text-sm font-medium transition-all hover:bg-gray-800",
                    isActive && "bg-gray-800 text-white"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0 text-gray-400" />
                  <span className="ml-3 truncate">{item.name.replace(' Dashboard', '').replace(' Management', '')}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mb-4">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3">Tools</span>
        </div>
        <nav className="space-y-1">
          {navigation.slice(5).map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/admin" && location?.startsWith(item.href));
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "group flex items-center rounded-lg p-3 text-sm font-medium transition-all hover:bg-gray-800",
                    isActive && "bg-gray-800 text-white"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0 text-gray-400" />
                  <span className="ml-3 truncate">{item.name.replace(' & ', ' & ').replace(' Management', '')}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom Actions */}
      <div className="border-t border-gray-700 p-4">
        <Button asChild variant="ghost" className="w-full text-white hover:bg-gray-800 justify-start">
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