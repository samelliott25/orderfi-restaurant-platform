import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Edit2, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  TrendingUp,
  DollarSign,
  Package2,
  Star,
  Grid,
  List
} from "lucide-react";
import type { MenuItem } from "@shared/schema";

interface InventoryGridProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
  onToggleAvailability: (itemId: number, available: boolean) => void;
}

export function InventoryGrid({ items, onItemClick, onToggleAvailability }: InventoryGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4 mr-2" />
            Visual Cards
          </Button>
          <Button 
            variant={viewMode === 'compact' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('compact')}
          >
            <List className="h-4 w-4 mr-2" />
            Data List
          </Button>
        </div>
      </div>

      {/* Grid Layout - Visual Cards (Best for quick product overview) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => {
            const price = parseFloat(item.price);
            const cost = parseFloat(item.costPrice || '0');
            const margin = cost > 0 ? ((price - cost) / price * 100) : 0;
            const isLowStock = item.trackInventory && 
              item.currentStock !== null && 
              item.currentStock <= (item.lowStockThreshold || 5);

            return (
              <Card 
                key={item.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  !item.isAvailable ? 'opacity-60' : ''
                } ${isLowStock ? 'border-red-200 bg-red-50' : ''}`}
                onClick={() => onItemClick(item)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {item.isAvailable ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                      {isLowStock && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg leading-tight">
                    {item.name}
                  </CardTitle>
                  
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Price and Margin */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-bold text-lg">${price.toFixed(2)}</span>
                      </div>
                      {margin > 0 && (
                        <Badge 
                          variant="secondary" 
                          className={`${
                            margin > 50 ? 'bg-green-100 text-green-800' :
                            margin > 30 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {margin.toFixed(0)}% margin
                        </Badge>
                      )}
                    </div>

                    {/* Stock Level */}
                    {item.trackInventory && (
                      <div className="flex items-center gap-2">
                        <Package2 className="h-4 w-4 text-blue-500" />
                        <span className={`text-sm ${isLowStock ? 'text-red-600 font-medium' : ''}`}>
                          {item.currentStock || 0} in stock
                        </span>
                        {isLowStock && (
                          <Badge variant="destructive" className="text-xs">
                            Low Stock
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Popularity */}
                    {item.popularityScore && item.popularityScore > 0 && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all" 
                            style={{ width: `${Math.min(item.popularityScore, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {item.popularityScore}
                        </span>
                      </div>
                    )}

                    {/* Aliases */}
                    {item.aliases && item.aliases.length > 0 && (
                      <div className="text-xs text-blue-600">
                        Also known as: {item.aliases.slice(0, 2).join(', ')}
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={Boolean(item.isAvailable)}
                          onCheckedChange={(checked) => onToggleAvailability(item.id, checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-xs">Available</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onItemClick(item);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Compact View - List Format (Best for detailed data analysis) */}
      {viewMode === 'compact' && (
        <div className="space-y-2">
          {items.map((item) => {
            const price = parseFloat(item.price);
            const cost = parseFloat(item.costPrice || '0');
            const margin = cost > 0 ? ((price - cost) / price * 100) : 0;
            const isLowStock = item.trackInventory && 
              item.currentStock !== null && 
              item.currentStock <= (item.lowStockThreshold || 5);

            return (
              <Card 
                key={item.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !item.isAvailable ? 'opacity-60' : ''
                } ${isLowStock ? 'border-l-4 border-l-red-500' : ''}`}
                onClick={() => onItemClick(item)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          {isLowStock && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Low Stock
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium">${price.toFixed(2)}</span>
                        </div>
                        
                        {margin > 0 && (
                          <div className={`${
                            margin > 50 ? 'text-green-600' :
                            margin > 30 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {margin.toFixed(1)}% margin
                          </div>
                        )}
                        
                        {item.trackInventory && (
                          <div className="flex items-center gap-1">
                            <Package2 className="h-4 w-4 text-blue-500" />
                            <span className={isLowStock ? 'text-red-600 font-medium' : ''}>
                              {item.currentStock || 0}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={Boolean(item.isAvailable)}
                          onCheckedChange={(checked) => onToggleAvailability(item.id, checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onItemClick(item);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}