import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { StandardLayout } from "@/components/StandardLayout";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { ThemeSelector, inventoryThemes, type InventoryTheme } from "@/components/inventory/ThemeSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Package,
  BarChart3,
  Mic,
  Eye,
  EyeOff,
  Grid,
  Table2,
  Layers,
  Star
} from "lucide-react";
import type { MenuItem } from "@shared/schema";

export default function AdminInventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<InventoryTheme>(inventoryThemes[0]); // OrderFi Classic

  // Fetch menu items for restaurant ID 1
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['/api/menu-items', 1],
    queryFn: () => fetch('/api/menu-items/1').then(res => res.json())
  });

  // Professional POS-style metrics
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter((item: MenuItem) => item.isAvailable).length;
  const lowStockItems = menuItems.filter((item: MenuItem) => 
    item.trackInventory && item.currentStock !== null && item.currentStock <= (item.lowStockThreshold || 5)
  ).length;
  const totalValue = menuItems.reduce((sum: number, item: MenuItem) => 
    sum + (parseFloat(item.price) * (item.currentStock || 0)), 0
  );

  // Filter items based on search and filters (like Lightspeed)
  const filteredItems = menuItems.filter((item: MenuItem) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.aliases?.some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesAvailability = availabilityFilter === "all" || 
                               (availabilityFilter === "available" && item.isAvailable) ||
                               (availabilityFilter === "unavailable" && !item.isAvailable);
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const categorySet = new Set<string>();
  menuItems.forEach((item: MenuItem) => categorySet.add(item.category));
  const categories = Array.from(categorySet);

  // AI Voice Command Handler
  const handleVoiceCommand = async () => {
    setIsListening(true);
    // TODO: Implement speech recognition for inventory commands
    setTimeout(() => setIsListening(false), 3000);
  };

  // Handle item selection and actions
  const handleItemClick = (item: MenuItem) => {
    console.log("Edit item:", item);
    // TODO: Open edit dialog
  };

  const handleToggleAvailability = async (itemId: number, available: boolean) => {
    console.log("Toggle availability:", itemId, available);
    // TODO: Implement API call to update availability
  };

  return (
    <StandardLayout title="Inventory Management" subtitle="Best-in-class database visualization with AI voice commands">
      <style>
        {`
          .inventory-theme-active {
            background-color: ${currentTheme.primary} !important;
            color: white !important;
          }
          .inventory-theme-hover:hover {
            background-color: ${currentTheme.primary}15 !important;
            border-color: ${currentTheme.primary} !important;
          }
          .inventory-theme-accent {
            color: ${currentTheme.accent} !important;
          }
          .inventory-theme-success {
            color: ${currentTheme.success} !important;
          }
          .inventory-theme-warning {
            color: ${currentTheme.warning} !important;
          }
          .inventory-theme-danger {
            color: ${currentTheme.danger} !important;
          }
          /* Tab active state styling */
          [data-state="active"] {
            background-color: ${currentTheme.primary} !important;
            color: white !important;
          }
        `}
      </style>
      <div className="space-y-6">
        {/* Professional POS-style Dashboard Metrics with Dynamic Theming */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.primary + '20' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4" style={{ color: currentTheme.primary }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: currentTheme.primary }}>{totalItems}</div>
              <p className="text-xs" style={{ color: currentTheme.muted }}>
                {availableItems} available
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.warning + '20' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4" style={{ color: currentTheme.warning }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: currentTheme.warning }}>{lowStockItems}</div>
              <p className="text-xs" style={{ color: currentTheme.muted }}>
                Items need restocking
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.success + '20' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <DollarSign className="h-4 w-4" style={{ color: currentTheme.success }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: currentTheme.success }}>${totalValue.toFixed(2)}</div>
              <p className="text-xs" style={{ color: currentTheme.muted }}>
                At current stock levels
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.info + '20' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <TrendingUp className="h-4 w-4" style={{ color: currentTheme.info }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: currentTheme.info }}>94%</div>
              <p className="text-xs" style={{ color: currentTheme.muted }}>
                Items in stock
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Professional Search & Filter Bar (Lightspeed-style) */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-1 gap-2 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items, descriptions, aliases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category: string) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <ThemeSelector 
                  currentTheme={currentTheme}
                  onThemeChange={setCurrentTheme}
                />
                <Button
                  variant={isListening ? "default" : "outline"}
                  size="sm"
                  onClick={handleVoiceCommand}
                  className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  {isListening ? "Listening..." : "Voice Command"}
                </Button>
                <Button 
                  size="sm"
                  style={{ backgroundColor: currentTheme.primary, color: 'white' }}
                  className="hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Best-in-Class Database Visualization - Multiple View Options */}
        <Tabs defaultValue="visual" className="w-full">
          <TabsList 
            className="grid w-full grid-cols-3" 
            style={{ backgroundColor: currentTheme.secondary }}
          >
            <TabsTrigger 
              value="visual" 
              className="flex items-center gap-2 data-[state=active]:text-white" 
              style={{ 
                '--primary': currentTheme.primary,
                backgroundColor: 'transparent'
              } as React.CSSProperties & { '--primary': string }}
              data-state-active-style={{ backgroundColor: currentTheme.primary }}
            >
              <Grid className="h-4 w-4" />
              Visual Cards
            </TabsTrigger>
            <TabsTrigger 
              value="table" 
              className="flex items-center gap-2 data-[state=active]:text-white"
              style={{ 
                '--primary': currentTheme.primary,
                backgroundColor: 'transparent'
              } as React.CSSProperties & { '--primary': string }}
            >
              <Table2 className="h-4 w-4" />
              Data Table
            </TabsTrigger>
            <TabsTrigger 
              value="kanban" 
              className="flex items-center gap-2 data-[state=active]:text-white"
              style={{ 
                '--primary': currentTheme.primary,
                backgroundColor: 'transparent'
              } as React.CSSProperties & { '--primary': string }}
            >
              <Layers className="h-4 w-4" />
              Category Boards
            </TabsTrigger>
          </TabsList>

          {/* Visual Cards View - Best for Product Overview */}
          <TabsContent value="visual" className="mt-6">
            {isLoading ? (
              <div className="text-center py-8">Loading inventory...</div>
            ) : (
              <InventoryGrid 
                items={filteredItems}
                onItemClick={handleItemClick}
                onToggleAvailability={handleToggleAvailability}
              />
            )}
          </TabsContent>

          {/* Traditional Table View - Best for Detailed Analysis */}
          <TabsContent value="table" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input type="checkbox" className="rounded" />
                      </TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Margin</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Popularity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8">
                          Loading inventory...
                        </TableCell>
                      </TableRow>
                    ) : filteredItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8">
                          No items found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredItems.map((item: MenuItem) => {
                        const price = parseFloat(item.price);
                        const cost = parseFloat(item.costPrice || '0');
                        const margin = cost > 0 ? ((price - cost) / price * 100) : 0;
                        const isLowStock = item.trackInventory && 
                          item.currentStock !== null && 
                          item.currentStock <= (item.lowStockThreshold || 5);

                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <input type="checkbox" className="rounded" />
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-muted-foreground truncate max-w-xs">
                                  {item.description}
                                </div>
                                {item.aliases && item.aliases.length > 0 && (
                                  <div className="text-xs text-blue-600 mt-1">
                                    Also: {item.aliases.slice(0, 2).join(', ')}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.category}</Badge>
                            </TableCell>
                            <TableCell>${price.toFixed(2)}</TableCell>
                            <TableCell>${cost.toFixed(2)}</TableCell>
                            <TableCell>
                              <span className={margin > 50 ? "text-green-600" : margin > 30 ? "text-yellow-600" : "text-red-600"}>
                                {margin.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell>
                              {item.trackInventory ? (
                                <div className="flex items-center gap-2">
                                  <span className={isLowStock ? "text-red-600 font-medium" : ""}>
                                    {item.currentStock || 0}
                                  </span>
                                  {isLowStock && <AlertTriangle className="h-4 w-4 text-red-500" />}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Not tracked</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {item.isAvailable ? (
                                  <Eye className="h-4 w-4 text-green-500" />
                                ) : (
                                  <EyeOff className="h-4 w-4 text-red-500" />
                                )}
                                <Badge variant={item.isAvailable ? "default" : "secondary"}>
                                  {item.isAvailable ? "Available" : "Hidden"}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <div className="w-12 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full" 
                                    style={{ width: `${Math.min((item.popularityScore || 0), 100)}%` }}
                                  />
                                </div>
                                <span className="text-sm">{item.popularityScore || 0}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleItemClick(item)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kanban Category View - Best for Menu Organization */}
          <TabsContent value="kanban" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {categories.map((category: string) => {
                const categoryItems = filteredItems.filter((item: MenuItem) => item.category === category);
                const lowStockCount = categoryItems.filter((item: MenuItem) => 
                  item.trackInventory && 
                  item.currentStock !== null && 
                  item.currentStock <= (item.lowStockThreshold || 5)
                ).length;

                return (
                  <Card key={category} className="h-fit">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{category}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {categoryItems.length} items
                          </Badge>
                          {lowStockCount > 0 && (
                            <Badge variant="destructive">
                              {lowStockCount} low stock
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {categoryItems.slice(0, 5).map((item: MenuItem) => {
                        const price = parseFloat(item.price);
                        const isLowStock = item.trackInventory && 
                          item.currentStock !== null && 
                          item.currentStock <= (item.lowStockThreshold || 5);

                        return (
                          <div 
                            key={item.id}
                            className={`p-3 border rounded-lg cursor-pointer hover:shadow-md transition-all ${
                              !item.isAvailable ? 'opacity-60' : ''
                            } ${isLowStock ? 'border-red-200 bg-red-50' : ''}`}
                            onClick={() => handleItemClick(item)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{item.name}</h4>
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-green-600">${price.toFixed(2)}</span>
                                {isLowStock && <AlertTriangle className="h-4 w-4 text-red-500" />}
                              </div>
                            </div>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {item.description.slice(0, 60)}...
                              </p>
                            )}
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                {item.isAvailable ? (
                                  <Eye className="h-3 w-3 text-green-500" />
                                ) : (
                                  <EyeOff className="h-3 w-3 text-gray-400" />
                                )}
                                {item.trackInventory && (
                                  <span className={`text-xs ${isLowStock ? 'text-red-600' : ''}`}>
                                    Stock: {item.currentStock || 0}
                                  </span>
                                )}
                              </div>
                              {item.popularityScore && item.popularityScore > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  <span className="text-xs">{item.popularityScore}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {categoryItems.length > 5 && (
                        <Button variant="outline" size="sm" className="w-full">
                          View all {categoryItems.length} {category.toLowerCase()} items
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* AI Voice Commands Help */}
        {isListening && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="animate-pulse">
                  <Mic className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-medium">Listening for inventory commands...</h4>
                  <p className="text-sm text-muted-foreground">
                    Try: "Show low stock items" • "Update burger price to $15" • "Mark fish as sold out"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </StandardLayout>
  );
}