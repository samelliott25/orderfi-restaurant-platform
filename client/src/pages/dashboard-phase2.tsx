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
  const [timePeriod, setTimePeriod] = useState('daily'); // 'hourly', 'daily', 'weekly', 'monthly'


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
                {timePeriod === 'hourly' ? 'Hourly P&L Analysis' :
                 timePeriod === 'daily' ? 'Daily P&L Analysis' : 
                 timePeriod === 'weekly' ? 'Weekly P&L Analysis' : 
                 'Monthly P&L Analysis'}
              </h3>
              <div className="flex items-center space-x-1">
                <Button
                  variant={timePeriod === 'hourly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimePeriod('hourly')}
                  className="liquid-glass-nav-item text-xs"
                >
                  Hourly
                </Button>
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
                  timePeriod === 'hourly' ? [
                    // Hourly data: Saturday peak service (12pm-11pm) - $3M venue busy Thu-Sun
                    { name: '12pm', sales: 420, laborPercent: 35.2 }, // Lunch prep/start
                    { name: '1pm', sales: 680, laborPercent: 32.4 },  // Lunch rush begins
                    { name: '2pm', sales: 890, laborPercent: 29.8 },  // Peak lunch
                    { name: '3pm', sales: 650, laborPercent: 31.5 },  // Lunch wind-down
                    { name: '4pm', sales: 380, laborPercent: 38.1 },  // Slowest hour
                    { name: '5pm', sales: 520, laborPercent: 35.7 },  // Dinner prep
                    { name: '6pm', sales: 840, laborPercent: 28.9 },  // Early dinner
                    { name: '7pm', sales: 1240, laborPercent: 24.2 }, // Peak dinner
                    { name: '8pm', sales: 1180, laborPercent: 25.1 }, // Prime dinner
                    { name: '9pm', sales: 920, laborPercent: 27.3 },  // Late dinner
                    { name: '10pm', sales: 580, laborPercent: 31.8 }, // Wind down
                    { name: '11pm', sales: 290, laborPercent: 37.9 }  // Close prep
                  ] : timePeriod === 'daily' ? [
                    // Daily data: $3M venue - busy Thu-Sun pattern
                    { name: 'Mon', sales: 6200, laborPercent: 31.8 }, // Quieter start
                    { name: 'Tue', sales: 6850, laborPercent: 30.4 }, // Building up
                    { name: 'Wed', sales: 7300, laborPercent: 29.7 }, // Mid-week
                    { name: 'Thu', sales: 9200, laborPercent: 27.6 }, // Weekend starts
                    { name: 'Fri', sales: 10800, laborPercent: 25.3 }, // Peak night
                    { name: 'Sat', sales: 11600, laborPercent: 24.8 }, // Busiest day
                    { name: 'Sun', sales: 9450, laborPercent: 26.9 }  // Strong finish
                  ] : timePeriod === 'weekly' ? [
                    // Weekly data: $3M venue seasonal variations
                    { name: 'W1', sales: 58400, laborPercent: 28.9 }, // Average week
                    { name: 'W2', sales: 62200, laborPercent: 27.4 }, // Strong week
                    { name: 'W3', sales: 65800, laborPercent: 26.8 }, // Peak week
                    { name: 'W4', sales: 55600, laborPercent: 29.7 }  // Staff challenges
                  ] : [
                    // Monthly data: $3M venue ($250K/month average)
                    { name: 'Jan', sales: 220000, laborPercent: 31.4 }, // Post-holiday slow
                    { name: 'Feb', sales: 195000, laborPercent: 33.1 }, // Winter low
                    { name: 'Mar', sales: 238000, laborPercent: 29.8 }, // Spring pickup
                    { name: 'Apr', sales: 258000, laborPercent: 28.2 }, // Strong month
                    { name: 'May', sales: 275000, laborPercent: 26.9 }, // Peak season
                    { name: 'Jun', sales: 289000, laborPercent: 25.7 }  // Summer high
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
                    domain={[0, 100]}
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