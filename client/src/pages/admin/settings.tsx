import { StandardLayout } from "@/components/StandardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Globe, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
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

      {/* Settings Content */}
      <Card>
        <CardHeader>
          <CardTitle className="playwrite-font">System Configuration</CardTitle>
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
            </div>
          </div>
        </CardContent>
      </Card>
    </StandardLayout>
  );
}