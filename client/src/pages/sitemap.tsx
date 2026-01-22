import { Link } from "wouter";
import { 
  MessageSquare, 
  QrCode, 
  ShoppingCart, 
  CreditCard, 
  Clock,
  LayoutDashboard,
  Package,
  ClipboardList,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  Grid3X3,
  ChefHat,
  Bot,
  LogIn,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SitemapPage() {
  const customerPages = [
    { path: "/order", name: "AI Ordering", icon: MessageSquare, description: "Conversational food ordering" },
    { path: "/scan", name: "QR Scan", icon: QrCode, description: "Scan table code to start" },
    { path: "/login", name: "Login", icon: LogIn, description: "Customer sign in" },
    { path: "/cart", name: "Cart", icon: ShoppingCart, description: "View your order" },
    { path: "/checkout", name: "Checkout", icon: CreditCard, description: "Complete payment" },
    { path: "/order-status/demo", name: "Order Status", icon: Clock, description: "Track your order" },
  ];

  const managerPages = [
    { path: "/manage", name: "AI Management", icon: Bot, description: "Natural language operations", primary: true },
    { path: "/", name: "Dashboard", icon: LayoutDashboard, description: "Analytics overview" },
    { path: "/inventory", name: "Inventory", icon: Package, description: "Stock levels" },
    { path: "/orders", name: "Orders", icon: ClipboardList, description: "Order management" },
    { path: "/payments", name: "Payments", icon: DollarSign, description: "Payment records" },
    { path: "/staff", name: "Staff", icon: Users, description: "Team management" },
    { path: "/reporting", name: "Reporting", icon: BarChart3, description: "Reports & analytics" },
    { path: "/settings", name: "Settings", icon: Settings, description: "App configuration" },
    { path: "/tables", name: "Tables", icon: Grid3X3, description: "Table layout" },
    { path: "/kds", name: "Kitchen Display", icon: ChefHat, description: "Kitchen orders" },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 playwrite-font text-orange-500 mb-2">
            OrderFi AI
          </h1>
          <p className="text-gray-600">Site Map</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-2 border-orange-200">
            <CardHeader className="bg-orange-50">
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <MessageSquare className="w-5 h-5" />
                Customer Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {customerPages.map((page) => (
                  <Link key={page.path} href={page.path}>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <page.icon className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{page.name}</p>
                        <p className="text-sm text-gray-500">{page.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <LayoutDashboard className="w-5 h-5" />
                Business Management
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {managerPages.map((page) => (
                  <Link key={page.path} href={page.path}>
                    <div className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group ${page.primary ? 'bg-orange-50 border border-orange-200' : ''}`}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${page.primary ? 'bg-orange-500' : 'bg-gray-100'}`}>
                        <page.icon className={`w-5 h-5 ${page.primary ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${page.primary ? 'text-orange-600' : 'text-gray-800'}`}>{page.name}</p>
                        <p className="text-sm text-gray-500">{page.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-500">
            Primary entry points: <span className="font-medium text-orange-600">/order</span> (customers) and <span className="font-medium text-orange-600">/manage</span> (managers)
          </p>
        </div>
      </div>
    </div>
  );
}
