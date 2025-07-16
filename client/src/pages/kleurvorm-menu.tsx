import React, { useState } from 'react';
import { KleurvormCard } from '@/components/kleurvorm/KleurvormCard';
import { KleurvormButton } from '@/components/kleurvorm/KleurvormButton';
import { KleurvormBottomNav } from '@/components/kleurvorm/KleurvormBottomNav';
import { Search, Calendar, Clock, MapPin, Plus, Star, Heart } from 'lucide-react';

export default function KleurvormMenu() {
  const [activeCategory, setActiveCategory] = useState('suggestions');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'suggestions', label: 'Suggestions', icon: Star },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'favorites', label: 'Favorites', icon: Heart },
  ];

  const menuItems = [
    {
      id: 1,
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with crispy croutons',
      price: 14,
      image: '🥗',
      category: 'suggestions',
      rating: 4.8,
      time: '15 min',
      calories: 280,
      protein: 12,
      carbs: 18,
      fat: 20,
    },
    {
      id: 2,
      name: 'Chicken Bread',
      description: 'Grilled chicken with artisan bread',
      price: 18,
      image: '🍞',
      category: 'suggestions',
      rating: 4.6,
      time: '20 min',
      calories: 420,
      protein: 35,
      carbs: 45,
      fat: 12,
    },
    {
      id: 3,
      name: 'Pizza Lazy',
      description: 'Classic margherita with fresh basil',
      price: 16,
      image: '🍕',
      category: 'suggestions',
      rating: 4.7,
      time: '25 min',
      calories: 380,
      protein: 18,
      carbs: 52,
      fat: 15,
    },
  ];

  const historyItems = [
    { name: 'Caesar Salad', date: 'Yesterday', image: '🥗' },
    { name: 'Chicken Bread', date: 'Monday', image: '🍞' },
    { name: 'Pizza Lazy', date: 'Sunday', image: '🍕' },
  ];

  const scheduleItems = [
    { time: '11:00 - 12:00', meal: 'Lunch', status: 'confirmed' },
    { time: '13:00 - 14:00', meal: 'Dinner', status: 'pending' },
    { time: '16:00 - 17:00', meal: 'Snack', status: 'available' },
  ];

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-kleurvorm-light-blue to-kleurvorm-white pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold kleurvorm-heading mb-2">Menu</h1>
          <p className="kleurvorm-small">Discover delicious meals</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-kleurvorm-purple" />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-kleurvorm-light-blue focus:outline-none focus:ring-2 focus:ring-kleurvorm-blue"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-white rounded-full p-2 shadow-sm">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-kleurvorm-blue to-kleurvorm-purple text-white'
                      : 'text-kleurvorm-black hover:bg-kleurvorm-light-blue'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content based on active category */}
        {activeCategory === 'suggestions' && (
          <div className="space-y-6">
            {/* Today's Suggestion */}
            <KleurvormCard variant="gradient">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="kleurvorm-subheading text-lg">Today's suggestion</h3>
                  <p className="kleurvorm-small">Based on your preferences</p>
                </div>
                <KleurvormButton variant="outline" size="sm">
                  Add to schedule
                </KleurvormButton>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-kleurvorm-white to-kleurvorm-light-blue rounded-full flex items-center justify-center text-2xl">
                  🥗
                </div>
                <div className="flex-1">
                  <h4 className="kleurvorm-body font-semibold mb-1">Caesar Salad</h4>
                  <p className="kleurvorm-small">Fresh romaine lettuce with crispy croutons</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="kleurvorm-small">⭐ 4.8</span>
                    <span className="kleurvorm-small">🕐 15 min</span>
                  </div>
                </div>
              </div>
            </KleurvormCard>

            {/* Popular Menu Items */}
            <div>
              <h3 className="kleurvorm-subheading text-lg mb-4">Popular near you</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <KleurvormCard key={item.id} className="cursor-pointer">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-kleurvorm-light-blue rounded-lg flex items-center justify-center text-xl">
                        {item.image}
                      </div>
                      <div className="flex-1">
                        <h4 className="kleurvorm-body font-semibold">{item.name}</h4>
                        <p className="kleurvorm-small text-kleurvorm-purple">${item.price}</p>
                      </div>
                      <button className="w-8 h-8 bg-gradient-to-br from-kleurvorm-orange to-kleurvorm-red rounded-full flex items-center justify-center">
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="kleurvorm-small">{item.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-kleurvorm-purple" />
                        <span className="kleurvorm-small">{item.time}</span>
                      </div>
                    </div>
                  </KleurvormCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'history' && (
          <div className="space-y-4">
            <h3 className="kleurvorm-subheading text-lg mb-4">Eating history</h3>
            {historyItems.map((item, index) => (
              <KleurvormCard key={index}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-kleurvorm-light-blue rounded-lg flex items-center justify-center text-xl">
                    {item.image}
                  </div>
                  <div className="flex-1">
                    <h4 className="kleurvorm-body font-semibold">{item.name}</h4>
                    <p className="kleurvorm-small">{item.date}</p>
                  </div>
                  <button className="w-8 h-8 bg-gradient-to-br from-kleurvorm-blue to-kleurvorm-purple rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </KleurvormCard>
            ))}
          </div>
        )}

        {activeCategory === 'schedule' && (
          <div className="space-y-6">
            <KleurvormCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="kleurvorm-subheading text-lg">Your schedule</h3>
                <p className="kleurvorm-small">This week</p>
              </div>
              <div className="space-y-4">
                {scheduleItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-kleurvorm-light-blue rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-kleurvorm-blue to-kleurvorm-purple rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="kleurvorm-body font-semibold">{item.time}</p>
                        <p className="kleurvorm-small">{item.meal}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </KleurvormCard>
          </div>
        )}

        {activeCategory === 'favorites' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-kleurvorm-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-kleurvorm-purple" />
            </div>
            <h3 className="kleurvorm-subheading text-lg mb-2">No favorites yet</h3>
            <p className="kleurvorm-body">Start adding items to your favorites</p>
          </div>
        )}
      </div>
      
      <KleurvormBottomNav />
    </div>
  );
}