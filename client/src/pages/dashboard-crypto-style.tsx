import { useState, useEffect } from 'react';
import { StandardLayout } from '@/components/StandardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LineChart, Line, Area, AreaChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Info, DollarSign, ShoppingCart, Users, Clock } from 'lucide-react';

// Generate realistic sales data with variations
const generateSalesData = (days: number) => {
  const data = [];
  const baseRevenue = 15000;
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add realistic variations
    const dayVariation = Math.sin(i * 0.3) * 0.15; // Weekly pattern
    const randomVariation = (Math.random() - 0.5) * 0.2; // Random variation
    const trendFactor = 1 + (i * 0.002); // Slight upward trend
    
    const revenue = baseRevenue * (1 + dayVariation + randomVariation) * trendFactor;
    
    data.push({
      date: date.toISOString().split('T')[0],
      time: date.getHours() + ':00',
      revenue: Math.round(revenue),
      orders: Math.round(revenue / 25), // Avg order ~$25
    });
  }
  
  return data;
};

// Generate hourly data for today
const generateHourlyData = () => {
  const data = [];
  const currentHour = new Date().getHours();
  
  for (let hour = 0; hour <= currentHour; hour++) {
    // Restaurant hours pattern (peak lunch and dinner)
    let multiplier = 0.3; // Base level
    if (hour >= 11 && hour <= 14) multiplier = 1.2; // Lunch rush
    if (hour >= 17 && hour <= 21) multiplier = 1.0; // Dinner rush
    if (hour >= 7 && hour <= 10) multiplier = 0.6; // Breakfast
    
    const revenue = Math.round(1200 * multiplier * (0.8 + Math.random() * 0.4));
    
    data.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      revenue,
      orders: Math.round(revenue / 25),
    });
  }
  
  return data;
};

export default function CryptoStyleDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartTimeframe, setChartTimeframe] = useState('1H');
  const [salesData, setSalesData] = useState(generateHourlyData());
  const [currentRevenue, setCurrentRevenue] = useState(108961);
  const [revenueChange, setRevenueChange] = useState(0.8);
  
  // Update data based on timeframe
  useEffect(() => {
    switch (chartTimeframe) {
      case '1H':
        setSalesData(generateHourlyData());
        break;
      case '24H':
        setSalesData(generateSalesData(1));
        break;
      case '7D':
        setSalesData(generateSalesData(7));
        break;
      case '1M':
        setSalesData(generateSalesData(30));
        break;
      case '3M':
        setSalesData(generateSalesData(90));
        break;
      case '1Y':
        setSalesData(generateSalesData(365));
        break;
    }
  }, [chartTimeframe]);

  // Performance metrics for different periods
  const performanceMetrics = {
    '24H': { value: 0.7, color: 'text-green-500' },
    '7D': { value: 2.3, color: 'text-green-500' },
    '14D': { value: 7.7, color: 'text-green-500' },
    '30D': { value: 4.3, color: 'text-green-500' },
    '60D': { value: 11.2, color: 'text-green-500' },
    '1Y': { value: 88.0, color: 'text-green-500' },
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const timeframes = ['1H', '24H', '7D', '1M', '3M', '1Y', 'MAX'];

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Header */}
        <div className="border-b border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">REV #1</h1>
                <p className="text-sm text-gray-400">Revenue</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Info className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-800">
          <div className="flex overflow-x-auto px-4">
            {['Overview', 'Info', 'Markets', 'Portfolio', 'News'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? 'border-green-500 text-green-500'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 space-y-6">
          {/* Revenue Display */}
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-white">{formatCurrency(currentRevenue)}</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">+{revenueChange}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>≈ A${(currentRevenue * 1.5).toLocaleString()}</span>
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">1.0%</span>
            </div>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex gap-2">
            <Button
              variant={chartTimeframe !== 'Market Cap' ? 'default' : 'outline'}
              size="sm"
              className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            >
              Revenue
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent text-gray-400 border-gray-700 hover:bg-gray-800"
            >
              Order Volume
            </Button>
          </div>

          {/* Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Timeframe Selector */}
          <div className="flex justify-center">
            <div className="flex bg-gray-800 rounded-lg p-1">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setChartTimeframe(timeframe)}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    chartTimeframe === timeframe
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(performanceMetrics).map(([period, metric]) => (
                  <div key={period} className="text-center">
                    <div className="text-xs text-gray-400 mb-1">{period}</div>
                    <div className={`text-sm font-medium ${metric.color}`}>
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      {metric.value}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Input */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-white mb-1">1.00</div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <DollarSign className="w-3 h-3 text-white" />
                  </div>
                  REV
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-white mb-1">108900.00</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">USD</span>
                  <Button variant="ghost" size="sm" className="text-gray-400 p-0 h-auto">
                    ⌄
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Info</h3>
              <Button variant="ghost" size="sm" className="text-gray-400">
                more →
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-400">Order Volume</span>
                    <Info className="w-3 h-3 text-gray-500" />
                  </div>
                  <div className="text-white font-medium">$2,165,735,944,128</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-400">Active Customers</span>
                    <Info className="w-3 h-3 text-gray-500" />
                  </div>
                  <div className="text-white font-medium">19.9 Million</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-400">Monthly Revenue</span>
                    <Info className="w-3 h-3 text-gray-500" />
                  </div>
                  <div className="text-white font-medium">$2,165,735,944,128</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-400">Total Orders</span>
                    <Info className="w-3 h-3 text-gray-500" />
                  </div>
                  <div className="text-white font-medium">19.9 Million</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}