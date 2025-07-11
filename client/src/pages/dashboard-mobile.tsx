import React from 'react';
import MobileLayout from '@/components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  AlertTriangle,
  Clock,
  Star,
  Zap,
  Target,
  Brain
} from 'lucide-react';

export default function DashboardMobile() {
  return (
    <MobileLayout title="Restaurant Dashboard" subtitle="Real-time operations overview">
      <div className="p-4 space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300">Revenue</p>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200">$2,450</p>
                  <p className="text-xs text-green-600 dark:text-green-400">+12% today</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Orders</p>
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">147</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">+8 pending</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Customers</p>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">89</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">Active now</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 dark:text-orange-300">Avg Order</p>
                  <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">$28.50</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">+$2.10 vs yesterday</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <Brain className="w-5 h-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-sm">Buffalo Wings trending +25% - consider promotion</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-sm">Optimal reorder time: 3 items need restocking</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <Star className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Peak hour prediction: 7:30-8:30 PM</span>
            </div>
          </CardContent>
        </Card>

        {/* Urgent Alerts */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertTriangle className="w-5 h-5" />
              Urgent Alerts
              <Badge variant="destructive" className="ml-auto">3</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">Buffalo Wings - Low Stock</span>
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                Reorder
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium">Lettuce expires in 2 days</span>
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                Special
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Order #147 waiting 15 min</span>
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                Check
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Order #147 completed</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New order received</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Buffalo Wings restocked</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}