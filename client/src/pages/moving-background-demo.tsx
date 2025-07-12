import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sidebar } from '@/components/Sidebar';
import { Palette, Zap, Gauge, Star, Sparkles, Play, Pause } from 'lucide-react';
import MovingTexturedBackground from '@/components/MovingTexturedBackground';
import NovelMovingBackground from '@/components/NovelMovingBackground';
import AnimatedBackground from '@/components/AnimatedBackground';
import InteractiveStarryBackground from '@/components/InteractiveStarryBackground';

export default function MovingBackgroundDemo() {
  const [intensity, setIntensity] = useState<'subtle' | 'medium' | 'vibrant'>('medium');
  const [speed, setSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [isPlaying, setIsPlaying] = useState(true);

  const handleIntensityChange = (value: string) => {
    setIntensity(value as 'subtle' | 'medium' | 'vibrant');
  };

  const handleSpeedChange = (value: string) => {
    setSpeed(value as 'slow' | 'medium' | 'fast');
  };

  const getIntensityColor = (level: string) => {
    switch (level) {
      case 'subtle': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'vibrant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSpeedColor = (level: string) => {
    switch (level) {
      case 'slow': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'fast': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Interactive Starry Background */}
      <InteractiveStarryBackground />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Interactive Starry Background
            </h1>
            <p className="text-muted-foreground">
              Canvas-based starry orange night with parallax scrolling, twinkling stars, and interactive movement - perfect for a warm, engaging food app experience
            </p>
          </div>

          {/* Controls */}
          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Background Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Intensity Control */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Intensity</label>
                  <Select value={intensity} onValueChange={handleIntensityChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subtle">Subtle</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="vibrant">Vibrant</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge className={getIntensityColor(intensity)}>
                    {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                  </Badge>
                </div>

                {/* Speed Control */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Animation Speed</label>
                  <Select value={speed} onValueChange={handleSpeedChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="fast">Fast</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge className={getSpeedColor(speed)}>
                    {speed.charAt(0).toUpperCase() + speed.slice(1)}
                  </Badge>
                </div>

                {/* Play/Pause Control */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Animation</label>
                  <Button
                    variant={isPlaying ? "default" : "outline"}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-full"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Play
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Description */}
          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>Background Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Visual Effects</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-orange-500" />
                      <span>Layered gradient animations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-orange-500" />
                      <span>Floating particle effects</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-orange-500" />
                      <span>Geometric pattern overlays</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-orange-500" />
                      <span>Subtle texture movements</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Performance</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>GPU-accelerated animations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>Optimized CSS transforms</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>Reduced motion support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>Mobile-responsive design</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gauge className="w-5 h-5" />
                <span>Technical Implementation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Current Settings</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Intensity:</span> {intensity}</p>
                      <p><span className="font-medium">Speed:</span> {speed}</p>
                      <p><span className="font-medium">Status:</span> {isPlaying ? 'Playing' : 'Paused'}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">CSS Features</h4>
                    <div className="space-y-1 text-sm">
                      <p>• Multiple animation layers</p>
                      <p>• CSS custom properties</p>
                      <p>• Transform3d optimization</p>
                      <p>• Backdrop-filter effects</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    This background uses advanced CSS animations with hardware acceleration, 
                    multiple gradient layers, geometric patterns, and floating particles to create 
                    a sophisticated visual experience optimized for restaurant ordering interfaces.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Content */}
          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Sample OrderFi Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg">
                  <h3 className="font-semibold mb-2">Today's Special</h3>
                  <p className="text-sm text-muted-foreground">
                    Experience our signature Buffalo Wings with the perfect blend of spices.
                  </p>
                  <Button className="mt-3 w-full">Order Now</Button>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg">
                  <h3 className="font-semibold mb-2">Fresh Ingredients</h3>
                  <p className="text-sm text-muted-foreground">
                    All our dishes are prepared with locally sourced, fresh ingredients.
                  </p>
                  <Button className="mt-3 w-full" variant="outline">Learn More</Button>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                  <h3 className="font-semibold mb-2">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Quick service with our AI-powered kitchen management system.
                  </p>
                  <Button className="mt-3 w-full" variant="outline">Track Order</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}