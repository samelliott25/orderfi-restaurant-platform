import { useState, useEffect, useCallback } from 'react';
import { useChatContext } from '@/contexts/ChatContext';

export interface LayoutSuggestion {
  id: string;
  type: 'grid' | 'sidebar' | 'split' | 'minimize' | 'focus';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  benefits: string[];
  implementation: {
    gridCols?: string;
    chartHeight?: string;
    sidebarWidth?: number;
    compactMode?: boolean;
  };
}

export interface ScreenMetrics {
  width: number;
  height: number;
  aspectRatio: number;
  availableWidth: number;
  availableHeight: number;
  density: 'low' | 'medium' | 'high';
}

export interface UsagePattern {
  primaryAction: string;
  timeSpent: number;
  interactionFrequency: number;
  preferredLayout: string;
  contextualNeeds: string[];
}

export function useLayoutOptimization() {
  const { isSidebarMode, isOpen } = useChatContext();
  const [screenMetrics, setScreenMetrics] = useState<ScreenMetrics | null>(null);
  const [usagePatterns, setUsagePatterns] = useState<UsagePattern[]>([]);
  const [suggestions, setSuggestions] = useState<LayoutSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Track screen metrics
  useEffect(() => {
    const updateMetrics = () => {
      const chatWidth = isSidebarMode && isOpen ? 340 : 0;
      const sidebarWidth = 256; // Standard sidebar width
      
      setScreenMetrics({
        width: window.innerWidth,
        height: window.innerHeight,
        aspectRatio: window.innerWidth / window.innerHeight,
        availableWidth: window.innerWidth - sidebarWidth - chatWidth,
        availableHeight: window.innerHeight - 100, // Account for header
        density: window.innerWidth > 1400 ? 'high' : window.innerWidth > 1000 ? 'medium' : 'low'
      });
    };

    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    return () => window.removeEventListener('resize', updateMetrics);
  }, [isSidebarMode, isOpen]);

  // Analyze layout patterns with AI
  const analyzeLayoutOptimization = useCallback(async (
    currentPage: string,
    contentType: string,
    userInteractions: any[]
  ) => {
    if (!screenMetrics) return;

    setIsAnalyzing(true);
    
    try {
      const analysisPrompt = `
        Analyze this restaurant dashboard layout scenario and provide optimization suggestions:

        Screen Metrics:
        - Resolution: ${screenMetrics.width}x${screenMetrics.height}
        - Available space: ${screenMetrics.availableWidth}x${screenMetrics.availableHeight}
        - Density: ${screenMetrics.density}
        - Aspect ratio: ${screenMetrics.aspectRatio.toFixed(2)}

        Current Context:
        - Page: ${currentPage}
        - Content type: ${contentType}
        - Chat sidebar: ${isSidebarMode && isOpen ? 'open' : 'closed'}
        - Recent interactions: ${userInteractions.slice(-5).map(i => i.type).join(', ')}

        Provide 3-5 specific layout optimization suggestions in JSON format:
        {
          "suggestions": [
            {
              "id": "unique-id",
              "type": "grid|sidebar|split|minimize|focus",
              "title": "Short suggestion title",
              "description": "Brief description of the suggestion",
              "confidence": 0.85,
              "reasoning": "Why this optimization makes sense",
              "benefits": ["Benefit 1", "Benefit 2"],
              "implementation": {
                "gridCols": "grid-cols-2",
                "chartHeight": "h-80",
                "sidebarWidth": 300,
                "compactMode": true
              }
            }
          ]
        }

        Focus on:
        - Screen real estate optimization
        - Workflow efficiency
        - Information hierarchy
        - User experience improvements
        - Performance considerations
      `;

      const response = await fetch('/api/ai/layout-optimization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: analysisPrompt,
          screenMetrics,
          context: {
            page: currentPage,
            contentType,
            chatSidebarOpen: isSidebarMode && isOpen
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze layout');
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Layout optimization analysis failed:', error);
      // Provide fallback suggestions based on screen metrics
      setSuggestions(generateFallbackSuggestions());
    } finally {
      setIsAnalyzing(false);
    }
  }, [screenMetrics, isSidebarMode, isOpen]);

  // Generate fallback suggestions based on metrics
  const generateFallbackSuggestions = useCallback((): LayoutSuggestion[] => {
    if (!screenMetrics) return [];

    const suggestions: LayoutSuggestion[] = [];

    // Small screen optimizations
    if (screenMetrics.density === 'low') {
      suggestions.push({
        id: 'compact-mobile',
        type: 'minimize',
        title: 'Compact Mobile Layout',
        description: 'Optimize for smaller screens with vertical stacking',
        confidence: 0.9,
        reasoning: 'Limited screen space detected',
        benefits: ['Better mobile experience', 'Reduced scrolling', 'Cleaner interface'],
        implementation: {
          gridCols: 'grid-cols-1',
          chartHeight: 'h-64',
          compactMode: true
        }
      });
    }

    // Wide screen optimizations
    if (screenMetrics.density === 'high') {
      suggestions.push({
        id: 'wide-screen-grid',
        type: 'grid',
        title: 'Maximize Wide Screen',
        description: 'Use full width with 4-column grid layout',
        confidence: 0.85,
        reasoning: 'Ample screen real estate available',
        benefits: ['More data visible', 'Better overview', 'Reduced navigation'],
        implementation: {
          gridCols: 'grid-cols-4',
          chartHeight: 'h-96',
          compactMode: false
        }
      });
    }

    // Chat sidebar optimizations
    if (isSidebarMode && isOpen) {
      suggestions.push({
        id: 'chat-sidebar-adapt',
        type: 'sidebar',
        title: 'Chat Sidebar Adaptation',
        description: 'Optimize layout for chat sidebar usage',
        confidence: 0.8,
        reasoning: 'Chat sidebar is currently active',
        benefits: ['Better space utilization', 'Maintained readability', 'Efficient workflow'],
        implementation: {
          gridCols: 'grid-cols-2',
          chartHeight: 'h-80',
          sidebarWidth: 340
        }
      });
    }

    return suggestions;
  }, [screenMetrics, isSidebarMode, isOpen]);

  return {
    screenMetrics,
    suggestions,
    isAnalyzing,
    analyzeLayoutOptimization,
    generateFallbackSuggestions
  };
}