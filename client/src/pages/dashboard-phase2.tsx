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

          {/* Revenue and Sales Charts */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Revenue Chart */}
            <div className="liquid-glass-card p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Daily Revenue</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { name: 'Mon', revenue: 2400, orders: 45 },
                    { name: 'Tue', revenue: 1398, orders: 32 },
                    { name: 'Wed', revenue: 9800, orders: 78 },
                    { name: 'Thu', revenue: 3908, orders: 54 },
                    { name: 'Fri', revenue: 4800, orders: 69 },
                    { name: 'Sat', revenue: 3800, orders: 58 },
                    { name: 'Sun', revenue: 4300, orders: 61 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.1)', 
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Orders Chart */}
            <div className="liquid-glass-card p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Daily Orders</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Mon', orders: 45, revenue: 2400 },
                    { name: 'Tue', orders: 32, revenue: 1398 },
                    { name: 'Wed', orders: 78, revenue: 9800 },
                    { name: 'Thu', orders: 54, revenue: 3908 },
                    { name: 'Fri', orders: 69, revenue: 4800 },
                    { name: 'Sat', orders: 58, revenue: 3800 },
                    { name: 'Sun', orders: 61, revenue: 4300 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.1)', 
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar 
                      dataKey="orders" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
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