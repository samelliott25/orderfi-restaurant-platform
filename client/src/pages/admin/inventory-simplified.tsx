import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MenuItem } from '@/shared/schema';
import { Search, Mic, Plus, Package, AlertTriangle, DollarSign, TrendingUp, X, BarChart3, CheckCircle, Star, Clock, HelpCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StandardLayout from '@/components/StandardLayout';

// Filter chip component for visual filtering (replacing complex dropdowns)
const FilterChip = ({ label, isActive, onClick, onRemove, icon: Icon }: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  onRemove: () => void;
  icon?: any;
}) => (
  <Button
    variant={isActive ? "default" : "outline"}
    size="sm"
    onClick={onClick}
    className="flex items-center gap-2 h-11 px-4 text-sm font-medium"
  >
    {Icon && <Icon size={14} />}
    {label}
    {isActive && (
      <X size={12} onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }} className="ml-1 hover:bg-white/20 rounded-full p-0.5" />
    )}
  </Button>
);

// Recent activity item component
const RecentItem = ({ name, action, time }: { name: string; action: string; time: string }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
      <div>
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs text-gray-500 ml-2">{action}</span>
      </div>
    </div>
    <span className="text-xs text-gray-400">{time}</span>
  </div>
);

// Top mover item component
const TopMoverItem = ({ name, trend, sales }: { name: string; trend: 'up' | 'down'; sales: number }) => (
  <Card className="min-w-[200px] hover:shadow-md transition-shadow cursor-pointer">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-sm truncate">{name}</h4>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={12} className={trend === 'up' ? 'text-green-500' : 'text-red-500 rotate-180'} />
            <span className="text-xs text-gray-500">{sales} sold today</span>
          </div>
        </div>
        <Star size={14} className="text-yellow-500" />
      </div>
    </CardContent>
  </Card>
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

  // Filter options with icons
  const filterOptions = [
    { id: 'low-stock', label: 'Low Stock', icon: AlertTriangle, color: 'text-red-600' },
    { id: 'under-10', label: 'Under $10', icon: DollarSign, color: 'text-green-600' },
    { id: 'vegan', label: 'Vegan', icon: Package, color: 'text-green-600' },
    { id: 'gluten-free', label: 'Gluten Free', icon: CheckCircle, color: 'text-blue-600' },
    { id: 'high-value', label: 'High Value', icon: Star, color: 'text-yellow-600' },
  ];

  // Mock recent activity data
  const recentActivity = [
    { name: 'Korean Fried Chicken Taco', action: 'stock updated', time: '2 hours ago' },
    { name: 'Cape Byron Beef Burger', action: 'price changed', time: '4 hours ago' },
    { name: 'Buffalo Wings', action: 'running low', time: '6 hours ago' },
    { name: 'Plant-Powered Tacos', action: 'new item added', time: '1 day ago' },
    { name: 'Hand Cooked Tortillas', action: 'reordered', time: '2 days ago' },
  ];

  // Mock top movers data
  const topMovers = [
    { name: 'Korean Fried Chicken Taco', trend: 'up' as const, sales: 45 },
    { name: 'Buffalo Wings', trend: 'up' as const, sales: 38 },
    { name: 'Cape Byron Beef Burger', trend: 'down' as const, sales: 32 },
    { name: 'Plant-Powered Tacos', trend: 'up' as const, sales: 28 },
  ];

  // Enhanced filter logic with voice search optimization
  const filteredItems = menuItems.filter((item: MenuItem) => {
    const matchesSearch = searchTerm.length < 2 || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      // Voice-friendly aliases for fuzzy matching
      (item.aliases && item.aliases.some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (item.keywords && item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase())));

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
        case 'high-value':
          return parseFloat(item.price) > 15;
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
    setSearchTerm('');
  };

  const getStockStatus = (item: MenuItem) => {
    if (!item.trackInventory) {
      return { label: 'Always Available', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
    }
    
    const stock = item.currentStock || 0;
    const threshold = item.lowStockThreshold || 10;
    
    if (stock === 0) {
      return { label: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertTriangle };
    } else if (stock < threshold) {
      return { label: 'Low Stock', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: AlertTriangle };
    } else {
      return { label: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
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
      
      // Enhanced voice search with instant feedback
      const matchingItems = menuItems.filter((item: MenuItem) => {
        const searchLower = transcript.toLowerCase();
        return item.name.toLowerCase().includes(searchLower) ||
               item.category.toLowerCase().includes(searchLower) ||
               (item.description && item.description.toLowerCase().includes(searchLower)) ||
               (item.aliases && item.aliases.some(alias => alias.toLowerCase().includes(searchLower)));
      });
      
      toast({
        title: "Voice search complete",
        description: `Found ${matchingItems.length} items for "${transcript}"`,
      });
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      const errorMessage = event.error === 'no-speech' 
        ? "No speech detected. Please try again."
        : event.error === 'network' 
          ? "Network error. Please check your connection."
          : "Could not recognize speech. Please try again.";
      
      toast({
        title: "Voice error",
        description: errorMessage,
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
        {/* Header with Manager-Friendly Language */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white playwrite-font">
              Simplified Inventory
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your {totalItems} menu items with ease • Quick access to everything you need
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="h-12">
              <HelpCircle size={16} className="mr-2" />
              Quick Help
            </Button>
            <Button size="lg" className="h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
              <Plus size={16} className="mr-2" />
              Add New Item
            </Button>
          </div>
        </div>

        {/* Progressive Disclosure Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-14">
            <TabsTrigger value="overview" className="flex flex-col items-center space-y-1 h-12">
              <BarChart3 size={16} />
              <span className="text-xs font-medium">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex flex-col items-center space-y-1 h-12">
              <Package size={16} />
              <span className="text-xs font-medium">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="items" className="flex flex-col items-center space-y-1 h-12">
              <Search size={16} />
              <span className="text-xs font-medium">Search Items</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex flex-col items-center space-y-1 h-12">
              <TrendingUp size={16} />
              <span className="text-xs font-medium">Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key metrics cards with color coding */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Package size={16} />
                    Total Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalItems}</div>
                  <p className="text-xs text-gray-500 mt-1">Across all categories</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Available Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{availableItems}</div>
                  <p className="text-xs text-gray-500 mt-1">Ready for orders</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-yellow-600" />
                    Low Stock Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
                  <p className="text-xs text-gray-500 mt-1">Need attention</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <DollarSign size={16} className="text-blue-600" />
                    Inventory Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">${totalValue.toFixed(2)}</div>
                  <p className="text-xs text-gray-500 mt-1">Total stock value</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Top Items Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Clock size={16} />
                    Recent Activity
                    <Badge variant="outline" className="ml-auto">Last 7 days</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {recentActivity.map((activity, index) => (
                    <RecentItem key={index} {...activity} />
                  ))}
                </CardContent>
              </Card>

              {/* Top Movers */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Star size={16} />
                    Top Items Today
                    <Badge variant="outline" className="ml-auto">Trending</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topMovers.map((item, index) => (
                      <TopMoverItem key={index} {...item} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab Content */}
          <TabsContent value="categories" className="space-y-6">
            {/* Category Boards with grouped items */}
            {Object.entries(
              menuItems.reduce((acc: Record<string, MenuItem[]>, item: MenuItem) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
              }, {})
            ).map(([category, items]) => (
              <Card key={category} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Package size={18} />
                      {category}
                    </CardTitle>
                    <Badge variant="outline" className="text-sm">
                      {items.length} items
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item: MenuItem) => {
                      const stockStatus = getStockStatus(item);
                      const IconComponent = stockStatus.icon;
                      
                      return (
                        <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-orange-500">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base font-medium truncate">
                                {item.name}
                              </CardTitle>
                              <div className={`p-1 rounded-full ${stockStatus.bgColor}`}>
                                <IconComponent size={12} className={stockStatus.color} />
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                ${parseFloat(item.price).toFixed(2)}
                              </div>
                              <Badge variant="outline" className={`${stockStatus.color} border-current`}>
                                {stockStatus.label}
                              </Badge>
                            </div>
                            {item.trackInventory && (
                              <div className="text-sm text-gray-600 dark:text-gray-400">
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
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Search Items Tab Content */}
          <TabsContent value="items" className="space-y-6">
            {/* Enhanced Search with Voice and Visual Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Search Bar with Voice */}
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3 top-4 text-gray-400" />
                      <Input
                        placeholder="Search items, categories, or descriptions... (or use voice)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12 text-base"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={handleVoiceCommand}
                      className={`h-12 px-6 ${isListening ? 'bg-red-100 dark:bg-red-900 border-red-300' : ''}`}
                      title="Voice Search - Say item names, categories, or descriptions"
                    >
                      <Mic size={16} className={`mr-2 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
                      {isListening ? 'Listening...' : 'Voice'}
                    </Button>
                  </div>

                  {/* Visual Filter Chips */}
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.map(option => (
                      <FilterChip
                        key={option.id}
                        label={option.label}
                        icon={option.icon}
                        isActive={activeFilters.includes(option.id)}
                        onClick={() => toggleFilter(option.id)}
                        onRemove={() => removeFilter(option.id)}
                      />
                    ))}
                    {activeFilters.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-11">
                        Clear All
                      </Button>
                    )}
                  </div>

                  {/* Active Filter Summary with Enhanced Search Feedback */}
                  {(activeFilters.length > 0 || searchTerm) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <Package size={14} className="text-gray-400" />
                      <span className="font-medium">
                        Showing {filteredItems.length} of {totalItems} items
                      </span>
                      {searchTerm && (
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                          Search: "{searchTerm}"
                        </Badge>
                      )}
                      {activeFilters.length > 0 && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                          {activeFilters.length} filter{activeFilters.length > 1 ? 's' : ''} active
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Filtered Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item: MenuItem) => {
                const stockStatus = getStockStatus(item);
                const IconComponent = stockStatus.icon;
                
                return (
                  <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-orange-500">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium truncate">
                          {item.name}
                        </CardTitle>
                        <div className={`p-1 rounded-full ${stockStatus.bgColor}`}>
                          <IconComponent size={12} className={stockStatus.color} />
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs w-fit">
                        {item.category}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          ${parseFloat(item.price).toFixed(2)}
                        </div>
                        <Badge variant="outline" className={`${stockStatus.color} border-current`}>
                          {stockStatus.label}
                        </Badge>
                      </div>
                      {item.trackInventory && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Stock: {item.currentStock || 0} units
                        </div>
                      )}
                      {item.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-2 line-clamp-2">
                          {item.description}
                        </div>
                      )}
                      {item.dietaryTags && item.dietaryTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.dietaryTags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No items found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search or filters, or use voice commands like "show me burgers"
                  </p>
                  <Button onClick={clearAllFilters}>
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reports Tab Content */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 size={16} />
                    Inventory Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Track which items are performing best and identify trends.</p>
                  <Button variant="outline" className="w-full">
                    View Performance Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package size={16} />
                    Category Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">See how different menu categories are performing.</p>
                  <Button variant="outline" className="w-full">
                    View Category Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp size={16} />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Identify your best-selling and most profitable items.</p>
                  <Button variant="outline" className="w-full">
                    View Top Items
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Stock Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Get alerts for low stock and reorder recommendations.</p>
                  <Button variant="outline" className="w-full">
                    View Stock Alerts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </StandardLayout>
  );
}