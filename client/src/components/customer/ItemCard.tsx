import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Leaf, Wheat } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number | string;
  image_url?: string;
  category: string;
  voice_aliases?: string[];
  aliases?: string[];
  modifiers?: Modifier[];
}

interface Modifier {
  id: number;
  name: string;
  price_delta: number;
  required?: boolean;
}

interface ItemCardProps {
  item: MenuItem;
  onAddClick: () => void;
  formatPrice: (price: number | string) => string;
}

export function ItemCard({ item, onAddClick, formatPrice }: ItemCardProps) {
  // Mock dietary info for demo
  const isVegetarian = item.name.toLowerCase().includes('vegan') || 
                      item.name.toLowerCase().includes('salad') ||
                      item.description.toLowerCase().includes('vegan');
  
  const isGlutenFree = item.description.toLowerCase().includes('gluten') ||
                       item.name.toLowerCase().includes('gf');

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300" data-testid={`item-card-${item.id}`}>
      <CardContent className="p-0">
        <div onClick={onAddClick} className="relative">
          {/* Image with better proportions - 3:2 ratio */}
          <div className="aspect-[3/2] bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center relative overflow-hidden rounded-t-lg">
            {item.image_url ? (
              <img 
                src={item.image_url} 
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="text-4xl opacity-30 group-hover:scale-110 transition-transform duration-300">🍽️</div>
            )}
            

          </div>
        </div>

        {/* Content area with better spacing */}
        <div className="p-3 space-y-2">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm leading-tight line-clamp-1 text-foreground">
              {item.name}
            </h3>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm orderfi-gradient-text">
                {formatPrice(item.price)}
              </span>
              
              {/* Add button in corner */}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddClick();
                }}
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white h-7 w-7 p-0 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Badges for dietary info */}
          {(isVegetarian || isGlutenFree) && (
            <div className="flex items-center gap-1">
              {isVegetarian && (
                <Badge variant="secondary" className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  <Leaf className="h-3 w-3 mr-1" />
                  Vegan
                </Badge>
              )}
              {isGlutenFree && (
                <Badge variant="secondary" className="text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                  <Wheat className="h-3 w-3 mr-1" />
                  GF
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}