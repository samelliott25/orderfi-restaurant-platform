import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Star, 
  Plus, 
  Heart,
  Clock,
  Flame,
  Leaf,
  Zap
} from 'lucide-react';

const KleurvormMenu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All', icon: '🍽️' },
    { id: 'breakfast', name: 'Breakfast', icon: '🥞' },
    { id: 'lunch', name: 'Lunch', icon: '🥗' },
    { id: 'dinner', name: 'Dinner', icon: '🍽️' },
    { id: 'drinks', name: 'Drinks', icon: '🥤' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' }
  ];

  const menuItems = [
    {
      id: '1',
      name: 'Avocado Toast Supreme',
      category: 'breakfast',
      price: 16.99,
      rating: 4.8,
      cookTime: '8 mins',
      calories: 420,
      tags: ['Healthy', 'Vegetarian', 'Popular'],
      description: 'Sourdough bread topped with smashed avocado, poached egg, microgreens, and everything seasoning',
      image: '🥑'
    },
    {
      id: '2',
      name: 'Buddha Bowl Deluxe',
      category: 'lunch',
      price: 22.50,
      rating: 4.9,
      cookTime: '12 mins',
      calories: 580,
      tags: ['Superfood', 'Vegan', 'Protein Rich'],
      description: 'Quinoa, roasted vegetables, chickpeas, tahini dressing, and hemp seeds',
      image: '🥗'
    },
    {
      id: '3',
      name: 'Grilled Salmon Bowl',
      category: 'dinner',
      price: 28.99,
      rating: 4.7,
      cookTime: '15 mins',
      calories: 650,
      tags: ['High Protein', 'Omega-3', 'Low Carb'],
      description: 'Fresh Atlantic salmon with quinoa, steamed broccoli, and lemon herb sauce',
      image: '🐟'
    },
    {
      id: '4',
      name: 'Green Goddess Smoothie',
      category: 'drinks',
      price: 9.99,
      rating: 4.6,
      cookTime: '3 mins',
      calories: 180,
      tags: ['Detox', 'Energy Boost', 'Antioxidants'],
      description: 'Spinach, banana, mango, coconut water, and chia seeds',
      image: '🥤'
    },
    {
      id: '5',
      name: 'Raw Chocolate Tart',
      category: 'desserts',
      price: 12.99,
      rating: 4.5,
      cookTime: '5 mins',
      calories: 320,
      tags: ['Raw', 'Gluten Free', 'Indulgent'],
      description: 'Cashew-based chocolate tart with raspberry coulis and mint',
      image: '🍰'
    }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getTagIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'healthy':
      case 'superfood':
        return <Leaf className="w-3 h-3" />;
      case 'popular':
        return <Flame className="w-3 h-3" />;
      case 'energy boost':
        return <Zap className="w-3 h-3" />;
      default:
        return <Star className="w-3 h-3" />;
    }
  };

  return (
    <div className="kleurvorm-background-gradient min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Healthy Menu</h1>
            <p className="text-white/80">Nourish your body with our curated wellness menu</p>
          </div>
          
          {/* Search & Filter */}
          <div className="kleurvorm-card mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search healthy dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button className="kleurvorm-pill-button">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? 'kleurvorm-tab-active' : 'kleurvorm-tab-inactive'}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="kleurvorm-food-card">
              
              {/* Image Section */}
              <div className="relative h-48 bg-gradient-to-br from-orange-100 to-pink-100 rounded-t-lg flex items-center justify-center">
                <span className="text-6xl">{item.image}</span>
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                  <Heart 
                    className={`w-5 h-5 ${favorites.includes(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                  />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{item.rating}</span>
                      <span className="text-gray-400">•</span>
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{item.cookTime}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">${item.price}</div>
                    <div className="text-sm text-gray-500">{item.calories} cal</div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag, index) => (
                    <Badge key={index} className="kleurvorm-nutrition-badge text-xs">
                      {getTagIcon(tag)}
                      <span className="ml-1">{tag}</span>
                    </Badge>
                  ))}
                </div>
                
                {/* Action Button */}
                <button className="kleurvorm-pill-button w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="kleurvorm-card text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <Button onClick={() => {setSearchTerm(''); setSelectedCategory('all');}} className="kleurvorm-pill-button">
              Clear Filters
            </Button>
          </div>
        )}
        
        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6">
          <button className="kleurvorm-pill-button w-14 h-14 rounded-full shadow-lg">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KleurvormMenu;