import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StandardLayout from '@/components/StandardLayout';
import { ExecutiveSummary } from '@/components/dashboard/ExecutiveSummary';
import { OperationalView } from '@/components/dashboard/OperationalView';
import { AnalyticsView } from '@/components/dashboard/AnalyticsView';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';


import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Brain,
  RefreshCw,
  Settings,
  Bell,
  MessageSquare,
  X
} from 'lucide-react';

export default function DashboardPhase2() {
  const [activeTab, setActiveTab] = useState('executive');
  const [chartView, setChartView] = useState('revenue'); // 'revenue', 'orders', 'hybrid'


  // Set document title
  useEffect(() => {
    document.title = "Dashboard - OrderFi";
    return () => {
      document.title = "OrderFi";
    };
  }, []);

  // Mock data for Operational View
  const liveOrders = [
    {
      id: 'ORD-001',
      customerName: 'Sarah Johnson',
      items: ['Cheeseburger', 'Fries', 'Coke'],
      status: 'preparing' as const,
      timeElapsed: 12,
      table: 'A3',
      priority: 'normal' as const,
      total: 24.50,
      estimatedTime: 15,
      specialInstructions: 'No onions, extra pickles'
    },
    {
      id: 'ORD-002',
      customerName: 'Mike Chen',
      items: ['Pizza Margherita', 'Caesar Salad'],
      status: 'ready' as const,
      timeElapsed: 18,
      table: 'B7',
      priority: 'high' as const,
      total: 32.75,
      estimatedTime: 20
    },
    {
      id: 'ORD-003',
      customerName: 'Emma Wilson',
      items: ['Pasta Carbonara', 'Garlic Bread', 'Wine'],
      status: 'preparing' as const,
      timeElapsed: 22,
      table: 'C2',
      priority: 'urgent' as const,
      total: 45.25,
      estimatedTime: 18,
      specialInstructions: 'Allergy: nuts'
    }
  ];

  const alerts = [
    {
      id: 'ALERT-001',
      type: 'urgent' as const,
      title: 'Order Overdue',
      message: 'Order #ORD-003 is 4 minutes overdue. Customer may be waiting.',
      timestamp: new Date(Date.now() - 240000), // 4 minutes ago
      actions: [
        {
          label: 'Check Kitchen',
          onClick: () => console.log('Check kitchen')
        },
        {
          label: 'Notify Customer',
          onClick: () => console.log('Notify customer')
        }
      ]
    },
    {
      id: 'ALERT-002',
      type: 'warning' as const,
      title: 'Low Stock Alert',
      message: 'Burger patties are running low (< 10 remaining)',
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      actions: [
        {
          label: 'Reorder',
          onClick: () => console.log('Reorder')
        }
      ]
    }
  ];

  // Mock data for Analytics View
  const analyticsData = {
    salesTrends: [
      { period: 'Mon', revenue: 2400, orders: 45, customers: 38 },
      { period: 'Tue', revenue: 2800, orders: 52, customers: 44 },
      { period: 'Wed', revenue: 3200, orders: 58, customers: 49 },
      { period: 'Thu', revenue: 2600, orders: 48, customers: 41 },
      { period: 'Fri', revenue: 4200, orders: 76, customers: 62 },
      { period: 'Sat', revenue: 4800, orders: 85, customers: 71 },
      { period: 'Sun', revenue: 3400, orders: 62, customers: 54 }
    ],
    inventoryForecasting: [
      {
        item: 'Burger Patties',
        currentStock: 25,
        predictedDemand: 45,
        reorderPoint: 30,
        accuracy: 96
      },
      {
        item: 'Pizza Dough',
        currentStock: 15,
        predictedDemand: 22,
        reorderPoint: 20,
        accuracy: 93
      },
      {
        item: 'Salad Mix',
        currentStock: 8,
        predictedDemand: 18,
        reorderPoint: 15,
        accuracy: 91
      }
    ],
    wastePatterns: [
      { category: 'Vegetables', amount: 12.5, cost: 87.50, trend: 'down' as const },
      { category: 'Bread', amount: 8.2, cost: 24.60, trend: 'up' as const },
      { category: 'Dairy', amount: 6.8, cost: 45.20, trend: 'stable' as const }
    ],
    aiInsights: [
      {
        id: 'INSIGHT-001',
        type: 'recommendation' as const,
        title: 'Optimize Menu Pricing',
        description: 'Analysis shows 15% price increase on premium items could boost revenue by $2,400/month with minimal impact on orders.',
        impact: 'high' as const,
        confidence: 87,
        actions: [
          'Increase burger prices by $2.50',
          'Add premium toppings option',
          'Test pricing for 2 weeks'
        ]
      },
      {
        id: 'INSIGHT-002',
        type: 'opportunity' as const,
        title: 'Peak Hour Staffing',
        description: 'Friday 6-8 PM shows 25% longer wait times. Adding one kitchen staff could reduce wait times by 40%.',
        impact: 'medium' as const,
        confidence: 92,
        actions: [
          'Schedule additional kitchen staff',
          'Implement prep workflow optimization',
          'Monitor customer satisfaction scores'
        ]
      }
    ]
  };



  return (
    <StandardLayout title="Dashboard" subtitle="Mobile-Optimized Restaurant Management">
        <div className="space-y-8 animate-fade-in-down">

          {/* Multi-Metric Analytics Chart */}
          <div className="liquid-glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {chartView === 'revenue' ? 'Daily Revenue' : 
                 chartView === 'orders' ? 'Daily Orders' : 
                 'Multi-Metric Overview'}
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant={chartView === 'revenue' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartView('revenue')}
                  className="liquid-glass-nav-item text-xs"
                >
                  Revenue
                </Button>
                <Button
                  variant={chartView === 'orders' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartView('orders')}
                  className="liquid-glass-nav-item text-xs"
                >
                  Orders
                </Button>
                <Button
                  variant={chartView === 'hybrid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartView('hybrid')}
                  className="liquid-glass-nav-item text-xs"
                >
                  Overlay
                </Button>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { name: 'Mon', revenue: 2400, orders: 45, customers: 38, avgOrder: 53.33 },
                  { name: 'Tue', revenue: 1398, orders: 32, customers: 28, avgOrder: 43.69 },
                  { name: 'Wed', revenue: 9800, orders: 78, customers: 65, avgOrder: 125.64 },
                  { name: 'Thu', revenue: 3908, orders: 54, customers: 47, avgOrder: 72.37 },
                  { name: 'Fri', revenue: 4800, orders: 69, customers: 58, avgOrder: 69.57 },
                  { name: 'Sat', revenue: 3800, orders: 58, customers: 49, avgOrder: 65.52 },
                  { name: 'Sun', revenue: 4300, orders: 61, customers: 52, avgOrder: 70.49 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis 
                    yAxisId="left"
                    stroke="hsl(var(--muted-foreground))" 
                    label={{ value: chartView === 'revenue' ? 'Revenue ($)' : chartView === 'orders' ? 'Orders' : 'Primary Scale', angle: -90, position: 'insideLeft' }}
                  />
                  {chartView === 'hybrid' && (
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      stroke="hsl(var(--muted-foreground))" 
                      label={{ value: 'Secondary Scale', angle: 90, position: 'insideRight' }}
                    />
                  )}
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.1)', 
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }} 
                  />
                  
                  {/* Revenue Line - Always show for revenue and hybrid */}
                  {(chartView === 'revenue' || chartView === 'hybrid') && (
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#f97316" 
                      strokeWidth={3}
                      dot={{ fill: '#f97316', strokeWidth: 2, r: 5 }}
                      name="Revenue ($)"
                    />
                  )}
                  
                  {/* Orders Line - Always show for orders and hybrid */}
                  {(chartView === 'orders' || chartView === 'hybrid') && (
                    <Line 
                      yAxisId={chartView === 'hybrid' ? 'right' : 'left'}
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      name="Orders"
                    />
                  )}
                  
                  {/* Customers Line - Only show in hybrid */}
                  {chartView === 'hybrid' && (
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="customers" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                      name="Customers"
                    />
                  )}
                  
                  {/* Avg Order Value Line - Only show in hybrid */}
                  {chartView === 'hybrid' && (
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="avgOrder" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      strokeDasharray="10 5"
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                      name="Avg Order ($)"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend for hybrid view */}
            {chartView === 'hybrid' && (
              <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-0.5 bg-orange-500"></div>
                  <span className="text-xs text-muted-foreground">Revenue ($)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-0.5 bg-blue-500 opacity-60" style={{ backgroundImage: 'repeating-linear-gradient(to right, #3b82f6 0, #3b82f6 5px, transparent 5px, transparent 10px)' }}></div>
                  <span className="text-xs text-muted-foreground">Orders</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-0.5 bg-green-500"></div>
                  <span className="text-xs text-muted-foreground">Customers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-0.5 bg-purple-500 opacity-60" style={{ backgroundImage: 'repeating-linear-gradient(to right, #8b5cf6 0, #8b5cf6 10px, transparent 10px, transparent 15px)' }}></div>
                  <span className="text-xs text-muted-foreground">Avg Order ($)</span>
                </div>
              </div>
            )}
          </div>

        {/* Progressive Disclosure Tabs - Apple Liquid Glass styling */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="liquid-glass-card flex rounded-full p-2 mb-6">
            <button
              onClick={() => setActiveTab('executive')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                activeTab === 'executive'
                  ? 'liquid-glass-nav-item-active'
                  : 'liquid-glass-nav-item'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Executive</span>
            </button>
            <button
              onClick={() => setActiveTab('operations')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                activeTab === 'operations'
                  ? 'liquid-glass-nav-item-active'
                  : 'liquid-glass-nav-item'
              }`}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Operations</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                activeTab === 'analytics'
                  ? 'liquid-glass-nav-item-active'
                  : 'liquid-glass-nav-item'
              }`}
            >
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
          </div>

          {/* Executive Summary Tab */}
          <TabsContent value="executive">
            <ExecutiveSummary />
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations">
            <OperationalView />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsView />
          </TabsContent>
        </Tabs>
      </div>
    </StandardLayout>
  );
}