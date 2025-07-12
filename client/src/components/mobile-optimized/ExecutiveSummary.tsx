import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye
} from 'lucide-react';

interface KPIData {
  revenue: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down';
  };
  orders: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down';
  };
  customers: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down';
  };
  avgOrderValue: {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down';
  };
}

interface ExecutiveSummaryProps {
  data: KPIData;
  isLoading?: boolean;
  onRefresh?: () => void;
  onViewDetails?: (metric: string) => void;
  className?: string;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  data,
  isLoading = false,
  onRefresh,
  onViewDetails,
  className = ""
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? ArrowUpRight : ArrowDownRight;
  };

  const getTrendColor = (trend: 'up' | 'down') => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getTrendBadgeColor = (trend: 'up' | 'down') => {
    return trend === 'up' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  const kpiCards = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: formatCurrency(data.revenue.current),
      previousValue: formatCurrency(data.revenue.previous),
      change: formatPercentage(data.revenue.change),
      trend: data.revenue.trend,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: formatNumber(data.orders.current),
      previousValue: formatNumber(data.orders.previous),
      change: formatPercentage(data.orders.change),
      trend: data.orders.trend,
      icon: ShoppingCart,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'customers',
      title: 'Customers',
      value: formatNumber(data.customers.current),
      previousValue: formatNumber(data.customers.previous),
      change: formatPercentage(data.customers.change),
      trend: data.customers.trend,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'avgOrderValue',
      title: 'Avg Order Value',
      value: formatCurrency(data.avgOrderValue.current),
      previousValue: formatCurrency(data.avgOrderValue.previous),
      change: formatPercentage(data.avgOrderValue.change),
      trend: data.avgOrderValue.trend,
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Executive Summary
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time performance metrics and KPIs
          </p>
        </div>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            disabled={isLoading}
            size="sm"
            variant="outline"
            className="h-11 min-w-[44px] px-4"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
        )}
      </div>

      {/* KPI Cards Grid - Mobile First Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = getTrendIcon(kpi.trend);
          
          return (
            <Card
              key={kpi.id}
              className={`relative overflow-hidden backdrop-blur-md bg-gradient-to-br ${kpi.bgColor} ${kpi.borderColor} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}
              onClick={() => onViewDetails?.(kpi.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full bg-gradient-to-r ${kpi.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-foreground">
                    {kpi.value}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Previous: {kpi.previousValue}
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${getTrendBadgeColor(kpi.trend)} text-xs px-2 py-1`}
                    >
                      <TrendIcon className="h-3 w-3 mr-1" />
                      {kpi.change}
                    </Badge>
                  </div>
                </div>
                
                {/* Touch-friendly view details button */}
                {onViewDetails && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(kpi.id);
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full h-11 mt-3 hover:bg-white/50 dark:hover:bg-gray-800/50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Insights */}
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Best Performing Metric</span>
              <span className="text-sm font-medium text-green-600">
                {data.revenue.change > 0 ? 'Revenue' : 'Orders'} 
                {data.revenue.change > 0 ? ` (+${data.revenue.change.toFixed(1)}%)` : ` (+${data.orders.change.toFixed(1)}%)`}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Current Trend</span>
              <span className={`text-sm font-medium ${
                (data.revenue.trend === 'up' && data.orders.trend === 'up') 
                  ? 'text-green-600' 
                  : 'text-orange-600'
              }`}>
                {(data.revenue.trend === 'up' && data.orders.trend === 'up') 
                  ? 'Strong Growth' 
                  : 'Mixed Performance'
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveSummary;