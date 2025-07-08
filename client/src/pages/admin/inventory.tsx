import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StandardLayout } from "@/components/StandardLayout";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
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
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch menu items for restaurant ID 1
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['/api/restaurants/1/menu'],
    queryFn: () => fetch('/api/restaurants/1/menu').then(res => res.json())
  });

  // Strategic color-coded metrics
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter((item: MenuItem) => item.isAvailable).length;
  const lowStockItems = menuItems.filter((item: MenuItem) => 
    item.trackInventory && item.currentStock !== null && item.currentStock <= (item.lowStockThreshold || 5)
  ).length;
  const totalValue = menuItems.reduce((sum: number, item: MenuItem) => 
    sum + (parseFloat(item.price) * (item.currentStock || 0)), 0
  );

  // Filter items based on search and filters
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

  // Voice command handler
  const handleVoiceCommand = async () => {
    setIsListening(true);
    setTimeout(() => setIsListening(false), 3000);
  };

  // Item interaction handlers
  const handleItemClick = (item: MenuItem) => {
    console.log("Edit item:", item);
  };

  const handleToggleAvailability = async (itemId: number, available: boolean) => {
    console.log("Toggle availability:", itemId, available);
  };

  return (
    <StandardLayout title="Menu & Item Management" subtitle="Strategic color coding for easy navigation and data insights">
      <div className="space-y-6">
        {/* Strategic Color-Coded Dashboard Metrics - OrderFi Brand Colors */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Slate Zone: Inventory Overview */}
          <Card className="border-slate-200 bg-slate-50 dark:bg-slate-950/20 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-slate-700 dark:text-slate-300 rock-salt-font">Total Items</CardTitle>
              <Package className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-slate-800 dark:text-slate-200">{totalItems}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {availableItems} available
              </p>
            </CardContent>
          </Card>

          {/* OrderFi Orange Zone: Attention Needed */}
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-700" 
                style={{ borderColor: 'hsl(25, 95%, 53%, 0.3)', backgroundColor: 'hsl(25, 95%, 53%, 0.05)' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm rock-salt-font" style={{ color: 'hsl(25, 95%, 35%)' }}>Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4" style={{ color: 'hsl(25, 95%, 53%)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl" style={{ color: 'hsl(25, 95%, 45%)' }}>{lowStockItems}</div>
              <p className="text-xs" style={{ color: 'hsl(25, 95%, 40%)' }}>
                Items need restocking
              </p>
            </CardContent>
          </Card>

          {/* OrderFi Pink Zone: Financial Health */}
          <Card className="border-pink-200 bg-pink-50 dark:bg-pink-950/20 dark:border-pink-700"
                style={{ borderColor: 'hsl(340, 82%, 52%, 0.3)', backgroundColor: 'hsl(340, 82%, 52%, 0.05)' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm rock-salt-font" style={{ color: 'hsl(340, 82%, 35%)' }}>Inventory Value</CardTitle>
              <DollarSign className="h-4 w-4" style={{ color: 'hsl(340, 82%, 52%)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl" style={{ color: 'hsl(340, 82%, 45%)' }}>${totalValue.toFixed(2)}</div>
              <p className="text-xs" style={{ color: 'hsl(340, 82%, 40%)' }}>
                At current stock levels
              </p>
            </CardContent>
          </Card>

          {/* Slate Blue Zone: Performance Metrics */}
          <Card className="border-slate-200 bg-slate-50 dark:bg-slate-950/20 dark:border-slate-700"
                style={{ borderColor: 'hsl(215, 28%, 17%, 0.3)', backgroundColor: 'hsl(215, 28%, 17%, 0.05)' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm rock-salt-font" style={{ color: 'hsl(215, 28%, 25%)' }}>Performance</CardTitle>
              <TrendingUp className="h-4 w-4" style={{ color: 'hsl(215, 28%, 35%)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl" style={{ color: 'hsl(215, 28%, 30%)' }}>94%</div>
              <p className="text-xs" style={{ color: 'hsl(215, 28%, 40%)' }}>
                Items in stock
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter Bar with OrderFi Gradient Accent */}
        <Card className="border-slate-200 bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-700"
              style={{ background: 'linear-gradient(135deg, hsl(25, 95%, 53%, 0.03), hsl(340, 82%, 52%, 0.03))' }}>
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-1 sm:max-w-md lg:max-w-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items, descriptions, aliases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-32">
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
                  onClick={() => setIsAddItemDialogOpen(true)}
                  className="text-white hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, hsl(25, 95%, 53%), hsl(340, 82%, 52%))' }}
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

        {/* Strategic Color-Coded View Options with OrderFi Gradient */}
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800">
            <TabsTrigger 
              value="visual" 
              className="flex items-center gap-2 data-[state=active]:text-white"
              style={{ 
                '--active-bg': 'linear-gradient(135deg, hsl(25, 95%, 53%), hsl(340, 82%, 52%))'
              } as React.CSSProperties & { '--active-bg': string }}
            >
              <Grid className="h-4 w-4" />
              Visual Cards
            </TabsTrigger>
            <TabsTrigger 
              value="table" 
              className="flex items-center gap-2 data-[state=active]:text-white"
              style={{ color: 'hsl(215, 28%, 35%)' }}
            >
              <Table2 className="h-4 w-4" />
              Data Table
            </TabsTrigger>
            <TabsTrigger 
              value="kanban" 
              className="flex items-center gap-2 data-[state=active]:text-white"
              style={{ color: 'hsl(215, 28%, 35%)' }}
            >
              <Layers className="h-4 w-4" />
              Category Boards
            </TabsTrigger>
          </TabsList>

          {/* Visual Cards View */}
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

          {/* Data Table View */}
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
                                <div className="">{item.name}</div>
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
                            <TableCell className="" style={{ color: 'hsl(340, 82%, 45%)' }}>${price.toFixed(2)}</TableCell>
                            <TableCell className="text-slate-600">${cost.toFixed(2)}</TableCell>
                            <TableCell>
                              <span className={`${
                                margin > 50 ? "text-emerald-600" : 
                                margin > 30 ? "" : 
                                ""
                              }`}
                              style={{
                                color: margin > 50 ? 'hsl(160, 84%, 39%)' :
                                       margin > 30 ? 'hsl(25, 95%, 53%)' :
                                       'hsl(0, 84%, 60%)'
                              }}>
                                {margin.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell>
                              {item.trackInventory ? (
                                <div className="flex items-center gap-2">
                                  <span className={``}
                                        style={{ color: isLowStock ? 'hsl(25, 95%, 53%)' : 'hsl(215, 28%, 35%)' }}>
                                    {item.currentStock || 0}
                                  </span>
                                  {isLowStock && <AlertTriangle className="h-4 w-4" style={{ color: 'hsl(25, 95%, 53%)' }} />}
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
                                <div className="w-12 bg-slate-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full transition-all" 
                                    style={{ 
                                      width: `${Math.min((item.popularityScore || 0), 100)}%`,
                                      background: 'linear-gradient(135deg, hsl(25, 95%, 53%), hsl(340, 82%, 52%))'
                                    }}
                                  />
                                </div>
                                <span className="text-sm text-slate-600">{item.popularityScore || 0}</span>
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

          {/* Category Boards View */}
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
                  <Card key={category} className="h-fit border-slate-200 bg-slate-50 dark:bg-slate-950/20"
                        style={{ 
                          background: 'linear-gradient(135deg, hsl(25, 95%, 53%, 0.02), hsl(340, 82%, 52%, 0.02))',
                          borderColor: 'hsl(215, 28%, 17%, 0.2)'
                        }}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg rock-salt-font" style={{ color: 'hsl(215, 28%, 25%)' }}>{category}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="secondary"
                            className="text-xs border-slate-200"
                            style={{ 
                              backgroundColor: 'hsl(215, 28%, 17%, 0.1)',
                              color: 'hsl(215, 28%, 35%)'
                            }}
                          >
                            {categoryItems.length} items
                          </Badge>
                          {lowStockCount > 0 && (
                            <Badge 
                              variant="destructive"
                              className="text-xs"
                              style={{
                                backgroundColor: 'hsl(25, 95%, 53%, 0.1)',
                                color: 'hsl(25, 95%, 45%)',
                                borderColor: 'hsl(25, 95%, 53%, 0.3)'
                              }}
                            >
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
                            }`}
                            style={{
                              borderColor: isLowStock ? 'hsl(25, 95%, 53%, 0.3)' : 'hsl(215, 28%, 17%, 0.15)',
                              backgroundColor: isLowStock ? 'hsl(25, 95%, 53%, 0.05)' : 'white'
                            }}
                            onClick={() => handleItemClick(item)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="rock-salt-font">{item.name}</h4>
                              <div className="flex items-center gap-1">
                                <span className="text-green-600">${price.toFixed(2)}</span>
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
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="animate-pulse">
                  <Mic className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="rock-salt-font text-orange-800 dark:text-orange-200">Listening for inventory commands...</h4>
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    Try: "Show low stock items" • "Update burger price to $15" • "Mark fish as sold out"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comprehensive Menu Item Management Dialog */}
        <Dialog open={isAddItemDialogOpen || !!editingItem} onOpenChange={(open) => {
          if (!open) {
            setIsAddItemDialogOpen(false);
            setEditingItem(null);
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="rock-salt-font text-xl" style={{ color: 'hsl(25, 95%, 53%)' }}>
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update item details, pricing, and availability.' : 'Create a new menu item with pricing, categories, and inventory tracking.'}
              </DialogDescription>
            </DialogHeader>

            <MenuItemForm 
              item={editingItem}
              onSave={(itemData) => {
                // Handle save logic here
                if (editingItem) {
                  // Update existing item
                  toast({
                    title: "Menu item updated",
                    description: `${itemData.name} has been successfully updated.`,
                  });
                } else {
                  // Create new item
                  toast({
                    title: "Menu item created", 
                    description: `${itemData.name} has been added to your menu.`,
                  });
                }
                setIsAddItemDialogOpen(false);
                setEditingItem(null);
                queryClient.invalidateQueries({ queryKey: ['/api/menu-items'] });
              }}
              onCancel={() => {
                setIsAddItemDialogOpen(false);
                setEditingItem(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </StandardLayout>
  );
}

// Comprehensive Menu Item Form Component
interface MenuItemFormProps {
  item?: MenuItem | null;
  onSave: (itemData: any) => void;
  onCancel: () => void;
}

function MenuItemForm({ item, onSave, onCancel }: MenuItemFormProps) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || '',
    costPrice: item?.costPrice || '',
    category: item?.category || 'Main Course',
    isAvailable: item?.isAvailable ?? true,
    trackInventory: item?.trackInventory ?? false,
    currentStock: item?.currentStock || 0,
    lowStockThreshold: item?.lowStockThreshold || 5,
    aliases: item?.aliases?.join(', ') || '',
    dietaryTags: item?.dietaryTags?.join(', ') || '',
    customizationOptions: item?.customizationOptions?.join(', ') || '',
    preparationTime: item?.preparationTime || 15,
    imageUrl: item?.imageUrl || ''
  });

  const categories = [
    'Appetizers', 'Main Course', 'Desserts', 'Beverages', 
    'Salads', 'Soups', 'Sides', 'Specials', 'Pizza', 'Pasta'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      ...formData,
      price: parseFloat(formData.price).toString(),
      costPrice: formData.costPrice ? parseFloat(formData.costPrice).toString() : null,
      aliases: formData.aliases ? formData.aliases.split(',').map(s => s.trim()).filter(s => s) : [],
      dietaryTags: formData.dietaryTags ? formData.dietaryTags.split(',').map(s => s.trim()).filter(s => s) : [],
      customizationOptions: formData.customizationOptions ? formData.customizationOptions.split(',').map(s => s.trim()).filter(s => s) : [],
      restaurantId: 1 // Default restaurant
    };

    onSave(itemData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg rock-salt-font">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Item Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Margherita Pizza"
                required
              />
            </div>
            <div>
              <label className="text-sm">Category *</label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the item, ingredients, preparation..."
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm">Alternative Names/Aliases</label>
            <Input
              value={formData.aliases}
              onChange={(e) => setFormData(prev => ({ ...prev, aliases: e.target.value }))}
              placeholder="e.g., Pepperoni, Pepperoni Pizza (comma separated)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg rock-salt-font">Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm">Sale Price *</label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="text-sm">Cost Price</label>
              <Input
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, costPrice: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm">Prep Time (min)</label>
              <Input
                type="number"
                value={formData.preparationTime}
                onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 15 }))}
                placeholder="15"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg rock-salt-font">Inventory & Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isAvailable}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAvailable: checked }))}
            />
            <label className="text-sm">Available for ordering</label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.trackInventory}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, trackInventory: checked }))}
            />
            <label className="text-sm">Track inventory levels</label>
          </div>

          {formData.trackInventory && (
            <div className="grid grid-cols-2 gap-4 pl-6">
              <div>
                <label className="text-sm">Current Stock</label>
                <Input
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentStock: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label className="text-sm">Low Stock Alert</label>
                <Input
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) || 5 }))}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg rock-salt-font">Additional Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm">Dietary Tags</label>
            <Input
              value={formData.dietaryTags}
              onChange={(e) => setFormData(prev => ({ ...prev, dietaryTags: e.target.value }))}
              placeholder="e.g., Vegetarian, Gluten-Free, Vegan (comma separated)"
            />
          </div>

          <div>
            <label className="text-sm">Customization Options</label>
            <Input
              value={formData.customizationOptions}
              onChange={(e) => setFormData(prev => ({ ...prev, customizationOptions: e.target.value }))}
              placeholder="e.g., Extra Cheese, No Onions, Spicy (comma separated)"
            />
          </div>

          <div>
            <label className="text-sm">Image URL</label>
            <Input
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </CardContent>
      </Card>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="text-white"
          style={{ background: 'linear-gradient(135deg, hsl(25, 95%, 53%), hsl(340, 82%, 52%))' }}
        >
          {item ? 'Update Item' : 'Create Item'}
        </Button>
      </DialogFooter>
    </form>
  );
}