import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  ShoppingCart, 
  Star, 
  TrendingUp, 
  Sparkles,
  Eye,
  Mic
} from 'lucide-react';

interface ConversationContext {
  intent: 'browsing' | 'ordering' | 'customizing' | 'checkout' | 'feedback';
  entities: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  currentFocus: string;
}

interface GridItem {
  id: string;
  type: 'menu_item' | 'category' | 'promotion' | 'cart' | 'ai_suggestion' | 'visual_element';
  content: any;
  priority: number;
  size: 'sm' | 'md' | 'lg' | 'xl';
  position: { x: number; y: number };
  glassmorphism: boolean;
  interactive: boolean;
}

interface ConversationalCanvasProps {
  conversationContext: ConversationContext;
  menuItems: any[];
  onItemSelect: (item: any) => void;
  onVoiceCommand: (command: string) => void;
  onGestureAction: (action: string, data?: any) => void;
  className?: string;
}

export function ConversationalCanvas({
  conversationContext,
  menuItems,
  onItemSelect,
  onVoiceCommand,
  onGestureAction,
  className = ''
}: ConversationalCanvasProps) {
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [adaptiveLayout, setAdaptiveLayout] = useState<'grid' | 'list' | 'focus' | 'immersive'>('grid');
  const [voiceFeedback, setVoiceFeedback] = useState<string>('');
  const canvasRef = useRef<HTMLDivElement>(null);

  // Adaptive grid system that responds to conversation context
  useEffect(() => {
    generateAdaptiveGrid();
  }, [conversationContext, menuItems]);

  const generateAdaptiveGrid = () => {
    const items: GridItem[] = [];
    
    // Base grid items based on conversation context
    switch (conversationContext.intent) {
      case 'browsing':
        items.push(...generateBrowsingGrid());
        break;
      case 'ordering':
        items.push(...generateOrderingGrid());
        break;
      case 'customizing':
        items.push(...generateCustomizingGrid());
        break;
      case 'checkout':
        items.push(...generateCheckoutGrid());
        break;
      case 'feedback':
        items.push(...generateFeedbackGrid());
        break;
    }
    
    // Add AI suggestions based on sentiment and entities
    if (conversationContext.confidence > 0.7) {
      items.push(...generateAISuggestions());
    }
    
    // Optimize layout based on screen size and context
    const optimizedItems = optimizeLayoutForContext(items);
    setGridItems(optimizedItems);
  };

  const generateBrowsingGrid = (): GridItem[] => {
    return [
      {
        id: 'featured-categories',
        type: 'category',
        content: { title: 'Popular Categories', categories: ['Burgers', 'Pizza', 'Salads'] },
        priority: 1,
        size: 'lg',
        position: { x: 0, y: 0 },
        glassmorphism: true,
        interactive: true
      },
      {
        id: 'trending-items',
        type: 'menu_item',
        content: { title: 'Trending Now', items: menuItems.slice(0, 6) },
        priority: 2,
        size: 'xl',
        position: { x: 1, y: 0 },
        glassmorphism: true,
        interactive: true
      },
      {
        id: 'voice-guide',
        type: 'ai_suggestion',
        content: { 
          title: 'Voice Guide',
          message: 'Say "Show me burgers" or "What\'s popular today?"',
          icon: Mic
        },
        priority: 3,
        size: 'md',
        position: { x: 0, y: 1 },
        glassmorphism: false,
        interactive: true
      }
    ];
  };

  const generateOrderingGrid = (): GridItem[] => {
    return [
      {
        id: 'selected-item',
        type: 'menu_item',
        content: { title: 'Your Selection', item: conversationContext.currentFocus },
        priority: 1,
        size: 'xl',
        position: { x: 0, y: 0 },
        glassmorphism: true,
        interactive: true
      },
      {
        id: 'customization-options',
        type: 'menu_item',
        content: { title: 'Customize', options: ['Size', 'Toppings', 'Modifications'] },
        priority: 2,
        size: 'lg',
        position: { x: 1, y: 0 },
        glassmorphism: true,
        interactive: true
      },
      {
        id: 'ai-upsell',
        type: 'ai_suggestion',
        content: { 
          title: 'Perfect Combo',
          message: 'Add fries and a drink for just $3.99 more?',
          confidence: conversationContext.confidence
        },
        priority: 3,
        size: 'md',
        position: { x: 0, y: 1 },
        glassmorphism: true,
        interactive: true
      }
    ];
  };

  const generateCustomizingGrid = (): GridItem[] => {
    return [
      {
        id: 'item-preview',
        type: 'visual_element',
        content: { title: '3D Preview', showAR: true },
        priority: 1,
        size: 'xl',
        position: { x: 0, y: 0 },
        glassmorphism: true,
        interactive: true
      },
      {
        id: 'modification-panel',
        type: 'menu_item',
        content: { title: 'Modifications', showVoiceInput: true },
        priority: 2,
        size: 'lg',
        position: { x: 1, y: 0 },
        glassmorphism: false,
        interactive: true
      }
    ];
  };

  const generateCheckoutGrid = (): GridItem[] => {
    return [
      {
        id: 'order-summary',
        type: 'cart',
        content: { title: 'Order Summary', showTotal: true },
        priority: 1,
        size: 'lg',
        position: { x: 0, y: 0 },
        glassmorphism: true,
        interactive: true
      },
      {
        id: 'payment-options',
        type: 'menu_item',
        content: { title: 'Payment', showVoicePayment: true },
        priority: 2,
        size: 'md',
        position: { x: 1, y: 0 },
        glassmorphism: false,
        interactive: true
      }
    ];
  };

  const generateFeedbackGrid = (): GridItem[] => {
    return [
      {
        id: 'rating-interface',
        type: 'visual_element',
        content: { title: 'Rate Your Experience', showVoiceRating: true },
        priority: 1,
        size: 'lg',
        position: { x: 0, y: 0 },
        glassmorphism: true,
        interactive: true
      }
    ];
  };

  const generateAISuggestions = (): GridItem[] => {
    const suggestions = [];
    
    // Sentiment-based suggestions
    if (conversationContext.sentiment === 'positive') {
      suggestions.push({
        id: 'positive-upsell',
        type: 'ai_suggestion',
        content: { 
          title: 'You\'re loving it!',
          message: 'Try our signature dessert to complete your meal?',
          icon: Star
        },
        priority: 4,
        size: 'sm',
        position: { x: 2, y: 0 },
        glassmorphism: true,
        interactive: true
      });
    }
    
    // Entity-based suggestions
    if (conversationContext.entities.includes('vegetarian')) {
      suggestions.push({
        id: 'vegetarian-options',
        type: 'ai_suggestion',
        content: { 
          title: 'Vegetarian Options',
          message: 'We have amazing plant-based alternatives!',
          icon: TrendingUp
        },
        priority: 5,
        size: 'md',
        position: { x: 0, y: 2 },
        glassmorphism: true,
        interactive: true
      });
    }
    
    return suggestions;
  };

  const optimizeLayoutForContext = (items: GridItem[]): GridItem[] => {
    // Sort by priority and optimize positions
    const sorted = items.sort((a, b) => a.priority - b.priority);
    
    // Adjust layout based on conversation context
    switch (conversationContext.intent) {
      case 'ordering':
        setAdaptiveLayout('focus');
        break;
      case 'customizing':
        setAdaptiveLayout('immersive');
        break;
      case 'browsing':
        setAdaptiveLayout('grid');
        break;
      default:
        setAdaptiveLayout('grid');
    }
    
    return sorted;
  };



  const renderGridItem = (item: GridItem) => {
    const baseClasses = `
      transition-all duration-300 ease-in-out
      ${item.glassmorphism ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-white dark:bg-gray-800'}
      ${item.interactive ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : ''}
      ${getSizeClasses(item.size)}
    `;

    return (
      <Card 
        key={item.id}
        className={baseClasses}
        onClick={() => item.interactive && onItemSelect(item)}
      >
        <CardContent className="p-4">
          {renderItemContent(item)}
        </CardContent>
      </Card>
    );
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm': return 'col-span-1 row-span-1';
      case 'md': return 'col-span-2 row-span-1';
      case 'lg': return 'col-span-2 row-span-2';
      case 'xl': return 'col-span-3 row-span-2';
      default: return 'col-span-1 row-span-1';
    }
  };

  const renderItemContent = (item: GridItem) => {
    switch (item.type) {
      case 'menu_item':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold playwrite-font">{item.content.title}</h3>
            {item.content.items && (
              <div className="grid grid-cols-2 gap-2">
                {item.content.items.slice(0, 4).map((menuItem: any, index: number) => (
                  <div key={index} className="text-sm p-2 rounded bg-white/50 dark:bg-gray-700/50">
                    <div className="font-medium">{menuItem.name}</div>
                    <div className="text-xs text-muted-foreground">${menuItem.price}</div>
                  </div>
                ))}
              </div>
            )}
            {item.content.showVoiceInput && (
              <Button className="w-full" onClick={() => onVoiceCommand('start_customization')}>
                <Mic className="h-4 w-4 mr-2" />
                Voice Customize
              </Button>
            )}
          </div>
        );
      
      case 'ai_suggestion':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {item.content.icon && <item.content.icon className="h-5 w-5 text-orange-500" />}
              <h3 className="font-semibold playwrite-font">{item.content.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{item.content.message}</p>
            {item.content.confidence && (
              <Badge variant="outline" className="text-xs">
                {Math.round(item.content.confidence * 100)}% confident
              </Badge>
            )}
          </div>
        );
      
      case 'visual_element':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold playwrite-font">{item.content.title}</h3>
            {item.content.showAR && (
              <div className="h-32 bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-sm">AR Preview</p>
                </div>
              </div>
            )}
            {item.content.showVoiceRating && (
              <div className="flex items-center space-x-2">
                <Button onClick={() => onVoiceCommand('rate_experience')}>
                  <Mic className="h-4 w-4 mr-2" />
                  Voice Rating
                </Button>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div>
            <h3 className="font-semibold playwrite-font">{item.content.title}</h3>
            <p className="text-sm text-muted-foreground">{item.content.message}</p>
          </div>
        );
    }
  };

  const getLayoutClasses = () => {
    switch (adaptiveLayout) {
      case 'focus':
        return 'grid grid-cols-1 md:grid-cols-2 gap-6';
      case 'immersive':
        return 'grid grid-cols-1 gap-8';
      case 'list':
        return 'flex flex-col space-y-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
    }
  };

  return (
    <div 
      ref={canvasRef}
      className={`conversational-canvas ${className}`}
    >
      {/* Context Header */}
      <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-orange-500" />
            <div>
              <h2 className="text-lg font-semibold playwrite-font">
                {conversationContext.intent.charAt(0).toUpperCase() + conversationContext.intent.slice(1)}
              </h2>
              <p className="text-sm text-muted-foreground">
                {conversationContext.entities.join(', ') || 'Ready to help'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {conversationContext.sentiment}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {Math.round(conversationContext.confidence * 100)}%
            </Badge>
          </div>
        </div>
      </div>

      {/* Adaptive Grid */}
      <div className={getLayoutClasses()}>
        {gridItems.map(renderGridItem)}
      </div>



      {/* Voice Feedback */}
      {voiceFeedback && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm">
          {voiceFeedback}
        </div>
      )}
    </div>
  );
}