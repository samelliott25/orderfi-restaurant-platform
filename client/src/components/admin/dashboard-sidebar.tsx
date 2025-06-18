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
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Bot className="h-8 w-8 text-primary" />
        <span className="ml-2 text-xl font-bold">Mimi Admin</span>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-6">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/admin" && location?.startsWith(item.href));
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "group flex flex-col rounded-lg p-3 text-sm transition-all hover:bg-accent",
                    isActive && "bg-accent text-accent-foreground font-medium"
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="ml-3 truncate">{item.name}</span>
                  </div>
                  <span className="mt-1 ml-7 text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom Actions */}
      <div className="border-t p-4">
        <Button asChild variant="outline" className="w-full">
          <Link href="/mobile-chat">
            View Customer App
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:block", className)}>
        <div className="flex h-screen w-64 flex-col border-r bg-background">
          <SidebarContent />
        </div>
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