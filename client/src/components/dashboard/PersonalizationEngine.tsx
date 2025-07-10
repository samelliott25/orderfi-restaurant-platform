import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Target,
  Lightbulb,
  Settings
} from "lucide-react";

interface PersonalizationProps {
  userRole: 'manager' | 'owner' | 'staff';
  currentTime: Date;
  metrics: any;
}

interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
}

export function PersonalizationEngine({ userRole, currentTime, metrics }: PersonalizationProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate AI-powered insights based on role and time
  const generateInsights = () => {
    setIsGenerating(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const currentHour = currentTime.getHours();
      const roleBasedInsights: Insight[] = [];

      // Manager-specific insights
      if (userRole === 'manager') {
        if (currentHour >= 11 && currentHour <= 14) {
          roleBasedInsights.push({
            id: 'LUNCH_RUSH',
            type: 'recommendation',
            title: 'Lunch Rush Optimization',
            description: 'Kitchen prep time is 18% above average. Consider adding a prep cook for next 2 hours.',
            confidence: 87,
            actionable: true,
            priority: 'high'
          });
        }

        if (metrics.avgOrder.change < 0) {
          roleBasedInsights.push({
            id: 'AOV_DOWN',
            type: 'opportunity',
            title: 'Average Order Value Declining',
            description: 'Promote appetizer combos or suggest wine pairings to increase AOV by 15%.',
            confidence: 73,
            actionable: true,
            priority: 'medium'
          });
        }
      }

      // Owner-specific insights
      if (userRole === 'owner') {
        roleBasedInsights.push({
          id: 'REVENUE_FORECAST',
          type: 'recommendation',
          title: 'Weekly Revenue Projection',
          description: 'Based on current trends, weekly revenue will exceed target by 12%. Consider inventory adjustments.',
          confidence: 91,
          actionable: true,
          priority: 'medium'
        });

        if (currentHour >= 18 && currentHour <= 21) {
          roleBasedInsights.push({
            id: 'DINNER_STAFFING',
            type: 'warning',
            title: 'Dinner Service Staffing',
            description: 'Current staffing may be insufficient for projected dinner rush. 23% table turn delay risk.',
            confidence: 76,
            actionable: true,
            priority: 'high'
          });
        }
      }

      // Universal insights
      roleBasedInsights.push({
        id: 'CUSTOMER_SENTIMENT',
        type: 'opportunity',
        title: 'Customer Satisfaction Trending Up',
        description: 'Recent feedback shows 94% satisfaction. Perfect time to launch loyalty program referrals.',
        confidence: 82,
        actionable: true,
        priority: 'low'
      });

      setInsights(roleBasedInsights);
      setIsGenerating(false);
    }, 1500);
  };

  // Auto-generate insights on component mount
  useEffect(() => {
    generateInsights();
  }, [userRole, currentTime.getHours()]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'recommendation': return <Lightbulb className="w-4 h-4 text-blue-500" />;
      default: return <Brain className="w-4 h-4 text-purple-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300';
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300';
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground playwrite-font font-normal flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          AI Insights
          <Badge variant="outline" className="bg-purple-500/20 text-purple-400 ml-2">
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Role-based personalization indicator */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Users className="w-4 h-4" />
            <span>Personalized for {userRole} at {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>

          {isGenerating ? (
            <div className="flex items-center gap-2 p-4 bg-secondary rounded-lg">
              <Brain className="w-4 h-4 text-purple-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">Analyzing patterns and generating insights...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.map((insight) => (
                <div 
                  key={insight.id}
                  className={`p-3 rounded-lg border ${getPriorityColor(insight.priority)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <span className="text-sm font-medium">{insight.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% confidence
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {insight.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {insight.description}
                  </p>
                  
                  {insight.actionable && (
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      Take Action
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Refresh button */}
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generateInsights}
              disabled={isGenerating}
              className="text-xs"
            >
              <Brain className="w-3 h-3 mr-2" />
              Refresh Insights
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}