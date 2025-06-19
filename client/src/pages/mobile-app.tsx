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
  Bell
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
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#fff0cc' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 border-b" style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8b795e] flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <p className="text-sm" style={{ color: '#8b795e' }}>Deliver to</p>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" style={{ color: '#8b795e' }} />
                <span className="font-semibold text-sm" style={{ color: '#8b795e' }}>Current Location</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6" style={{ color: '#8b795e' }} />
            <Heart className="w-6 h-6" style={{ color: '#8b795e' }} />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#8b795e' }} />
          <input
            type="text"
            placeholder="Search for food, restaurants..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background"
            style={{ borderColor: '#e5cf97', color: '#8b795e' }}
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
          >
            <Filter className="w-5 h-5" style={{ color: '#8b795e' }} />
          </Button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="p-4">
        <Card className="bg-gradient-to-r from-[#8b795e] to-[#6d5d4f] text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Satisfy Your Cravings</h2>
                <p className="text-sm opacity-90 mb-4">Free delivery on orders over $25</p>
                <Button 
                  size="sm"
                  className="bg-white text-[#8b795e] hover:bg-gray-100"
                >
                  Order Now
                </Button>
              </div>
              <div className="text-6xl">🍔</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div className="px-4 mb-4">
        <h3 className="font-bold text-lg mb-3" style={{ color: '#8b795e' }}>Categories</h3>
        <div className="flex gap-3 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`whitespace-nowrap ${
                selectedCategory === category.id 
                  ? 'bg-[#8b795e] text-white' 
                  : 'border-[#8b795e] text-[#8b795e] bg-white'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-4">
        <h3 className="font-bold text-lg" style={{ color: '#8b795e' }}>
          {selectedCategory === 'popular' ? 'Popular Items' : 
           selectedCategory === 'healthy' ? 'Healthy Options' :
           categories.find(c => c.id === selectedCategory)?.name || 'Menu Items'}
        </h3>
        
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="bg-background border" style={{ borderColor: '#e5cf97' }}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="text-4xl">{item.image}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-lg" style={{ color: '#8b795e' }}>
                        {item.name}
                      </h4>
                      <span className="font-bold text-lg" style={{ color: '#8b795e' }}>
                        ${item.price}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-3" style={{ color: '#8b795e' }}>
                      {item.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                      <div className="flex items-center gap-1" style={{ color: '#8b795e' }}>
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{item.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1" style={{ color: '#8b795e' }}>
                        <Truck className="w-4 h-4" />
                        <span className="text-sm">Free Delivery</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {item.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        size="sm"
                        className="bg-[#8b795e] hover:bg-[#6d5d4f] text-white"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background" style={{ borderColor: '#e5cf97' }}>
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
                activeTab === tab.id ? 'text-[#8b795e]' : 'text-gray-400'
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
  );
}