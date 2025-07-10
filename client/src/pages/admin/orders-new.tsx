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
        {/* Quick Stats */}
        <div className="flex flex-col space-y-3 mb-6 w-full">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <ChefHat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Currently being prepared</p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready for Pickup</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Waiting for customers</p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">Orders fulfilled</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Order #{order.id}</span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {order.customerName}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          Table {order.table}
                        </span>
                        <span>{order.time}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Items: {order.items.join(", ")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
                    <span className="font-semibold">{order.total}</span>
                    <div className="flex items-center gap-2">
                      {order.status === 'preparing' && (
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                          Mark Ready
                        </Button>
                      )}
                      {order.status === 'ready' && (
                        <Button size="sm" variant="outline">
                          Mark Picked Up
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StandardLayout>
  );
}