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
  BarChart3, 
  Users, 
  TrendingUp, 
  Brain,
  RefreshCw,
  Settings,
  Bell
} from 'lucide-react';

export default function DashboardPhase2() {
  const [activeTab, setActiveTab] = useState('executive');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Progressive disclosure state management
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

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
    <StandardLayout title="Phase 2 Dashboard" subtitle="Mobile-Optimized Restaurant Management">
      <div className="space-y-6">
        {/* Status Bar */}
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200" style={{backgroundColor: '#FFE8D6', borderColor: '#FF5B05'}}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{backgroundColor: '#075956'}}></div>
                  <span className="text-sm font-medium">System Online</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 min-w-[44px]"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  {alerts.length} Alerts
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 min-w-[44px]"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progressive Disclosure Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-11 mb-6">
            <TabsTrigger value="executive" className="h-9 flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Executive</span>
            </TabsTrigger>
            <TabsTrigger value="operations" className="h-9 flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Operations</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="h-9 flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Executive Summary Tab */}
          <TabsContent value="executive">
            <ExecutiveSummary key={`executive-${refreshKey}`} />
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations">
            <OperationalView key={`operations-${refreshKey}`} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsView key={`analytics-${refreshKey}`} />
          </TabsContent>
        </Tabs>
      </div>
    </StandardLayout>
  );
}