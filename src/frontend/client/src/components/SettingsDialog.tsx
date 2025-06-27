import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bell, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Globe, 
  Shield, 
  CreditCard,
  User,
  Smartphone,
  Palette,
  Database,
  Zap
} from "lucide-react";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const [settings, setSettings] = useState({
    // Voice & Audio
    voiceEnabled: true,
    voiceSpeed: "normal",
    soundEffects: true,
    
    // Notifications
    orderUpdates: true,
    promotions: true,
    loyaltyRewards: true,
    emailNotifications: true,
    
    // Display
    darkMode: false,
    language: "en",
    currency: "USD",
    fontSize: "medium",
    
    // Privacy
    dataCollection: true,
    locationTracking: false,
    analyticsSharing: true,
    
    // Ordering
    autoSave: true,
    quickReorder: true,
    defaultTip: "18",
    paymentMethod: "card",
    
    // AI Assistant
    aiPersonality: "friendly",
    aiSuggestions: true,
    voiceInteraction: true,
    aiMemory: true
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-5 w-5">
              <svg viewBox="0 0 24 24" className="w-full h-full text-orange-500" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
              </svg>
            </div>
            OrderFi Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Voice & Audio Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Volume2 className="h-4 w-4" />
                Voice & Audio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-enabled">Voice Interaction</Label>
                <Switch
                  id="voice-enabled"
                  checked={settings.voiceEnabled}
                  onCheckedChange={(checked) => updateSetting('voiceEnabled', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Voice Speed</Label>
                <Select value={settings.voiceSpeed} onValueChange={(value) => updateSetting('voiceSpeed', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-effects">Sound Effects</Label>
                <Switch
                  id="sound-effects"
                  checked={settings.soundEffects}
                  onCheckedChange={(checked) => updateSetting('soundEffects', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="order-updates">Order Updates</Label>
                <Switch
                  id="order-updates"
                  checked={settings.orderUpdates}
                  onCheckedChange={(checked) => updateSetting('orderUpdates', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="promotions">Promotions & Offers</Label>
                <Switch
                  id="promotions"
                  checked={settings.promotions}
                  onCheckedChange={(checked) => updateSetting('promotions', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="loyalty-rewards">Loyalty Rewards</Label>
                <Switch
                  id="loyalty-rewards"
                  checked={settings.loyaltyRewards}
                  onCheckedChange={(checked) => updateSetting('loyaltyRewards', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Display & Language */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Palette className="h-4 w-4" />
                Display & Language
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => updateSetting('darkMode', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => updateSetting('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select value={settings.fontSize} onValueChange={(value) => updateSetting('fontSize', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4">
                  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                </div>
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>AI Personality</Label>
                <Select value={settings.aiPersonality} onValueChange={(value) => updateSetting('aiPersonality', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly & Casual</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="concise">Concise & Direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="ai-suggestions">Smart Suggestions</Label>
                <Switch
                  id="ai-suggestions"
                  checked={settings.aiSuggestions}
                  onCheckedChange={(checked) => updateSetting('aiSuggestions', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-interaction">Voice Interaction</Label>
                <Switch
                  id="voice-interaction"
                  checked={settings.voiceInteraction}
                  onCheckedChange={(checked) => updateSetting('voiceInteraction', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="ai-memory">Remember Preferences</Label>
                <Switch
                  id="ai-memory"
                  checked={settings.aiMemory}
                  onCheckedChange={(checked) => updateSetting('aiMemory', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Ordering Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4" />
                Ordering & Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save">Auto-save Orders</Label>
                <Switch
                  id="auto-save"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="quick-reorder">Quick Reorder</Label>
                <Switch
                  id="quick-reorder"
                  checked={settings.quickReorder}
                  onCheckedChange={(checked) => updateSetting('quickReorder', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Default Tip</Label>
                <Select value={settings.defaultTip} onValueChange={(value) => updateSetting('defaultTip', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15%</SelectItem>
                    <SelectItem value="18">18%</SelectItem>
                    <SelectItem value="20">20%</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Preferred Payment</Label>
                <Select value={settings.paymentMethod} onValueChange={(value) => updateSetting('paymentMethod', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="wallet">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4" />
                Privacy & Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="data-collection">Analytics & Improvement</Label>
                <Switch
                  id="data-collection"
                  checked={settings.dataCollection}
                  onCheckedChange={(checked) => updateSetting('dataCollection', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="location-tracking">Location Services</Label>
                <Switch
                  id="location-tracking"
                  checked={settings.locationTracking}
                  onCheckedChange={(checked) => updateSetting('locationTracking', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="analytics-sharing">Usage Analytics</Label>
                <Switch
                  id="analytics-sharing"
                  checked={settings.analyticsSharing}
                  onCheckedChange={(checked) => updateSetting('analyticsSharing', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setSettings({
              voiceEnabled: true,
              voiceSpeed: "normal",
              soundEffects: true,
              orderUpdates: true,
              promotions: true,
              loyaltyRewards: true,
              emailNotifications: true,
              darkMode: false,
              language: "en",
              currency: "USD",
              fontSize: "medium",
              dataCollection: true,
              locationTracking: false,
              analyticsSharing: true,
              autoSave: true,
              quickReorder: true,
              defaultTip: "18",
              paymentMethod: "card",
              aiPersonality: "friendly",
              aiSuggestions: true,
              voiceInteraction: true,
              aiMemory: true
            })}>
              Reset to Defaults
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={onClose}>
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}