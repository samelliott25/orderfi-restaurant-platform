import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Zap, Sparkles, Heart, Star } from 'lucide-react';

const KleurvormDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section with Kleurvörm Gradients */}
      <div className="kleurvorm-primary p-8 rounded-xl text-white">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Kleurvörm Theme System</h1>
          <p className="text-lg opacity-90 mb-6">
            Sophisticated purple-blue-pink-orange gradient palette for professional restaurant management
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Primary Gradient
            </Button>
            <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              <Heart className="w-4 h-4 mr-2" />
              Explore Theme
            </Button>
          </div>
        </div>
      </div>

      {/* Color Palette Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Primary Gradient */}
        <Card className="orderfi-glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Primary Gradient
            </CardTitle>
            <CardDescription>
              Deep navy → Royal blue → Purple → Mint → Coral
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="kleurvorm-primary h-20 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <Badge className="bg-primary text-primary-foreground">Purple Primary</Badge>
              <Badge className="bg-accent text-accent-foreground">Orange Accent</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Gradient */}
        <Card className="orderfi-glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Secondary Gradient
            </CardTitle>
            <CardDescription>
              Light lavender → Purple → Red → Navy → Orange
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="kleurvorm-secondary h-20 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <Badge variant="secondary">Lavender Start</Badge>
              <Badge className="bg-red-500 text-white">Red Accent</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Accent Gradient */}
        <Card className="orderfi-glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Accent Gradient
            </CardTitle>
            <CardDescription>
              Coral orange → Warm orange
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="kleurvorm-accent h-20 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <Badge className="bg-orange-500 text-white">Coral Orange</Badge>
              <Badge className="bg-yellow-500 text-white">Warm Orange</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Component Showcase */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold orderfi-gradient-text">Enhanced OrderFi Components</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Enhanced Cards */}
          <div className="orderfi-card p-6">
            <h3 className="text-xl font-semibold mb-3 orderfi-gradient-text">OrderFi Glass Card</h3>
            <p className="text-muted-foreground mb-4">
              Professional glassmorphism effect with Kleurvörm gradient accents
            </p>
            <Button className="orderfi-button-primary">
              <Sparkles className="w-4 h-4 mr-2" />
              Primary Action
            </Button>
          </div>

          <div className="orderfi-glass p-6">
            <h3 className="text-xl font-semibold mb-3">Glass Morphism</h3>
            <p className="text-muted-foreground mb-4">
              Sophisticated backdrop blur with subtle transparency
            </p>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Palette className="w-4 h-4 mr-2" />
              Secondary Action
            </Button>
          </div>
        </div>

        {/* Gradient Text Examples */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold orderfi-gradient-text">Gradient Text Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-card rounded-lg">
              <h4 className="orderfi-gradient-text text-lg font-semibold mb-2">Restaurant Menu</h4>
              <p className="text-sm text-muted-foreground">Purple to orange gradient text for headers</p>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <h4 className="orderfi-gradient-text text-lg font-semibold mb-2">Order Status</h4>
              <p className="text-sm text-muted-foreground">Sophisticated branding throughout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Implementation Status */}
      <Card className="orderfi-glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Theme Implementation Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">CSS Variables Updated</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Gradient Classes Applied</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Component System Enhanced</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Light/Dark Mode Ready</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Glassmorphism Effects</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Professional Branding</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KleurvormDemo;