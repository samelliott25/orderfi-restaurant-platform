import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star, Clock } from 'lucide-react';

interface FreshOrderCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  rating: number;
  cookTime: number;
  dietary: string[];
  isPopular?: boolean;
  designStyle: 'neubrutalist' | 'glassmorphism' | 'bento';
}

export function FreshOrderCard({
  id,
  name,
  description,
  price,
  image,
  rating,
  cookTime,
  dietary,
  isPopular,
  designStyle
}: FreshOrderCardProps) {
  const getCardClasses = () => {
    switch (designStyle) {
      case 'neubrutalist':
        return 'neubrutalist-card p-6 relative overflow-hidden';
      case 'glassmorphism':
        return 'glassmorphism-card p-6 relative overflow-hidden';
      case 'bento':
        return 'bento-item relative overflow-hidden';
      default:
        return 'bento-item relative overflow-hidden';
    }
  };

  const getButtonClasses = () => {
    switch (designStyle) {
      case 'neubrutalist':
        return 'neubrutalist-button px-6 py-3 rounded-none';
      case 'glassmorphism':
        return 'bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 px-6 py-3 rounded-lg';
      case 'bento':
        return 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 px-6 py-3 rounded-xl';
      default:
        return 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 px-6 py-3 rounded-xl';
    }
  };

  return (
    <div className={`${getCardClasses()} group cursor-pointer transition-all duration-300`}>
      {/* Popular Badge */}
      {isPopular && (
        <Badge className="absolute -top-2 -right-2 z-10 bg-neon-pink text-white border-2 border-black rotate-12">
          🔥 Popular
        </Badge>
      )}

      {/* Background Pattern for Neubrutalist */}
      {designStyle === 'neubrutalist' && (
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-600"></div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative mb-4 overflow-hidden rounded-lg">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
            <div className="text-white text-6xl font-bold opacity-30">
              {name.charAt(0)}
            </div>
          </div>
        )}
        
        {/* Floating Action Button */}
        <Button 
          size="sm" 
          className="absolute top-3 right-3 p-2 bg-white/90 text-gray-800 hover:bg-white rounded-full shadow-lg"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${designStyle === 'neubrutalist' ? 'text-black uppercase' : 'text-gray-900'}`}>
              {name}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {description}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${designStyle === 'neubrutalist' ? 'text-black' : 'text-gray-900'}`}>
              ${price}
            </div>
          </div>
        </div>

        {/* Rating and Time */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{cookTime} min</span>
          </div>
        </div>

        {/* Dietary Tags */}
        <div className="flex flex-wrap gap-2">
          {dietary.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Action Button */}
        <Button className={`w-full ${getButtonClasses()} micro-bounce`}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>

      {/* Micro-interaction effects */}
      <div className="absolute inset-0 pointer-events-none">
        {designStyle === 'glassmorphism' && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg"></div>
        )}
      </div>
    </div>
  );
}