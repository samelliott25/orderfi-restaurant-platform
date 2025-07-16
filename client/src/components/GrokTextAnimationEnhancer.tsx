import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Sparkles, Play, Code, Zap, Palette } from 'lucide-react';

interface AnimationRecommendation {
  name: string;
  description: string;
  css: string;
  javascript?: string;
  performance: string;
  compatibility: string;
}

interface GrokAnalysisResult {
  analysis: string;
  recommendations: AnimationRecommendation[];
  bestPractices: string[];
  implementation: string;
}

interface AdvancedAnimationSystem {
  primaryAnimation: {
    name: string;
    css: string;
    keyframes: string;
  };
  secondaryEffects: Array<{
    name: string;
    css: string;
    purpose: string;
  }>;
  interactiveStates: {
    hover: string;
    focus: string;
    click: string;
  };
  responsiveDesign: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

export default function GrokTextAnimationEnhancer() {
  const [analysis, setAnalysis] = useState<GrokAnalysisResult | null>(null);
  const [advancedSystem, setAdvancedSystem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');
  const [selectedAnimation, setSelectedAnimation] = useState<string>('');

  const orderFiTextContent = `
    <div className="text-7xl sm:text-8xl md:text-9xl font-normal bg-gradient-to-r from-[#F5A623] via-orange-500 to-pink-500 bg-clip-text text-transparent animate-pulse playwrite-font px-4 py-6 gentle-glow hover-float">
      OrderFi
    </div>
  `;

  const currentAnimations = `
    - animate-pulse: Simple opacity animation
    - gentle-glow: Subtle glow effect
    - hover-float: Hover transform animation
    - bg-gradient-to-r: Static gradient background
    - playwrite-font: Custom font family
  `;

  const designContext = `
    Restaurant platform landing page with OrderFi branding. 
    Current theme: Orange to pink gradient with food industry appeal.
    Target audience: Restaurant owners and customers.
    Design goal: Modern, professional, engaging without being overwhelming.
  `;

  const analyzeTextAnimations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/grok/analyze-text-animations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          textContent: orderFiTextContent,
          currentAnimations,
          designContext
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze text animations');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing text animations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAdvancedAnimations = async (animationType: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/grok/generate-advanced-text-animations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          textElement: orderFiTextContent,
          animationType,
          complexity: 'high'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate advanced animations');
      }

      const result = await response.json();
      setAdvancedSystem(result);
      setActiveTab('advanced');
    } catch (error) {
      console.error('Error generating advanced animations:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const testPreviewAnimation = () => {
    const testCSS = `
      @keyframes testBounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0) scale(1);
        }
        40% {
          transform: translateY(-10px) scale(1.05);
        }
        60% {
          transform: translateY(-5px) scale(1.02);
        }
      }
      
      animation: testBounce 2s ease-in-out infinite;
      transform-origin: center;
    `;
    applyAnimationPreview(testCSS);
  };

  const applyAnimationPreview = (css: string) => {
    // Remove any existing preview styles
    const existingStyle = document.getElementById('grok-preview-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Create new style element with unique ID
    const style = document.createElement('style');
    style.id = 'grok-preview-styles';
    
    // Extract keyframes if they exist and apply them properly
    const keyframesMatch = css.match(/@keyframes\s+(\w+)\s*\{[^}]*\}/g);
    let keyframesCSS = '';
    let animationCSS = css;
    
    if (keyframesMatch) {
      keyframesCSS = keyframesMatch.join('\n');
      // Remove keyframes from animation CSS
      animationCSS = css.replace(/@keyframes\s+(\w+)\s*\{[^}]*\}/g, '');
    }
    
    style.textContent = `
      /* Grok Animation Preview Keyframes */
      ${keyframesCSS}
      
      /* Apply to our demo text */
      .orderfi-demo-text.orderfi-preview {
        ${animationCSS}
      }
    `;
    document.head.appendChild(style);
    
    // Apply preview class to our demo text
    const demoText = document.querySelector('.orderfi-demo-text');
    if (demoText) {
      demoText.classList.add('orderfi-preview');
    }
    
    // Remove after 5 seconds
    setTimeout(() => {
      const previewStyle = document.getElementById('grok-preview-styles');
      if (previewStyle) {
        previewStyle.remove();
      }
      if (demoText) {
        demoText.classList.remove('orderfi-preview');
      }
    }, 5000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Grok Text Animation Enhancer
            <Badge variant="secondary">AI-Powered</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-8 border rounded-lg bg-gradient-to-r from-orange-50 to-pink-50">
            <div className="orderfi-demo-text text-4xl md:text-6xl font-normal bg-gradient-to-r from-[#F5A623] via-orange-500 to-pink-500 bg-clip-text text-transparent animate-pulse playwrite-font transition-all duration-300">
              OrderFi
            </div>
            <p className="text-sm text-muted-foreground mt-2">Current Implementation (Preview animations here)</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              onClick={analyzeTextAnimations}
              disabled={loading}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Analyze Current Animations
            </Button>
            <Button
              onClick={() => generateAdvancedAnimations('morphing')}
              disabled={loading}
              variant="outline"
              className="gap-2"
            >
              <Zap className="h-4 w-4" />
              Generate Morphing Effects
            </Button>
            <Button
              onClick={() => generateAdvancedAnimations('particle')}
              disabled={loading}
              variant="outline"
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Generate Particle System
            </Button>
            <Button
              onClick={() => testPreviewAnimation()}
              disabled={loading}
              variant="outline"
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Test Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">Analysis & Recommendations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced System</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Analyzing with Grok AI...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{analysis.analysis}</p>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Animation Recommendations</h3>
                {analysis.recommendations.map((rec, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>{rec.name}</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => applyAnimationPreview(rec.css)}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(rec.css)}
                          >
                            <Code className="h-3 w-3 mr-1" />
                            Copy CSS
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm">{rec.description}</p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">CSS Implementation:</h4>
                        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                          <code>{rec.css}</code>
                        </pre>
                      </div>

                      {rec.javascript && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">JavaScript:</h4>
                          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                            <code>{rec.javascript}</code>
                          </pre>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <h4 className="font-semibold text-sm">Performance:</h4>
                          <p className="text-muted-foreground">{rec.performance}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">Compatibility:</h4>
                          <p className="text-muted-foreground">{rec.compatibility}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.bestPractices.map((practice, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-0.5">•</span>
                        {practice}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Palette className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Click "Analyze Current Animations" to get AI-powered enhancement suggestions</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          {advancedSystem ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Animation System</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Primary Animation</h3>
                      <p className="text-sm text-muted-foreground mb-2">{advancedSystem.animationSystem?.primaryAnimation?.name}</p>
                      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                        <code>{advancedSystem.animationSystem?.primaryAnimation?.css}</code>
                      </pre>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Interactive States</h3>
                      <div className="space-y-2">
                        {Object.entries(advancedSystem.animationSystem?.interactiveStates || {}).map(([state, css]) => (
                          <div key={state}>
                            <h4 className="text-sm font-medium capitalize">{state}:</h4>
                            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
                              <code>{css}</code>
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Complete Implementation</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-xs overflow-x-auto">
                    <code>{advancedSystem.implementation?.css}</code>
                  </pre>
                  <Button
                    className="mt-4"
                    onClick={() => copyToClipboard(advancedSystem.implementation?.css || '')}
                  >
                    Copy Complete Implementation
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Generate advanced animations using the buttons above</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="implementation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Step 1: Add to CSS</h3>
                  <p className="text-sm text-muted-foreground">
                    Copy the generated CSS animations and add them to your <code>client/src/index.css</code> file.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Step 2: Update Component</h3>
                  <p className="text-sm text-muted-foreground">
                    Replace the className in your <code>landing-page.tsx</code> with the new animation classes.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Step 3: Test Performance</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor animation performance and ensure smooth rendering across different devices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}