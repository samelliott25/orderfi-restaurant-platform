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
    <Card className="group cursor-pointer h-[200px] hover:shadow-lg transition-all duration-300" data-testid={`item-card-${item.id}`}>
      <CardContent className="p-0 h-full flex flex-col">
        <div onClick={onAddClick} className="relative flex-1">
          {/* Smaller image - 4:3 ratio, ~60% of card height */}
          <div className="aspect-[4/3] bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center relative overflow-hidden rounded-t-lg">
            {item.image_url ? (
              <img 
                src={item.image_url} 
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="text-3xl opacity-30 group-hover:scale-110 transition-transform duration-300">🍽️</div>
            )}
            
            {/* Quick add button overlay - simplified for smaller cards */}
            <div className="absolute inset-0 bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddClick();
                }}
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs px-2 py-1 h-6"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Compact content area - ~40% of card height */}
        <div className="p-2 space-y-1 flex-shrink-0">
          <div className="flex items-center justify-between gap-1">
            <h3 className="font-semibold text-xs leading-tight line-clamp-1 text-foreground">
              {item.name}
            </h3>
            <span className="font-bold text-xs orderfi-gradient-text flex-shrink-0">
              {formatPrice(item.price)}
            </span>
          </div>
          
          {/* Badges for dietary info */}
          <div className="flex items-center gap-1">
            {isVegetarian && (
              <div className="text-[10px] px-1 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded flex items-center">
                <Leaf className="h-2 w-2 mr-0.5" />
                V
              </div>
            )}
            {isGlutenFree && (
              <div className="text-[10px] px-1 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded flex items-center">
                <Wheat className="h-2 w-2 mr-0.5" />
                GF
              </div>
            )}
            
            {/* Add button moved to badges area */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAddClick();
              }}
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white h-5 w-5 p-0 text-xs ml-auto"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}