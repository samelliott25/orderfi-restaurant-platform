import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface MetricData {
  current: number;
  change: number;
  trend: 'up' | 'down';
  status: 'good' | 'warning' | 'critical';
}

interface ExecutiveSummaryProps {
  metrics: {
    revenue: MetricData;
    orders: MetricData;
    customers: MetricData;
    avgOrder: MetricData;
  };
  currentTime: Date;
}

export function ExecutiveSummary({ metrics, currentTime }: ExecutiveSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="w-3 h-3 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'border-green-500/30 bg-green-500/5';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/5';
      case 'critical': return 'border-red-500/30 bg-red-500/5';
      default: return 'border-border';
    }
  };

  const executiveMetrics = [
    {
      title: "Revenue Today",
      value: formatCurrency(metrics.revenue.current),
      change: metrics.revenue.change,
      trend: metrics.revenue.trend,
      status: metrics.revenue.status,
      icon: DollarSign,
      color: "text-green-500"
    },
    {
      title: "Orders",
      value: metrics.orders.current.toString(),
      change: metrics.orders.change,
      trend: metrics.orders.trend,
      status: metrics.orders.status,
      icon: ShoppingCart,
      color: "text-blue-500"
    },
    {
      title: "Customers",
      value: metrics.customers.current.toString(),
      change: metrics.customers.change,
      trend: metrics.customers.trend,
      status: metrics.customers.status,
      icon: Users,
      color: "text-purple-500"
    },
    {
      title: "Avg Order",
      value: formatCurrency(metrics.avgOrder.current),
      change: metrics.avgOrder.change,
      trend: metrics.avgOrder.trend,
      status: metrics.avgOrder.status,
      icon: Target,
      color: "text-orange-500"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Executive Status Bar */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              OPERATIONAL
            </Badge>
            <div className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          <div className="text-lg font-normal text-foreground playwrite-font">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* Primary KPIs - Mobile Optimized Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {executiveMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          
          return (
            <Card 
              key={index}
              className={`bg-card border transition-all duration-200 hover:shadow-lg ${getStatusColor(metric.status)}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-normal text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(metric.status)}
                  <IconComponent className={`w-4 h-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-normal text-foreground mb-2">
                  {metric.value}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-muted-foreground">vs yesterday</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Status Summary */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-foreground">Today's Performance</div>
            <Badge variant="outline" className="bg-green-500/20 text-green-400">
              On Track
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Revenue goal: {Math.round((metrics.revenue.current / 20000) * 100)}% complete
          </div>
        </div>
      </div>
    </div>
  );
}