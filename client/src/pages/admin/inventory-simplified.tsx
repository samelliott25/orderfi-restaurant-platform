import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { StandardLayout } from '@/components/StandardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MenuItem } from '@/shared/schema';
import { Search, Mic, Plus, Package, AlertTriangle, DollarSign, TrendingUp, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Filter chip component for visual filtering
const FilterChip = ({ label, isActive, onClick, onRemove }: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  onRemove: () => void;
}) => (
  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
    isActive 
      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' 
      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
  }`}>
    <span onClick={onClick}>{label}</span>
    {isActive && (
      <X 
        size={14} 
        className="cursor-pointer hover:bg-white/20 rounded-full p-0.5" 
        onClick={onRemove}
      />
    )}
  </div>
);

// Recent items component
const RecentItems = ({ items }: { items: MenuItem[] }) => (
  <div className="mb-4">
    <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Recently Updated</h3>
    <div className="flex gap-2 flex-wrap">
      {items.slice(0, 5).map((item) => (
        <Badge key={item.id} variant="outline" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
          {item.name}
        </Badge>
      ))}
    </div>
  </div>
);

// Top movers component
const TopMovers = ({ items }: { items: MenuItem[] }) => (
  <div className="mb-4">
    <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Top Items</h3>
    <div className="flex gap-2 flex-wrap">
      {items.slice(0, 3).map((item) => (
        <Badge key={item.id} variant="secondary" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
          <TrendingUp size={12} className="mr-1" />
          {item.name}
        </Badge>
      ))}
    </div>
  </div>
);

export default function SimplifiedInventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isListening, setIsListening] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch menu items
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['/api/restaurants/1/menu'],
    queryFn: () => fetch('/api/restaurants/1/menu').then(res => res.json())
  });

  // Calculate key metrics
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter((item: MenuItem) => item.isAvailable).length;
  const lowStockItems = menuItems.filter((item: MenuItem) => 
    item.trackInventory && item.currentStock !== null && item.currentStock <= (item.lowStockThreshold || 5)
  ).length;
  const totalValue = menuItems.reduce((sum: number, item: MenuItem) => 
    sum + (parseFloat(item.price) * (item.currentStock || 0)), 0
  );

  // Filter options with easy-to-understand labels
  const filterOptions = [
    { id: 'low-stock', label: 'Low Stock', icon: AlertTriangle, color: 'text-red-500' },
    { id: 'under-10', label: 'Under $10', icon: DollarSign, color: 'text-green-500' },
    { id: 'under-20', label: 'Under $20', icon: DollarSign, color: 'text-blue-500' },
    { id: 'vegan', label: 'Vegan', icon: Package, color: 'text-green-600' },
    { id: 'gluten-free', label: 'Gluten Free', icon: Package, color: 'text-purple-500' },
  ];

  // Filter items based on search and active filters
  const filteredItems = menuItems.filter((item: MenuItem) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilters = activeFilters.every(filter => {
      switch (filter) {
        case 'low-stock':
          return item.trackInventory && item.currentStock !== null && item.currentStock <= (item.lowStockThreshold || 5);
        case 'under-10':
          return parseFloat(item.price) < 10;
        case 'under-20':
          return parseFloat(item.price) < 20;
        case 'vegan':
          return item.description?.toLowerCase().includes('vegan');
        case 'gluten-free':
          return item.description?.toLowerCase().includes('gf') || item.description?.toLowerCase().includes('gluten');
        default:
          return true;
      }
    });
    
    return matchesSearch && matchesFilters;
  });

  // Handle voice command
  const handleVoiceCommand = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      toast({
        title: "Voice command ready",
        description: "Say 'show low stock' or 'add new item'"
      });
    }, 2000);
  };

  // Toggle filter
  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  // Remove filter
  const removeFilter = (filterId: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filterId));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
  };

  // Get stock status color and icon
  const getStockStatus = (item: MenuItem) => {
    if (!item.trackInventory) return { color: 'text-gray-500', icon: Package, label: 'Not Tracked' };
    
    const stock = item.currentStock || 0;
    const threshold = item.lowStockThreshold || 5;
    
    if (stock <= threshold) return { color: 'text-red-500', icon: AlertTriangle, label: 'Low Stock' };
    if (stock <= threshold * 2) return { color: 'text-yellow-500', icon: Package, label: 'Moderate' };
    return { color: 'text-green-500', icon: Package, label: 'Healthy' };
  };

  if (isLoading) {
    return (
      <StandardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading inventory...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <div className="space-y-6">
        {/* Header with clear title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold playwrite-font text-gray-900 dark:text-white">
              Inventory Management
            </h1>
          </div>
          <Button 
            onClick={() => toast({ title: "Add Item", description: "Add new item functionality" })}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          >
            <Plus size={16} className="mr-2" />
            Add New Item
          </Button>
        </div>

        {/* Main navigation tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="items">Item List</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
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
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalItems}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Available Now
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {availableItems}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Low Stock Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">
                    {lowStockItems}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Inventory Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    ${totalValue.toFixed(0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent items and top movers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentItems items={menuItems} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <TopMovers items={menuItems} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Items List Tab */}
          <TabsContent value="items" className="space-y-4">
            {/* Search and filter bar */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search items or say what you want..."
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

              {/* Active filters display */}
              {activeFilters.length > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredItems.length} of {totalItems} items
                </div>
              )}
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
                        <CardTitle className="text-lg font-medium truncate">
                          {item.name}
                        </CardTitle>
                        <IconComponent size={16} className={stockStatus.color} />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.category}
                      </p>
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
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Categories Tab */}
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

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="text-center py-12">
              <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Reports & Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                View detailed reports on inventory performance and trends
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </StandardLayout>
  );
}