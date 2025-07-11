import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FreshOrderCard } from '@/components/2026-design/FreshOrderCard';
import { FreshDashboard } from '@/components/2026-design/FreshDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Zap, 
  Sparkles, 
  Eye, 
  RefreshCw,
  ArrowRight,
  Target,
  TrendingUp,
  Star
} from 'lucide-react';

// Import the new design system
import '@/styles/2026-design-system.css';

const Design2026 = () => {
  const [currentDesign, setCurrentDesign] = useState<'neubrutalist' | 'glassmorphism' | 'bento'>('bento');
  const [showDemo, setShowDemo] = useState(false);

  const designStyles = [
    {
      id: 'neubrutalist' as const,
      name: 'Neubrutalist',
      description: 'Bold, raw, and unapologetic design with high contrast',
      color: 'from-yellow-400 to-orange-500',
      icon: '🔥',
      features: ['Bold typography', 'High contrast', 'Chunky borders', 'Raw aesthetics']
    },
    {
      id: 'glassmorphism' as const,
      name: 'Glassmorphism',
      description: 'Translucent, frosted glass effects with depth',
      color: 'from-cyan-400 to-blue-500',
      icon: '✨',
      features: ['Frosted glass', 'Backdrop blur', 'Translucent layers', 'Depth effects']
    },
    {
      id: 'bento' as const,
      name: 'Bento Grid',
      description: 'Organized, modular layouts inspired by Japanese aesthetics',
      color: 'from-emerald-400 to-green-500',
      icon: '🍱',
      features: ['Modular grids', 'Clean organization', 'Responsive design', 'Balanced composition']
    }
  ];

  const sampleMenuItems = [
    {
      id: '1',
      name: 'Buffalo Wings Deluxe',
      description: 'Crispy wings with our signature buffalo sauce and ranch dip',
      price: 14.99,
      rating: 4.8,
      cookTime: 12,
      dietary: ['Spicy', 'Gluten-Free'],
      isPopular: true
    },
    {
      id: '2',
      name: 'Artisan Burger',
      description: 'Grass-fed beef with truffle aioli and aged cheddar',
      price: 18.99,
      rating: 4.9,
      cookTime: 15,
      dietary: ['Premium', 'Local']
    },
    {
      id: '3',
      name: 'Vegan Buddha Bowl',
      description: 'Quinoa, roasted vegetables, and tahini dressing',
      price: 16.99,
      rating: 4.7,
      cookTime: 8,
      dietary: ['Vegan', 'Healthy', 'GF']
    }
  ];

  const trendHighlights = [
    {
      trend: 'Neubrutalism',
      impact: 'Eye-catching',
      description: 'Bold, in-your-face design that demands attention',
      stats: '+340% engagement',
      color: 'bg-gradient-to-r from-yellow-400 to-red-500'
    },
    {
      trend: 'Glassmorphism',
      impact: 'Premium Feel',
      description: 'Sophisticated, modern aesthetic with depth',
      stats: '+250% conversions',
      color: 'bg-gradient-to-r from-cyan-400 to-blue-600'
    },
    {
      trend: 'Bento Grids',
      impact: 'User-Friendly',
      description: 'Organized layouts that improve usability',
      stats: '+180% retention',
      color: 'bg-gradient-to-r from-emerald-400 to-green-600'
    }
  ];

  const inspirationSources = [
    { name: 'TikTok', revenue: '$2.33B', highlight: 'Dynamic video interfaces' },
    { name: 'Monopoly GO!', revenue: '$2.2B', highlight: 'Playful gamification' },
    { name: 'Honor of Kings', revenue: '$2.6B', highlight: 'Immersive visuals' },
    { name: 'Royal Match', revenue: '$2.0B', highlight: 'Addictive UI patterns' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-8 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="h-8 w-8" />
            <h1 className="text-4xl font-bold">OrderFi 2026 Design System</h1>
            <Badge className="bg-white/20 text-white">Fresh</Badge>
          </div>
          <p className="text-xl text-white/90">
            Revolutionary design trends inspired by top-grossing apps and 2026 UI predictions
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Inspiration Sources */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Inspiration from Top-Grossing Apps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {inspirationSources.map((source) => (
                <div key={source.name} className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border">
                  <div className="text-2xl font-bold text-green-600 mb-2">{source.revenue}</div>
                  <div className="font-semibold text-gray-900 mb-1">{source.name}</div>
                  <div className="text-sm text-gray-600">{source.highlight}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trend Highlights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              2026 Design Trends Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendHighlights.map((trend) => (
                <div key={trend.trend} className="relative overflow-hidden rounded-lg">
                  <div className={`${trend.color} p-6 text-white`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg">{trend.trend}</h3>
                      <Badge className="bg-white/20 text-white">{trend.impact}</Badge>
                    </div>
                    <p className="text-white/90 text-sm mb-3">{trend.description}</p>
                    <div className="flex items-center gap-2 text-white">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-semibold">{trend.stats}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Design Style Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Choose Your 2026 Design Style
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {designStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setCurrentDesign(style.id)}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 text-left ${
                    currentDesign === style.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${style.color} flex items-center justify-center text-2xl`}>
                      {style.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{style.name}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{style.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {style.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={() => setShowDemo(true)} 
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview {designStyles.find(s => s.id === currentDesign)?.name}
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Apply to OrderFi
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Section */}
        {showDemo && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Live Demo - {designStyles.find(s => s.id === currentDesign)?.name} Style
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="cards" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="cards">Menu Cards</TabsTrigger>
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                </TabsList>
                
                <TabsContent value="cards">
                  <div className="bento-grid">
                    {sampleMenuItems.map((item) => (
                      <FreshOrderCard
                        key={item.id}
                        {...item}
                        designStyle={currentDesign}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="dashboard">
                  <FreshDashboard designStyle={currentDesign} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Implementation Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Ready to Transform OrderFi?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                These cutting-edge 2026 design trends are based on comprehensive research of top-grossing apps 
                and emerging UI patterns. Each style offers unique advantages:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-bold text-yellow-800 mb-2">Neubrutalist</h4>
                  <p className="text-sm text-yellow-700">
                    Perfect for grabbing attention and creating memorable brand experiences
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-2">Glassmorphism</h4>
                  <p className="text-sm text-blue-700">
                    Ideal for premium experiences and sophisticated restaurant brands
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-bold text-green-800 mb-2">Bento Grid</h4>
                  <p className="text-sm text-green-700">
                    Best for complex data organization and improved user experience
                  </p>
                </div>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-lg py-3">
                <Sparkles className="h-5 w-5 mr-2" />
                Implement Fresh 2026 Design System
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Design2026;