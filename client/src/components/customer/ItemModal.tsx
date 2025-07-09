import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Minus, Plus, X, Leaf, Wheat } from 'lucide-react';

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

interface ItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (modifiers: Modifier[], quantity: number) => void;
  formatPrice: (price: number) => string;
}

export function ItemModal({ item, isOpen, onClose, onAddToCart, formatPrice }: ItemModalProps) {
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedModifiers([]);
      setQuantity(1);
    }
  }, [isOpen]);

  if (!item) return null;

  // Mock modifiers for demo
  const mockModifiers: Modifier[] = [
    { id: 1, name: 'Extra Sauce', price_delta: 0.50 },
    { id: 2, name: 'No Onions', price_delta: 0 },
    { id: 3, name: 'Extra Cheese', price_delta: 1.00 },
    { id: 4, name: 'Make it Spicy', price_delta: 0 },
    { id: 5, name: 'Gluten Free Bun', price_delta: 2.00 }
  ];

  const availableModifiers = item.modifiers || mockModifiers;

  const isVegetarian = item.name.toLowerCase().includes('vegan') || 
                      item.name.toLowerCase().includes('salad') ||
                      item.description.toLowerCase().includes('vegan');
  
  const isGlutenFree = item.description.toLowerCase().includes('gluten') ||
                       item.name.toLowerCase().includes('gf');

  const handleModifierToggle = (modifier: Modifier) => {
    setSelectedModifiers(prev => 
      prev.some(m => m.id === modifier.id)
        ? prev.filter(m => m.id !== modifier.id)
        : [...prev, modifier]
    );
  };

  const calculateTotalPrice = () => {
    const basePrice = item.price;
    const modifiersPrice = selectedModifiers.reduce((sum, mod) => sum + mod.price_delta, 0);
    return (basePrice + modifiersPrice) * quantity;
  };

  const handleAddToCart = () => {
    onAddToCart(selectedModifiers, quantity);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">{item.name}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Customize your order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item image */}
          <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 rounded-lg flex items-center justify-center">
            {item.image_url ? (
              <img 
                src={item.image_url} 
                alt={item.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-8xl opacity-20">🍽️</div>
            )}
          </div>

          {/* Item details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <span className="font-bold text-lg text-orange-600 dark:text-orange-400">
                {formatPrice(item.price)}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground">{item.description}</p>
            
            <div className="flex items-center space-x-2">
              {isVegetarian && (
                <Badge variant="secondary" className="text-xs">
                  <Leaf className="h-3 w-3 mr-1" />
                  Vegan
                </Badge>
              )}
              {isGlutenFree && (
                <Badge variant="secondary" className="text-xs">
                  <Wheat className="h-3 w-3 mr-1" />
                  GF
                </Badge>
              )}
            </div>
          </div>

          {/* Modifiers */}
          {availableModifiers.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Customize</h4>
              <div className="space-y-2">
                {availableModifiers.map((modifier) => (
                  <div key={modifier.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`modifier-${modifier.id}`}
                      checked={selectedModifiers.some(m => m.id === modifier.id)}
                      onCheckedChange={() => handleModifierToggle(modifier)}
                    />
                    <Label 
                      htmlFor={`modifier-${modifier.id}`}
                      className="flex-1 flex items-center justify-between text-sm cursor-pointer"
                    >
                      <span>{modifier.name}</span>
                      {modifier.price_delta > 0 && (
                        <span className="text-orange-600 dark:text-orange-400 font-medium">
                          +{formatPrice(modifier.price_delta)}
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Quantity</span>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium min-w-[2ch] text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to cart button */}
          <Button
            onClick={handleAddToCart}
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium"
          >
            Add to Cart • {formatPrice(calculateTotalPrice())}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}