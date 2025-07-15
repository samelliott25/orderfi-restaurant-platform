import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Activity,
  Clock
} from 'lucide-react';

interface KPIData {
  revenue: {
    current: number;
    previous: number;
    trend: 'up' | 'down';
    percentage: number;
  };
  orders: {
    current: number;
    previous: number;
    trend: 'up' | 'down';
    percentage: number;
  };
  customers: {
    current: number;
    previous: number;
    trend: 'up' | 'down';
    percentage: number;
  };
  avgOrder: {
    current: number;
    previous: number;
    trend: 'up' | 'down';
    percentage: number;
  };
}

interface LiveMetric {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  color: string;
  gradient: string;
}

export function ExecutiveSummary() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wsConnected, setWsConnected] = useState(false);

  // Real-time KPI data
  const { data: kpiData, isLoading } = useQuery<KPIData>({
    queryKey: ['/api/dashboard/kpis'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setWsConnected(true);
        ws.send(JSON.stringify({
          type: 'subscribe',
          payload: { channel: 'dashboard-kpis' }
        }));
      };
      
      ws.onclose = () => {
        setWsConnected(false);
      };
      
      return () => {
        ws.close();
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }, []);

  // Default KPI data for development
  const defaultKPIData: KPIData = {
    revenue: { current: 14530, previous: 12340, trend: 'up', percentage: 17.8 },
    orders: { current: 567, previous: 489, trend: 'up', percentage: 15.9 },
    customers: { current: 342, previous: 298, trend: 'up', percentage: 14.8 },
    avgOrder: { current: 25.62, previous: 25.23, trend: 'up', percentage: 1.5 }
  };

  const currentKPIData = kpiData || defaultKPIData;

  const metrics: LiveMetric[] = [
    {
      label: 'Today\'s Revenue',
      value: `$${currentKPIData.revenue.current.toLocaleString()}`,
      icon: DollarSign,
      trend: currentKPIData.revenue.trend,
      percentage: currentKPIData.revenue.percentage,
      color: 'text-teal-600 dark:text-teal-400',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Orders',
      value: currentKPIData.orders.current.toString(),
      icon: ShoppingCart,
      trend: currentKPIData.orders.trend,
      percentage: currentKPIData.orders.percentage,
      color: 'text-teal-600 dark:text-teal-400',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Customers',
      value: currentKPIData.customers.current.toString(),
      icon: Users,
      trend: currentKPIData.customers.trend,
      percentage: currentKPIData.customers.percentage,
      color: 'text-orange-600 dark:text-orange-400',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Avg Order Value',
      value: `$${currentKPIData.avgOrder.current.toFixed(2)}`,
      icon: TrendingUp,
      trend: currentKPIData.avgOrder.trend,
      percentage: currentKPIData.avgOrder.percentage,
      color: 'text-orange-600 dark:text-orange-400',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Real-time Status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Executive Summary
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time business performance overview
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-2 py-1 rounded-full ${wsConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>
              {wsConnected ? 'Live' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? ArrowUp : ArrowDown;
          
          return (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                      <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </p>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendIcon className={`h-4 w-4 ${metric.trend === 'up' ? 'text-teal-600' : 'text-orange-600'}`} />
                  <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-muted-foreground">
                    vs yesterday
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Button 
          variant="default"
          className="h-11 min-h-[44px] justify-start space-x-2"
          onClick={() => window.location.href = '/inventory'}
        >
          <Activity className="h-4 w-4" />
          <span>Check Inventory</span>
        </Button>
        <Button 
          variant="outline"
          className="h-11 min-h-[44px] justify-start space-x-2"
          onClick={() => window.location.href = '/orders'}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>View Orders</span>
        </Button>
        <Button 
          variant="default"
          className="h-11 min-h-[44px] justify-start space-x-2"
          onClick={() => window.location.href = '/kds'}
        >
          <Clock className="h-4 w-4" />
          <span>Kitchen Display</span>
        </Button>
        <Button 
          variant="outline"
          className="h-11 min-h-[44px] justify-start space-x-2"
          onClick={() => window.location.href = '/payments'}
        >
          <DollarSign className="h-4 w-4" />
          <span>Payments</span>
        </Button>
      </div>
    </div>
  );
}