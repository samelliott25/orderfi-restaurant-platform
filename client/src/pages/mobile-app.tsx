import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CollapsibleChat } from "@/components/CollapsibleChat";

import { 
  Search, 
  Heart, 
  User, 
  Home,
  Star,
  Clock,
  Truck,
  Filter,
  MapPin,
  Bell,
  ShoppingCart,
  Utensils
} from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  deliveryTime: string;
  tags: string[];
}

export default function MobileAppPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('popular');

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Pepperoni Pizza",
      description: "Classic pizza with a thin or thick crust, tomato sauce, mozzarella cheese, and spicy pepperoni sausage.",
      price: 19.99,
      image: "🍕",
      category: "pizza",
      rating: 4.5,
      deliveryTime: "30-40 min",
      tags: ["Popular", "Free Delivery"]
    },
    {
      id: 2,
      name: "Classic Burger",
      description: "Juicy beef patty with fresh lettuce, tomato, onion, and our special sauce on a toasted bun.",
      price: 12.99,
      image: "🍔",
      category: "burger",
      rating: 4.7,
      deliveryTime: "20-30 min",
      tags: ["Bestseller"]
    },
    {
      id: 3,
      name: "Chicken Wings",
      description: "Crispy chicken wings with your choice of BBQ, buffalo, or honey mustard sauce.",
      price: 14.99,
      image: "🍗",
      category: "appetizer",
      rating: 4.6,
      deliveryTime: "25-35 min",
      tags: ["Spicy"]
    },
    {
      id: 4,
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with parmesan cheese, croutons, and our homemade Caesar dressing.",
      price: 9.99,
      image: "🥗",
      category: "salad",
      rating: 4.2,
      deliveryTime: "15-25 min",
      tags: ["Healthy", "Light"]
    },
    {
      id: 5,
      name: "Vegetable Pizza",
      description: "Fresh vegetables on crispy crust with premium mozzarella cheese and signature sauce.",
      price: 18.99,
      image: "🍕",
      category: "pizza",
      rating: 4.3,
      deliveryTime: "30-40 min",
      tags: ["Healthy", "Free Delivery"]
    },
    {
      id: 6,
      name: "Chocolate Cake",
      description: "Rich chocolate cake with layers of chocolate ganache and fresh berries.",
      price: 7.99,
      image: "🍰",
      category: "dessert",
      rating: 4.8,
      deliveryTime: "10-15 min",
      tags: ["Sweet", "Popular"]
    }
  ];

  const categories = [
    { id: 'popular', name: 'Popular', icon: '🔥' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'burger', name: 'Burgers', icon: '🍔' },
    { id: 'healthy', name: 'Healthy', icon: '🥗' },
    { id: 'dessert', name: 'Desserts', icon: '🍰' }
  ];

  const featuredItems = menuItems.filter(item => item.tags.includes('Popular') || item.tags.includes('Bestseller'));
  const filteredItems = selectedCategory === 'popular' 
    ? featuredItems
    : selectedCategory === 'healthy'
    ? menuItems.filter(item => item.tags.includes('Healthy') || item.category === 'salad')
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Smartphone Container */}
      <div className="relative w-full max-w-sm mx-auto">
        {/* Phone Frame */}
        <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl">
          {/* Screen */}
          <div className="bg-white rounded-[2.5rem] overflow-hidden relative">
            {/* Status Bar */}
            <div className="bg-black text-white text-xs px-6 py-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 bg-white rounded-sm"></div>
                <div className="w-4 h-2 bg-white rounded-sm opacity-60"></div>
                <div className="w-4 h-2 bg-white rounded-sm opacity-30"></div>
              </div>
              <div className="text-white font-medium">9:41</div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 bg-white rounded-sm"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-6 h-3 border border-white rounded-sm">
                  <div className="w-4 h-2 bg-white rounded-sm m-0.5"></div>
                </div>
              </div>
            </div>
            
            {/* App Content */}
            <div className="h-[600px] overflow-y-auto pb-20" style={{ backgroundColor: '#e8f5e9' }}>
              {/* Header - Mamo Style */}
              <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ lineHeight: '1.1' }}>
            Hi! I'm OrderFi.
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Smart with food.<br />
            Easy on the taste buds.
          </p>
          <button className="bg-yellow-300 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition-colors">
            Get started!
          </button>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            OrderFi helps you order,<br />
            pay, and enjoy<br />
            your food – step by<br />
            step, without the wait.
          </p>
        </div>
      </div>

      {/* How OrderFi Works */}
      <div className="px-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">How OrderFi works:</h2>
        
        <div className="space-y-4">
          {/* Step 1 - White Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm text-gray-500 font-medium">Step 1</span>
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="w-8 h-8 border-2 border-gray-800 rounded-lg flex items-center justify-center mb-3">
                <Search className="w-4 h-4 text-gray-800" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Browse our menu
              </h3>
            </div>
          </div>

          {/* Step 2 - Yellow Card */}
          <div className="bg-yellow-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm text-gray-700 font-medium">Step 2</span>
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="w-8 h-8 border-2 border-gray-800 rounded-lg flex items-center justify-center mb-3">
                <ShoppingCart className="w-4 h-4 text-gray-800" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Add to cart
              </h3>
            </div>
          </div>

          {/* Step 3 - Light Green Card */}
          <div className="bg-green-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm text-gray-700 font-medium">Step 3</span>
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="w-8 h-8 border-2 border-gray-800 rounded-lg flex items-center justify-center mb-3">
                <Utensils className="w-4 h-4 text-gray-800" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Enjoy your meal
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Preview Cards */}
      <div className="p-4 space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Popular dishes</h3>
        
        {/* Menu Item Cards in Mamo Style */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🍔</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">Burgers</h3>
              <p className="text-sm text-gray-600">Fresh, juicy, delicious</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">🍕</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">Pizza</h3>
              <p className="text-sm text-gray-600">Wood-fired perfection</p>
            </div>
          </div>
        </div>

        <div className="bg-green-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">🥗</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">Salads</h3>
              <p className="text-sm text-gray-600">Fresh and healthy</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="p-4 mb-8">
        <div className="bg-gray-800 rounded-3xl p-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">O</span>
          </div>
          <p className="text-white text-sm mb-6">
            OrderFi helps you track, order, and<br />
            enjoy your food – step by<br />
            step, without the stress.
          </p>
          <div className="flex gap-3 justify-center">
            <button className="bg-green-400 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-green-500 transition-colors">
              Connect Menu
            </button>
            <button className="bg-yellow-300 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition-colors">
              Get started!
            </button>
          </div>
        </div>
      </div>

              {/* Bottom Navigation */}
              <div className="absolute bottom-0 left-0 right-0 border-t bg-background border-border">
                <div className="flex justify-around py-2">
                  {[
                    { id: 'home', icon: Home, label: 'Home' },
                    { id: 'search', icon: Search, label: 'Search' },
                    { id: 'favorites', icon: Heart, label: 'Favorites' },
                    { id: 'profile', icon: User, label: 'Profile' }
                  ].map((tab) => (
                    <Button
                      key={tab.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center p-2 ${
                        activeTab === tab.id ? 'text-primary' : 'text-gray-400'
                      }`}
                    >
                      <tab.icon className="w-5 h-5 mb-1" />
                      <span className="text-xs">{tab.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Collapsible Chat */}
              <CollapsibleChat className="bottom-24 right-4" />
            </div>
            
            {/* Home Indicator */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}