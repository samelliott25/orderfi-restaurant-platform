import { StandardLayout } from "@/components/StandardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Shield, Clock } from "lucide-react";
import "@/styles/mobile-fix.css";

export default function StaffPage() {
  return (
    <StandardLayout 
      title="Staff & Access Control"
      subtitle="Team management, roles, and security permissions"
    >
      <div data-testid="staff-page" className="space-y-6">
        {/* Header Stats - Responsive Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Staff</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">24</p>
              <p className="text-xs text-muted-foreground">+2 this month</p>
            </div>
            <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Now</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">12</p>
              <p className="text-xs text-muted-foreground">Currently clocked in</p>
            </div>
            <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">New This Month</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">3</p>
              <p className="text-xs text-muted-foreground">Recent hires</p>
            </div>
            <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Access Levels</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">5</p>
              <p className="text-xs text-muted-foreground">Permission groups</p>
            </div>
            <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Staff Management Content */}
      <Card>
        <CardHeader>
          <CardTitle className="playwrite-font">Staff Management System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Employee Management</Badge>
              <Badge variant="outline">Role-Based Access</Badge>
              <Badge variant="outline">Time Tracking</Badge>
              <Badge variant="outline">Performance Metrics</Badge>
              <Badge variant="outline">Scheduling</Badge>
              <Badge variant="outline">Security Controls</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </StandardLayout>
  );
}