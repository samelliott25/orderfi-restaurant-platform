import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Brain,
  Lightbulb,
  Target,
  Zap,
  Clock,
  DollarSign,
  Package,
  Users,
  ChefHat,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface AnalyticsData {
  revenue: Array<{ time: string; amount: number; forecast?: number }>;
  orders: Array<{ time: string; count: number; forecast?: number }>;
  categories: Array<{ name: string; value: number; color: string }>;
  wasteAnalysis: Array<{ item: string; waste: number; cost: number }>;
  aiInsights: Array<{
    id: string;
    type: 'optimization' | 'warning' | 'opportunity';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    action: string;
  }>;
}

export function AnalyticsView() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [aiInsightsVisible, setAiInsightsVisible] = useState(true);

  // Fetch analytics data (no automatic refresh)
  const { data: analyticsData, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/dashboard/analytics', selectedPeriod],
    // Removed refetchInterval to prevent dashboard refreshes
  });

  // Get AI-powered restaurant strategy insights (no automatic refresh)
  const { data: aiStrategy } = useQuery({
    queryKey: ['/api/grok/restaurant-strategy'],
    // Removed refetchInterval to prevent dashboard refreshes
  });

  // Default data for development
  const defaultAnalytics: AnalyticsData = {
    revenue: [
      { time: '9:00', amount: 120, forecast: 125 },
      { time: '10:00', amount: 240, forecast: 250 },
      { time: '11:00', amount: 480, forecast: 470 },
      { time: '12:00', amount: 720, forecast: 740 },
      { time: '13:00', amount: 890, forecast: 880 },
      { time: '14:00', amount: 650, forecast: 680 },
      { time: '15:00', amount: 420, forecast: 450 },
      { time: '16:00', amount: 380, forecast: 400 },
      { time: '17:00', amount: 580, forecast: 560 },
      { time: '18:00', amount: 920, forecast: 900 },
      { time: '19:00', amount: 1200, forecast: 1180 },
      { time: '20:00', amount: 980, forecast: 1000 },
      { time: '21:00', amount: 560, forecast: 580 },
      { time: '22:00', amount: 280, forecast: 300 }
    ],
    orders: [
      { time: '9:00', count: 12, forecast: 13 },
      { time: '10:00', count: 18, forecast: 19 },
      { time: '11:00', count: 32, forecast: 31 },
      { time: '12:00', count: 48, forecast: 50 },
      { time: '13:00', count: 42, forecast: 44 },
      { time: '14:00', count: 28, forecast: 30 },
      { time: '15:00', count: 22, forecast: 24 },
      { time: '16:00', count: 19, forecast: 21 },
      { time: '17:00', count: 35, forecast: 33 },
      { time: '18:00', count: 52, forecast: 50 },
      { time: '19:00', count: 68, forecast: 65 },
      { time: '20:00', count: 45, forecast: 48 },
      { time: '21:00', count: 25, forecast: 28 },
      { time: '22:00', count: 15, forecast: 17 }
    ],
    categories: [
      { name: 'Burgers', value: 35, color: '#f97316' },
      { name: 'Wings', value: 25, color: '#e11d48' },
      { name: 'Tacos', value: 20, color: '#8b5cf6' },
      { name: 'Salads', value: 12, color: '#10b981' },
      { name: 'Drinks', value: 8, color: '#3b82f6' }
    ],
    wasteAnalysis: [
      { item: 'Buffalo Wings', waste: 8, cost: 45.60 },
      { item: 'Caesar Salad', waste: 3, cost: 18.75 },
      { item: 'Beef Burger', waste: 5, cost: 32.50 },
      { item: 'Fish Tacos', waste: 2, cost: 12.00 }
    ],
    aiInsights: [
      {
        id: '1',
        type: 'optimization',
        title: 'Menu Optimization',
        description: 'Buffalo wings show highest demand but 15% waste rate',
        impact: 'high',
        action: 'Reduce portion size by 10% or improve preparation timing'
      },
      {
        id: '2',
        type: 'opportunity',
        title: 'Peak Hour Staffing',
        description: 'Order volume increases 40% during 6-8 PM',
        impact: 'medium',
        action: 'Schedule additional kitchen staff during peak hours'
      },
      {
        id: '3',
        type: 'warning',
        title: 'Ingredient Cost Rising',
        description: 'Beef prices up 12% this month affecting margins',
        impact: 'high',
        action: 'Consider alternative protein options or price adjustment'
      }
    ]
  };

  const currentAnalytics = analyticsData || defaultAnalytics;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Target className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'opportunity': return <Lightbulb className="h-4 w-4 text-green-500" />;
      default: return <Brain className="h-4 w-4 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'amount' ? `Revenue: $${entry.value}` : 
               entry.dataKey === 'forecast' ? `Forecast: $${entry.value}` :
               entry.dataKey === 'count' ? `Orders: ${entry.value}` :
               `${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold playwrite-font text-gray-900 dark:text-white">
            Analytics & Insights
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered analytics and business intelligence
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedPeriod === 'today' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('today')}
            className="h-9"
          >
            Today
          </Button>
          <Button
            variant={selectedPeriod === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('week')}
            className="h-9"
          >
            Week
          </Button>
          <Button
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('month')}
            className="h-9"
          >
            Month
          </Button>
        </div>
      </div>

      {/* AI Insights */}
      {aiInsightsVisible && (
        <Card className="border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Brain className="h-5 w-5 text-blue-500" />
                <span>AI-Powered Insights</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAiInsightsVisible(false)}
                className="h-8 w-8 p-0"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentAnalytics.aiInsights.map(insight => (
                <div key={insight.id} className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      💡 {insight.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="waste">Waste Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span>Revenue Trend vs Forecast</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={currentAnalytics.revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#f97316" 
                    fill="#f97316" 
                    fillOpacity={0.3}
                    name="Actual Revenue"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#64748b" 
                    fill="#64748b" 
                    fillOpacity={0.1}
                    strokeDasharray="5 5"
                    name="Forecast"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ChefHat className="h-5 w-5 text-orange-500" />
                <span>Order Volume vs Forecast</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={currentAnalytics.orders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    name="Actual Orders"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#64748b" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Forecast"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-purple-500" />
                <span>Popular Categories</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={currentAnalytics.categories}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {currentAnalytics.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {currentAnalytics.categories.map((category, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">{category.value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${category.value}%`,
                              backgroundColor: category.color
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waste" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span>Waste Analysis & Cost Impact</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={currentAnalytics.wasteAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="item" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cost" fill="#ef4444" name="Waste Cost ($)" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {currentAnalytics.wasteAnalysis.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.item}</span>
                        <Badge variant="destructive" className="text-xs">
                          {item.waste} units
                        </Badge>
                      </div>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        Cost: ${item.cost.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}