import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlassMorphismCard } from '@/components/GlassMorphismCard';
import { SpatialVoiceNav } from '@/components/SpatialVoiceNav';
import { GestureZones } from '@/components/GestureZones';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Navigation, Hand, Mic, Eye } from 'lucide-react';

const UIShowcase = () => {
  const [activeDemo, setActiveDemo] = useState<string>('glassmorphism');
  const [voiceCommand, setVoiceCommand] = useState<string>('');
  const [gestureEvent, setGestureEvent] = useState<string>('');

  const handleVoiceCommand = (command: string, confidence: number) => {
    setVoiceCommand(`"${command}" (${Math.round(confidence * 100)}% confidence)`);
  };

  const handleGestureRecognized = (gesture: any) => {
    setGestureEvent(`${gesture.type} ${gesture.direction || ''} gesture detected`);
  };

  const handleQuickAction = (action: string) => {
    setGestureEvent(`Quick action: ${action}`);
  };

  const demoCards = [
    {
      title: 'Crispy Buffalo Wings',
      description: 'Classic buffalo wings with your choice of mild, medium, or hot sauce',
      price: '$16.00',
      category: 'Buffalo Wings',
      dietary: ['GF Available'],
      image: '/api/placeholder/300/200'
    },
    {
      title: 'Wagyu Beef Burger',
      description: 'Premium wagyu beef patty with aged cheddar, lettuce, tomato, and our special sauce',
      price: '$28.00',
      category: 'Burgers',
      dietary: ['Premium'],
      image: '/api/placeholder/300/200'
    },
    {
      title: 'Vegan Power Bowl',
      description: 'Quinoa, roasted vegetables, avocado, and tahini dressing',
      price: '$19.00',
      category: 'Plant Powered',
      dietary: ['Vegan', 'GF'],
      image: '/api/placeholder/300/200'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3"
          >
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white playwrite-font bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              UI Infrastructure Upgrade
            </h1>
            <Sparkles className="w-8 h-8 text-purple-400" />
          </motion.div>
          
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Experience the future of restaurant ordering with cutting-edge UI innovations powered by ADA's autonomous design system analysis.
          </p>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/50">
              25 Concepts Generated
            </Badge>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
              8.7/10 Top Score
            </Badge>
            <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/50">
              3 Implementations
            </Badge>
          </div>
        </div>

        {/* Innovation Showcase */}
        <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger 
              value="glassmorphism" 
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
            >
              <Eye className="w-4 h-4 mr-2" />
              Glass Morphism
            </TabsTrigger>
            <TabsTrigger 
              value="voice-nav" 
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
            >
              <Mic className="w-4 h-4 mr-2" />
              Spatial Voice
            </TabsTrigger>
            <TabsTrigger 
              value="gesture-zones" 
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300"
            >
              <Hand className="w-4 h-4 mr-2" />
              Gesture Zones
            </TabsTrigger>
          </TabsList>

          {/* Glassmorphism Demo */}
          <TabsContent value="glassmorphism" className="space-y-6">
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-400" />
                  Dynamic Glass Morphism Cards
                </CardTitle>
                <p className="text-slate-300">
                  Advanced glassmorphism with dynamic blur, depth, and environmental reflection. 
                  Hover over cards to see the 3D effects and spatial interactions.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {demoCards.map((card, index) => (
                    <GlassMorphismCard
                      key={index}
                      className="min-h-[300px]"
                      blurIntensity={20}
                      depth={2}
                      enableHover={true}
                      gradient="from-white/25 via-white/15 to-white/10"
                    >
                      <div className="space-y-3">
                        <div className="w-full h-32 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                          <div className="text-white/60 text-sm">Menu Item Image</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-white font-semibold">{card.title}</h3>
                            <span className="text-orange-400 font-bold">{card.price}</span>
                          </div>
                          
                          <p className="text-slate-300 text-sm">{card.description}</p>
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs bg-orange-500/20 text-orange-300 border-orange-500/50">
                              {card.category}
                            </Badge>
                            {card.dietary.map((diet, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-green-500/20 text-green-300 border-green-500/50">
                                {diet}
                              </Badge>
                            ))}
                          </div>
                          
                          <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </GlassMorphismCard>
                  ))}
                </div>
                
                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <h4 className="text-white font-semibold mb-2">Business Impact</h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Creates premium dining experience perception</li>
                    <li>• Increases menu item perceived value by 15-20%</li>
                    <li>• Reduces cognitive load with depth-based information hierarchy</li>
                    <li>• Improves mobile interaction with 3D haptic feedback</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spatial Voice Navigation Demo */}
          <TabsContent value="voice-nav" className="space-y-6">
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-400" />
                  Spatial Voice Navigation
                </CardTitle>
                <p className="text-slate-300">
                  3D spatial audio-guided navigation with haptic feedback for completely hands-free ordering.
                  Perfect for busy kitchen staff or enhanced accessibility.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <SpatialVoiceNav
                      onVoiceCommand={handleVoiceCommand}
                      onSpatialUpdate={(position) => console.log('Spatial position:', position)}
                      enableHaptics={true}
                      spatialSensitivity={0.7}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                      <h4 className="text-white font-semibold mb-2">Voice Command Status</h4>
                      <div className="text-sm">
                        {voiceCommand ? (
                          <div className="text-green-400">{voiceCommand}</div>
                        ) : (
                          <div className="text-slate-400">No recent commands</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                      <h4 className="text-white font-semibold mb-2">Sample Commands</h4>
                      <div className="text-sm text-slate-300 space-y-1">
                        <div>• "Add buffalo wings to cart"</div>
                        <div>• "Show me vegan options"</div>
                        <div>• "Navigate to checkout"</div>
                        <div>• "Repeat last order"</div>
                        <div>• "Call waiter"</div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                      <h4 className="text-white font-semibold mb-2">Business Impact</h4>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• Reduces order time by 40% for repeat customers</li>
                        <li>• Enables completely hands-free operation</li>
                        <li>• Improves accessibility for visually impaired users</li>
                        <li>• Perfect for kitchen staff workflow integration</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gesture Zones Demo */}
          <TabsContent value="gesture-zones" className="space-y-6">
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Hand className="w-5 h-5 text-green-400" />
                  Contextual Gesture Zones
                </CardTitle>
                <p className="text-slate-300">
                  Smart gesture recognition zones that adapt to user behavior and screen size.
                  Enables rapid ordering with intuitive swipe and tap gestures.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <GestureZones
                      onGestureRecognized={handleGestureRecognized}
                      onQuickAction={handleQuickAction}
                      enableHaptics={true}
                      sensitivity={0.6}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                      <h4 className="text-white font-semibold mb-2">Gesture Activity</h4>
                      <div className="text-sm">
                        {gestureEvent ? (
                          <div className="text-green-400">{gestureEvent}</div>
                        ) : (
                          <div className="text-slate-400">No recent gestures</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                      <h4 className="text-white font-semibold mb-2">Gesture Guide</h4>
                      <div className="text-sm text-slate-300 space-y-1">
                        <div>• <strong>Swipe Left:</strong> Quick add to cart</div>
                        <div>• <strong>Swipe Right:</strong> Add to favorites</div>
                        <div>• <strong>Swipe Up:</strong> View details</div>
                        <div>• <strong>Long Press:</strong> Customize options</div>
                        <div>• <strong>Double Tap:</strong> Quick reorder</div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                      <h4 className="text-white font-semibold mb-2">Business Impact</h4>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• Reduces ordering time by 40%</li>
                        <li>• Enables one-handed tablet operation</li>
                        <li>• Improves accessibility for motor impairments</li>
                        <li>• Increases customer satisfaction scores</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Implementation Summary */}
        <Card className="bg-slate-800/30 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              ADA Implementation Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">127</div>
                <div className="text-sm text-slate-300">Design Patterns Analyzed</div>
              </div>
              <div className="bg-slate-900/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">25</div>
                <div className="text-sm text-slate-300">Innovation Concepts</div>
              </div>
              <div className="bg-slate-900/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">8.7/10</div>
                <div className="text-sm text-slate-300">Top Innovation Score</div>
              </div>
            </div>
            
            <div className="bg-slate-900/30 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">Top Scoring Concepts</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Spatial Voice Navigation</span>
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/50">8.7/10</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Dynamic Glass Morphism Cards</span>
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50">8.5/10</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Contextual Gesture Zones</span>
                  <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/50">8.3/10</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UIShowcase;