import { useState, useEffect } from 'react';
import { useLayoutOptimization, type LayoutSuggestion } from '@/hooks/useLayoutOptimization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Lightbulb, 
  Monitor, 
  Zap, 
  CheckCircle, 
  Settings,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Sidebar,
  Split,
  Eye,
  TrendingUp,
  Loader2
} from 'lucide-react';

interface LayoutOptimizationProps {
  currentPage: string;
  onApplySuggestion?: (suggestion: LayoutSuggestion) => void;
}

export function LayoutOptimization({ currentPage, onApplySuggestion }: LayoutOptimizationProps) {
  const { screenMetrics, suggestions, isAnalyzing, analyzeLayoutOptimization } = useLayoutOptimization();
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);

  // Mock user interactions for analysis
  const userInteractions = [
    { type: 'click', target: 'kpi-card', timestamp: Date.now() - 30000 },
    { type: 'scroll', target: 'chart-area', timestamp: Date.now() - 20000 },
    { type: 'hover', target: 'sidebar-item', timestamp: Date.now() - 10000 }
  ];

  // Auto-analyze layout when component mounts or page changes
  useEffect(() => {
    if (screenMetrics) {
      analyzeLayoutOptimization(currentPage, 'dashboard', userInteractions);
    }
  }, [currentPage, screenMetrics, analyzeLayoutOptimization]);

  const handleApplySuggestion = (suggestion: LayoutSuggestion) => {
    setAppliedSuggestions(prev => new Set(prev).add(suggestion.id));
    onApplySuggestion?.(suggestion);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'grid': return <LayoutGrid className="w-4 h-4" />;
      case 'sidebar': return <Sidebar className="w-4 h-4" />;
      case 'split': return <Split className="w-4 h-4" />;
      case 'minimize': return <Minimize2 className="w-4 h-4" />;
      case 'focus': return <Eye className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="fixed top-4 right-20 z-50 bg-white/80 backdrop-blur-sm border-orange-200 hover:bg-orange-50"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Layout AI
          {suggestions.length > 0 && (
            <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
              {suggestions.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Layout Optimization AI
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Screen Metrics */}
          {screenMetrics && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Screen Analysis</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Resolution:</span>
                    <div className="font-mono">{screenMetrics.width}×{screenMetrics.height}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Available:</span>
                    <div className="font-mono">{screenMetrics.availableWidth}×{screenMetrics.availableHeight}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Density:</span>
                    <Badge variant="outline" className="ml-2">
                      {screenMetrics.density}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Aspect Ratio:</span>
                    <div className="font-mono">{screenMetrics.aspectRatio.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Status */}
          {isAnalyzing && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing layout optimization...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Layout Suggestions */}
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getSuggestionIcon(suggestion.type)}
                        <CardTitle className="text-base">{suggestion.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs">
                          <div className={`w-2 h-2 rounded-full ${getConfidenceColor(suggestion.confidence)}`} />
                          {Math.round(suggestion.confidence * 100)}%
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      {suggestion.description}
                    </p>
                    
                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-1">Why this helps:</h4>
                      <p className="text-xs text-muted-foreground">
                        {suggestion.reasoning}
                      </p>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Benefits:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {suggestion.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApplySuggestion(suggestion)}
                        disabled={appliedSuggestions.has(suggestion.id)}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        {appliedSuggestions.has(suggestion.id) ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Applied
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Apply
                          </>
                        )}
                      </Button>
                      
                      <Progress 
                        value={suggestion.confidence * 100} 
                        className="flex-1 h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {/* Empty State */}
          {!isAnalyzing && suggestions.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Layout Optimized</h3>
                <p className="text-sm text-muted-foreground">
                  Your current layout is well-optimized for this screen size and usage pattern.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}