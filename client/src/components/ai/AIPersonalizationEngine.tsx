import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Clock, 
  Sun, 
  Moon, 
  CloudRain, 
  Snowflake,
  Calendar,
  TrendingUp,
  Heart,
  Utensils,
  Star,
  Target
} from 'lucide-react';

interface CustomerProfile {
  id: string;
  preferences: {
    dietary: string[];
    cuisines: string[];
    spiceLevel: number;
    priceRange: [number, number];
    allergens: string[];
  };
  behavior: {
    orderFrequency: number;
    averageOrderValue: number;
    favoriteCategories: string[];
    orderTimes: string[];
    seasonalPreferences: Record<string, string[]>;
  };
  context: {
    currentMood: 'happy' | 'stressed' | 'adventurous' | 'comfort' | 'healthy';
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    weather: 'sunny' | 'rainy' | 'cold' | 'hot';
    dayOfWeek: string;
    isSpecialOccasion: boolean;
  };
}

interface PersonalizationResult {
  recommendations: Array<{
    id: string;
    item: any;
    score: number;
    reasoning: string;
    confidence: number;
    category: 'behavioral' | 'contextual' | 'seasonal' | 'mood' | 'weather';
  }>;
  adaptations: {
    interfaceTheme: string;
    layoutPreference: string;
    interactionStyle: string;
    voicePersonality: string;
  };
  insights: Array<{
    type: 'preference' | 'behavior' | 'opportunity' | 'recommendation';
    title: string;
    description: string;
    confidence: number;
    actionable: boolean;
  }>;
}

interface AIPersonalizationEngineProps {
  customerId?: string;
  menuItems: any[];
  onPersonalizationUpdate: (result: PersonalizationResult) => void;
  onProfileUpdate: (profile: CustomerProfile) => void;
  className?: string;
}

export function AIPersonalizationEngine({
  customerId,
  menuItems,
  onPersonalizationUpdate,
  onProfileUpdate,
  className = ''
}: AIPersonalizationEngineProps) {
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [personalizationResult, setPersonalizationResult] = useState<PersonalizationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [learningMode, setLearningMode] = useState(true);

  useEffect(() => {
    if (customerId) {
      loadCustomerProfile();
    } else {
      generateContextualProfile();
    }
  }, [customerId]);

  useEffect(() => {
    if (customerProfile) {
      generatePersonalizedRecommendations();
    }
  }, [customerProfile, menuItems]);

  const loadCustomerProfile = async () => {
    try {
      const response = await fetch(`/api/customers/${customerId}/profile`);
      if (response.ok) {
        const profile = await response.json();
        setCustomerProfile(profile);
      } else {
        generateContextualProfile();
      }
    } catch (error) {
      console.error('Error loading customer profile:', error);
      generateContextualProfile();
    }
  };

  const generateContextualProfile = () => {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Determine time of day
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';
    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';

    // Simulate weather context (in real app, use weather API)
    const weatherConditions = ['sunny', 'rainy', 'cold', 'hot'];
    const weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)] as any;

    // Determine mood based on contextual factors
    let currentMood: 'happy' | 'stressed' | 'adventurous' | 'comfort' | 'healthy' = 'happy';
    if (dayOfWeek === 'Monday') currentMood = 'comfort';
    else if (dayOfWeek === 'Friday') currentMood = 'adventurous';
    else if (weather === 'rainy') currentMood = 'comfort';
    else if (timeOfDay === 'morning') currentMood = 'healthy';

    const contextualProfile: CustomerProfile = {
      id: customerId || 'anonymous',
      preferences: {
        dietary: [],
        cuisines: [],
        spiceLevel: 2,
        priceRange: [10, 30],
        allergens: []
      },
      behavior: {
        orderFrequency: 1,
        averageOrderValue: 25,
        favoriteCategories: [],
        orderTimes: [timeOfDay],
        seasonalPreferences: {}
      },
      context: {
        currentMood,
        timeOfDay,
        weather,
        dayOfWeek,
        isSpecialOccasion: false
      }
    };

    setCustomerProfile(contextualProfile);
  };

  const generatePersonalizedRecommendations = async () => {
    if (!customerProfile) return;
    
    setIsProcessing(true);
    
    try {
      // Send profile to AI for personalized recommendations
      const response = await fetch('/api/ai/personalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: customerProfile,
          menuItems,
          contextualFactors: {
            timeOfDay: customerProfile.context.timeOfDay,
            weather: customerProfile.context.weather,
            mood: customerProfile.context.currentMood,
            dayOfWeek: customerProfile.context.dayOfWeek
          }
        })
      });

      if (response.ok) {
        const aiResult = await response.json();
        const personalizedResult: PersonalizationResult = {
          recommendations: aiResult.recommendations.map((rec: any) => ({
            ...rec,
            confidence: Math.min(rec.confidence, 0.95) // Cap AI confidence
          })),
          adaptations: aiResult.adaptations || generateDefaultAdaptations(),
          insights: aiResult.insights || []
        };

        setPersonalizationResult(personalizedResult);
        onPersonalizationUpdate(personalizedResult);
      } else {
        // Fallback to rule-based recommendations
        const fallbackResult = generateRuleBasedRecommendations();
        setPersonalizationResult(fallbackResult);
        onPersonalizationUpdate(fallbackResult);
      }
    } catch (error) {
      console.error('AI personalization error:', error);
      // Fallback to rule-based recommendations
      const fallbackResult = generateRuleBasedRecommendations();
      setPersonalizationResult(fallbackResult);
      onPersonalizationUpdate(fallbackResult);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateRuleBasedRecommendations = (): PersonalizationResult => {
    if (!customerProfile) return { recommendations: [], adaptations: generateDefaultAdaptations(), insights: [] };

    const recommendations = [];
    
    // Time-based recommendations
    const timeRecommendations = getTimeBasedRecommendations();
    recommendations.push(...timeRecommendations);

    // Weather-based recommendations
    const weatherRecommendations = getWeatherBasedRecommendations();
    recommendations.push(...weatherRecommendations);

    // Mood-based recommendations
    const moodRecommendations = getMoodBasedRecommendations();
    recommendations.push(...moodRecommendations);

    // Sort by score and take top 6
    const sortedRecommendations = recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    return {
      recommendations: sortedRecommendations,
      adaptations: generateContextualAdaptations(),
      insights: generateBehavioralInsights()
    };
  };

  const getTimeBasedRecommendations = () => {
    const timeOfDay = customerProfile!.context.timeOfDay;
    const recommendations = [];

    menuItems.forEach(item => {
      let score = 0;
      let reasoning = '';

      switch (timeOfDay) {
        case 'morning':
          if (item.category?.toLowerCase().includes('breakfast') || 
              item.name.toLowerCase().includes('coffee') ||
              item.name.toLowerCase().includes('smoothie')) {
            score = 0.8;
            reasoning = 'Perfect for morning energy';
          }
          break;
        case 'afternoon':
          if (item.category?.toLowerCase().includes('lunch') ||
              item.category?.toLowerCase().includes('salad') ||
              item.name.toLowerCase().includes('sandwich')) {
            score = 0.7;
            reasoning = 'Great afternoon meal';
          }
          break;
        case 'evening':
          if (item.category?.toLowerCase().includes('dinner') ||
              item.category?.toLowerCase().includes('burger') ||
              item.category?.toLowerCase().includes('pasta')) {
            score = 0.8;
            reasoning = 'Satisfying evening choice';
          }
          break;
        case 'night':
          if (item.category?.toLowerCase().includes('snack') ||
              item.name.toLowerCase().includes('light')) {
            score = 0.6;
            reasoning = 'Light late-night option';
          }
          break;
      }

      if (score > 0) {
        recommendations.push({
          id: `time-${item.id}`,
          item,
          score,
          reasoning,
          confidence: 0.75,
          category: 'contextual' as const
        });
      }
    });

    return recommendations;
  };

  const getWeatherBasedRecommendations = () => {
    const weather = customerProfile!.context.weather;
    const recommendations = [];

    menuItems.forEach(item => {
      let score = 0;
      let reasoning = '';

      switch (weather) {
        case 'cold':
          if (item.name.toLowerCase().includes('soup') ||
              item.name.toLowerCase().includes('hot') ||
              item.category?.toLowerCase().includes('warm')) {
            score = 0.7;
            reasoning = 'Warm comfort for cold weather';
          }
          break;
        case 'hot':
          if (item.name.toLowerCase().includes('salad') ||
              item.name.toLowerCase().includes('ice') ||
              item.name.toLowerCase().includes('cold')) {
            score = 0.7;
            reasoning = 'Cool and refreshing for hot weather';
          }
          break;
        case 'rainy':
          if (item.name.toLowerCase().includes('comfort') ||
              item.category?.toLowerCase().includes('hearty')) {
            score = 0.6;
            reasoning = 'Comforting for rainy day';
          }
          break;
      }

      if (score > 0) {
        recommendations.push({
          id: `weather-${item.id}`,
          item,
          score,
          reasoning,
          confidence: 0.65,
          category: 'weather' as const
        });
      }
    });

    return recommendations;
  };

  const getMoodBasedRecommendations = () => {
    const mood = customerProfile!.context.currentMood;
    const recommendations = [];

    menuItems.forEach(item => {
      let score = 0;
      let reasoning = '';

      switch (mood) {
        case 'comfort':
          if (item.name.toLowerCase().includes('burger') ||
              item.name.toLowerCase().includes('mac') ||
              item.name.toLowerCase().includes('pizza')) {
            score = 0.8;
            reasoning = 'Perfect comfort food';
          }
          break;
        case 'healthy':
          if (item.name.toLowerCase().includes('salad') ||
              item.name.toLowerCase().includes('grilled') ||
              item.category?.toLowerCase().includes('healthy')) {
            score = 0.8;
            reasoning = 'Healthy choice for wellness';
          }
          break;
        case 'adventurous':
          if (item.category?.toLowerCase().includes('specialty') ||
              item.name.toLowerCase().includes('fusion')) {
            score = 0.7;
            reasoning = 'Adventure for your taste buds';
          }
          break;
        case 'stressed':
          if (item.name.toLowerCase().includes('chocolate') ||
              item.category?.toLowerCase().includes('dessert')) {
            score = 0.6;
            reasoning = 'Sweet stress relief';
          }
          break;
      }

      if (score > 0) {
        recommendations.push({
          id: `mood-${item.id}`,
          item,
          score,
          reasoning,
          confidence: 0.70,
          category: 'mood' as const
        });
      }
    });

    return recommendations;
  };

  const generateDefaultAdaptations = () => ({
    interfaceTheme: 'adaptive',
    layoutPreference: 'conversational',
    interactionStyle: 'voice-first',
    voicePersonality: 'friendly'
  });

  const generateContextualAdaptations = () => {
    const mood = customerProfile!.context.currentMood;
    const timeOfDay = customerProfile!.context.timeOfDay;
    
    return {
      interfaceTheme: mood === 'comfort' ? 'warm' : mood === 'healthy' ? 'fresh' : 'balanced',
      layoutPreference: timeOfDay === 'morning' ? 'focused' : 'exploratory',
      interactionStyle: 'voice-first',
      voicePersonality: mood === 'stressed' ? 'calm' : mood === 'adventurous' ? 'enthusiastic' : 'friendly'
    };
  };

  const generateBehavioralInsights = () => {
    if (!customerProfile) return [];

    const insights = [];
    
    // Time-based insight
    insights.push({
      type: 'preference' as const,
      title: 'Dining Time Pattern',
      description: `You typically order during ${customerProfile.context.timeOfDay} hours`,
      confidence: 0.8,
      actionable: true
    });

    // Weather-based insight
    insights.push({
      type: 'behavior' as const,
      title: 'Weather Preference',
      description: `Current ${customerProfile.context.weather} weather suggests comfort food preferences`,
      confidence: 0.7,
      actionable: true
    });

    // Mood-based insight
    insights.push({
      type: 'opportunity' as const,
      title: 'Mood Enhancement',
      description: `Your ${customerProfile.context.currentMood} mood aligns with our comfort menu`,
      confidence: 0.75,
      actionable: true
    });

    return insights;
  };

  const updateCustomerPreference = (preference: string, value: any) => {
    if (!customerProfile) return;

    const updatedProfile = {
      ...customerProfile,
      preferences: {
        ...customerProfile.preferences,
        [preference]: value
      }
    };

    setCustomerProfile(updatedProfile);
    onProfileUpdate(updatedProfile);
  };

  const getContextIcon = (context: string) => {
    switch (context) {
      case 'morning': return Sun;
      case 'afternoon': return Sun;
      case 'evening': return Moon;
      case 'night': return Moon;
      case 'sunny': return Sun;
      case 'rainy': return CloudRain;
      case 'cold': return Snowflake;
      default: return Clock;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'behavioral': return 'bg-blue-500';
      case 'contextual': return 'bg-green-500';
      case 'seasonal': return 'bg-orange-500';
      case 'mood': return 'bg-purple-500';
      case 'weather': return 'bg-cyan-500';
      default: return 'bg-gray-500';
    }
  };

  if (!customerProfile) {
    return (
      <Card className={`personalization-engine ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Brain className="h-6 w-6 text-orange-500 animate-pulse" />
            <span>Building your personalized experience...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`personalization-engine ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-orange-500" />
          <span className="playwrite-font">AI Personalization Engine</span>
          {isProcessing && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Context */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm capitalize">{customerProfile.context.timeOfDay}</span>
          </div>
          <div className="flex items-center space-x-2">
            {React.createElement(getContextIcon(customerProfile.context.weather), { className: "h-4 w-4 text-muted-foreground" })}
            <span className="text-sm capitalize">{customerProfile.context.weather}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm capitalize">{customerProfile.context.currentMood}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{customerProfile.context.dayOfWeek}</span>
          </div>
        </div>

        {/* Personalized Recommendations */}
        {personalizationResult && (
          <div className="space-y-4">
            <h3 className="font-semibold playwrite-font">Personalized for You</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalizationResult.recommendations.slice(0, 4).map((rec, index) => (
                <div key={rec.id} className="p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{rec.item.name}</h4>
                      <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getCategoryColor(rec.category)}`} />
                      <Badge variant="outline" className="text-xs">
                        {Math.round(rec.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">${rec.item.price}</span>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < rec.score * 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        {personalizationResult?.insights && personalizationResult.insights.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold playwrite-font">Personal Insights</h3>
            {personalizationResult.insights.map((insight, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {insight.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Learning Toggle */}
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Continuous Learning</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLearningMode(!learningMode)}
            className={learningMode ? 'bg-green-100 text-green-800' : ''}
          >
            {learningMode ? 'Active' : 'Paused'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}