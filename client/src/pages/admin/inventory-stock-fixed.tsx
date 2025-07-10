import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar } from '@/components/Sidebar';
import { CustomerAiChat } from '@/components/CustomerAiChat';
import { useChatContext } from '@/contexts/ChatContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import "@/styles/mobile-fix.css";

export default function InventoryStockPageFixed() {
  const [, setLocation] = useLocation();
  const { isSidebarMode, isOpen, setIsOpen } = useChatContext();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="h-screen bg-background overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area - FIXED LAYOUT */}
      <div 
        className="h-full bg-background transition-all duration-300 relative" 
        style={{ 
          marginLeft: isMobile ? '0px' : '256px',
          marginRight: '0px', // Remove dynamic chat margin
        }}
      >
        <ScrollArea className="h-full w-full bg-transparent">
          <div className="w-full min-w-0 p-6">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-normal tracking-tight playwrite-font">
                Inventory Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Stock levels, reorder points, and supplier management
              </p>
            </div>

            {/* Page Content */}
            <div data-testid="inventory-page-fixed" className="space-y-6">
              {/* Header Stats */}
              <div className="flex flex-col space-y-3 mb-6 w-full">
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,247</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>
                
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">23</div>
                    <p className="text-xs text-muted-foreground">Need reorder</p>
                  </CardContent>
                </Card>
                
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">7</div>
                    <p className="text-xs text-muted-foreground">Immediate action needed</p>
                  </CardContent>
                </Card>
                
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">$45,892</div>
                    <p className="text-xs text-muted-foreground">+5.4% from last week</p>
                  </CardContent>
                </Card>
              </div>

              {/* Coming Soon */}
              <Card>
                <CardHeader>
                  <CardTitle className="rock-salt-font" style={{ color: 'hsl(25, 95%, 53%)' }}>
                    Inventory Stock Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Advanced Inventory Tracking</h3>
                    <p className="text-muted-foreground mb-6">
                      Comprehensive stock management with real-time tracking, automated reordering, and supplier integration.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge variant="outline">Real-time Stock Levels</Badge>
                      <Badge variant="outline">Automated Reordering</Badge>
                      <Badge variant="outline">Supplier Management</Badge>
                      <Badge variant="outline">Cost Tracking</Badge>
                      <Badge variant="outline">Analytics & Reports</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* AI Chat Dialog */}
      <CustomerAiChat isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
    </div>
  );
}