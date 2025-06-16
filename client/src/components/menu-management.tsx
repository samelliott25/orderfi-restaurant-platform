import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { restaurantApi } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { Utensils, Plus, Edit, Trash2, Upload } from "lucide-react";

interface MenuManagementProps {
  restaurantId: number;
}

export function MenuManagement({ restaurantId }: MenuManagementProps) {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    tags: [] as string[],
    isAvailable: true,
  });

  // Fetch menu items
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: [`/api/restaurants/${restaurantId}/menu`],
  });

  // Create menu item mutation
  const createMenuItemMutation = useMutation({
    mutationFn: (data: any) => restaurantApi.createMenuItem(restaurantId, data),
    onSuccess: () => {
      toast({ title: "Menu item added successfully!" });
      setIsAddDialogOpen(false);
      setNewItem({
        name: "",
        description: "",
        price: "",
        category: "",
        tags: [],
        isAvailable: true,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${restaurantId}/menu`] });
    },
    onError: () => {
      toast({ title: "Failed to add menu item", variant: "destructive" });
    },
  });

  // Update menu item mutation
  const updateMenuItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => restaurantApi.updateMenuItem(id, data),
    onSuccess: () => {
      toast({ title: "Menu item updated successfully!" });
      setEditingItem(null);
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${restaurantId}/menu`] });
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
      queryClient.invalidateQueries({ queryKey: [`/api/restaurants/${restaurantId}/menu`] });
    },
    onError: () => {
      toast({ title: "Failed to delete menu item", variant: "destructive" });
    },
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    createMenuItemMutation.mutate({
      ...newItem,
      tags: newItem.tags.length > 0 ? newItem.tags : null,
    });
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    updateMenuItemMutation.mutate({
      id: editingItem.id,
      data: {
        ...editingItem,
        tags: editingItem.tags?.length > 0 ? editingItem.tags : null,
      },
    });
  };

  const handleTagToggle = (tag: string, isEditing = false) => {
    if (isEditing && editingItem) {
      const tags = editingItem.tags || [];
      const updatedTags = tags.includes(tag)
        ? tags.filter((t: string) => t !== tag)
        : [...tags, tag];
      setEditingItem({ ...editingItem, tags: updatedTags });
    } else {
      const updatedTags = newItem.tags.includes(tag)
        ? newItem.tags.filter(t => t !== tag)
        : [...newItem.tags, tag];
      setNewItem({ ...newItem, tags: updatedTags });
    }
  };

  const availableTags = ["vegetarian", "vegan", "gluten-free", "spicy", "popular", "new", "special"];

  const getBadgeVariant = (tag: string) => {
    switch (tag) {
      case "vegetarian": return "secondary";
      case "vegan": return "secondary";
      case "gluten-free": return "outline";
      case "spicy": return "destructive";
      case "popular": return "default";
      case "new": return "secondary";
      case "special": return "default";
      default: return "secondary";
    }
  };

  if (isLoading) {
    return <div>Loading menu items...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Utensils className="mr-2 text-primary" />
            Menu Management
          </span>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Menu Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Item name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Item description"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appetizer">Appetizer</SelectItem>
                        <SelectItem value="pizza">Pizza</SelectItem>
                        <SelectItem value="pasta">Pasta</SelectItem>
                        <SelectItem value="main">Main Course</SelectItem>
                        <SelectItem value="salad">Salad</SelectItem>
                        <SelectItem value="dessert">Dessert</SelectItem>
                        <SelectItem value="beverage">Beverage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={newItem.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMenuItemMutation.isPending}>
                    Add Item
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="csvFile">Upload Menu CSV</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                className="mt-1"
              />
            </div>
            <Button className="mt-6" variant="secondary">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {menuItems.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {item.tags?.map((tag: string) => (
                    <Badge key={tag} variant={getBadgeVariant(tag)} className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  <span className="text-sm font-medium text-gray-900">${item.price}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Dialog open={editingItem?.id === item.id} onOpenChange={(open) => !open && setEditingItem(null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Menu Item</DialogTitle>
                    </DialogHeader>
                    {editingItem && (
                      <form onSubmit={handleUpdateItem} className="space-y-4">
                        <div>
                          <Label htmlFor="editName">Name</Label>
                          <Input
                            id="editName"
                            value={editingItem.name}
                            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="editDescription">Description</Label>
                          <Textarea
                            id="editDescription"
                            value={editingItem.description || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="editPrice">Price</Label>
                            <Input
                              id="editPrice"
                              type="number"
                              step="0.01"
                              value={editingItem.price}
                              onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="editCategory">Category</Label>
                            <Select 
                              value={editingItem.category} 
                              onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="appetizer">Appetizer</SelectItem>
                                <SelectItem value="pizza">Pizza</SelectItem>
                                <SelectItem value="pasta">Pasta</SelectItem>
                                <SelectItem value="main">Main Course</SelectItem>
                                <SelectItem value="salad">Salad</SelectItem>
                                <SelectItem value="dessert">Dessert</SelectItem>
                                <SelectItem value="beverage">Beverage</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Tags</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {availableTags.map(tag => (
                              <Badge
                                key={tag}
                                variant={(editingItem.tags || []).includes(tag) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => handleTagToggle(tag, true)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={updateMenuItemMutation.isPending}>
                            Update Item
                          </Button>
                        </div>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMenuItemMutation.mutate(item.id)}
                  disabled={deleteMenuItemMutation.isPending}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
