import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CollapsibleChat } from "@/components/CollapsibleChat";
import { StandardLayout } from "@/components/StandardLayout";

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
    <StandardLayout 
      title="Mobile App Preview" 
      subtitle="View and test the customer mobile ordering interface"
    >
      <div className="flex items-center justify-center p-6 min-h-full">
        {/* iPhone 15 Pro Mockup Container */}
        <div className="relative">
        {/* iPhone Frame with Titanium Finish */}
        <div className="relative w-[375px] h-[812px] bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-[60px] p-[8px] shadow-2xl border-[3px] border-gray-600">
          {/* Volume Buttons */}
          <div className="absolute left-[-3px] top-[120px] w-[3px] h-[28px] bg-gray-600 rounded-l-sm"></div>
          <div className="absolute left-[-3px] top-[160px] w-[3px] h-[28px] bg-gray-600 rounded-l-sm"></div>
          <div className="absolute left-[-3px] top-[200px] w-[3px] h-[56px] bg-gray-600 rounded-l-sm"></div>
          
          {/* Power Button */}
          <div className="absolute right-[-3px] top-[180px] w-[3px] h-[56px] bg-gray-600 rounded-r-sm"></div>
          
          {/* Inner Frame */}
          <div className="relative w-full h-full bg-black rounded-[52px] overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-[14px] left-1/2 transform -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-[19px] z-20 shadow-inner border border-gray-800"></div>
            
            {/* Screen Content */}
            <div className="absolute inset-0 bg-black rounded-[52px] overflow-hidden">
              {/* Status Bar */}
              <div className="absolute top-0 left-0 right-0 h-[54px] bg-black z-10">
                <div className="flex justify-between items-center px-8 pt-[16px] text-white text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                      <div className="w-1 h-1 bg-white rounded-full opacity-30"></div>
                    </div>
                    <span className="ml-2 text-xs">Verizon</span>
                  </div>
                  <div className="text-white font-semibold">9:41</div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                    </svg>
                    <svg className="w-4 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.24 0 1 1 0 01-1.415-1.415 5 5 0 017.07 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                    <div className="w-6 h-3 border border-white rounded-sm relative">
                      <div className="absolute inset-0.5 bg-white rounded-sm"></div>
                      <div className="absolute -right-0.5 top-1/2 transform -translate-y-1/2 w-0.5 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* App Content with proper offset for status bar */}
              <div className="absolute top-[54px] left-0 right-0 bottom-0 overflow-y-auto bg-white">
                {/* Header - OrderFi Theme */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-10 h-10 rounded-full kleurvorm-primary flex items-center justify-center">
                      <span className="text-white font-bold text-lg playwrite-font">O</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full kleurvorm-secondary flex items-center justify-center">
                        <Bell className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-8 h-8 rounded-full kleurvorm-accent flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Hero Section */}
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold orderfi-gradient-text mb-2 playwrite-font" style={{ lineHeight: '1.1' }}>
                      Hi! I'm OrderFi.
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6">
                      Smart with food.<br />
                      Easy on the taste buds.
                    </p>
                    <button className="kleurvorm-pill-button text-white px-6 py-3 rounded-full font-semibold">
                      Get started!
                    </button>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <p className="text-muted-foreground leading-relaxed">
                      OrderFi helps you order,<br />
                      pay, and enjoy<br />
                      your food – step by<br />
                      step, without the wait.
                    </p>
                  </div>
                </div>

                {/* How OrderFi Works */}
                <div className="px-4 mb-6">
                  <h2 className="text-2xl font-bold orderfi-gradient-text mb-6 playwrite-font">How OrderFi works:</h2>
                  
                  <div className="space-y-4">
                    {/* Step 1 - Kleurvörm Card */}
                    <div className="kleurvorm-card p-6">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-sm text-muted-foreground font-medium">Step 1</span>
                        <div className="w-8 h-8 rounded-full kleurvorm-primary flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="w-8 h-8 border-2 border-primary rounded-lg flex items-center justify-center mb-3">
                          <Search className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">
                          Browse our menu
                        </h3>
                      </div>
                    </div>

                    {/* Step 2 - Kleurvörm Card */}
                    <div className="kleurvorm-card p-6">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-sm text-muted-foreground font-medium">Step 2</span>
                        <div className="w-8 h-8 rounded-full kleurvorm-secondary flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="w-8 h-8 border-2 border-secondary rounded-lg flex items-center justify-center mb-3">
                          <ShoppingCart className="w-4 h-4 text-secondary" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">
                          Add to cart
                        </h3>
                      </div>
                    </div>

                    {/* Step 3 - Kleurvörm Card */}
                    <div className="kleurvorm-card p-6">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-sm text-muted-foreground font-medium">Step 3</span>
                        <div className="w-8 h-8 rounded-full kleurvorm-accent flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="w-8 h-8 border-2 border-accent rounded-lg flex items-center justify-center mb-3">
                          <Utensils className="w-4 h-4 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">
                          Enjoy your meal
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Preview Cards */}
                <div className="p-4 space-y-4">
                  <h3 className="text-xl font-semibold orderfi-gradient-text mb-4 playwrite-font">Popular dishes</h3>
                  
                  {/* Menu Item Cards with Kleurvörm Theme */}
                  <div className="kleurvorm-card p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 kleurvorm-primary rounded-full flex items-center justify-center">
                        <span className="text-2xl">🍔</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">Burgers</h3>
                        <p className="text-sm text-muted-foreground">Fresh, juicy, delicious</p>
                      </div>
                    </div>
                  </div>

                  <div className="kleurvorm-card p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 kleurvorm-secondary rounded-full flex items-center justify-center">
                        <span className="text-2xl">🍕</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">Pizza</h3>
                        <p className="text-sm text-muted-foreground">Wood-fired perfection</p>
                      </div>
                    </div>
                  </div>

                  <div className="kleurvorm-card p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 kleurvorm-accent rounded-full flex items-center justify-center">
                        <span className="text-2xl">🥗</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">Salads</h3>
                        <p className="text-sm text-muted-foreground">Fresh and healthy</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="p-4 mb-8">
                  <div className="kleurvorm-card p-6 text-center">
                    <div className="w-16 h-16 kleurvorm-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl text-white playwrite-font">O</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-6">
                      OrderFi helps you track, order, and<br />
                      enjoy your food – step by<br />
                      step, without the stress.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button className="kleurvorm-pill-button text-white px-6 py-3 rounded-full font-semibold">
                        Connect Menu
                      </button>
                      <button className="kleurvorm-pill-button text-white px-6 py-3 rounded-full font-semibold">
                        Get started!
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200">
                  <div className="flex justify-around py-2 px-4">
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
                          activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
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
            </div>
            
            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-30">
              <div className="w-32 h-1 bg-white rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </StandardLayout>
  );
}