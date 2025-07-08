import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MenuItem } from '@/shared/schema';
import { 
  Package, 
  AlertTriangle, 
  RefreshCw, 
  Mail, 
  Search, 
  Mic, 
  Bot, 
  Plus, 
  Edit, 
  ShoppingCart, 
  Calendar,
  Check,
  X,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Truck,
  FileText,
  Activity,
  Filter,
  Eye,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Zap,
  Target,
  Box
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StandardLayout from '@/components/StandardLayout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StockItem extends MenuItem {
  onHand: number;
  threshold: number;
  reorderQty: number;
  supplier: string;
  lastPO?: string;
  lastPODate?: string;
  cost: number;
  totalValue: number;
  daysOfStock: number;
}

interface PurchaseOrder {
  id: string;
  items: Array<{
    itemId: number;
    name: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
  supplier: string;
  status: 'pending' | 'approved' | 'ordered' | 'received';
  createdAt: string;
  totalAmount: number;
}

interface StockActivity {
  id: string;
  action: string;
  item?: string;
  timestamp: string;
  details: string;
  type: 'reorder' | 'po_created' | 'invoice_sent' | 'stock_updated' | 'threshold_changed';
}

// Stock Summary Cards Component
const StockSummaryCards = ({ stockItems }: { stockItems: StockItem[] }) => {
  const totalSKUs = stockItems.length;
  const belowThreshold = stockItems.filter(item => item.onHand < item.threshold).length;
  const pendingPOs = 3; // Mock data - would come from API
  const overdueInvoices = 2; // Mock data - would come from API
  const totalValue = stockItems.reduce((sum, item) => sum + item.totalValue, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total SKUs</p>
              <p className="text-2xl font-bold">{totalSKUs}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">Total Value: ${totalValue.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Below Threshold</p>
              <p className="text-2xl font-bold text-orange-600">{belowThreshold}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
          <div className="mt-2">
            <Badge variant="destructive" className="text-xs">
              {((belowThreshold / totalSKUs) * 100).toFixed(1)}% of inventory
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending POs</p>
              <p className="text-2xl font-bold text-blue-600">{pendingPOs}</p>
            </div>
            <RefreshCw className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">Awaiting approval</p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Invoices</p>
              <p className="text-2xl font-bold text-red-600">{overdueInvoices}</p>
            </div>
            <Mail className="h-8 w-8 text-red-600" />
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">Requires attention</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ChatOps Panel Component
const ChatOpsPanel = ({ onCommand, isExpanded, onToggle }: {
  onCommand: (command: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickCommands = [
    "Show low-stock items",
    "Create PO for critical items",
    "Run weekly stock report",
    "Check supplier performance",
    "Update reorder thresholds",
    "Generate cost analysis"
  ];

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    await onCommand(message.trim());
    setMessage('');
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        <Button
          onClick={onToggle}
          className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
      ) : (
        <Card className="w-80 max-h-96 bg-white shadow-xl border-2 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Stock ChatOps</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={onToggle}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Commands */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Commands</Label>
              <div className="flex flex-wrap gap-1">
                {quickCommands.slice(0, 3).map((cmd, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onCommand(cmd)}
                    className="text-xs"
                  >
                    {cmd}
                  </Button>
                ))}
              </div>
            </div>

            {/* Command Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter stock command..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                disabled={isLoading}
                className="text-sm"
              />
              <Button 
                onClick={handleSubmit}
                disabled={isLoading || !message.trim()}
                size="sm"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Activity Feed Component
const ActivityFeed = ({ activities }: { activities: StockActivity[] }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'reorder': return <ShoppingCart className="h-4 w-4 text-blue-600" />;
      case 'po_created': return <FileText className="h-4 w-4 text-green-600" />;
      case 'invoice_sent': return <Mail className="h-4 w-4 text-orange-600" />;
      case 'stock_updated': return <Box className="h-4 w-4 text-purple-600" />;
      case 'threshold_changed': return <Target className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500 truncate">{activity.details}</p>
                  <p className="text-xs text-gray-400">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Stock Table Component
const StockTable = ({ stockItems, onReorder, onEdit }: {
  stockItems: StockItem[];
  onReorder: (item: StockItem) => void;
  onEdit: (item: StockItem) => void;
}) => {
  const [sortBy, setSortBy] = useState<'name' | 'onHand' | 'threshold' | 'daysOfStock'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedItems = [...stockItems].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * direction;
    }
    return (aVal - bVal) * direction;
  });

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const getStockStatus = (item: StockItem) => {
    if (item.onHand === 0) return { color: 'text-red-600', bg: 'bg-red-100', label: 'Out of Stock' };
    if (item.onHand < item.threshold) return { color: 'text-orange-600', bg: 'bg-orange-100', label: 'Low Stock' };
    if (item.daysOfStock < 7) return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Reorder Soon' };
    return { color: 'text-green-600', bg: 'bg-green-100', label: 'In Stock' };
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">
              <Button variant="ghost" onClick={() => handleSort('name')} className="h-8 p-0">
                Item {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </Button>
            </TableHead>
            <TableHead className="w-[100px] text-right">
              <Button variant="ghost" onClick={() => handleSort('onHand')} className="h-8 p-0">
                On Hand {sortBy === 'onHand' && (sortDirection === 'asc' ? '↑' : '↓')}
              </Button>
            </TableHead>
            <TableHead className="w-[100px] text-right">
              <Button variant="ghost" onClick={() => handleSort('threshold')} className="h-8 p-0">
                Threshold {sortBy === 'threshold' && (sortDirection === 'asc' ? '↑' : '↓')}
              </Button>
            </TableHead>
            <TableHead className="w-[100px] text-right">Reorder Qty</TableHead>
            <TableHead className="w-[120px]">Supplier</TableHead>
            <TableHead className="w-[100px]">Last PO</TableHead>
            <TableHead className="w-[100px] text-right">
              <Button variant="ghost" onClick={() => handleSort('daysOfStock')} className="h-8 p-0">
                Days Left {sortBy === 'daysOfStock' && (sortDirection === 'asc' ? '↑' : '↓')}
              </Button>
            </TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => {
            const status = getStockStatus(item);
            return (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <Package className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span className={`font-medium ${status.color}`}>{item.onHand}</span>
                    <span className="text-xs text-gray-500">{item.unitOfMeasure || 'units'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm">{item.threshold}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm font-medium">{item.reorderQty}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{item.supplier}</span>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {item.lastPO ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-blue-600 cursor-pointer">{item.lastPO}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.lastPODate}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className={`${status.bg} ${status.color} text-xs`}>
                    {item.daysOfStock}d
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReorder(item)}
                      disabled={item.onHand >= item.threshold}
                    >
                      <ShoppingCart className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

// Main Stock Page Component
export default function StockPage() {
  const [activeTab, setActiveTab] = useState('stock-health');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'low-stock' | 'out-of-stock' | 'reorder-soon'>('all');
  const [isListening, setIsListening] = useState(false);
  const [chatOpsExpanded, setChatOpsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [showReorderDialog, setShowReorderDialog] = useState(false);
  const { toast } = useToast();

  // Fetch menu items and transform to stock items
  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/restaurants/1/menu'],
  });

  // Transform menu items to stock items with mock stock data
  const stockItems: StockItem[] = menuItems.map((item, index) => ({
    ...item,
    onHand: Math.floor(Math.random() * 100) + 10,
    threshold: Math.floor(Math.random() * 20) + 5,
    reorderQty: Math.floor(Math.random() * 50) + 20,
    supplier: ['Sysco', 'US Foods', 'Performance Food Group', 'Local Farms', 'Specialty Distributor'][index % 5],
    lastPO: index % 3 === 0 ? `PO-${1000 + index}` : undefined,
    lastPODate: index % 3 === 0 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString() : undefined,
    cost: parseFloat(item.price) * 0.6, // Mock cost at 60% of sale price
    totalValue: (Math.floor(Math.random() * 100) + 10) * (parseFloat(item.price) * 0.6),
    daysOfStock: Math.floor(Math.random() * 30) + 1
  }));

  // Mock activity data
  const activities: StockActivity[] = [
    {
      id: '1',
      action: 'Auto-PO created',
      item: 'Buffalo Wings',
      timestamp: '2 hours ago',
      details: 'PO-1045 for 50 units sent to Sysco',
      type: 'po_created'
    },
    {
      id: '2',
      action: 'Stock threshold updated',
      item: 'Korean Fried Chicken',
      timestamp: '4 hours ago',
      details: 'Threshold changed from 10 to 15 units',
      type: 'threshold_changed'
    },
    {
      id: '3',
      action: 'Inventory updated',
      item: 'Wagyu Beef Burger',
      timestamp: '6 hours ago',
      details: 'Stock count adjusted to 23 units',
      type: 'stock_updated'
    },
    {
      id: '4',
      action: 'Invoice sent',
      item: 'Multiple items',
      timestamp: '1 day ago',
      details: 'INV-2024-001 sent to US Foods',
      type: 'invoice_sent'
    },
    {
      id: '5',
      action: 'Reorder triggered',
      item: 'Plant-Based Patty',
      timestamp: '1 day ago',
      details: 'Automatic reorder for 30 units',
      type: 'reorder'
    }
  ];

  // Filter stock items based on search and filter criteria
  const filteredStockItems = stockItems.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterBy === 'all' || 
      (filterBy === 'low-stock' && item.onHand < item.threshold) ||
      (filterBy === 'out-of-stock' && item.onHand === 0) ||
      (filterBy === 'reorder-soon' && item.daysOfStock < 7);

    return matchesSearch && matchesFilter;
  });

  // ChatOps command handler
  const handleChatOpsCommand = async (command: string) => {
    try {
      const response = await fetch('/api/chatops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: command,
          restaurantId: 1
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "ChatOps Executed",
          description: result.action || "Command processed successfully",
        });
        
        // Handle specific commands
        if (command.toLowerCase().includes('low-stock')) {
          setFilterBy('low-stock');
        } else if (command.toLowerCase().includes('out-of-stock')) {
          setFilterBy('out-of-stock');
        }
      } else {
        toast({
          title: "ChatOps Error",
          description: result.error || "Failed to process command",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to ChatOps system",
        variant: "destructive",
      });
    }
  };

  // Reorder handler
  const handleReorder = (item: StockItem) => {
    setSelectedItem(item);
    setShowReorderDialog(true);
  };

  // Edit handler
  const handleEdit = (item: StockItem) => {
    toast({
      title: "Edit Item",
      description: `Opening editor for ${item.name}`,
    });
  };

  // Voice command handler
  const handleVoiceCommand = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support voice recognition",
        variant: "destructive",
      });
      return;
    }

    setIsListening(true);
    const recognition = new (window as any).webkitSpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      
      // Also send to ChatOps if it's a command
      if (transcript.toLowerCase().includes('show') || transcript.toLowerCase().includes('find')) {
        handleChatOpsCommand(transcript);
      }
    };

    recognition.onerror = () => {
      toast({
        title: "Voice Error",
        description: "Could not recognize speech. Please try again.",
        variant: "destructive",
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (isLoading) {
    return (
      <StandardLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Stock Management</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setChatOpsExpanded(true)}>
              <Bot className="h-4 w-4 mr-2" />
              ChatOps
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Stock Summary Cards */}
        <StockSummaryCards stockItems={stockItems} />

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stock-health">Stock Health</TabsTrigger>
            <TabsTrigger value="auto-reorder">Auto-Reorder</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="stock-health" className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search items, categories, or suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceCommand}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 ${isListening ? 'text-red-500' : 'text-gray-400'}`}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
              <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="reorder-soon">Reorder Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stock Table */}
            <StockTable 
              stockItems={filteredStockItems}
              onReorder={handleReorder}
              onEdit={handleEdit}
            />
          </TabsContent>

          <TabsContent value="auto-reorder" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Reorder Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Configure automatic reordering rules and thresholds.</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-Reorder Enabled</p>
                      <p className="text-sm text-gray-500">Automatically create purchase orders when items are low</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Weekly Reports</p>
                      <p className="text-sm text-gray-500">Generate and email weekly stock reports</p>
                    </div>
                    <Button variant="outline">Schedule</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityFeed activities={activities} />
              <Card>
                <CardHeader>
                  <CardTitle>Stock Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Items restocked this week</span>
                      <Badge variant="outline">12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Purchase orders created</span>
                      <Badge variant="outline">8</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average days of stock</span>
                      <Badge variant="outline">14.5</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* ChatOps Panel */}
        <ChatOpsPanel
          onCommand={handleChatOpsCommand}
          isExpanded={chatOpsExpanded}
          onToggle={() => setChatOpsExpanded(!chatOpsExpanded)}
        />

        {/* Reorder Dialog */}
        <Dialog open={showReorderDialog} onOpenChange={setShowReorderDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
              <DialogDescription>
                Generate a purchase order for {selectedItem?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Current Stock</Label>
                  <p className="text-lg font-semibold">{selectedItem?.onHand} units</p>
                </div>
                <div>
                  <Label>Reorder Quantity</Label>
                  <p className="text-lg font-semibold">{selectedItem?.reorderQty} units</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReorderDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "Purchase Order Created",
                    description: `PO created for ${selectedItem?.name}`,
                  });
                  setShowReorderDialog(false);
                }}>
                  Create PO
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </StandardLayout>
  );
}