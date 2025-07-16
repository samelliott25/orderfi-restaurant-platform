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
        <div className="space-y-8">

          {/* Status Bar - Enhanced with Kleurvorm styling */}
          <div className="kleurvorm-card">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-kleurvorm-blue to-kleurvorm-purple rounded-full animate-pulse"></div>
                  <span className="text-lg font-medium kleurvorm-subheading">System Online</span>
                </div>
                <div className="text-lg kleurvorm-small">
                  Dashboard Active
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="kleurvorm-btn kleurvorm-btn-secondary text-sm px-4 py-2">
                  <Bell className="h-4 w-4 mr-2" />
                  {alerts.length} Alerts
                </button>
                <button className="kleurvorm-btn kleurvorm-btn-outline text-sm px-4 py-2">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </button>
              </div>
            </div>
          </div>

        {/* Progressive Disclosure Tabs - Enhanced with Kleurvorm styling */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex space-x-2 bg-white rounded-full p-2 shadow-sm mb-6">
            <button
              onClick={() => setActiveTab('executive')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                activeTab === 'executive'
                  ? 'bg-gradient-to-r from-kleurvorm-blue to-kleurvorm-purple text-white'
                  : 'text-kleurvorm-black hover:bg-kleurvorm-light-blue'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline kleurvorm-small">Executive</span>
            </button>
            <button
              onClick={() => setActiveTab('operations')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                activeTab === 'operations'
                  ? 'bg-gradient-to-r from-kleurvorm-blue to-kleurvorm-purple text-white'
                  : 'text-kleurvorm-black hover:bg-kleurvorm-light-blue'
              }`}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline kleurvorm-small">Operations</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-kleurvorm-blue to-kleurvorm-purple text-white'
                  : 'text-kleurvorm-black hover:bg-kleurvorm-light-blue'
              }`}
            >
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline kleurvorm-small">Analytics</span>
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