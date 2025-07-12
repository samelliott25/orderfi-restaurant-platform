import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Calendar,
  Brain,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Download,
  Filter,
  Zap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface AnalyticsData {
  salesTrends: {
    period: string;
    revenue: number;
    orders: number;
    customers: number;
  }[];
  inventoryForecasting: {
    item: string;
    currentStock: number;
    predictedDemand: number;
    reorderPoint: number;
    accuracy: number;
  }[];
  wastePatterns: {
    category: string;
    amount: number;
    cost: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  aiInsights: {
    id: string;
    type: 'recommendation' | 'warning' | 'opportunity';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    confidence: number;
    actions?: string[];
  }[];
}

interface AnalyticsViewProps {
  data: AnalyticsData;
  isLoading?: boolean;
  onRefresh?: () => void;
  onExport?: (format: 'pdf' | 'csv' | 'excel') => void;
  onApplyInsight?: (insightId: string) => void;
  className?: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  data,
  isLoading = false,
  onRefresh,
  onExport,
  onApplyInsight,
  className = ""
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [activeTab, setActiveTab] = useState('overview');

  const COLORS = {
    primary: '#f97316',
    secondary: '#ec4899',
    accent: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  };

  const chartColors = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.success, COLORS.warning];

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

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'opportunity': return <Zap className="h-4 w-4 text-blue-500" />;
      default: return <Brain className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'recommendation': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'warning': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'opportunity': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default: return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
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
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Revenue') ? formatCurrency(entry.value) : formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold playwrite-font bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Analytics Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered insights and forecasting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-24 h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1D</SelectItem>
              <SelectItem value="7d">7D</SelectItem>
              <SelectItem value="30d">30D</SelectItem>
              <SelectItem value="90d">90D</SelectItem>
            </SelectContent>
          </Select>
          {onExport && (
            <Button
              onClick={() => onExport('pdf')}
              variant="outline"
              size="sm"
              className="h-11 min-w-[44px] px-4"
            >
              <Download className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Export</span>
            </Button>
          )}
          {onRefresh && (
            <Button
              onClick={onRefresh}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="h-11 min-w-[44px] px-4"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="ml-2 hidden sm:inline">Refresh</span>
            </Button>
          )}
        </div>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-11">
          <TabsTrigger value="overview" className="h-9 text-sm">Overview</TabsTrigger>
          <TabsTrigger value="forecasting" className="h-9 text-sm">Forecasting</TabsTrigger>
          <TabsTrigger value="waste" className="h-9 text-sm">Waste</TabsTrigger>
          <TabsTrigger value="insights" className="h-9 text-sm">AI Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Sales Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.salesTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke={COLORS.primary}
                        fill={COLORS.primary}
                        fillOpacity={0.3}
                        name="Revenue"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Orders Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Order Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.salesTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="orders" 
                        fill={COLORS.secondary}
                        name="Orders"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Forecasting Tab */}
        <TabsContent value="forecasting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Inventory Forecasting (95% Accuracy)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.inventoryForecasting.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.item}</h4>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span>Current: {item.currentStock}</span>
                        <span>Predicted: {item.predictedDemand}</span>
                        <span>Reorder: {item.reorderPoint}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      <Badge variant="outline" className={getImpactColor(item.currentStock < item.reorderPoint ? 'high' : 'low')}>
                        {item.accuracy}% Accuracy
                      </Badge>
                      {item.currentStock < item.reorderPoint && (
                        <Badge variant="destructive">Low Stock</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Waste Tab */}
        <TabsContent value="waste" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Waste by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <RechartsPieChart
                        data={data.wastePatterns}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="amount"
                        nameKey="category"
                      >
                        {data.wastePatterns.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </RechartsPieChart>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Waste Reduction Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.wastePatterns.map((pattern, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{pattern.category}</h4>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(pattern.cost)} wasted
                        </p>
                      </div>
                      <Badge variant="outline" className={
                        pattern.trend === 'up' ? 'text-red-600' : 
                        pattern.trend === 'down' ? 'text-green-600' : 'text-gray-600'
                      }>
                        {pattern.trend === 'up' ? '↗' : pattern.trend === 'down' ? '↘' : '→'} {pattern.trend}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.aiInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-sm">{insight.title}</h4>
                            <Badge variant="outline" className={getImpactColor(insight.impact)}>
                              {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {insight.confidence}% Confidence
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {insight.description}
                          </p>
                          {insight.actions && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium">Recommended Actions:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {insight.actions.map((action, idx) => (
                                  <li key={idx} className="flex items-center">
                                    <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => onApplyInsight?.(insight.id)}
                          size="sm"
                          variant="outline"
                          className="h-9 min-w-[44px] text-xs"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsView;