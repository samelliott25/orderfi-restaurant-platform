import { StandardLayout } from "@/components/StandardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, Globe, Bell, Shield, Palette, Brain, Sparkles, Activity } from "lucide-react";
import { useState } from "react";
import { useLayoutOptimization } from "@/hooks/useLayoutOptimization";

export default function SettingsPage() {
  const [layoutAiEnabled, setLayoutAiEnabled] = useState(true);
  const [autoOptimize, setAutoOptimize] = useState(false);
  const { suggestions, isAnalyzing, analyzeLayoutOptimization } = useLayoutOptimization();

  const handleManualOptimization = () => {
    analyzeLayoutOptimization('settings', 'admin_panel', []);
  };

  return (
    <StandardLayout 
      title="Settings & Configuration"
      subtitle="Restaurant preferences, integrations, and system configuration"
    >
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Connected services</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active alerts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Level</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">High</div>
            <p className="text-xs text-muted-foreground">All systems secure</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Theme</CardTitle>
            <Palette className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">OrderFi</div>
            <p className="text-xs text-muted-foreground">Custom brand theme</p>
          </CardContent>
        </Card>
      </div>

      {/* Layout AI Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="carter-one-font flex items-center gap-2">
            <Brain className="h-5 w-5 text-orange-500" />
            Layout AI
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            AI-powered layout optimization analyzes your screen and usage patterns to suggest better dashboard arrangements.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Status */}
          <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-orange-800 dark:text-orange-200">AI Analysis Active</p>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  {suggestions.length} suggestions available
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-orange-300 text-orange-700">
              Enabled
            </Badge>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Enable Layout AI</label>
                <Switch checked={layoutAiEnabled} onCheckedChange={setLayoutAiEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto-optimize layouts</label>
                <Switch checked={autoOptimize} onCheckedChange={setAutoOptimize} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={handleManualOptimization}
                disabled={isAnalyzing || !layoutAiEnabled}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Generate Layout Suggestions'}
              </Button>
              <p className="text-xs text-muted-foreground">
                Analyze current screen and generate layout optimization suggestions
              </p>
            </div>
          </div>

          {/* Recent Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Recent AI Suggestions</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {suggestions.slice(0, 3).map((suggestion) => (
                  <div key={suggestion.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{suggestion.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
                        <Badge variant="outline" className="mt-2">
                          {Math.round(suggestion.confidence * 100)}% confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Content */}
      <Card>
        <CardHeader>
          <CardTitle className="carter-one-font">System Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Restaurant Profile</Badge>
              <Badge variant="outline">Payment Methods</Badge>
              <Badge variant="outline">Integrations</Badge>
              <Badge variant="outline">Notifications</Badge>
              <Badge variant="outline">Security Settings</Badge>
              <Badge variant="outline">Display Preferences</Badge>
              <Badge variant="outline">Layout AI</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </StandardLayout>
  );
}