import { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Clock, 
  ChefHat, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  MapPin,
  Timer,
  Bell,
  Eye,
  Grid3X3,
  RefreshCcw,
  Printer
} from "lucide-react";

interface Order {
  id: string;
  tableNumber: string;
  customerName: string;
  items: OrderItem[];
  status: 'new' | 'preparing' | 'ready' | 'served' | 'paid';
  orderTime: string;
  estimatedTime: number; // minutes
  priority: 'normal' | 'high' | 'urgent';
  totalAmount: number;
  specialInstructions?: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  modifications?: string;
  status: 'pending' | 'preparing' | 'ready';
  station: 'grill' | 'salad' | 'pizza' | 'fryer' | 'bar';
}

interface Table {
  id: string;
  number: string;
  seats: number;
  status: 'available' | 'occupied' | 'needs-cleaning' | 'reserved';
  orderId?: string;
  position: { x: number; y: number };
}

export default function AdminOrdersPage() {
  const [currentView, setCurrentView] = useState<'kvs' | 'floor'>('kvs');
  const [selectedStation, setSelectedStation] = useState<string>('all');

  const [orders] = useState<Order[]>([
    {
      id: "ORD-001",
      tableNumber: "T-12",
      customerName: "Smith Family",
      items: [
        { id: "1", name: "Caesar Salad", quantity: 2, status: "ready", station: "salad" },
        { id: "2", name: "Grilled Salmon", quantity: 1, status: "preparing", station: "grill", modifications: "No lemon" },
        { id: "3", name: "Kids Pasta", quantity: 1, status: "pending", station: "grill" }
      ],
      status: "preparing",
      orderTime: "7:45 PM",
      estimatedTime: 12,
      priority: "normal",
      totalAmount: 67.50,
      specialInstructions: "Table has food allergies - nuts"
    },
    {
      id: "ORD-002",
      tableNumber: "T-5",
      customerName: "Johnson",
      items: [
        { id: "4", name: "Margherita Pizza", quantity: 1, status: "preparing", station: "pizza" },
        { id: "5", name: "House Wine", quantity: 2, status: "ready", station: "bar" }
      ],
      status: "preparing",
      orderTime: "8:02 PM",
      estimatedTime: 8,
      priority: "high",
      totalAmount: 34.00
    },
    {
      id: "ORD-003",
      tableNumber: "T-8",
      customerName: "Davis Party",
      items: [
        { id: "6", name: "Buffalo Wings", quantity: 2, status: "ready", station: "fryer" },
        { id: "7", name: "BBQ Ribs", quantity: 1, status: "preparing", station: "grill" },
        { id: "8", name: "Onion Rings", quantity: 1, status: "ready", station: "fryer" }
      ],
      status: "ready",
      orderTime: "7:30 PM",
      estimatedTime: 0,
      priority: "urgent",
      totalAmount: 89.25
    }
  ]);

  const [tables] = useState<Table[]>([
    { id: "1", number: "T-1", seats: 2, status: "available", position: { x: 50, y: 100 } },
    { id: "2", number: "T-2", seats: 4, status: "available", position: { x: 200, y: 100 } },
    { id: "3", number: "T-3", seats: 2, status: "available", position: { x: 350, y: 100 } },
    { id: "4", number: "T-4", seats: 6, status: "available", position: { x: 500, y: 100 } },
    { id: "5", number: "T-5", seats: 4, status: "occupied", orderId: "ORD-002", position: { x: 100, y: 250 } },
    { id: "6", number: "T-6", seats: 2, status: "available", position: { x: 300, y: 250 } },
    { id: "7", number: "T-7", seats: 4, status: "needs-cleaning", position: { x: 450, y: 250 } },
    { id: "8", number: "T-8", seats: 8, status: "occupied", orderId: "ORD-003", position: { x: 150, y: 400 } },
    { id: "9", number: "T-9", seats: 2, status: "reserved", position: { x: 400, y: 400 } },
    { id: "10", number: "T-10", seats: 4, status: "available", position: { x: 250, y: 550 } },
    { id: "11", number: "T-11", seats: 6, status: "available", position: { x: 450, y: 550 } },
    { id: "12", number: "T-12", seats: 4, status: "occupied", orderId: "ORD-001", position: { x: 50, y: 550 } }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'served': return 'bg-gray-100 text-gray-800';
      case 'paid': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#e8f5e8';
      case 'occupied': return '#fef3c7';
      case 'needs-cleaning': return '#fee2e2';
      case 'reserved': return '#e0e7ff';
      default: return '#f3f4f6';
    }
  };

  const getElapsedTime = (orderTime: string) => {
    // Simplified time calculation for demo
    const elapsed = Math.floor(Math.random() * 45) + 5;
    return elapsed;
  };

  const filteredOrders = selectedStation === 'all' 
    ? orders 
    : orders.filter(order => 
        order.items.some(item => item.station === selectedStation)
      );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#654321' }}>
              Orders Management
            </h1>
            <p className="text-sm" style={{ color: '#8b795e' }}>
              Kitchen video system and floor plan management
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView(currentView === 'kvs' ? 'floor' : 'kvs')}
              style={{ borderColor: '#8b795e', color: '#654321' }}
            >
              {currentView === 'kvs' ? <Grid3X3 className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {currentView === 'kvs' ? 'Floor Plan' : 'Kitchen View'}
            </Button>
            <Button 
              variant="outline"
              style={{ borderColor: '#8b795e', color: '#654321' }}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              className="bg-[#8b795e] hover:bg-[#6d5d4f] text-white"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Orders
            </Button>
          </div>
        </div>

        {/* Order Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm" style={{ color: '#654321' }}>
                Active Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1" style={{ color: '#654321' }}>
                {orders.filter(o => o.status !== 'paid').length}
              </div>
              <p className="text-xs" style={{ color: '#8b795e' }}>
                {orders.filter(o => o.status === 'new').length} new orders
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm" style={{ color: '#654321' }}>
                Average Wait Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1" style={{ color: '#654321' }}>
                18 min
              </div>
              <p className="text-xs text-green-600">
                -3 min from yesterday
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm" style={{ color: '#654321' }}>
                Orders Ready
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1" style={{ color: '#654321' }}>
                {orders.filter(o => o.status === 'ready').length}
              </div>
              <p className="text-xs" style={{ color: '#8b795e' }}>
                Awaiting pickup
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm" style={{ color: '#654321' }}>
                Revenue Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1" style={{ color: '#654321' }}>
                ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
              </div>
              <p className="text-xs" style={{ color: '#8b795e' }}>
                From {orders.length} orders
              </p>
            </CardContent>
          </Card>
        </div>

        {currentView === 'kvs' ? (
          <div className="space-y-6">
            {/* Kitchen Station Filter */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium" style={{ color: '#654321' }}>
                Station:
              </label>
              <Select value={selectedStation} onValueChange={setSelectedStation}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stations</SelectItem>
                  <SelectItem value="grill">Grill</SelectItem>
                  <SelectItem value="pizza">Pizza</SelectItem>
                  <SelectItem value="salad">Salad</SelectItem>
                  <SelectItem value="fryer">Fryer</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* KVS Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className="relative"
                  style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}
                >
                  {/* Priority Indicator */}
                  <div 
                    className={`absolute top-0 left-0 w-1 h-full ${getPriorityColor(order.priority)}`}
                  ></div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg" style={{ color: '#654321' }}>
                          {order.tableNumber}
                        </CardTitle>
                        <CardDescription style={{ color: '#8b795e' }}>
                          {order.customerName} • {order.orderTime}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <div className="text-xs mt-1 flex items-center gap-1" style={{ color: '#8b795e' }}>
                          <Timer className="h-3 w-3" />
                          {order.estimatedTime > 0 ? `${order.estimatedTime} min` : 'Ready'}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {order.items.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-2 rounded border"
                        style={{ backgroundColor: '#f8f9fa', borderColor: '#e5cf97' }}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm" style={{ color: '#654321' }}>
                            {item.quantity}x {item.name}
                          </div>
                          {item.modifications && (
                            <div className="text-xs" style={{ color: '#8b795e' }}>
                              {item.modifications}
                            </div>
                          )}
                          <div className="text-xs flex items-center gap-1 mt-1">
                            <ChefHat className="h-3 w-3" style={{ color: '#8b795e' }} />
                            <span style={{ color: '#8b795e' }}>{item.station}</span>
                          </div>
                        </div>
                        <Badge 
                          className={`text-xs ${getStatusColor(item.status)}`}
                        >
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                    
                    {order.specialInstructions && (
                      <div className="p-2 rounded" style={{ backgroundColor: '#fef3c7', border: '1px solid #f59e0b' }}>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm text-yellow-800">Special Instructions</div>
                            <div className="text-xs text-yellow-700">{order.specialInstructions}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: '#e5cf97' }}>
                      <div className="text-sm" style={{ color: '#8b795e' }}>
                        Elapsed: {getElapsedTime(order.orderTime)} min
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          style={{ borderColor: '#8b795e', color: '#654321' }}
                        >
                          <Bell className="h-3 w-3 mr-1" />
                          Alert
                        </Button>
                        {order.status === 'ready' && (
                          <Button 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Served
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Floor Plan View */}
            <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
              <CardHeader>
                <CardTitle style={{ color: '#654321' }}>Restaurant Floor Plan</CardTitle>
                <CardDescription style={{ color: '#8b795e' }}>
                  Interactive table layout with order status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-[600px] border rounded-lg overflow-hidden" style={{ backgroundColor: '#f8f9fa' }}>
                  {tables.map((table) => {
                    const tableOrder = orders.find(order => order.id === table.orderId);
                    return (
                      <div
                        key={table.id}
                        className="absolute rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-105"
                        style={{
                          left: `${table.position.x}px`,
                          top: `${table.position.y}px`,
                          width: table.seats <= 2 ? '60px' : table.seats <= 4 ? '80px' : '100px',
                          height: table.seats <= 2 ? '60px' : table.seats <= 4 ? '80px' : '100px',
                          backgroundColor: getTableStatusColor(table.status),
                          borderColor: table.status === 'occupied' ? '#f59e0b' : '#d1d5db'
                        }}
                      >
                        <div className="text-center">
                          <div className="font-bold text-sm" style={{ color: '#654321' }}>
                            {table.number}
                          </div>
                          <div className="text-xs" style={{ color: '#8b795e' }}>
                            {table.seats} seats
                          </div>
                          {tableOrder && (
                            <div className="text-xs mt-1">
                              <Badge className={`text-xs ${getStatusColor(tableOrder.status)}`}>
                                {tableOrder.status}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Legend */}
                  <div className="absolute bottom-4 right-4 p-4 rounded-lg border" style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
                    <h4 className="font-semibold mb-2 text-sm" style={{ color: '#654321' }}>Table Status</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded border" style={{ backgroundColor: '#e8f5e8' }}></div>
                        <span style={{ color: '#8b795e' }}>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded border" style={{ backgroundColor: '#fef3c7' }}></div>
                        <span style={{ color: '#8b795e' }}>Occupied</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded border" style={{ backgroundColor: '#fee2e2' }}></div>
                        <span style={{ color: '#8b795e' }}>Needs Cleaning</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded border" style={{ backgroundColor: '#e0e7ff' }}></div>
                        <span style={{ color: '#8b795e' }}>Reserved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}