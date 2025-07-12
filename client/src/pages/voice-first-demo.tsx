import React, { useState, useEffect } from 'react';
import { VoiceFirstOrchestrator } from '@/components/voice/VoiceFirstOrchestrator';
import { ConversationalCanvas } from '@/components/ui/ConversationalCanvas';
import { AIPersonalizationEngine } from '@/components/ai/AIPersonalizationEngine';
import { NudgeEngine } from '@/components/ai/NudgeEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { 
  Brain, 
  Mic, 
  Eye, 
  Target, 
  Zap,
  Bot,
  Users,
  TrendingUp,
  Settings,
  ShoppingCart
} from 'lucide-react';

interface DemoState {
  voiceActive: boolean;
  conversationContext: any;
  personalizationResult: any;
  customerProfile: any;
  currentOrder: any[];
  robotStatus: any;
}

export default function VoiceFirstDemo() {
  const [demoState, setDemoState] = useState<DemoState>({
    voiceActive: false,
    conversationContext: {
      intent: 'browsing',
      entities: [],
      sentiment: 'positive',
      confidence: 0.85,
      currentFocus: ''
    },
    personalizationResult: null,
    customerProfile: null,
    currentOrder: [],
    robotStatus: null
  });

  // Fetch menu items for demonstration
  const { data: menuItems = [] } = useQuery({
    queryKey: ['/api/menu-items'],
    queryFn: async () => {
      const response = await fetch('/api/menu-items');
      if (!response.ok) throw new Error('Failed to fetch menu items');
      return response.json();
    }
  });

  // Fetch robot status
  const { data: robotStatus } = useQuery({
    queryKey: ['/api/robots/status'],
    queryFn: async () => {
      const response = await fetch('/api/robots/status');
      if (!response.ok) throw new Error('Failed to fetch robot status');
      return response.json();
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  useEffect(() => {
    if (robotStatus) {
      setDemoState(prev => ({ ...prev, robotStatus }));
    }
  }, [robotStatus]);

  const handleOrderUpdate = (orderData: any) => {
    setDemoState(prev => ({
      ...prev,
      currentOrder: [...prev.currentOrder, orderData],
      conversationContext: {
        ...prev.conversationContext,
        intent: 'ordering',
        currentFocus: orderData.itemName
      }
    }));
  };

  const handleUIAdaptation = (adaptationData: any) => {
    setDemoState(prev => ({
      ...prev,
      conversationContext: {
        ...prev.conversationContext,
        ...adaptationData
      }
    }));
  };

  const handleRobotCommand = async (command: any) => {
    try {
      const response = await fetch('/api/robots/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Robot command executed:', result);
      }
    } catch (error) {
      console.error('Robot command failed:', error);
    }
  };

  const handlePersonalizationUpdate = (result: any) => {
    setDemoState(prev => ({
      ...prev,
      personalizationResult: result
    }));
  };

  const handleProfileUpdate = (profile: any) => {
    setDemoState(prev => ({
      ...prev,
      customerProfile: profile
    }));
  };

  const handleItemSelect = (item: any) => {
    handleOrderUpdate({
      itemId: item.id,
      itemName: item.content?.title || 'Selected Item',
      price: 12.99
    });
  };

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command:', command);
    setDemoState(prev => ({
      ...prev,
      voiceActive: true,
      conversationContext: {
        ...prev.conversationContext,
        intent: command.includes('customize') ? 'customizing' : 'browsing'
      }
    }));
  };

  const handleGestureAction = (action: string, data?: any) => {
    console.log('Gesture action:', action, data);
    
    switch (action) {
      case 'swipe-left':
        setDemoState(prev => ({
          ...prev,
          conversationContext: {
            ...prev.conversationContext,
            intent: 'browsing'
          }
        }));
        break;
      case 'swipe-right':
        setDemoState(prev => ({
          ...prev,
          conversationContext: {
            ...prev.conversationContext,
            intent: 'checkout'
          }
        }));
        break;
      case 'swipe-up':
        setDemoState(prev => ({
          ...prev,
          conversationContext: {
            ...prev.conversationContext,
            intent: 'ordering'
          }
        }));
        break;
    }
  };

  const handleNudgeTriggered = (nudge: any) => {
    console.log('Nudge triggered:', nudge);
  };

  const handleItemAddedToCart = (item: any) => {
    handleOrderUpdate({
      itemId: item.id,
      itemName: item.name,
      price: item.price
    });
  };

  const handleNudgeDeclined = (nudgeId: string) => {
    console.log('Nudge declined:', nudgeId);
  };

  const generateNudgeContext = () => ({
    customerProfile: demoState.customerProfile,
    currentOrder: demoState.currentOrder,
    orderHistory: [],
    timeContext: {
      timeOfDay: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening',
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      rushPeriod: new Date().getHours() >= 12 && new Date().getHours() <= 14,
      lastOrderTime: new Date()
    },
    socialContext: {
      popularItems: menuItems.slice(0, 5),
      trendingNow: menuItems.slice(5, 10),
      peakOrders: 150,
      socialProof: true
    },
    businessContext: {
      inventoryLevels: {
        '1': 3,
        '2': 8,
        '3': 1
      },
      marginOptimization: true,
      promotionalPeriod: false
    }
  });

  return (
    <div className="voice-first-demo min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              OrderFi Voice-First Demo
            </h1>
            <p className="text-muted-foreground mt-2">
              Experience the future of restaurant ordering with AI-driven voice interfaces and robot automation
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${demoState.voiceActive ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span>Voice {demoState.voiceActive ? 'Active' : 'Inactive'}</span>
            </Badge>
            
            <Badge variant="outline" className="flex items-center space-x-1">
              <Bot className="h-3 w-3" />
              <span>Robots: {robotStatus ? Object.keys(robotStatus).length : 0}</span>
            </Badge>
            
            <Badge variant="outline" className="flex items-center space-x-1">
              <ShoppingCart className="h-3 w-3" />
              <span>Cart: {demoState.currentOrder.length}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Demo Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Voice Orchestrator & AI */}
        <div className="space-y-6">
          {/* Voice First Orchestrator */}
          <VoiceFirstOrchestrator
            onOrderUpdate={handleOrderUpdate}
            onUIAdaptation={handleUIAdaptation}
            onRobotCommand={handleRobotCommand}
            className="glass-morphism"
          />
          
          {/* AI Personalization Engine */}
          <AIPersonalizationEngine
            customerId="demo-customer"
            menuItems={menuItems}
            onPersonalizationUpdate={handlePersonalizationUpdate}
            onProfileUpdate={handleProfileUpdate}
            className="glass-morphism"
          />
          
          {/* Robot Status */}
          {robotStatus && (
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-500" />
                  <span className="playwrite-font">Robot Fleet Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(robotStatus).map(([robotId, status]: [string, any]) => (
                  <div key={robotId} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{robotId.replace('_', ' ').toUpperCase()}</div>
                      <div className="text-xs text-muted-foreground">{status.currentTask}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        status.status === 'active' ? 'bg-green-500' : 
                        status.status === 'charging' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-xs">{status.batteryLevel}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Center Column: Conversational Canvas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Conversational Canvas */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Eye className="h-5 w-5 text-orange-500" />
                <span className="playwrite-font">Conversational Canvas</span>
                <Badge variant="outline" className="text-xs ml-auto">
                  {demoState.conversationContext.intent}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ConversationalCanvas
                conversationContext={demoState.conversationContext}
                menuItems={menuItems}
                onItemSelect={handleItemSelect}
                onVoiceCommand={handleVoiceCommand}
                onGestureAction={handleGestureAction}
              />
            </CardContent>
          </Card>
          
          {/* Nudge Engine */}
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-500" />
                <span className="playwrite-font">Psychology-Based Nudges</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NudgeEngine
                context={generateNudgeContext()}
                onNudgeTriggered={handleNudgeTriggered}
                onItemAddedToCart={handleItemAddedToCart}
                onNudgeDeclined={handleNudgeDeclined}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Demo Controls & Analytics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Demo Controls */}
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Settings className="h-5 w-5 text-gray-500" />
              <span className="playwrite-font">Demo Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDemoState(prev => ({ 
                  ...prev, 
                  conversationContext: { ...prev.conversationContext, intent: 'browsing' }
                }))}
              >
                Browsing Mode
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDemoState(prev => ({ 
                  ...prev, 
                  conversationContext: { ...prev.conversationContext, intent: 'ordering' }
                }))}
              >
                Ordering Mode
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDemoState(prev => ({ 
                  ...prev, 
                  conversationContext: { ...prev.conversationContext, intent: 'customizing' }
                }))}
              >
                Customizing Mode
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDemoState(prev => ({ 
                  ...prev, 
                  conversationContext: { ...prev.conversationContext, intent: 'checkout' }
                }))}
              >
                Checkout Mode
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={() => setDemoState(prev => ({ 
                  ...prev, 
                  voiceActive: !prev.voiceActive 
                }))}
              >
                <Mic className="h-4 w-4 mr-2" />
                {demoState.voiceActive ? 'Stop Voice Demo' : 'Start Voice Demo'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Order */}
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-green-500" />
              <span className="playwrite-font">Current Order</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {demoState.currentOrder.length > 0 ? (
              <div className="space-y-2">
                {demoState.currentOrder.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white/50 rounded">
                    <span className="text-sm font-medium">{item.itemName}</span>
                    <span className="text-sm">${item.price}</span>
                  </div>
                ))}
                <div className="pt-2 border-t font-semibold">
                  Total: ${demoState.currentOrder.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No items in order yet. Start voice ordering to add items!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span className="playwrite-font">Live Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {demoState.conversationContext.confidence * 100 | 0}%
                </div>
                <div className="text-xs text-muted-foreground">Voice Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {demoState.currentOrder.length}
                </div>
                <div className="text-xs text-muted-foreground">Items Ordered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {demoState.personalizationResult?.recommendations?.length || 0}
                </div>
                <div className="text-xs text-muted-foreground">AI Suggestions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">
                  {robotStatus ? Object.values(robotStatus).filter((r: any) => r.status === 'active').length : 0}
                </div>
                <div className="text-xs text-muted-foreground">Active Robots</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .glass-morphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
      `}</style>
    </div>
  );
}