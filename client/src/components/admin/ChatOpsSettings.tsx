import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Bell, 
  Volume2, 
  Brain, 
  Zap,
  Globe,
  MessageSquare,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export interface ChatOpsSettingsConfig {
  // 1. Notification Frequency Setting
  notificationFrequency: 'high' | 'medium' | 'low' | 'mute';
  
  // 2. Alert Types Toggle
  alertTypes: {
    orders: boolean;
    inventory: boolean;
    alerts: boolean;
  };
  
  // 3. Sound/Volume Controls
  soundEnabled: boolean;
  soundVolume: number; // 0-100
  
  // 4. AI Model Choice
  aiModel: 'fast' | 'advanced' | 'custom';
  
  // 5. Auto-Model Selection
  autoModelSelection: boolean;
  
  // 6. Language/Tone Preferences
  language: 'english' | 'spanish';
  tone: 'professional' | 'casual' | 'concise';
  
  // 7. Response Length
  responseLength: 'short' | 'detailed';
}

interface ChatOpsSettingsProps {
  config: ChatOpsSettingsConfig;
  onConfigChange: (config: ChatOpsSettingsConfig) => void;
  onClose: () => void;
}

// Default configuration
export const defaultChatOpsConfig: ChatOpsSettingsConfig = {
  notificationFrequency: 'medium',
  alertTypes: {
    orders: true,
    inventory: true,
    alerts: true
  },
  soundEnabled: true,
  soundVolume: 70,
  aiModel: 'fast',
  autoModelSelection: true,
  language: 'english',
  tone: 'professional',
  responseLength: 'detailed'
};

export function ChatOpsSettings({ 
  config, 
  onConfigChange, 
  onClose 
}: ChatOpsSettingsProps) {
  const [localConfig, setLocalConfig] = useState<ChatOpsSettingsConfig>(config);

  const updateConfig = (key: keyof ChatOpsSettingsConfig, value: any) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
    
    // Also save to localStorage for persistence
    localStorage.setItem('chatops-settings', JSON.stringify(newConfig));
  };

  const updateAlertType = (alertType: keyof ChatOpsSettingsConfig['alertTypes'], enabled: boolean) => {
    const newAlertTypes = { ...localConfig.alertTypes, [alertType]: enabled };
    updateConfig('alertTypes', newAlertTypes);
  };

  const handleReset = () => {
    setLocalConfig(defaultChatOpsConfig);
    onConfigChange(defaultChatOpsConfig);
    localStorage.setItem('chatops-settings', JSON.stringify(defaultChatOpsConfig));
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold">ChatOps Settings</h3>
        </div>
      </div>

      {/* 1. Notification Frequency */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-orange-500" />
          <Label className="text-sm font-medium">Notification Frequency</Label>
        </div>
        <Select value={localConfig.notificationFrequency} onValueChange={(value) => updateConfig('notificationFrequency', value)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High (All alerts)</SelectItem>
            <SelectItem value="medium">Medium (Important alerts)</SelectItem>
            <SelectItem value="low">Low (Critical only)</SelectItem>
            <SelectItem value="mute">Mute (No alerts)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-white/10" />

      {/* 2. Alert Types Toggle */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <Label className="text-sm font-medium">Alert Types</Label>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="orders-alerts" className="text-sm">Orders</Label>
            <Switch
              id="orders-alerts"
              checked={localConfig.alertTypes.orders}
              onCheckedChange={(checked) => updateAlertType('orders', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="inventory-alerts" className="text-sm">Inventory</Label>
            <Switch
              id="inventory-alerts"
              checked={localConfig.alertTypes.inventory}
              onCheckedChange={(checked) => updateAlertType('inventory', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="general-alerts" className="text-sm">General Alerts</Label>
            <Switch
              id="general-alerts"
              checked={localConfig.alertTypes.alerts}
              onCheckedChange={(checked) => updateAlertType('alerts', checked)}
            />
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* 3. Sound/Volume Controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-orange-500" />
          <Label className="text-sm font-medium">Sound & Volume</Label>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-enabled" className="text-sm">Sound Notifications</Label>
            <Switch
              id="sound-enabled"
              checked={localConfig.soundEnabled}
              onCheckedChange={(checked) => updateConfig('soundEnabled', checked)}
            />
          </div>
          {localConfig.soundEnabled && (
            <div className="space-y-2">
              <Label className="text-sm">Volume: {localConfig.soundVolume}%</Label>
              <Slider
                value={[localConfig.soundVolume]}
                onValueChange={(value) => updateConfig('soundVolume', value[0])}
                max={100}
                min={0}
                step={10}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* 4. AI Model Choice */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-orange-500" />
          <Label className="text-sm font-medium">AI Model</Label>
        </div>
        <Select value={localConfig.aiModel} onValueChange={(value) => updateConfig('aiModel', value)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fast">Fast (Quick responses)</SelectItem>
            <SelectItem value="advanced">Advanced (Detailed analysis)</SelectItem>
            <SelectItem value="custom">Custom (Specialized)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-white/10" />

      {/* 5. Auto-Model Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-orange-500" />
          <Label className="text-sm font-medium">Auto-Model Selection</Label>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-model" className="text-sm">Automatically choose model based on query complexity</Label>
          <Switch
            id="auto-model"
            checked={localConfig.autoModelSelection}
            onCheckedChange={(checked) => updateConfig('autoModelSelection', checked)}
          />
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* 6. Language/Tone Preferences */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-orange-500" />
          <Label className="text-sm font-medium">Language & Tone</Label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">Language</Label>
            <Select value={localConfig.language} onValueChange={(value) => updateConfig('language', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Tone</Label>
            <Select value={localConfig.tone} onValueChange={(value) => updateConfig('tone', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="concise">Concise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* 7. Response Length */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-orange-500" />
          <Label className="text-sm font-medium">Response Length</Label>
        </div>
        <Select value={localConfig.responseLength} onValueChange={(value) => updateConfig('responseLength', value)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Short (Brief answers)</SelectItem>
            <SelectItem value="detailed">Detailed (Complete explanations)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-white/10" />

      {/* 8. Reset to Defaults */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-orange-500" />
          <Label className="text-sm font-medium">Reset Settings</Label>
        </div>
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}