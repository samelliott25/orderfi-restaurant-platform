import { StandardLayoutWithSidebar } from "@/components/StandardLayoutWithSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Shield, Clock } from "lucide-react";

export default function StaffPage() {
  return (
    <StandardLayoutWithSidebar 
      title="Staff & Access Control"
      subtitle="Team management, roles, and security permissions"
    >
      <div className="p-6 space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">12</div>
              <p className="text-xs text-muted-foreground">Currently clocked in</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Shield className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">4</div>
              <p className="text-xs text-muted-foreground">Full access</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Week</CardTitle>
              <UserPlus className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">3</div>
              <p className="text-xs text-muted-foreground">Recently added</p>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon */}
        <Card>
          <CardHeader>
            <CardTitle className="playwrite-font" style={{ color: 'hsl(25, 95%, 53%)' }}>
              Staff & Access Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Advanced Staff Management</h3>
              <p className="text-muted-foreground mb-4">
                Complete team management with role-based access control, scheduling, and performance tracking.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">Role-Based Access</Badge>
                <Badge variant="outline">Time Tracking</Badge>
                <Badge variant="outline">Performance Analytics</Badge>
                <Badge variant="outline">Schedule Management</Badge>
                <Badge variant="outline">Security Controls</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StandardLayoutWithSidebar>
  );
}