import { StandardLayout } from "@/components/StandardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Clock, ChefHat, CheckCircle, Users, MapPin } from "lucide-react";
import "@/styles/mobile-fix.css";

export default function AdminOrdersPage() {
  // Mock order data
  const orders = [
    {
      id: "1234",
      customerName: "John Doe",
      items: ["Burger", "Fries", "Coke"],
      status: "preparing",
      time: "10 min ago",
      table: "A3",
      total: "$24.50"
    },
    {
      id: "1235", 
      customerName: "Jane Smith",
      items: ["Pizza Margherita", "Salad"],
      status: "ready",
      time: "15 min ago",
      table: "B2",
      total: "$18.00"
    },
    {
      id: "1236",
      customerName: "Mike Johnson", 
      items: ["Pasta Carbonara", "Garlic Bread"],
      status: "completed",
      time: "25 min ago",
      table: "C1",
      total: "$22.75"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing': return <ChefHat className="h-4 w-4 text-orange-500" />;
      case 'ready': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'ready': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <StandardLayout title="Orders Management" subtitle="Kitchen video system and floor plan management">
      <div data-testid="orders-page" className="space-y-6">
        {/* Quick Stats - Responsive Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Active Orders</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">12</p>
                <p className="text-xs text-muted-foreground">Currently being prepared</p>
              </div>
              <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Ready for Pickup</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">3</p>
                <p className="text-xs text-muted-foreground">Waiting for customers</p>
              </div>
              <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Completed Today</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">47</p>
                <p className="text-xs text-muted-foreground">Orders fulfilled</p>
              </div>
              <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="relative bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">{order.customerName} • Table {order.table}</p>
                  </div>
                  <Badge variant={order.status === 'preparing' ? 'default' : order.status === 'ready' ? 'secondary' : 'outline'}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Items:</span>
                    <span className="text-sm">{order.items.join(", ")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Time:</span>
                    <span className="text-sm">{order.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total:</span>
                    <span className="text-sm font-bold">{order.total}</span>
                  </div>
                  <div className="pt-2">
                    <Button 
                      className="w-full"
                      variant={order.status === 'preparing' ? 'default' : order.status === 'ready' ? 'secondary' : 'outline'}
                    >
                      {order.status === 'preparing' ? 'Mark Ready' : 
                       order.status === 'ready' ? 'Mark Picked Up' : 'Complete'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </StandardLayout>
  );
}