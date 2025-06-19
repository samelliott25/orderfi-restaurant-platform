import { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Printer,
  MessageSquare,
  X
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
  zone: number;
}

interface TableZone {
  id: number;
  name: string;
  color: string;
}

export default function AdminOrdersPage() {
  const [currentView, setCurrentView] = useState<'kvs' | 'floor'>('kvs');
  const [selectedStation, setSelectedStation] = useState<string>('all');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [messageText, setMessageText] = useState('');

  const [orders] = useState<Order[]>([
    {
      id: "ORD-001",
      tableNumber: "T-2",
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
      tableNumber: "T-7",
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
      tableNumber: "T-10",
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
    },
    {
      id: "ORD-004",
      tableNumber: "T-15",
      customerName: "Wilson",
      items: [
        { id: "9", name: "Fish & Chips", quantity: 1, status: "preparing", station: "fryer" },
        { id: "10", name: "Garden Salad", quantity: 1, status: "ready", station: "salad" }
      ],
      status: "preparing",
      orderTime: "8:15 PM",
      estimatedTime: 6,
      priority: "normal",
      totalAmount: 28.50
    },
    {
      id: "ORD-005",
      tableNumber: "T-23",
      customerName: "Martinez",
      items: [
        { id: "11", name: "Steak Dinner", quantity: 1, status: "preparing", station: "grill" },
        { id: "12", name: "Red Wine", quantity: 1, status: "ready", station: "bar" }
      ],
      status: "preparing",
      orderTime: "8:20 PM",
      estimatedTime: 15,
      priority: "normal",
      totalAmount: 45.00
    },
    {
      id: "ORD-006",
      tableNumber: "T-27",
      customerName: "Thompson Family",
      items: [
        { id: "13", name: "Family Pizza", quantity: 1, status: "preparing", station: "pizza" },
        { id: "14", name: "Garlic Bread", quantity: 2, status: "ready", station: "pizza" },
        { id: "15", name: "Soda", quantity: 4, status: "ready", station: "bar" }
      ],
      status: "preparing",
      orderTime: "7:55 PM",
      estimatedTime: 10,
      priority: "normal",
      totalAmount: 52.75
    }
  ]);

  const [tableZones] = useState<TableZone[]>([
    { id: 1, name: "Zone 1", color: "#e8f5e8" },
    { id: 2, name: "Zone 2", color: "#e8f0ff" },
    { id: 3, name: "Zone 3", color: "#fef3c7" },
    { id: 4, name: "Zone 4", color: "#fee2e2" },
    { id: 5, name: "Zone 5", color: "#f3e8ff" }
  ]);

  const [tables] = useState<Table[]>([
    // Zone 1 - Tables 1-6
    { id: "1", number: "T-1", seats: 2, status: "available", position: { x: 50, y: 80 }, zone: 1 },
    { id: "2", number: "T-2", seats: 4, status: "occupied", orderId: "ORD-001", position: { x: 150, y: 80 }, zone: 1 },
    { id: "3", number: "T-3", seats: 2, status: "available", position: { x: 250, y: 80 }, zone: 1 },
    { id: "4", number: "T-4", seats: 4, status: "needs-cleaning", position: { x: 50, y: 150 }, zone: 1 },
    { id: "5", number: "T-5", seats: 2, status: "reserved", position: { x: 150, y: 150 }, zone: 1 },
    { id: "6", number: "T-6", seats: 6, status: "available", position: { x: 250, y: 150 }, zone: 1 },
    
    // Zone 2 - Tables 7-12
    { id: "7", number: "T-7", seats: 4, status: "occupied", orderId: "ORD-002", position: { x: 400, y: 80 }, zone: 2 },
    { id: "8", number: "T-8", seats: 2, status: "available", position: { x: 500, y: 80 }, zone: 2 },
    { id: "9", number: "T-9", seats: 4, status: "available", position: { x: 600, y: 80 }, zone: 2 },
    { id: "10", number: "T-10", seats: 6, status: "occupied", orderId: "ORD-003", position: { x: 400, y: 150 }, zone: 2 },
    { id: "11", number: "T-11", seats: 2, status: "available", position: { x: 500, y: 150 }, zone: 2 },
    { id: "12", number: "T-12", seats: 4, status: "available", position: { x: 600, y: 150 }, zone: 2 },
    
    // Zone 3 - Tables 13-18
    { id: "13", number: "T-13", seats: 2, status: "available", position: { x: 50, y: 280 }, zone: 3 },
    { id: "14", number: "T-14", seats: 4, status: "available", position: { x: 150, y: 280 }, zone: 3 },
    { id: "15", number: "T-15", seats: 2, status: "occupied", position: { x: 250, y: 280 }, zone: 3 },
    { id: "16", number: "T-16", seats: 6, status: "available", position: { x: 50, y: 350 }, zone: 3 },
    { id: "17", number: "T-17", seats: 4, status: "needs-cleaning", position: { x: 150, y: 350 }, zone: 3 },
    { id: "18", number: "T-18", seats: 2, status: "available", position: { x: 250, y: 350 }, zone: 3 },
    
    // Zone 4 - Tables 19-24
    { id: "19", number: "T-19", seats: 4, status: "reserved", position: { x: 400, y: 280 }, zone: 4 },
    { id: "20", number: "T-20", seats: 2, status: "available", position: { x: 500, y: 280 }, zone: 4 },
    { id: "21", number: "T-21", seats: 4, status: "available", position: { x: 600, y: 280 }, zone: 4 },
    { id: "22", number: "T-22", seats: 6, status: "available", position: { x: 400, y: 350 }, zone: 4 },
    { id: "23", number: "T-23", seats: 2, status: "occupied", position: { x: 500, y: 350 }, zone: 4 },
    { id: "24", number: "T-24", seats: 4, status: "available", position: { x: 600, y: 350 }, zone: 4 },
    
    // Zone 5 - Tables 25-30
    { id: "25", number: "T-25", seats: 2, status: "available", position: { x: 150, y: 480 }, zone: 5 },
    { id: "26", number: "T-26", seats: 4, status: "available", position: { x: 250, y: 480 }, zone: 5 },
    { id: "27", number: "T-27", seats: 6, status: "occupied", position: { x: 350, y: 480 }, zone: 5 },
    { id: "28", number: "T-28", seats: 2, status: "available", position: { x: 450, y: 480 }, zone: 5 },
    { id: "29", number: "T-29", seats: 4, status: "needs-cleaning", position: { x: 550, y: 480 }, zone: 5 },
    { id: "30", number: "T-30", seats: 2, status: "available", position: { x: 350, y: 550 }, zone: 5 }
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

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setShowTableDialog(true);
  };

  const handleSendMessage = () => {
    // In a real app, this would send the message to the customer
    console.log(`Sending message to ${selectedTable?.number}: ${messageText}`);
    setMessageText('');
    setShowTableDialog(false);
  };

  const getSelectedTableOrder = () => {
    if (!selectedTable) return null;
    return orders.find(order => order.id === selectedTable.orderId);
  };

  const getZoneColor = (zoneId: number) => {
    const zone = tableZones.find(z => z.id === zoneId);
    return zone?.color || '#f3f4f6';
  };

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
            {/* Table Zones Overview */}
            <div className="grid grid-cols-5 gap-4">
              {tableZones.map((zone) => {
                const zoneTables = tables.filter(t => t.zone === zone.id);
                const occupiedTables = zoneTables.filter(t => t.status === 'occupied').length;
                return (
                  <Card key={zone.id} style={{ backgroundColor: zone.color, borderColor: '#e5cf97' }}>
                    <CardContent className="p-3">
                      <div className="text-center">
                        <h3 className="font-semibold text-sm" style={{ color: '#654321' }}>
                          {zone.name}
                        </h3>
                        <p className="text-xs" style={{ color: '#8b795e' }}>
                          Automated Service
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#8b795e' }}>
                          {occupiedTables}/{zoneTables.length} occupied
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Floor Plan View */}
            <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
              <CardHeader>
                <CardTitle style={{ color: '#654321' }}>Restaurant Floor Plan</CardTitle>
                <CardDescription style={{ color: '#8b795e' }}>
                  30 tables organized in 5 zones - Click any table for details and customer messaging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-[700px] border rounded-lg overflow-hidden" style={{ backgroundColor: '#f8f9fa' }}>
                  {/* Zone Labels */}
                  {tableZones.map((zone) => (
                    <div key={`label-${zone.id}`} className="absolute font-semibold text-lg" style={{ 
                      color: '#654321',
                      left: zone.id <= 2 ? (zone.id === 1 ? '150px' : '500px') : 
                            zone.id <= 4 ? (zone.id === 3 ? '150px' : '500px') : '350px',
                      top: zone.id <= 2 ? '40px' : zone.id <= 4 ? '240px' : '440px'
                    }}>
                      {zone.name} - Automated Service
                    </div>
                  ))}

                  {tables.map((table) => {
                    const tableOrder = orders.find(order => order.id === table.orderId);
                    const zoneColor = getZoneColor(table.zone);
                    
                    return (
                      <div
                        key={table.id}
                        className="absolute rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-110 hover:shadow-lg"
                        onClick={() => handleTableClick(table)}
                        style={{
                          left: `${table.position.x}px`,
                          top: `${table.position.y}px`,
                          width: table.seats <= 2 ? '60px' : table.seats <= 4 ? '80px' : '100px',
                          height: table.seats <= 2 ? '60px' : table.seats <= 4 ? '80px' : '100px',
                          backgroundColor: table.status === 'occupied' ? '#fef3c7' : 
                                         table.status === 'needs-cleaning' ? '#fee2e2' :
                                         table.status === 'reserved' ? '#e0e7ff' : zoneColor,
                          borderColor: table.status === 'occupied' ? '#f59e0b' : 
                                     table.status === 'needs-cleaning' ? '#ef4444' :
                                     table.status === 'reserved' ? '#6366f1' : '#d1d5db',
                          borderWidth: table.status === 'occupied' ? '3px' : '2px'
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
                  
                  {/* Legends */}
                  <div className="absolute bottom-4 left-4 p-4 rounded-lg border" style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
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

                  <div className="absolute bottom-4 right-4 p-4 rounded-lg border" style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
                    <h4 className="font-semibold mb-2 text-sm" style={{ color: '#654321' }}>Table Zones</h4>
                    <div className="space-y-1 text-xs">
                      {tableZones.map((zone) => (
                        <div key={zone.id} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded border" style={{ backgroundColor: zone.color }}></div>
                          <span style={{ color: '#8b795e' }}>{zone.name} - Automated Service</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Table Details Dialog */}
            <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
              <DialogContent className="max-w-2xl" style={{ backgroundColor: '#fff0cc' }}>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle style={{ color: '#654321' }}>
                        {selectedTable?.number} - Table Details
                      </DialogTitle>
                      <DialogDescription style={{ color: '#8b795e' }}>
                        {selectedTable?.seats} seats • {tableZones.find(z => z.id === selectedTable?.zone)?.name} • Automated Service
                      </DialogDescription>
                    </div>
                    <Badge className={selectedTable ? getStatusColor(selectedTable.status) : ''}>
                      {selectedTable?.status}
                    </Badge>
                  </div>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Current Order */}
                  {getSelectedTableOrder() ? (
                    <div>
                      <h3 className="font-semibold mb-3" style={{ color: '#654321' }}>Current Order</h3>
                      <Card style={{ backgroundColor: '#f8f9fa', borderColor: '#e5cf97' }}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-medium" style={{ color: '#654321' }}>
                                {getSelectedTableOrder()?.customerName}
                              </div>
                              <div className="text-sm" style={{ color: '#8b795e' }}>
                                Order Time: {getSelectedTableOrder()?.orderTime}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold" style={{ color: '#654321' }}>
                                ${getSelectedTableOrder()?.totalAmount.toFixed(2)}
                              </div>
                              <Badge className={getStatusColor(getSelectedTableOrder()?.status || '')}>
                                {getSelectedTableOrder()?.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {getSelectedTableOrder()?.items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: '#fff0cc' }}>
                                <div>
                                  <span className="font-medium" style={{ color: '#654321' }}>
                                    {item.quantity}x {item.name}
                                  </span>
                                  {item.modifications && (
                                    <div className="text-xs" style={{ color: '#8b795e' }}>
                                      {item.modifications}
                                    </div>
                                  )}
                                </div>
                                <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                                  {item.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                          
                          {getSelectedTableOrder()?.specialInstructions && (
                            <div className="mt-3 p-2 rounded" style={{ backgroundColor: '#fef3c7', border: '1px solid #f59e0b' }}>
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                <div>
                                  <div className="font-medium text-sm text-yellow-800">Special Instructions</div>
                                  <div className="text-xs text-yellow-700">{getSelectedTableOrder()?.specialInstructions}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center p-8" style={{ color: '#8b795e' }}>
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No active order for this table</p>
                    </div>
                  )}

                  {/* Send Message */}
                  <div>
                    <h3 className="font-semibold mb-3" style={{ color: '#654321' }}>Send Message to Table</h3>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Type your message to the customer..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-[#8b795e] hover:bg-[#6d5d4f] text-white"
                          onClick={handleSendMessage}
                          disabled={!messageText.trim()}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setShowTableDialog(false)}
                          style={{ borderColor: '#8b795e', color: '#654321' }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}