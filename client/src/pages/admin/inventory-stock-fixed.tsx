import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Sidebar } from '@/components/Sidebar';
import { CustomerAiChat } from '@/components/CustomerAiChat';
import { useChatContext } from '@/contexts/ChatContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

export default function InventoryStockPageFixed() {
  const { isOpen, setIsOpen } = useChatContext();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Collapsed by default */}
      <aside className="flex-shrink-0 w-16">
        <Sidebar />
      </aside>
      
      {/* Main Content Area - Full width to screen edge */}
      <main className="flex-1 overflow-auto bg-background w-full">
        <div className="w-full min-w-0 p-4 sm:p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-normal tracking-tight playwrite-font">
              Inventory Management
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Stock levels, reorder points, and supplier management
            </p>
          </div>

          {/* Page Content */}
          <div data-testid="inventory-page-fixed" className="space-y-6">
            {/* Header Stats - Responsive Grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-orange-600">23</div>
                  <p className="text-xs text-muted-foreground">Need reorder</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-red-600">7</div>
                  <p className="text-xs text-muted-foreground">Immediate action needed</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">$45,892</div>
                  <p className="text-xs text-muted-foreground">+5.4% from last week</p>
                </CardContent>
              </Card>
            </div>

            {/* Coming Soon */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="rock-salt-font text-lg sm:text-xl" style={{ color: 'hsl(25, 95%, 53%)' }}>
                  Inventory Stock Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 sm:py-12">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Inventory Tracking</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Comprehensive stock management with real-time tracking, automated reordering, and supplier integration.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="outline" className="text-xs sm:text-sm">Real-time Stock Levels</Badge>
                    <Badge variant="outline" className="text-xs sm:text-sm">Automated Reordering</Badge>
                    <Badge variant="outline" className="text-xs sm:text-sm">Supplier Management</Badge>
                    <Badge variant="outline" className="text-xs sm:text-sm">Cost Tracking</Badge>
                    <Badge variant="outline" className="text-xs sm:text-sm">Analytics & Reports</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* AI Chat Dialog */}
      <CustomerAiChat isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
    </div>
  );
}