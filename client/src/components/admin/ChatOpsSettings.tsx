import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Clock, 
  Archive, 
  Brain, 
  Mic, 
  Bell, 
  Shield, 
  Database,
  MessageSquare,
  Zap,
  X,
  RefreshCw,
  Download,
  Trash2
} from 'lucide-react';

export interface ChatOpsSettingsConfig {
  // Conversation Management
  sessionTimeout: number; // minutes
  conversationCondensing: 'off' | 'time-based' | 'message-count' | 'smart';
  condensingInterval: number; // hours for time-based, message count for count-based
  contextRetention: number; // days
  maxMessagesPerSession: number;
  
  // AI Behavior
  responseStyle: 'professional' | 'casual' | 'concise' | 'detailed';
  aiModel: 'grok-2-1212' | 'gpt-4o' | 'claude-3-5-sonnet';
  autoSummarization: boolean;
  proactiveInsights: boolean;
  
  // Notifications & Alerts
  enableNotifications: boolean;
  urgentAlerts: boolean;
  quietHours: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  
  // Voice & Audio
  voiceEnabled: boolean;
  voiceSpeed: number; // 0.5 to 2.0
  voiceModel: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  
  // Security & Privacy
  dataRetention: number; // days
  encryptionEnabled: boolean;
  logConversations: boolean;
  shareAnalytics: boolean;
  
  // Integration Settings
  posIntegration: boolean;
  kitchenDisplaySync: boolean;
  inventoryAlerts: boolean;
  customerDataSync: boolean;
}

interface ChatOpsSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  config: ChatOpsSettingsConfig;
  onConfigChange: (config: ChatOpsSettingsConfig) => void;
  onClearHistory: () => void;
  onExportData: () => void;
}

export function ChatOpsSettings({ 
  isOpen, 
  onClose, 
  config, 
  onConfigChange, 
  onClearHistory, 
  onExportData 
}: ChatOpsSettingsProps) {
  const [localConfig, setLocalConfig] = useState<ChatOpsSettingsConfig>(config);

  const updateConfig = (key: keyof ChatOpsSettingsConfig, value: any) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleSave = () => {
    // Save to localStorage or backend
    localStorage.setItem('chatops-settings', JSON.stringify(localConfig));
    onClose();
  };

  const handleReset = () => {
    const defaultConfig: ChatOpsSettingsConfig = {
      sessionTimeout: 30,
      conversationCondensing: 'smart',
      condensingInterval: 2,
      contextRetention: 7,
      maxMessagesPerSession: 100,
      responseStyle: 'professional',
      aiModel: 'grok-2-1212',
      autoSummarization: true,
      proactiveInsights: true,
      enableNotifications: true,
      urgentAlerts: true,
      quietHours: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00',
      voiceEnabled: true,
      voiceSpeed: 1.0,
      voiceModel: 'nova',
      dataRetention: 30,
      encryptionEnabled: true,
      logConversations: true,
      shareAnalytics: false,
      posIntegration: true,
      kitchenDisplaySync: true,
      inventoryAlerts: true,
      customerDataSync: true,
    };
    setLocalConfig(defaultConfig);
    onConfigChange(defaultConfig);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="liquid-glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-orange-500" />
            <h2 className="text-xl font-semibold">ChatOps Settings</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-8">
          
          {/* Conversation Management */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-medium">Conversation Management</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={localConfig.sessionTimeout}
                  onChange={(e) => updateConfig('sessionTimeout', parseInt(e.target.value))}
                  min="5"
                  max="1440"
                />
                <p className="text-xs text-muted-foreground">How long before chat session expires</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condensing">Conversation Condensing</Label>
                <Select value={localConfig.conversationCondensing} onValueChange={(value) => updateConfig('conversationCondensing', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Disabled</SelectItem>
                    <SelectItem value="time-based">Time-based</SelectItem>
                    <SelectItem value="message-count">Message Count</SelectItem>
                    <SelectItem value="smart">Smart AI Condensing</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">How to condense old conversations</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condensingInterval">
                  {localConfig.conversationCondensing === 'time-based' ? 'Condensing Interval (hours)' : 'Max Messages Before Condensing'}
                </Label>
                <Input
                  id="condensingInterval"
                  type="number"
                  value={localConfig.condensingInterval}
                  onChange={(e) => updateConfig('condensingInterval', parseInt(e.target.value))}
                  min={localConfig.conversationCondensing === 'time-based' ? "1" : "20"}
                  max={localConfig.conversationCondensing === 'time-based' ? "24" : "200"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contextRetention">Context Retention (days)</Label>
                <Input
                  id="contextRetention"
                  type="number"
                  value={localConfig.contextRetention}
                  onChange={(e) => updateConfig('contextRetention', parseInt(e.target.value))}
                  min="1"
                  max="90"
                />
                <p className="text-xs text-muted-foreground">How long to remember conversation context</p>
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* AI Behavior */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-medium">AI Behavior</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responseStyle">Response Style</Label>
                <Select value={localConfig.responseStyle} onValueChange={(value) => updateConfig('responseStyle', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiModel">AI Model</Label>
                <Select value={localConfig.aiModel} onValueChange={(value) => updateConfig('aiModel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grok-2-1212">Grok-2 (Latest)</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="autoSummarization">Auto Summarization</Label>
                <Switch
                  id="autoSummarization"
                  checked={localConfig.autoSummarization}
                  onCheckedChange={(checked) => updateConfig('autoSummarization', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="proactiveInsights">Proactive Insights</Label>
                <Switch
                  id="proactiveInsights"
                  checked={localConfig.proactiveInsights}
                  onCheckedChange={(checked) => updateConfig('proactiveInsights', checked)}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Voice & Audio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-medium">Voice & Audio</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="voiceEnabled">Voice Responses</Label>
                <Switch
                  id="voiceEnabled"
                  checked={localConfig.voiceEnabled}
                  onCheckedChange={(checked) => updateConfig('voiceEnabled', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="voiceModel">Voice Model</Label>
                <Select value={localConfig.voiceModel} onValueChange={(value) => updateConfig('voiceModel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                    <SelectItem value="echo">Echo (Male)</SelectItem>
                    <SelectItem value="fable">Fable (British)</SelectItem>
                    <SelectItem value="onyx">Onyx (Deep)</SelectItem>
                    <SelectItem value="nova">Nova (Female)</SelectItem>
                    <SelectItem value="shimmer">Shimmer (Soft)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="voiceSpeed">Voice Speed: {localConfig.voiceSpeed}x</Label>
                <Slider
                  id="voiceSpeed"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={[localConfig.voiceSpeed]}
                  onValueChange={(value) => updateConfig('voiceSpeed', value[0])}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-medium">Notifications & Alerts</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="enableNotifications">Enable Notifications</Label>
                <Switch
                  id="enableNotifications"
                  checked={localConfig.enableNotifications}
                  onCheckedChange={(checked) => updateConfig('enableNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="urgentAlerts">Urgent Alerts</Label>
                <Switch
                  id="urgentAlerts"
                  checked={localConfig.urgentAlerts}
                  onCheckedChange={(checked) => updateConfig('urgentAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="quietHours">Quiet Hours</Label>
                <Switch
                  id="quietHours"
                  checked={localConfig.quietHours}
                  onCheckedChange={(checked) => updateConfig('quietHours', checked)}
                />
              </div>

              {localConfig.quietHours && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="quietStart">Start</Label>
                    <Input
                      id="quietStart"
                      type="time"
                      value={localConfig.quietHoursStart}
                      onChange={(e) => updateConfig('quietHoursStart', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quietEnd">End</Label>
                    <Input
                      id="quietEnd"
                      type="time"
                      value={localConfig.quietHoursEnd}
                      onChange={(e) => updateConfig('quietHoursEnd', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Security & Privacy */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-medium">Security & Privacy</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataRetention">Data Retention (days)</Label>
                <Input
                  id="dataRetention"
                  type="number"
                  value={localConfig.dataRetention}
                  onChange={(e) => updateConfig('dataRetention', parseInt(e.target.value))}
                  min="1"
                  max="365"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="encryptionEnabled">Encryption Enabled</Label>
                <Switch
                  id="encryptionEnabled"
                  checked={localConfig.encryptionEnabled}
                  onCheckedChange={(checked) => updateConfig('encryptionEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="logConversations">Log Conversations</Label>
                <Switch
                  id="logConversations"
                  checked={localConfig.logConversations}
                  onCheckedChange={(checked) => updateConfig('logConversations', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="shareAnalytics">Share Analytics</Label>
                <Switch
                  id="shareAnalytics"
                  checked={localConfig.shareAnalytics}
                  onCheckedChange={(checked) => updateConfig('shareAnalytics', checked)}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Integration Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-medium">Restaurant Integrations</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="posIntegration">POS Integration</Label>
                <Switch
                  id="posIntegration"
                  checked={localConfig.posIntegration}
                  onCheckedChange={(checked) => updateConfig('posIntegration', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="kitchenDisplaySync">Kitchen Display Sync</Label>
                <Switch
                  id="kitchenDisplaySync"
                  checked={localConfig.kitchenDisplaySync}
                  onCheckedChange={(checked) => updateConfig('kitchenDisplaySync', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="inventoryAlerts">Inventory Alerts</Label>
                <Switch
                  id="inventoryAlerts"
                  checked={localConfig.inventoryAlerts}
                  onCheckedChange={(checked) => updateConfig('inventoryAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="customerDataSync">Customer Data Sync</Label>
                <Switch
                  id="customerDataSync"
                  checked={localConfig.customerDataSync}
                  onCheckedChange={(checked) => updateConfig('customerDataSync', checked)}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Data Management */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-medium">Data Management</h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={onExportData}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Chat Data
              </Button>
              
              <Button
                variant="outline"
                onClick={onClearHistory}
                className="flex items-center gap-2 text-red-500 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
                Clear Chat History
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default configuration
export const defaultChatOpsConfig: ChatOpsSettingsConfig = {
  sessionTimeout: 30,
  conversationCondensing: 'smart',
  condensingInterval: 2,
  contextRetention: 7,
  maxMessagesPerSession: 100,
  responseStyle: 'professional',
  aiModel: 'grok-2-1212',
  autoSummarization: true,
  proactiveInsights: true,
  enableNotifications: true,
  urgentAlerts: true,
  quietHours: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  voiceEnabled: true,
  voiceSpeed: 1.0,
  voiceModel: 'nova',
  dataRetention: 30,
  encryptionEnabled: true,
  logConversations: true,
  shareAnalytics: false,
  posIntegration: true,
  kitchenDisplaySync: true,
  inventoryAlerts: true,
  customerDataSync: true,
};