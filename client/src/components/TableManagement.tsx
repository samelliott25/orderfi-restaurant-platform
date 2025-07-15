import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Edit,
  Trash2,
  QrCode,
  DollarSign,
  Timer,
  UserCheck,
  Coffee
} from 'lucide-react';

interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentOrder?: {
    id: string;
    customerName: string;
    startTime: string;
    items: number;
    total: number;
  };
  reservations?: {
    id: string;
    customerName: string;
    time: string;
    partySize: number;
  }[];
  qrCode: string;
  section: string;
  notes?: string;
}

interface TableManagementProps {
  isAddTableOpen?: boolean;
  onAddTableOpenChange?: (open: boolean) => void;
}

export default function TableManagement({ 
  isAddTableOpen = false, 
  onAddTableOpenChange = () => {} 
}: TableManagementProps) {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [newTable, setNewTable] = useState({
    number: '',
    capacity: 4,
    section: 'main'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tables
  const { data: tables = [], isLoading } = useQuery<Table[]>({
    queryKey: ['/api/tables'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Add table mutation
  const addTableMutation = useMutation({
    mutationFn: (table: any) => apiRequest('/api/tables', {
      method: 'POST',
      body: table
    }),
    onSuccess: () => {
      toast({
        title: "Table Added",
        description: "New table has been added successfully.",
      });
      onAddTableOpenChange(false);
      setNewTable({ number: '', capacity: 4, section: 'main' });
      queryClient.invalidateQueries({ queryKey: ['/api/tables'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add table.",
        variant: "destructive",
      });
    }
  });

  // Update table status mutation
  const updateTableStatus = useMutation({
    mutationFn: ({ tableId, status }: { tableId: string; status: string }) =>
      apiRequest(`/api/tables/${tableId}/status`, {
        method: 'PATCH',
        body: { status }
      }),
    onSuccess: () => {
      toast({
        title: "Table Status Updated",
        description: "Table status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tables'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update table status.",
        variant: "destructive",
      });
    }
  });

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return { className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Available', icon: CheckCircle };
      case 'occupied':
        return { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Occupied', icon: Users };
      case 'reserved':
        return { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Reserved', icon: Clock };
      case 'cleaning':
        return { className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', label: 'Cleaning', icon: AlertCircle };
      default:
        return { className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', label: 'Unknown', icon: AlertCircle };
    }
  };

  // Calculate table occupancy time
  const getOccupancyTime = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  };

  // Mock data for demonstration
  const mockTables: Table[] = [
    {
      id: '1',
      number: '1',
      capacity: 4,
      status: 'occupied',
      currentOrder: {
        id: 'ORD-001',
        customerName: 'John Doe',
        startTime: new Date(Date.now() - 45 * 60000).toISOString(),
        items: 3,
        total: 45.50
      },
      qrCode: 'QR-TABLE-001',
      section: 'main'
    },
    {
      id: '2',
      number: '2',
      capacity: 2,
      status: 'available',
      qrCode: 'QR-TABLE-002',
      section: 'main'
    },
    {
      id: '3',
      number: '3',
      capacity: 6,
      status: 'reserved',
      reservations: [{
        id: 'RES-001',
        customerName: 'Jane Smith',
        time: new Date(Date.now() + 30 * 60000).toISOString(),
        partySize: 4
      }],
      qrCode: 'QR-TABLE-003',
      section: 'main'
    },
    {
      id: '4',
      number: '4',
      capacity: 4,
      status: 'cleaning',
      qrCode: 'QR-TABLE-004',
      section: 'patio'
    }
  ];

  const displayTables = tables.length > 0 ? tables : mockTables;

  // Group tables by section
  const tablesBySection = displayTables.reduce((acc, table) => {
    if (!acc[table.section]) {
      acc[table.section] = [];
    }
    acc[table.section].push(table);
    return acc;
  }, {} as Record<string, Table[]>);

  return (
    <div className="space-y-6">
      {/* Add Table Dialog */}
      <Dialog open={isAddTableOpen} onOpenChange={onAddTableOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="table-number">Table Number</Label>
                <Input
                  id="table-number"
                  value={newTable.number}
                  onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
                  placeholder="e.g., 1, A1, VIP-1"
                />
              </div>
              <div>
                <Label htmlFor="table-capacity">Capacity</Label>
                <Select value={newTable.capacity.toString()} onValueChange={(value) => setNewTable({ ...newTable, capacity: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 people</SelectItem>
                    <SelectItem value="4">4 people</SelectItem>
                    <SelectItem value="6">6 people</SelectItem>
                    <SelectItem value="8">8 people</SelectItem>
                    <SelectItem value="10">10 people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="table-section">Section</Label>
                <Select value={newTable.section} onValueChange={(value) => setNewTable({ ...newTable, section: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Dining</SelectItem>
                    <SelectItem value="patio">Patio</SelectItem>
                    <SelectItem value="bar">Bar Area</SelectItem>
                    <SelectItem value="private">Private Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => addTableMutation.mutate(newTable)}
                disabled={!newTable.number || addTableMutation.isPending}
                className="w-full"
              >
                Add Table
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      {/* Tables by Section */}
      {Object.entries(tablesBySection).map(([section, sectionTables]) => (
        <div key={section} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize text-muted-foreground">
            {section.replace('-', ' ')} Section
          </h3>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sectionTables.map((table) => {
              const statusBadge = getStatusBadge(table.status);
              const StatusIcon = statusBadge.icon;

              return (
                <Card 
                  key={table.id}
                  className={`relative overflow-hidden backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    table.status === 'occupied' ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedTable(table)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10"></div>
                  
                  <CardHeader className="pb-3 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {table.number}
                        </div>
                        <div>
                          <CardTitle className="text-lg">Table {table.number}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {table.capacity} seats
                          </p>
                        </div>
                      </div>
                      <Badge className={statusBadge.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusBadge.label}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 relative">
                    {/* Current Order Info */}
                    {table.currentOrder && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-800 dark:text-blue-200">
                              {table.currentOrder.customerName}
                            </span>
                          </div>
                          <span className="text-sm text-blue-600 font-medium">
                            {getOccupancyTime(table.currentOrder.startTime)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-blue-700 dark:text-blue-300">
                          <span>{table.currentOrder.items} items</span>
                          <span className="font-bold">${table.currentOrder.total.toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    {/* Reservation Info */}
                    {table.reservations && table.reservations.length > 0 && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium text-yellow-800 dark:text-yellow-200">
                            Reserved
                          </span>
                        </div>
                        {table.reservations.map((reservation) => (
                          <div key={reservation.id} className="text-sm text-yellow-700 dark:text-yellow-300">
                            <p className="font-medium">{reservation.customerName}</p>
                            <p>
                              {new Date(reservation.time).toLocaleTimeString()} - {reservation.partySize} people
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Table Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Generate QR code or show QR code modal
                          toast({
                            title: "QR Code",
                            description: `QR Code for Table ${table.number}: ${table.qrCode}`,
                          });
                        }}
                        className="flex-1"
                      >
                        <QrCode className="h-3 w-3 mr-1" />
                        QR Code
                      </Button>
                      
                      {table.status === 'available' && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTableStatus.mutate({ tableId: table.id, status: 'occupied' });
                          }}
                          className="flex-1"
                        >
                          <Users className="h-3 w-3 mr-1" />
                          Seat
                        </Button>
                      )}
                      
                      {table.status === 'occupied' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTableStatus.mutate({ tableId: table.id, status: 'cleaning' });
                          }}
                          className="flex-1"
                        >
                          <Coffee className="h-3 w-3 mr-1" />
                          Clear
                        </Button>
                      )}
                      
                      {table.status === 'cleaning' && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTableStatus.mutate({ tableId: table.id, status: 'available' });
                          }}
                          className="flex-1"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Clean
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {/* No Tables Message */}
      {displayTables.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Tables Found</h3>
          <p className="text-muted-foreground">Add your first table to get started</p>
        </div>
      )}
    </div>
  );
}