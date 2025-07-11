import { StandardLayout } from "@/components/StandardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, DollarSign, Target } from "lucide-react";
import "@/styles/mobile-fix.css";

export default function ReportingPage() {
  return (
    <StandardLayout 
      title="Reporting & Analytics"
      subtitle="Sales reports, performance metrics, and business insights"
    >
      <div data-testid="reporting-page" className="space-y-6">
        {/* Header Stats - Responsive Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Today's Revenue</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">$14,530</p>
              <p className="text-xs text-green-600 font-medium">+8.2% from yesterday</p>
            </div>
            <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Performance Score</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">94%</p>
              <p className="text-xs text-purple-600 font-medium">Above target</p>
            </div>
            <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Growth Rate</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">+15.3%</p>
              <p className="text-xs text-blue-600 font-medium">Monthly growth</p>
            </div>
            <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Reports Generated</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">42</p>
              <p className="text-xs text-muted-foreground">This month</p>
            </div>
            <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Reporting Content */}
      <Card>
        <CardHeader>
          <CardTitle className="playwrite-font">Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Sales Reports</Badge>
              <Badge variant="outline">Customer Analytics</Badge>
              <Badge variant="outline">Menu Performance</Badge>
              <Badge variant="outline">Staff Metrics</Badge>
              <Badge variant="outline">Financial Insights</Badge>
              <Badge variant="outline">Operational KPIs</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </StandardLayout>
  );
}