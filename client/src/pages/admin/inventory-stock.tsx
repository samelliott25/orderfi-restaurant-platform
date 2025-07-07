import { StandardLayoutWithSidebar } from "@/components/StandardLayoutWithSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

export default function InventoryStockPage() {
  return (
    <StandardLayoutWithSidebar 
      title="Inventory Management"
      subtitle="Stock levels, reorder points, and supplier management"
    >
      <div className="p-6 space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">23</div>
              <p className="text-xs text-muted-foreground">Need reorder</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">7</div>
              <p className="text-xs text-muted-foreground">Immediate action needed</p>
            </CardContent>
          </Card>
          
          <Card>
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
            <CardTitle className="carter-one-font" style={{ color: 'hsl(25, 95%, 53%)' }}>
              Inventory Stock Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Advanced Inventory Tracking</h3>
              <p className="text-muted-foreground mb-4">
                Complete stock management with automated reordering, supplier integration, and cost tracking.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">Real-time Stock Levels</Badge>
                <Badge variant="outline">Automated Reorder Points</Badge>
                <Badge variant="outline">Supplier Management</Badge>
                <Badge variant="outline">Cost Analysis</Badge>
                <Badge variant="outline">Waste Tracking</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StandardLayoutWithSidebar>
  );
}