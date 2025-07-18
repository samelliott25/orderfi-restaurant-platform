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
    <div className="orderfi-card group cursor-pointer min-h-[320px]" data-testid={`item-card-${item.id}`}>
      <div onClick={onAddClick} className="relative">
        {/* Image placeholder with OrderFi gradient */}
        <div className="aspect-[4/3] bg-gradient-to-br from-orderfi-start/20 to-orderfi-end/20 flex items-center justify-center relative overflow-hidden">
          {item.image_url ? (
            <img 
              src={item.image_url} 
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-6xl opacity-30 group-hover:scale-110 transition-transform duration-500">🍽️</div>
          )}
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        
        {/* Enhanced quick add button overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddClick();
            }}
            size="sm"
            className="orderfi-btn-primary transform scale-90 group-hover:scale-100 transition-all duration-300 font-semibold"
          >
            <Plus className="h-4 w-4 mr-1" />
            Quick Add
          </Button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-base leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-300">
              {item.name}
            </h3>
            <div className="ml-3 flex-shrink-0">
              <span className="font-bold text-lg orderfi-gradient-text bg-primary/10 px-3 py-1 rounded-full">
                {formatPrice(item.price)}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            {isVegetarian && (
              <Badge variant="secondary" className="text-xs px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                <Leaf className="h-3 w-3 mr-1" />
                Vegan
              </Badge>
            )}
            {isGlutenFree && (
              <Badge variant="secondary" className="text-xs px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800">
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
            className="orderfi-btn orderfi-btn-primary h-10 w-10 p-0 hover:scale-110 transition-transform duration-200 shadow-lg"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}