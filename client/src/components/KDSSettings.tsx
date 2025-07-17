import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings, Palette, Type, Volume2, Eye } from 'lucide-react';

interface KDSSettingsConfig {
  fontSize: number;
  cardSize: 'compact' | 'normal' | 'large';
  colorScheme: 'default' | 'high-contrast' | 'colorblind-friendly';
  showTimestamps: boolean;
  showCustomerNames: boolean;
  showOrderTotals: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  soundEnabled: boolean;
  soundVolume: number;
  compactView: boolean;
  statusColors: {
    pending: string;
    preparing: string;
    ready: string;
    completed: string;
  };
}

const DEFAULT_SETTINGS: KDSSettingsConfig = {
  fontSize: 14,
  cardSize: 'normal',
  colorScheme: 'default',
  showTimestamps: true,
  showCustomerNames: true,
  showOrderTotals: true,
  autoRefresh: true,
  refreshInterval: 5000,
  soundEnabled: true,
  soundVolume: 0.7,
  compactView: false,
  statusColors: {
    pending: '#ef4444',
    preparing: '#f59e0b',
    ready: '#10b981',
    completed: '#6b7280'
  }
};

interface KDSSettingsProps {
  onSettingsChange: (settings: KDSSettingsConfig) => void;
}

export const KDSSettings: React.FC<KDSSettingsProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<KDSSettingsConfig>(DEFAULT_SETTINGS);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('kds-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Error loading KDS settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage and notify parent
    localStorage.setItem('kds-settings', JSON.stringify(settings));
    onSettingsChange(settings);
  }, [settings, onSettingsChange]);

  const updateSetting = <K extends keyof KDSSettingsConfig>(
    key: K,
    value: KDSSettingsConfig[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const applyColorScheme = (scheme: string) => {
    const schemes = {
      default: {
        pending: '#ef4444',
        preparing: '#f59e0b',
        ready: '#10b981',
        completed: '#6b7280'
      },
      'high-contrast': {
        pending: '#dc2626',
        preparing: '#d97706',
        ready: '#059669',
        completed: '#374151'
      },
      'colorblind-friendly': {
        pending: '#7c3aed',
        preparing: '#0ea5e9',
        ready: '#10b981',
        completed: '#6b7280'
      }
    };

    const colors = schemes[scheme] || schemes.default;
    updateSetting('statusColors', colors);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 border-white/20 dark:border-gray-600/20"
        >
          <Settings className="w-4 h-4 mr-2" />
          Display Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            KDS Display Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Font and Display Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Type className="w-5 h-5" />
              Font & Display
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([value]) => updateSetting('fontSize', value)}
                  min={12}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{settings.fontSize}px</span>
              </div>
              
              <div className="space-y-2">
                <Label>Card Size</Label>
                <Select value={settings.cardSize} onValueChange={(value) => updateSetting('cardSize', value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Color Scheme */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Color Scheme
            </h3>
            
            <div className="space-y-2">
              <Label>Color Scheme</Label>
              <Select 
                value={settings.colorScheme} 
                onValueChange={(value) => {
                  updateSetting('colorScheme', value as any);
                  applyColorScheme(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="high-contrast">High Contrast</SelectItem>
                  <SelectItem value="colorblind-friendly">Colorblind Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status Colors</Label>
                <div className="space-y-2">
                  {Object.entries(settings.statusColors).map(([status, color]) => (
                    <div key={status} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm capitalize">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visibility Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Visibility
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.showTimestamps}
                  onCheckedChange={(checked) => updateSetting('showTimestamps', checked)}
                />
                <Label>Show Timestamps</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.showCustomerNames}
                  onCheckedChange={(checked) => updateSetting('showCustomerNames', checked)}
                />
                <Label>Show Customer Names</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.showOrderTotals}
                  onCheckedChange={(checked) => updateSetting('showOrderTotals', checked)}
                />
                <Label>Show Order Totals</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.compactView}
                  onCheckedChange={(checked) => updateSetting('compactView', checked)}
                />
                <Label>Compact View</Label>
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Audio
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                />
                <Label>Sound Enabled</Label>
              </div>
              
              {settings.soundEnabled && (
                <div className="space-y-2">
                  <Label>Volume</Label>
                  <Slider
                    value={[settings.soundVolume]}
                    onValueChange={([value]) => updateSetting('soundVolume', value)}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{Math.round(settings.soundVolume * 100)}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Refresh Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Auto Refresh</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.autoRefresh}
                  onCheckedChange={(checked) => updateSetting('autoRefresh', checked)}
                />
                <Label>Auto Refresh</Label>
              </div>
              
              {settings.autoRefresh && (
                <div className="space-y-2">
                  <Label>Refresh Interval</Label>
                  <Select 
                    value={settings.refreshInterval.toString()} 
                    onValueChange={(value) => updateSetting('refreshInterval', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2000">2 seconds</SelectItem>
                      <SelectItem value="5000">5 seconds</SelectItem>
                      <SelectItem value="10000">10 seconds</SelectItem>
                      <SelectItem value="30000">30 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={resetSettings}>
            Reset to Defaults
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Apply Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KDSSettings;