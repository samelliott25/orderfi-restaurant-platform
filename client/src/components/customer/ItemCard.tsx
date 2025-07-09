import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Leaf, Wheat } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  voice_aliases?: string[];
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
  formatPrice: (price: number) => string;
}

export function ItemCard({ item, onAddClick, formatPrice }: ItemCardProps) {
  // Mock dietary info for demo
  const isVegetarian = item.name.toLowerCase().includes('vegan') || 
                      item.name.toLowerCase().includes('salad') ||
                      item.description.toLowerCase().includes('vegan');
  
  const isGlutenFree = item.description.toLowerCase().includes('gluten') ||
                       item.name.toLowerCase().includes('gf');

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
      <div onClick={onAddClick} className="relative">
        {/* Image placeholder */}
        <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 flex items-center justify-center">
          {item.image_url ? (
            <img 
              src={item.image_url} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-6xl opacity-20">🍽️</div>
          )}
        </div>
        
        {/* Quick add button overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddClick();
            }}
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg"
          >
            <Plus className="h-4 w-4 mr-1" />
            Quick Add
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2">
              {item.name}
            </h3>
            <span className="font-bold text-sm text-orange-600 dark:text-orange-400 ml-2 flex-shrink-0">
              {formatPrice(item.price)}
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {isVegetarian && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                <Leaf className="h-3 w-3 mr-1" />
                Vegan
              </Badge>
            )}
            {isGlutenFree && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                <Wheat className="h-3 w-3 mr-1" />
                GF
              </Badge>
            )}
          </div>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddClick();
            }}
            size="sm"
            className="h-8 w-8 p-0 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}