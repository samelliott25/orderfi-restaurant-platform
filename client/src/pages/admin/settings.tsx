import { StandardLayout } from "@/components/StandardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Globe, Bell, Shield, Palette, Brain, Sparkles, Activity, Store, Clock, Users, CreditCard } from "lucide-react";
import { useState } from "react";
import "@/styles/mobile-fix.css";

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoReorder, setAutoReorder] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  return (
    <StandardLayout 
      title="Settings & Configuration"
      subtitle="Restaurant preferences, integrations, and system configuration"
    >
      <div data-testid="settings-page" className="p-2 sm:p-4 lg:p-6 w-full overflow-x-hidden settings-mobile-fix" style={{ width: '100%', maxWidth: '100%' }}>
        {/* Header Stats */}
        <div className="flex flex-col space-y-3 mb-6 w-full">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Connected services</p>
            </CardContent>
          </Card>
        
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Active alerts</p>
            </CardContent>
          </Card>
          
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Level</CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">High</div>
              <p className="text-xs text-muted-foreground">All systems secure</p>
            </CardContent>
          </Card>
          
          <Card className="w-full">
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

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-4 w-full overflow-x-hidden">
          <div className="w-full overflow-x-hidden">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="general" className="text-xs sm:text-sm">General</TabsTrigger>
              <TabsTrigger value="restaurant" className="text-xs sm:text-sm">Restaurant</TabsTrigger>
              <TabsTrigger value="integrations" className="text-xs sm:text-sm">Integrations</TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notifications</TabsTrigger>
            </TabsList>
          </div>
        
        <TabsContent value="general" className="space-y-4 w-full overflow-x-hidden">
          <Card className="w-full overflow-x-hidden">
            <CardHeader>
              <CardTitle className="rock-salt-font flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-500" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-reorder">Auto-reorder Stock</Label>
                    <Switch id="auto-reorder" checked={autoReorder} onCheckedChange={setAutoReorder} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="voice">Voice Recognition</Label>
                    <Switch id="voice" checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" value="Australia/Sydney" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Input id="language" value="English" disabled />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="restaurant" className="space-y-4 w-full overflow-x-hidden">
          <Card className="w-full overflow-x-hidden">
            <CardHeader>
              <CardTitle className="rock-salt-font flex items-center gap-2">
                <Store className="h-5 w-5 text-orange-500" />
                Restaurant Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="restaurant-name">Restaurant Name</Label>
                    <Input id="restaurant-name" value="Loose Moose" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cuisine">Cuisine Type</Label>
                    <Input id="cuisine" value="Modern Australian" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+61 2 1234 5678" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" placeholder="Restaurant address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value="A modern Australian pub offering fresh, locally-sourced dishes with creative twists on classic favorites." />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-4 w-full overflow-x-hidden">
          <Card className="w-full overflow-x-hidden">
            <CardHeader>
              <CardTitle className="rock-salt-font flex items-center gap-2">
                <Globe className="h-5 w-5 text-orange-500" />
                Connected Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 w-full min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full min-w-0">
                <div className="p-3 sm:p-4 border rounded-lg w-full min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full min-w-0">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base truncate">Stripe Payments</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">Payment processing</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 self-start sm:self-center">
                      Connected
                    </Badge>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4 border rounded-lg w-full min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full min-w-0">
                    <div className="flex items-center gap-3">
                      <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base truncate">OpenAI GPT-4</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">AI chat assistant</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 self-start sm:self-center">
                      Connected
                    </Badge>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4 border rounded-lg w-full min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full min-w-0">
                    <div className="flex items-center gap-3">
                      <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base truncate">Blockchain Network</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">Web3 payments</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 self-start sm:self-center">
                      Connected
                    </Badge>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4 border rounded-lg w-full min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full min-w-0">
                    <div className="flex items-center gap-3">
                      <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base truncate">Kitchen Printer</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">Order printing</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 self-start sm:self-center">
                      Setup Required
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 w-full overflow-x-hidden">
          <Card className="w-full overflow-x-hidden">
            <CardHeader>
              <CardTitle className="rock-salt-font flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1">
                    <Label htmlFor="order-notifications" className="text-sm sm:text-base">New Order Alerts</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">Get notified when new orders arrive</p>
                  </div>
                  <Switch id="order-notifications" checked={true} />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1">
                    <Label htmlFor="low-stock" className="text-sm sm:text-base">Low Stock Warnings</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">Alert when inventory runs low</p>
                  </div>
                  <Switch id="low-stock" checked={true} />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1">
                    <Label htmlFor="payment-alerts" className="text-sm sm:text-base">Payment Notifications</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">Notify on successful payments</p>
                  </div>
                  <Switch id="payment-alerts" checked={false} />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1">
                    <Label htmlFor="system-updates" className="text-sm sm:text-base">System Updates</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">Important system notifications</p>
                  </div>
                  <Switch id="system-updates" checked={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
    </StandardLayout>
  );
}