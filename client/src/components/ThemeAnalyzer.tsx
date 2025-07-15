import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Palette, Wand2, CheckCircle, AlertTriangle } from 'lucide-react';

interface ThemeAnalysisResult {
  success: boolean;
  analysis: string;
  timestamp: string;
  error?: string;
}

const ThemeAnalyzer: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ThemeAnalysisResult | null>(null);
  const [themeApplied, setThemeApplied] = useState(false);

  const analyzeColorPalette = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const response = await fetch('/api/grok/analyze-palette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageDescription: "Kleurvörm sophisticated gradient color palette featuring: Primary band with Deep navy/black → Royal blue → Purple/magenta → Light purple → Pale mint → Coral orange. Secondary band with Light lavender → Purple gradient → Bright red/coral → Dark navy → Orange gradient. Distribution: 40% primary, 40% secondary, 10% accent, 10% neutral. Professional color system by @BramVanhaeren.",
          currentThemeIssues: "Previous brown theme completely removed. Need sophisticated color system using purple-blue gradients as primary, coral/orange as accents. User wants professional design consideration with proper accessibility and modern restaurant management feel."
        })
      });

      const result = await response.json();
      setAnalysisResult(result);
      
      if (result.success) {
        // Parse the analysis and apply the theme
        await applyThemeFromAnalysis(result.analysis);
      }
    } catch (error) {
      console.error('Theme analysis error:', error);
      setAnalysisResult({
        success: false,
        analysis: '',
        timestamp: new Date().toISOString(),
        error: error.message
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyThemeFromAnalysis = async (analysis: string) => {
    try {
      // Extract CSS variables from the analysis
      const cssVariables = extractCSSVariables(analysis);
      
      // Apply the new theme to the CSS
      await updateThemeCSS(cssVariables);
      
      setThemeApplied(true);
    } catch (error) {
      console.error('Theme application error:', error);
    }
  };

  const extractCSSVariables = (analysis: string) => {
    // This function would parse the Grok analysis and extract CSS variables
    // For now, return a sophisticated Kleurvörm-inspired theme
    return {
      light: {
        '--background': '0 0% 100%',
        '--foreground': '240 10% 3.9%',
        '--primary': '262 83% 58%', // Purple from palette
        '--primary-foreground': '0 0% 98%',
        '--secondary': '210 40% 98%',
        '--secondary-foreground': '222.2 84% 4.9%',
        '--accent': '14 100% 57%', // Coral orange from palette
        '--accent-foreground': '0 0% 98%',
        '--destructive': '0 84% 60%',
        '--destructive-foreground': '0 0% 98%',
        '--muted': '220 14.3% 95.9%',
        '--muted-foreground': '220 8.9% 46.1%',
        '--card': '0 0% 100%',
        '--card-foreground': '240 10% 3.9%',
        '--popover': '0 0% 100%',
        '--popover-foreground': '240 10% 3.9%',
        '--border': '220 13% 91%',
        '--input': '220 13% 91%',
        '--ring': '262 83% 58%',
        '--radius': '0.5rem'
      },
      dark: {
        '--background': '240 10% 3.9%',
        '--foreground': '0 0% 98%',
        '--primary': '262 83% 58%', // Purple from palette
        '--primary-foreground': '0 0% 98%',
        '--secondary': '217 32.6% 17.5%',
        '--secondary-foreground': '0 0% 98%',
        '--accent': '14 100% 57%', // Coral orange from palette
        '--accent-foreground': '0 0% 98%',
        '--destructive': '0 62.8% 30.6%',
        '--destructive-foreground': '0 0% 98%',
        '--muted': '217 32.6% 17.5%',
        '--muted-foreground': '215 20.2% 65.1%',
        '--card': '217 32.6% 17.5%',
        '--card-foreground': '0 0% 98%',
        '--popover': '240 10% 3.9%',
        '--popover-foreground': '0 0% 98%',
        '--border': '217 32.6% 17.5%',
        '--input': '217 32.6% 17.5%',
        '--ring': '262 83% 58%',
        '--radius': '0.5rem'
      }
    };
  };

  const updateThemeCSS = async (cssVariables: any) => {
    // Create new CSS content with Kleurvörm theme
    const newCSS = `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer base {
  :root {
    ${Object.entries(cssVariables.light).map(([key, value]) => `${key}: ${value};`).join('\n    ')}
  }
 
  .dark {
    ${Object.entries(cssVariables.dark).map(([key, value]) => `${key}: ${value};`).join('\n    ')}
  }
}

/* Kleurvörm Gradient System */
.kleurvorm-primary {
  background: linear-gradient(135deg, 
    hsl(240, 100%, 15%), 
    hsl(248, 100%, 50%), 
    hsl(310, 100%, 60%), 
    hsl(320, 100%, 70%)
  );
}

.kleurvorm-secondary {
  background: linear-gradient(135deg, 
    hsl(280, 100%, 85%), 
    hsl(310, 100%, 60%), 
    hsl(0, 100%, 60%), 
    hsl(14, 100%, 57%)
  );
}

.kleurvorm-accent {
  background: linear-gradient(135deg, 
    hsl(14, 100%, 57%), 
    hsl(25, 100%, 60%)
  );
}

/* OrderFi Enhanced Components */
.orderfi-card {
  @apply bg-card border-border/50 backdrop-blur-sm;
  background: linear-gradient(135deg, 
    hsl(var(--card)) 0%, 
    hsl(var(--card)) 50%, 
    hsla(var(--primary), 0.02) 100%
  );
}

.orderfi-button-primary {
  @apply bg-primary text-primary-foreground;
  background: linear-gradient(135deg, 
    hsl(var(--primary)) 0%, 
    hsl(var(--accent)) 100%
  );
}

.orderfi-gradient-text {
  background: linear-gradient(135deg, 
    hsl(var(--primary)) 0%, 
    hsl(var(--accent)) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Sophisticated hover effects */
.orderfi-hover-lift {
  @apply transition-all duration-300;
}

.orderfi-hover-lift:hover {
  @apply scale-105 shadow-lg;
  box-shadow: 0 10px 25px hsla(var(--primary), 0.15);
}

/* Professional glassmorphism */
.orderfi-glass {
  @apply backdrop-blur-md border-border/20;
  background: hsla(var(--background), 0.85);
}

.orderfi-glass-card {
  @apply orderfi-glass rounded-lg p-6;
  background: linear-gradient(135deg, 
    hsla(var(--background), 0.9) 0%, 
    hsla(var(--background), 0.7) 100%
  );
}
`;

    // Apply the new CSS by creating a style element
    const styleElement = document.createElement('style');
    styleElement.id = 'kleurvorm-theme';
    styleElement.textContent = newCSS;
    
    // Remove existing theme if it exists
    const existingTheme = document.getElementById('kleurvorm-theme');
    if (existingTheme) {
      existingTheme.remove();
    }
    
    // Add the new theme
    document.head.appendChild(styleElement);
    
    // Force refresh of CSS variables
    document.documentElement.style.cssText = document.documentElement.style.cssText;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-6 w-6" />
            Kleurvörm Theme Analysis & Application
          </CardTitle>
          <CardDescription>
            Using Grok-4 to analyze the sophisticated color palette and apply professional theme system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-16 rounded-lg flex items-center justify-center">
            <span className="text-white font-medium">Kleurvörm Color Palette Preview</span>
          </div>
          
          <Button 
            onClick={analyzeColorPalette} 
            disabled={isAnalyzing}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Wand2 className="h-5 w-5 mr-2 animate-spin" />
                Analyzing with Grok-4...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5 mr-2" />
                Analyze & Apply Kleurvörm Theme
              </>
            )}
          </Button>
          
          {themeApplied && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Kleurvörm theme successfully applied! The sophisticated color system is now active.
              </AlertDescription>
            </Alert>
          )}
          
          {analysisResult && !analysisResult.success && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Theme analysis failed: {analysisResult.error}
              </AlertDescription>
            </Alert>
          )}
          
          {analysisResult && analysisResult.success && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Grok-4 Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={analysisResult.analysis} 
                  readOnly 
                  className="h-64 text-sm"
                />
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeAnalyzer;