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
  const [timePeriod, setTimePeriod] = useState('daily'); // 'daily', 'weekly', 'monthly'


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
                {timePeriod === 'daily' ? 'Daily P&L Analysis' : 
                 timePeriod === 'weekly' ? 'Weekly P&L Analysis' : 
                 'Monthly P&L Analysis'}
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant={timePeriod === 'daily' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimePeriod('daily')}
                  className="liquid-glass-nav-item text-xs"
                >
                  Daily
                </Button>
                <Button
                  variant={timePeriod === 'weekly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimePeriod('weekly')}
                  className="liquid-glass-nav-item text-xs"
                >
                  Weekly
                </Button>
                <Button
                  variant={timePeriod === 'monthly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimePeriod('monthly')}
                  className="liquid-glass-nav-item text-xs"
                >
                  Monthly
                </Button>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={
                  timePeriod === 'daily' ? [
                    // Daily data: Based on $1,350 industry average with realistic variations
                    { name: 'Mon', sales: 1180, laborPercent: 31.2 }, // Slower start of week
                    { name: 'Tue', sales: 1250, laborPercent: 29.8 }, // Mid-week pickup
                    { name: 'Wed', sales: 1320, laborPercent: 28.5 }, // Building momentum
                    { name: 'Thu', sales: 1450, laborPercent: 27.9 }, // Pre-weekend surge
                    { name: 'Fri', sales: 1680, laborPercent: 26.4 }, // Peak night
                    { name: 'Sat', sales: 1820, laborPercent: 25.8 }, // Busiest day
                    { name: 'Sun', sales: 1390, laborPercent: 28.7 }  // Family dining
                  ] : timePeriod === 'weekly' ? [
                    // Weekly data: Aggregated from daily averages (~$9,450/week)
                    { name: 'W1', sales: 8950, laborPercent: 29.2 }, // Slower week
                    { name: 'W2', sales: 9680, laborPercent: 28.1 }, // Average performance
                    { name: 'W3', sales: 10240, laborPercent: 27.3 }, // Strong week
                    { name: 'W4', sales: 9120, laborPercent: 30.4 }  // Staff shortage week
                  ] : [
                    // Monthly data: Based on $493K annual average (~$41K/month)
                    { name: 'Jan', sales: 38400, laborPercent: 32.1 }, // Post-holiday slowdown
                    { name: 'Feb', sales: 35200, laborPercent: 33.4 }, // Shortest month, winter lull
                    { name: 'Mar', sales: 41800, laborPercent: 29.6 }, // Spring recovery
                    { name: 'Apr', sales: 43200, laborPercent: 28.3 }, // Strong spring month
                    { name: 'May', sales: 45600, laborPercent: 27.1 }, // Peak season begins
                    { name: 'Jun', sales: 47500, laborPercent: 26.8 }  // Summer high season
                  ]
                }>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis 
                    yAxisId="left"
                    stroke="hsl(var(--muted-foreground))" 
                    label={{ value: 'Sales ($)', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))" 
                    label={{ value: 'Labor %', angle: 90, position: 'insideRight' }}
                    domain={[20, 35]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.1)', 
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }} 
                  />
                  
                  {/* Sales Line - Primary metric */}
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#f97316" 
                    strokeWidth={4}
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 6 }}
                    name="Sales ($)"
                  />
                  
                  {/* Labor Percentage Line - Key P&L metric */}
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="laborPercent" 
                    stroke="#dc2626" 
                    strokeWidth={3}
                    strokeDasharray="8 4"
                    dot={{ fill: '#dc2626', strokeWidth: 2, r: 5 }}
                    name="Labor % of Sales"
                  />
                  

                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* P&L Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-orange-500 rounded"></div>
                <span className="text-xs text-muted-foreground font-medium">Sales ($)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-1 bg-red-600 rounded opacity-80" style={{ backgroundImage: 'repeating-linear-gradient(to right, #dc2626 0, #dc2626 8px, transparent 8px, transparent 12px)' }}></div>
                <span className="text-xs text-muted-foreground font-medium">Labor % of Sales</span>
              </div>
            </div>
            
            {/* P&L Key Insights */}
            <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-muted-foreground">Target Labor %</div>
                  <div className="text-sm font-semibold text-green-600">≤ 30%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Optimal Range</div>
                  <div className="text-sm font-semibold text-yellow-600">25-30%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Critical Level</div>
                  <div className="text-sm font-semibold text-red-600">&gt; 35%</div>
                </div>
              </div>
            </div>
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