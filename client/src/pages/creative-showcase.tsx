import React, { useState } from 'react';
import { CreativeHeader } from '@/components/creative-layout/CreativeHeader';
import { CreativeCardStack } from '@/components/creative-layout/CreativeCardStack';
import { CreativeMasonryGrid } from '@/components/creative-layout/CreativeMasonryGrid';
import { CreativeSplitScreen } from '@/components/creative-layout/CreativeSplitScreen';
import { CreativeShapes, FloatingShapes } from '@/components/creative-layout/CreativeShapes';
import { CreativeNavigation } from '@/components/creative-layout/CreativeNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Layers, 
  Sparkles, 
  Zap,
  Target,
  TrendingUp,
  Users,
  Heart
} from 'lucide-react';

export default function CreativeShowcase() {
  const [selectedDemo, setSelectedDemo] = useState('overview');

  const cardStackData = [
    {
      title: "Premium Menu Items",
      content: "Discover our chef's special selections with premium ingredients and artistic presentation.",
      accent: 'primary' as const
    },
    {
      title: "Seasonal Specials",
      content: "Fresh, local ingredients prepared with innovative techniques for unique flavors.",
      accent: 'secondary' as const
    },
    {
      title: "Customer Favorites",
      content: "The most loved dishes by our community, consistently rated 5 stars."
    }
  ];

  const masonryData = [
    {
      id: 1,
      title: "Dynamic Layouts",
      content: "Asymmetrical grids that adapt to content naturally, creating visual interest while maintaining usability.",
      height: 'tall' as const,
      color: 'primary' as const
    },
    {
      id: 2,
      title: "Micro-Interactions",
      content: "Subtle animations that provide feedback and delight users.",
      height: 'short' as const,
      color: 'secondary' as const
    },
    {
      id: 3,
      title: "Responsive Design",
      content: "Layouts that work beautifully across all devices and screen sizes.",
      height: 'medium' as const,
      color: 'neutral' as const
    },
    {
      id: 4,
      title: "Creative Shapes",
      content: "Custom clip-path shapes that add visual interest and brand personality.",
      height: 'tall' as const,
      color: 'accent' as const
    },
    {
      id: 5,
      title: "Color Psychology",
      content: "Strategic use of color to guide user attention and create emotional connections.",
      height: 'short' as const,
      color: 'primary' as const
    },
    {
      id: 6,
      title: "Performance First",
      content: "Optimized animations and transitions using modern CSS techniques.",
      height: 'medium' as const,
      color: 'secondary' as const
    }
  ];

  const navigationItems = [
    { label: 'Overview', href: '#overview', icon: <Target className="w-4 h-4" /> },
    { label: 'Layouts', href: '#layouts', icon: <Layers className="w-4 h-4" /> },
    { label: 'Animations', href: '#animations', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Components', href: '#components', icon: <Zap className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Import Creative Layout CSS */}
      <link rel="stylesheet" href="/src/styles/creative-layout-system.css" />
      
      <CreativeHeader
        title="Creative Layout System"
        subtitle="Advanced UI patterns for modern web applications"
        description="Explore cutting-edge layout techniques, micro-interactions, and design patterns that create engaging user experiences."
        actions={[
          {
            label: "Explore Demos",
            onClick: () => setSelectedDemo('demos'),
            variant: 'primary'
          },
          {
            label: "View Documentation",
            onClick: () => setSelectedDemo('docs'),
            variant: 'secondary'
          }
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 flex justify-center">
          <CreativeNavigation items={navigationItems} />
        </div>

        <Tabs value={selectedDemo} onValueChange={setSelectedDemo} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="demos">Live Demos</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="creative-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-orange-500" />
                    Advanced Layouts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Layered card stacks, masonry grids, and split-screen designs that create depth and visual interest.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">CSS Grid</Badge>
                    <Badge variant="secondary">Flexbox</Badge>
                    <Badge variant="secondary">Responsive</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="creative-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-500" />
                    Micro-Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Subtle animations and hover effects that provide feedback and create delightful user experiences.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">CSS Animations</Badge>
                    <Badge variant="secondary">Transforms</Badge>
                    <Badge variant="secondary">Transitions</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="creative-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-500" />
                    Custom Shapes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Clip-path shapes, blobs, and geometric elements that add personality and visual appeal.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Clip-path</Badge>
                    <Badge variant="secondary">Mask</Badge>
                    <Badge variant="secondary">Custom</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">150+</div>
                <div className="text-gray-600 dark:text-gray-300">CSS Classes</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-500 mb-2">25+</div>
                <div className="text-gray-600 dark:text-gray-300">Components</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-500 mb-2">12+</div>
                <div className="text-gray-600 dark:text-gray-300">Layout Patterns</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500 mb-2">100%</div>
                <div className="text-gray-600 dark:text-gray-300">Responsive</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="demos" className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6">Card Stack Demo</h3>
                <CreativeCardStack
                  title="Layered Information"
                  cards={cardStackData}
                />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-6">Custom Shapes</h3>
                <div className="flex flex-wrap gap-6 justify-center">
                  <CreativeShapes variant="blob" size="lg" color="primary" />
                  <CreativeShapes variant="star" size="lg" color="secondary" />
                  <CreativeShapes variant="card-angle" size="lg" color="accent" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Masonry Grid Layout</h3>
              <CreativeMasonryGrid items={masonryData} />
            </div>
          </TabsContent>

          <TabsContent value="components" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="creative-card">
                <CardHeader>
                  <CardTitle>CreativeHeader</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Hero sections with floating shapes and gradient backgrounds.
                  </p>
                  <Button variant="outline" size="sm">View Examples</Button>
                </CardContent>
              </Card>

              <Card className="creative-card">
                <CardHeader>
                  <CardTitle>CreativeCardStack</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Layered cards with hover animations and 3D transforms.
                  </p>
                  <Button variant="outline" size="sm">View Examples</Button>
                </CardContent>
              </Card>

              <Card className="creative-card">
                <CardHeader>
                  <CardTitle>CreativeMasonryGrid</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Responsive masonry layouts with dynamic item heights.
                  </p>
                  <Button variant="outline" size="sm">View Examples</Button>
                </CardContent>
              </Card>

              <Card className="creative-card">
                <CardHeader>
                  <CardTitle>CreativeSplitScreen</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Split-screen layouts with gradient backgrounds and animations.
                  </p>
                  <Button variant="outline" size="sm">View Examples</Button>
                </CardContent>
              </Card>

              <Card className="creative-card">
                <CardHeader>
                  <CardTitle>CreativeShapes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Custom clip-path shapes for visual interest and branding.
                  </p>
                  <Button variant="outline" size="sm">View Examples</Button>
                </CardContent>
              </Card>

              <Card className="creative-card">
                <CardHeader>
                  <CardTitle>CreativeNavigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Glassmorphism navigation with smooth transitions.
                  </p>
                  <Button variant="outline" size="sm">View Examples</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="docs" className="space-y-8">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2>Getting Started</h2>
              <p>
                The Creative Layout System is a comprehensive CSS framework that provides advanced layout patterns,
                micro-interactions, and design components for modern web applications.
              </p>

              <h3>Installation</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <code>import '/src/styles/creative-layout-system.css';</code>
              </div>

              <h3>CSS Custom Properties</h3>
              <p>
                The system uses CSS custom properties for consistent theming and easy customization:
              </p>
              <ul>
                <li><code>--color-primary-*</code> - Primary color scale</li>
                <li><code>--color-secondary-*</code> - Secondary color scale</li>
                <li><code>--space-*</code> - Spacing scale</li>
                <li><code>--font-size-*</code> - Typography scale</li>
                <li><code>--radius-*</code> - Border radius scale</li>
                <li><code>--elevation-*</code> - Shadow elevation scale</li>
              </ul>

              <h3>Key Features</h3>
              <ul>
                <li>Advanced layout patterns (card stacks, masonry grids, split screens)</li>
                <li>Custom shapes using clip-path</li>
                <li>Micro-interactions and animations</li>
                <li>Glassmorphism effects</li>
                <li>Responsive design utilities</li>
                <li>Accessibility considerations</li>
                <li>Dark mode support</li>
              </ul>

              <h3>Performance</h3>
              <p>
                All animations use GPU-accelerated properties (transform, opacity) and include
                <code>will-change</code> hints for optimal performance. The system also respects
                <code>prefers-reduced-motion</code> for accessibility.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <FloatingShapes className="fixed inset-0 -z-10" />
    </div>
  );
}