import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MenuItem } from '@/shared/schema';
import { Search, Mic, Plus, Package, AlertTriangle, DollarSign, TrendingUp, X, BarChart3, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StandardLayout from '@/components/StandardLayout';

// Filter chip component for visual filtering
const FilterChip = ({ label, isActive, onClick, onRemove }: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  onRemove: () => void;
}) => (
  <Button
    variant={isActive ? "default" : "outline"}
    size="sm"
    onClick={onClick}
    className="flex items-center gap-1"
  >
    {label}
    {isActive && (
      <X size={12} onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }} />
    )}
  </Button>
);

export default function SimplifiedInventoryPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  // Fetch menu items
  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu-items'],
  });

  // Calculate key metrics
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter((item: MenuItem) => item.isAvailable).length;
  const lowStockItems = menuItems.filter((item: MenuItem) => 
    item.trackInventory && (item.currentStock || 0) < (item.lowStockThreshold || 10)
  ).length;
  const totalValue = menuItems.reduce((sum: number, item: MenuItem) => 
    sum + (parseFloat(item.price) * (item.currentStock || 0)), 0
  );

  // Filter options
  const filterOptions = [
    { id: 'low-stock', label: 'Low Stock', icon: AlertTriangle },
    { id: 'under-10', label: 'Under $10', icon: DollarSign },
    { id: 'vegan', label: 'Vegan', icon: Package },
    { id: 'gluten-free', label: 'Gluten Free', icon: CheckCircle },
  ];

  // Filter logic
  const filteredItems = menuItems.filter((item: MenuItem) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilters = activeFilters.length === 0 || activeFilters.every(filter => {
      switch (filter) {
        case 'low-stock':
          return item.trackInventory && (item.currentStock || 0) < (item.lowStockThreshold || 10);
        case 'under-10':
          return parseFloat(item.price) < 10;
        case 'vegan':
          return item.dietaryTags && item.dietaryTags.includes('vegan');
        case 'gluten-free':
          return item.dietaryTags && item.dietaryTags.includes('gluten-free');
        default:
          return true;
      }
    });

    return matchesSearch && matchesFilters;
  });

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters(prev => prev.filter(id => id !== filterId));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  const getStockStatus = (item: MenuItem) => {
    if (!item.trackInventory) {
      return { label: 'Always Available', color: 'text-green-600', icon: CheckCircle };
    }
    
    const stock = item.currentStock || 0;
    const threshold = item.lowStockThreshold || 10;
    
    if (stock === 0) {
      return { label: 'Out of Stock', color: 'text-red-600', icon: AlertTriangle };
    } else if (stock < threshold) {
      return { label: 'Low Stock', color: 'text-yellow-600', icon: AlertTriangle };
    } else {
      return { label: 'In Stock', color: 'text-green-600', icon: CheckCircle };
    }
  };

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

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      toast({
        title: "Voice command received",
        description: `Searching for: "${transcript}"`,
      });
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: "Voice error",
        description: "Could not recognize speech. Please try again.",
        variant: "destructive",
      });
    };

    recognition.start();
  };

  if (isLoading) {
    return (
      <StandardLayout title="Inventory Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading inventory...</div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout title="Inventory Management">
      <div className="space-y-6">
        {/* Header with Add New Item button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Simplified Inventory
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your {totalItems} menu items with ease
            </p>
          </div>
          <Button>
            <Plus size={16} className="mr-2" />
            Add New Item
          </Button>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex flex-col items-center space-y-1">
              <BarChart3 size={16} />
              <span className="text-xs">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex flex-col items-center space-y-1">
              <Package size={16} />
              <span className="text-xs">By Category</span>
            </TabsTrigger>
            <TabsTrigger value="items" className="flex flex-col items-center space-y-1">
              <Search size={16} />
              <span className="text-xs">Search Items</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex flex-col items-center space-y-1">
              <TrendingUp size={16} />
              <span className="text-xs">Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalItems}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Available Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{availableItems}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Low Stock Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">${totalValue.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Korean Fried Chicken Taco stock updated</span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cape Byron Beef Burger price changed</span>
                    <span className="text-xs text-gray-500">4 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Buffalo Wings running low on stock</span>
                    <span className="text-xs text-gray-500">6 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab Content */}
          <TabsContent value="categories" className="space-y-6">
            {/* Group items by category */}
            {Object.entries(
              menuItems.reduce((acc: Record<string, MenuItem[]>, item: MenuItem) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
              }, {})
            ).map(([category, items]) => (
              <div key={category} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category}
                  </h3>
                  <Badge variant="outline" className="text-sm">
                    {items.length} items
                  </Badge>
                </div>
                
                {/* Category Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item: MenuItem) => {
                    const stockStatus = getStockStatus(item);
                    const IconComponent = stockStatus.icon;
                    
                    return (
                      <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-medium truncate">
                              {item.name}
                            </CardTitle>
                            <IconComponent size={14} className={stockStatus.color} />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              ${parseFloat(item.price).toFixed(2)}
                            </div>
                            <Badge variant="outline" className={stockStatus.color}>
                              {stockStatus.label}
                            </Badge>
                          </div>
                          {item.trackInventory && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Stock: {item.currentStock || 0} units
                            </div>
                          )}
                          {item.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-2 line-clamp-2">
                              {item.description}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Items Tab Content */}
          <TabsContent value="items" className="space-y-6">
            {/* Search and filters */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search items, categories, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleVoiceCommand}
                  className={isListening ? 'bg-red-100 dark:bg-red-900' : ''}
                >
                  <Mic size={16} className={isListening ? 'text-red-500' : ''} />
                  {isListening ? 'Listening...' : 'Voice'}
                </Button>
              </div>

              {/* Filter chips */}
              <div className="flex flex-wrap gap-2">
                {filterOptions.map(option => (
                  <FilterChip
                    key={option.id}
                    label={option.label}
                    isActive={activeFilters.includes(option.id)}
                    onClick={() => toggleFilter(option.id)}
                    onRemove={() => removeFilter(option.id)}
                  />
                ))}
                {activeFilters.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item: MenuItem) => {
                const stockStatus = getStockStatus(item);
                const IconComponent = stockStatus.icon;
                
                return (
                  <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium truncate">
                          {item.name}
                        </CardTitle>
                        <IconComponent size={14} className={stockStatus.color} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          ${parseFloat(item.price).toFixed(2)}
                        </div>
                        <Badge variant="outline" className={stockStatus.color}>
                          {stockStatus.label}
                        </Badge>
                      </div>
                      {item.trackInventory && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Stock: {item.currentStock || 0} units
                        </div>
                      )}
                      {item.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-2 line-clamp-2">
                          {item.description}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Reports Tab Content */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 size={16} className="mr-2" />
                    Inventory Performance Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Package size={16} className="mr-2" />
                    Category Sales Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp size={16} className="mr-2" />
                    Top Performing Items
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle size={16} className="mr-2" />
                    Low Stock Alert Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StandardLayout>
  );
}