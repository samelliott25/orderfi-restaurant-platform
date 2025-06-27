import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { restaurantApi } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ChefHat, 
  DollarSign, 
  Tag,
  Clock,
  Upload
} from "lucide-react";

const RESTAURANT_ID = 1;

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  tags: string[];
  available: boolean;
}

export function MenuManagementDashboard() {
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    tags: "",
    available: true
  });

  // Fetch menu items
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: [`/api/restaurants/${RESTAURANT_ID}/menu-items`],
  });

  const typedMenuItems = menuItems as MenuItem[];

  // Create menu item mutation
  const createMenuItemMutation = useMutation({
    mutationFn: (data: any) => restaurantApi.createMenuItem(RESTAURANT_ID, {
      ...data,
      tags: data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
    }),
    onSuccess: () => {
      toast({ title: "Menu item added successfully!" });
      setNewItem({ name: "", description: "", price: "", category: "", tags: "", available: true });
      setShowAddForm(false);
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${RESTAURANT_ID}/menu-items`] });
    },
    onError: () => {
      toast({ title: "Failed to add menu item", variant: "destructive" });
    },
  });

  // Update menu item mutation
  const updateMenuItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      restaurantApi.updateMenuItem(id, {
        ...data,
        tags: typeof data.tags === 'string' 
          ? data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
          : data.tags
      }),
    onSuccess: () => {
      toast({ title: "Menu item updated successfully!" });
      setEditingItem(null);
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${RESTAURANT_ID}/menu-items`] });
    },
    onError: () => {
      toast({ title: "Failed to update menu item", variant: "destructive" });
    },
  });

  // Delete menu item mutation
  const deleteMenuItemMutation = useMutation({
    mutationFn: (id: number) => restaurantApi.deleteMenuItem(id),
    onSuccess: () => {
      toast({ title: "Menu item deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${RESTAURANT_ID}/menu-items`] });
    },
    onError: () => {
      toast({ title: "Failed to delete menu item", variant: "destructive" });
    },
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name.trim() && newItem.price.trim()) {
      createMenuItemMutation.mutate(newItem);
    }
  };

  const handleUpdateItem = (item: MenuItem) => {
    updateMenuItemMutation.mutate({
      id: item.id,
      data: {
        ...item,
        tags: item.tags.join(', ')
      }
    });
  };

  const categories = ["appetizers", "mains", "desserts", "beverages", "specials"];
  const groupedItems = categories.reduce((acc, category) => {
    acc[category] = typedMenuItems.filter((item: MenuItem) => item.category === category);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading menu...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">Manage your restaurant's menu items, categories, and pricing</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Menu Item
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Items</span>
            </div>
            <div className="text-2xl font-bold">{typedMenuItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Avg Price</span>
            </div>
            <div className="text-2xl font-bold">
              ${typedMenuItems.length > 0 
                ? (typedMenuItems.reduce((sum: number, item: MenuItem) => sum + parseFloat(item.price), 0) / typedMenuItems.length).toFixed(2)
                : '0.00'
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Categories</span>
            </div>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Available</span>
            </div>
            <div className="text-2xl font-bold">
              {typedMenuItems.filter((item: MenuItem) => item.available).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Item Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Add New Menu Item</span>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newItem.tags}
                  onChange={(e) => setNewItem(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="vegetarian, spicy, popular"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the menu item"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMenuItemMutation.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Menu Items by Category */}
      {categories.map(category => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="capitalize flex items-center justify-between">
              <span>{category} ({groupedItems[category]?.length || 0} items)</span>
              <Badge variant="secondary">{category}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {groupedItems[category]?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No items in this category</p>
              ) : (
                groupedItems[category]?.map((item: MenuItem) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{item.name}</h3>
                        <span className="font-bold text-green-600">${item.price}</span>
                        {!item.available && (
                          <Badge variant="destructive">Unavailable</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      {item.tags.length > 0 && (
                        <div className="flex space-x-1 mt-2">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMenuItemMutation.mutate(item.id)}
                        disabled={deleteMenuItemMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Edit Item Modal/Form */}
      {editingItem && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Edit Menu Item</span>
              <Button variant="ghost" size="sm" onClick={() => setEditingItem(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Item Name</Label>
                <Input
                  id="edit-name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, price: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select 
                  value={editingItem.category} 
                  onValueChange={(value) => setEditingItem(prev => prev ? { ...prev, category: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input
                  id="edit-tags"
                  value={editingItem.tags.join(', ')}
                  onChange={(e) => setEditingItem(prev => prev ? { 
                    ...prev, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  } : null)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={3}
                />
              </div>
              <div className="md:col-span-2 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => editingItem && handleUpdateItem(editingItem)}
                  disabled={updateMenuItemMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Update Item
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}