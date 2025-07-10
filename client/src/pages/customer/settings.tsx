import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Mic, CreditCard, Bell, Palette, LogOut } from 'lucide-react';

export default function CustomerSettings() {
  const [, navigate] = useLocation();
  const [settings, setSettings] = useState({
    voiceOrdering: false,
    pushNotifications: false,
    darkMode: false,
    autoTip: 18
  });

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      navigate('/login');
      return;
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('customerSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [navigate]);

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('customerSettings', JSON.stringify(newSettings));
  };

  const handleLogout = () => {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('cart');
    localStorage.removeItem('tipAmount');
    localStorage.removeItem('customerSettings');
    navigate('/login');
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    localStorage.removeItem('tipAmount');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/mobileapp')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
            <h1 className="text-2xl rock-salt-font">Settings</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          {/* Voice & Accessibility */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mic className="w-5 h-5" />
                <span>Voice & Accessibility</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="voice-ordering">Voice Ordering</Label>
                  <p className="text-sm text-muted-foreground">
                    Use voice commands to add items and navigate
                  </p>
                </div>
                <Switch
                  id="voice-ordering"
                  checked={settings.voiceOrdering}
                  onCheckedChange={(checked) => updateSetting('voiceOrdering', checked)}
                />
              </div>

              {settings.voiceOrdering && (
                <div className="ml-4 p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium mb-2">Voice Commands:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• "Add [item name]" - Add items to cart</li>
                    <li>• "Show cart" - View your cart</li>
                    <li>• "Checkout" - Proceed to payment</li>
                    <li>• "Clear cart" - Remove all items</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Order Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your order status changes
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Payment Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Default Tip Percentage</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Automatically apply this tip percentage
                </p>
                <div className="flex space-x-2">
                  {[15, 18, 20, 25].map((percent) => (
                    <Button
                      key={percent}
                      variant={settings.autoTip === percent ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSetting('autoTip', percent)}
                      className="flex-1"
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Appearance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme for better visibility in low light
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => {
                    updateSetting('darkMode', checked);
                    document.documentElement.classList.toggle('dark', checked);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full justify-start"
              >
                Clear Cart
              </Button>

              <Separator />

              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* App Info */}
          <Card>
            <CardHeader>
              <CardTitle>About OrderFi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm space-y-1">
                <p><strong>Version:</strong> 1.0.0 MVP</p>
                <p><strong>Build:</strong> Customer Self-Ordering</p>
                <p className="text-muted-foreground">
                  A decentralized restaurant ordering platform powered by Web3 technology.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}