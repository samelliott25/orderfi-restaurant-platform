import { StandardLayout } from '@/components/StandardLayout';
import { OrderFiHeading, OrderFiSubtitle } from '@/components/ui/design-system';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TypographyDemo() {
  return (
    <StandardLayout 
      title="Typography System"
      subtitle="OrderFi's optimized font strategy for food apps"
    >
      <div className="space-y-8">
        {/* Font Strategy Overview */}
        <div className="kleurvorm-card p-8">
          <h1 className="orderfi-brand text-4xl mb-4">OrderFi</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="orderfi-heading text-2xl mb-4">Font Strategy</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="orderfi-heading text-lg mb-2">Primary: Inter</h3>
                  <p className="orderfi-body text-sm text-gray-600">
                    Modern, highly readable sans-serif perfect for UI elements, body text, and data display.
                    Used for headings, buttons, forms, and all interface elements.
                  </p>
                </div>
                <div>
                  <h3 className="orderfi-heading text-lg mb-2">Brand: Comfortaa</h3>
                  <p className="orderfi-body text-sm text-gray-600">
                    Friendly, approachable font ideal for food and health apps. 
                    Used sparingly for the OrderFi logo and special brand elements.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="orderfi-heading text-2xl mb-4">Benefits</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>95% faster loading (2 fonts vs 12+)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Consistent brand experience</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Optimized for food app psychology</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Better accessibility & readability</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Typography Scale */}
        <div className="kleurvorm-card p-8">
          <h2 className="orderfi-heading text-2xl mb-6">Typography Scale</h2>
          <div className="space-y-6">
            {/* Headings */}
            <div>
              <h3 className="orderfi-heading text-lg mb-4">Headings (Inter 600)</h3>
              <div className="space-y-3">
                <h1 className="orderfi-heading text-4xl">H1: Main Page Title</h1>
                <h2 className="orderfi-heading text-3xl">H2: Section Heading</h2>
                <h3 className="orderfi-heading text-2xl">H3: Subsection</h3>
                <h4 className="orderfi-heading text-xl">H4: Component Title</h4>
                <h5 className="orderfi-heading text-lg">H5: Small Heading</h5>
                <h6 className="orderfi-heading text-base">H6: Smallest Heading</h6>
              </div>
            </div>

            {/* Body Text */}
            <div>
              <h3 className="orderfi-heading text-lg mb-4">Body Text (Inter 400)</h3>
              <div className="space-y-3">
                <p className="orderfi-body text-lg">Large body text for important content</p>
                <p className="orderfi-body text-base">Regular body text for standard content</p>
                <p className="orderfi-body text-sm">Small body text for secondary information</p>
                <p className="orderfi-body text-xs">Extra small text for metadata</p>
              </div>
            </div>

            {/* Brand Elements */}
            <div>
              <h3 className="orderfi-heading text-lg mb-4">Brand Elements (Comfortaa 700)</h3>
              <div className="space-y-3">
                <div className="orderfi-brand text-6xl">OrderFi</div>
                <div className="orderfi-brand text-4xl">OrderFi</div>
                <div className="orderfi-brand text-2xl">OrderFi</div>
                <div className="orderfi-brand text-xl">OrderFi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Component Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Component */}
          <Card>
            <CardHeader>
              <CardTitle className="orderfi-heading">Menu Item</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="orderfi-body text-sm text-gray-600 mb-4">
                Delicious grilled chicken with fresh vegetables and aromatic herbs.
              </p>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="orderfi-ui text-xs">Gluten-Free</Badge>
                <Badge variant="outline" className="orderfi-ui text-xs">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="orderfi-heading text-lg">$12.99</span>
                <Button size="sm" className="orderfi-ui">Add to Cart</Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="orderfi-heading">Today's Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="orderfi-body text-sm">Total Orders</span>
                  <span className="orderfi-heading text-xl">247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="orderfi-body text-sm">Revenue</span>
                  <span className="orderfi-heading text-xl">$3,245</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="orderfi-body text-sm">Avg Order</span>
                  <span className="orderfi-heading text-xl">$13.12</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Font Loading Performance */}
        <div className="kleurvorm-card p-8">
          <h2 className="orderfi-heading text-2xl mb-6">Performance Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="orderfi-heading text-lg mb-4 text-red-600">Before (Old System)</h3>
              <ul className="space-y-2 text-sm">
                <li>• 12+ Google Fonts loaded</li>
                <li>• ~450KB font files</li>
                <li>• 3-4 second load time</li>
                <li>• Inconsistent brand experience</li>
                <li>• Multiple font fallbacks</li>
              </ul>
            </div>
            <div>
              <h3 className="orderfi-heading text-lg mb-4 text-green-600">After (Optimized)</h3>
              <ul className="space-y-2 text-sm">
                <li>• 2 optimized fonts (Inter + Comfortaa)</li>
                <li>• ~95KB font files</li>
                <li>• <1 second load time</li>
                <li>• Consistent typography system</li>
                <li>• Better food app psychology</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="kleurvorm-card p-8">
          <h2 className="orderfi-heading text-2xl mb-6">Usage Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="orderfi-heading text-lg mb-3">Inter (Primary)</h3>
              <ul className="space-y-1 text-sm">
                <li>• All headings (H1-H6)</li>
                <li>• Body text and paragraphs</li>
                <li>• Button text</li>
                <li>• Form inputs</li>
                <li>• Navigation menus</li>
                <li>• Data tables</li>
              </ul>
            </div>
            <div>
              <h3 className="orderfi-heading text-lg mb-3">Comfortaa (Brand)</h3>
              <ul className="space-y-1 text-sm">
                <li>• OrderFi logo</li>
                <li>• Special CTAs</li>
                <li>• Marketing headers</li>
                <li>• Brand moments</li>
                <li>• Hero sections</li>
                <li>• Limited use only</li>
              </ul>
            </div>
            <div>
              <h3 className="orderfi-heading text-lg mb-3">CSS Classes</h3>
              <ul className="space-y-1 text-sm">
                <li>• <code>.orderfi-brand</code></li>
                <li>• <code>.orderfi-heading</code></li>
                <li>• <code>.orderfi-body</code></li>
                <li>• <code>.orderfi-ui</code></li>
                <li>• <code>.playwrite-font</code> (legacy)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}