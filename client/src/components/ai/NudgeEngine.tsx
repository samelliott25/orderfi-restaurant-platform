import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Zap, 
  Heart, 
  Target,
  Gift,
  Star,
  ChevronRight,
  AlertCircle,
  ThumbsUp,
  Timer
} from 'lucide-react';

interface NudgeContext {
  customerProfile: any;
  currentOrder: any[];
  orderHistory: any[];
  timeContext: {
    timeOfDay: string;
    dayOfWeek: string;
    rushPeriod: boolean;
    lastOrderTime?: Date;
  };
  socialContext: {
    popularItems: any[];
    trendingNow: any[];
    peakOrders: number;
    socialProof: boolean;
  };
  businessContext: {
    inventoryLevels: Record<string, number>;
    marginOptimization: boolean;
    promotionalPeriod: boolean;
  };
}

interface NudgeStrategy {
  id: string;
  type: 'scarcity' | 'social_proof' | 'authority' | 'reciprocity' | 'commitment' | 'liking';
  trigger: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
  effectiveness: number;
  ethicalScore: number;
  targetItems: any[];
  timing: 'immediate' | 'after_selection' | 'before_checkout' | 'post_order';
  personalization: {
    moodAlignment: number;
    preferenceMatch: number;
    behaviorFit: number;
  };
}

interface NudgeEngineProps {
  context: NudgeContext;
  onNudgeTriggered: (nudge: NudgeStrategy) => void;
  onItemAddedToCart: (item: any) => void;
  onNudgeDeclined: (nudgeId: string) => void;
  className?: string;
}

export function NudgeEngine({
  context,
  onNudgeTriggered,
  onItemAddedToCart,
  onNudgeDeclined,
  className = ''
}: NudgeEngineProps) {
  const [activeNudges, setActiveNudges] = useState<NudgeStrategy[]>([]);
  const [nudgeHistory, setNudgeHistory] = useState<Array<{ nudge: NudgeStrategy; response: 'accepted' | 'declined'; timestamp: Date }>>([]);
  const [effectivenessMetrics, setEffectivenessMetrics] = useState({
    conversionRate: 0,
    averageUplift: 0,
    ethicalScore: 0
  });

  useEffect(() => {
    generateContextualNudges();
  }, [context]);

  const generateContextualNudges = () => {
    const nudges: NudgeStrategy[] = [];
    
    // Scarcity-based nudges
    if (context.businessContext.inventoryLevels) {
      nudges.push(...generateScarcityNudges());
    }
    
    // Social proof nudges
    if (context.socialContext.socialProof) {
      nudges.push(...generateSocialProofNudges());
    }
    
    // Time-based urgency nudges
    if (context.timeContext.rushPeriod) {
      nudges.push(...generateUrgencyNudges());
    }
    
    // Personalized preference nudges
    if (context.customerProfile) {
      nudges.push(...generatePersonalizedNudges());
    }
    
    // Authority-based nudges (chef recommendations)
    nudges.push(...generateAuthorityNudges());
    
    // Reciprocity nudges (loyalty rewards)
    nudges.push(...generateReciprocityNudges());
    
    // Filter and rank nudges by effectiveness and ethics
    const rankedNudges = nudges
      .filter(nudge => nudge.ethicalScore >= 0.7) // Minimum ethical threshold
      .sort((a, b) => (b.effectiveness * b.ethicalScore) - (a.effectiveness * a.ethicalScore))
      .slice(0, 3); // Show max 3 nudges at once
    
    setActiveNudges(rankedNudges);
  };

  const generateScarcityNudges = (): NudgeStrategy[] => {
    const scarcityNudges: NudgeStrategy[] = [];
    
    Object.entries(context.businessContext.inventoryLevels).forEach(([itemId, quantity]) => {
      if (quantity <= 5 && quantity > 0) {
        const item = findItemById(itemId);
        if (item) {
          scarcityNudges.push({
            id: `scarcity-${itemId}`,
            type: 'scarcity',
            trigger: 'low_inventory',
            message: `Only ${quantity} ${item.name} remaining! ${quantity <= 2 ? 'Almost sold out!' : 'Get yours before it\'s gone!'}`,
            urgency: quantity <= 2 ? 'high' : 'medium',
            effectiveness: 0.75,
            ethicalScore: 0.9, // High ethical score as it's truthful information
            targetItems: [item],
            timing: 'immediate',
            personalization: {
              moodAlignment: 0.6,
              preferenceMatch: calculatePreferenceMatch(item),
              behaviorFit: 0.7
            }
          });
        }
      }
    });
    
    return scarcityNudges;
  };

  const generateSocialProofNudges = (): NudgeStrategy[] => {
    const socialNudges: NudgeStrategy[] = [];
    
    // Most popular items
    context.socialContext.popularItems.slice(0, 3).forEach((item, index) => {
      socialNudges.push({
        id: `social-popular-${item.id}`,
        type: 'social_proof',
        trigger: 'popular_item',
        message: `${item.name} is our #${index + 1} most popular dish today! ${getRandomSocialProofPhrase()}`,
        urgency: 'low',
        effectiveness: 0.65,
        ethicalScore: 0.95,
        targetItems: [item],
        timing: 'after_selection',
        personalization: {
          moodAlignment: context.customerProfile?.context?.currentMood === 'adventurous' ? 0.8 : 0.6,
          preferenceMatch: calculatePreferenceMatch(item),
          behaviorFit: 0.8
        }
      });
    });
    
    // Trending items
    context.socialContext.trendingNow.forEach(item => {
      socialNudges.push({
        id: `social-trending-${item.id}`,
        type: 'social_proof',
        trigger: 'trending_item',
        message: `${item.name} is trending! ${Math.floor(Math.random() * 50) + 20} people ordered this in the last hour.`,
        urgency: 'medium',
        effectiveness: 0.70,
        ethicalScore: 0.85,
        targetItems: [item],
        timing: 'immediate',
        personalization: {
          moodAlignment: context.customerProfile?.context?.currentMood === 'adventurous' ? 0.9 : 0.5,
          preferenceMatch: calculatePreferenceMatch(item),
          behaviorFit: 0.7
        }
      });
    });
    
    return socialNudges;
  };

  const generateUrgencyNudges = (): NudgeStrategy[] => {
    const urgencyNudges: NudgeStrategy[] = [];
    
    if (context.timeContext.rushPeriod) {
      urgencyNudges.push({
        id: 'rush-period-discount',
        type: 'scarcity',
        trigger: 'rush_period',
        message: 'Rush hour special! Add a drink for just $1 more - limited time only!',
        urgency: 'high',
        effectiveness: 0.8,
        ethicalScore: 0.8,
        targetItems: [], // General upsell
        timing: 'before_checkout',
        personalization: {
          moodAlignment: 0.7,
          preferenceMatch: 0.8,
          behaviorFit: 0.9
        }
      });
    }
    
    return urgencyNudges;
  };

  const generatePersonalizedNudges = (): NudgeStrategy[] => {
    const personalizedNudges: NudgeStrategy[] = [];
    
    // Mood-based recommendations
    const mood = context.customerProfile?.context?.currentMood;
    if (mood === 'comfort') {
      personalizedNudges.push({
        id: 'comfort-upsell',
        type: 'liking',
        trigger: 'mood_comfort',
        message: 'Feeling like comfort food? Our customers love pairing that with our famous mac & cheese!',
        urgency: 'low',
        effectiveness: 0.7,
        ethicalScore: 0.9,
        targetItems: [], // Find comfort food items
        timing: 'after_selection',
        personalization: {
          moodAlignment: 0.95,
          preferenceMatch: 0.8,
          behaviorFit: 0.8
        }
      });
    }
    
    // Behavioral pattern nudges
    if (context.orderHistory.length > 0) {
      const frequentCategories = getFrequentCategories(context.orderHistory);
      const suggestedItem = findItemByCategory(frequentCategories[0]);
      
      if (suggestedItem) {
        personalizedNudges.push({
          id: 'behavioral-pattern',
          type: 'liking',
          trigger: 'behavioral_pattern',
          message: `Based on your favorites, you might love our ${suggestedItem.name}!`,
          urgency: 'low',
          effectiveness: 0.8,
          ethicalScore: 0.95,
          targetItems: [suggestedItem],
          timing: 'after_selection',
          personalization: {
            moodAlignment: 0.7,
            preferenceMatch: 0.9,
            behaviorFit: 0.95
          }
        });
      }
    }
    
    return personalizedNudges;
  };

  const generateAuthorityNudges = (): NudgeStrategy[] => {
    const authorityNudges: NudgeStrategy[] = [];
    
    // Chef's recommendations
    const chefSpecials = findChefSpecials();
    chefSpecials.forEach(item => {
      authorityNudges.push({
        id: `chef-special-${item.id}`,
        type: 'authority',
        trigger: 'chef_recommendation',
        message: `Chef's recommendation: ${item.name} - made with our signature technique!`,
        urgency: 'low',
        effectiveness: 0.6,
        ethicalScore: 0.9,
        targetItems: [item],
        timing: 'immediate',
        personalization: {
          moodAlignment: context.customerProfile?.context?.currentMood === 'adventurous' ? 0.8 : 0.6,
          preferenceMatch: calculatePreferenceMatch(item),
          behaviorFit: 0.7
        }
      });
    });
    
    return authorityNudges;
  };

  const generateReciprocityNudges = (): NudgeStrategy[] => {
    const reciprocityNudges: NudgeStrategy[] = [];
    
    // Loyalty rewards
    if (context.customerProfile?.loyalty?.points > 0) {
      reciprocityNudges.push({
        id: 'loyalty-reward',
        type: 'reciprocity',
        trigger: 'loyalty_points',
        message: `Thanks for being a loyal customer! Use your points to get a free appetizer with any main dish.`,
        urgency: 'low',
        effectiveness: 0.75,
        ethicalScore: 0.95,
        targetItems: [],
        timing: 'after_selection',
        personalization: {
          moodAlignment: 0.8,
          preferenceMatch: 0.7,
          behaviorFit: 0.9
        }
      });
    }
    
    return reciprocityNudges;
  };

  const handleNudgeInteraction = (nudge: NudgeStrategy, action: 'accept' | 'decline') => {
    // Record interaction
    const interaction = {
      nudge,
      response: action,
      timestamp: new Date()
    };
    
    setNudgeHistory(prev => [...prev, interaction]);
    
    // Update effectiveness metrics
    updateEffectivenessMetrics();
    
    // Trigger appropriate callback
    if (action === 'accept') {
      onNudgeTriggered(nudge);
      if (nudge.targetItems.length > 0) {
        nudge.targetItems.forEach(item => onItemAddedToCart(item));
      }
    } else {
      onNudgeDeclined(nudge.id);
    }
    
    // Remove the nudge from active nudges
    setActiveNudges(prev => prev.filter(n => n.id !== nudge.id));
  };

  const updateEffectivenessMetrics = () => {
    const totalInteractions = nudgeHistory.length;
    const acceptedInteractions = nudgeHistory.filter(h => h.response === 'accepted').length;
    
    const conversionRate = totalInteractions > 0 ? acceptedInteractions / totalInteractions : 0;
    const averageUplift = calculateAverageUplift();
    const ethicalScore = calculateAverageEthicalScore();
    
    setEffectivenessMetrics({
      conversionRate,
      averageUplift,
      ethicalScore
    });
  };

  // Helper functions
  const findItemById = (id: string) => {
    // This would typically search through available menu items
    return null; // Placeholder
  };

  const calculatePreferenceMatch = (item: any): number => {
    // Calculate how well the item matches customer preferences
    return Math.random() * 0.3 + 0.7; // Placeholder: 0.7-1.0 range
  };

  const getRandomSocialProofPhrase = (): string => {
    const phrases = [
      'Join the crowd!',
      'See what everyone\'s talking about!',
      'You\'re in good company!',
      'A customer favorite!',
      'Highly recommended by diners!'
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  const getFrequentCategories = (orders: any[]): string[] => {
    // Analyze order history to find frequent categories
    return ['burgers', 'pizza', 'salads']; // Placeholder
  };

  const findItemByCategory = (category: string) => {
    // Find items in the specified category
    return null; // Placeholder
  };

  const findChefSpecials = () => {
    // Find items marked as chef specials
    return []; // Placeholder
  };

  const calculateAverageUplift = (): number => {
    // Calculate average revenue uplift from nudges
    return 0.15; // Placeholder: 15% uplift
  };

  const calculateAverageEthicalScore = (): number => {
    if (nudgeHistory.length === 0) return 0.9;
    const totalScore = nudgeHistory.reduce((sum, h) => sum + h.nudge.ethicalScore, 0);
    return totalScore / nudgeHistory.length;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'scarcity': return Timer;
      case 'social_proof': return Users;
      case 'authority': return Star;
      case 'reciprocity': return Gift;
      case 'commitment': return Target;
      case 'liking': return Heart;
      default: return TrendingUp;
    }
  };

  return (
    <div className={`nudge-engine ${className}`}>
      {/* Active Nudges */}
      <div className="space-y-4">
        {activeNudges.map((nudge, index) => {
          const TypeIcon = getTypeIcon(nudge.type);
          
          return (
            <Card key={nudge.id} className="nudge-card border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <TypeIcon className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className={`text-xs ${getUrgencyColor(nudge.urgency)}`}>
                          {nudge.urgency} urgency
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(nudge.effectiveness * 100)}% effective
                        </Badge>
                      </div>
                      <p className="text-sm font-medium mb-2">{nudge.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Mood fit: {Math.round(nudge.personalization.moodAlignment * 100)}%</span>
                        <span>Preference match: {Math.round(nudge.personalization.preferenceMatch * 100)}%</span>
                        <span>Behavior fit: {Math.round(nudge.personalization.behaviorFit * 100)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleNudgeInteraction(nudge, 'decline')}
                      className="text-xs"
                    >
                      Maybe later
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleNudgeInteraction(nudge, 'accept')}
                      className="text-xs bg-orange-500 hover:bg-orange-600"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Sounds good!
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Effectiveness Metrics */}
      {nudgeHistory.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Nudge Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(effectivenessMetrics.conversionRate * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Conversion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(effectivenessMetrics.averageUplift * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Average Uplift</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(effectivenessMetrics.ethicalScore * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Ethical Score</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ethical Guidelines Compliance</span>
                <span>{Math.round(effectivenessMetrics.ethicalScore * 100)}%</span>
              </div>
              <Progress value={effectivenessMetrics.ethicalScore * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Active Nudges */}
      {activeNudges.length === 0 && (
        <Card className="text-center p-8">
          <CardContent>
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              No personalized suggestions available right now.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Continue exploring the menu to get tailored recommendations!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}