import { StandardLayoutWithSidebar } from "@/components/StandardLayoutWithSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Globe, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <StandardLayoutWithSidebar 
      title="Settings & Configuration"
      subtitle="Restaurant preferences, integrations, and system configuration"
    >
      <div className="p-6 space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Settings className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Integrations</CardTitle>
              <Globe className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">7</div>
              <p className="text-xs text-muted-foreground">Active connections</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">12</div>
              <p className="text-xs text-muted-foreground">Active alerts</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security</CardTitle>
              <Shield className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">High</div>
              <p className="text-xs text-muted-foreground">Security level</p>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon */}
        <Card>
          <CardHeader>
            <CardTitle className="playwrite-font" style={{ color: 'hsl(25, 95%, 53%)' }}>
              Advanced Settings & Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Comprehensive System Configuration</h3>
              <p className="text-muted-foreground mb-4">
                Complete restaurant settings with integrations, notifications, security, and customization options.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">Restaurant Profile</Badge>
                <Badge variant="outline">Payment Integration</Badge>
                <Badge variant="outline">API Configuration</Badge>
                <Badge variant="outline">Security Settings</Badge>
                <Badge variant="outline">Notification Rules</Badge>
                <Badge variant="outline">Theme Customization</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StandardLayoutWithSidebar>
  );
}