import { StandardLayoutWithSidebar } from "@/components/StandardLayoutWithSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, DollarSign, Target } from "lucide-react";

export default function ReportingPage() {
  return (
    <StandardLayoutWithSidebar 
      title="Reporting & Analytics"
      subtitle="Sales reports, performance metrics, and business insights"
    >
      <div className="p-6 space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$14,530</div>
              <p className="text-xs text-muted-foreground">+8.2% vs yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">567</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">$25.61</div>
              <p className="text-xs text-muted-foreground">+2.4% this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">4.8</div>
              <p className="text-xs text-muted-foreground">out of 5.0 stars</p>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon */}
        <Card>
          <CardHeader>
            <CardTitle className="playwrite-font" style={{ color: 'hsl(25, 95%, 53%)' }}>
              Advanced Reporting & Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Comprehensive Business Intelligence</h3>
              <p className="text-muted-foreground mb-4">
                Advanced analytics dashboard with real-time insights, custom reports, and predictive analytics.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">Sales Analytics</Badge>
                <Badge variant="outline">Customer Insights</Badge>
                <Badge variant="outline">Menu Performance</Badge>
                <Badge variant="outline">Profit Margins</Badge>
                <Badge variant="outline">Custom Reports</Badge>
                <Badge variant="outline">Export Data</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StandardLayoutWithSidebar>
  );
}