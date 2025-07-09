import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Utensils, 
  Coffee, 
  Wine, 
  Sandwich, 
  IceCream, 
  Pizza,
  Salad,
  Soup,
  Leaf
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  count?: number;
}

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const defaultCategories: Category[] = [
  { id: 'all', name: 'All', icon: Utensils, count: 48 },
  { id: 'bar snacks', name: 'Bar Snacks', icon: Soup, count: 8 },
  { id: 'buffalo wings', name: 'Buffalo Wings', icon: Pizza, count: 12 },
  { id: 'burgers', name: 'Burgers', icon: Sandwich, count: 6 },
  { id: 'tacos', name: 'Tacos', icon: Salad, count: 4 },
  { id: 'plant powered', name: 'Plant Powered', icon: Leaf, count: 4 },
  { id: 'dawgs', name: 'Dawgs', icon: Coffee, count: 10 },
  { id: 'from our grill', name: 'From Our Grill', icon: IceCream, count: 6 }
];

export function CategoryTabs({ 
  categories = defaultCategories, 
  activeCategory = 'all',
  onCategoryChange 
}: CategoryTabsProps) {
  return (
    <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollArea className="w-full">
        <div className="flex space-x-1 p-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full min-w-fit",
                  isActive && "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600"
                )}
              >
                <IconComponent className="h-4 w-4" />
                <span className="font-medium">{category.name}</span>
                {category.count && (
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full",
                    isActive ? "bg-white/20" : "bg-muted"
                  )}>
                    {category.count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}