import { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Clock, 
  MapPin,
  Phone,
  Mail,
  Settings,
  ExternalLink,
  Zap,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload
} from "lucide-react";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  department: 'FOH' | 'BOH';
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'on-break';
  shift: string;
  hourlyRate: number;
  startDate: string;
}

interface ShiftSlot {
  id: string;
  staffId: number;
  staffName: string;
  role: string;
  startTime: string;
  endTime: string;
  department: 'FOH' | 'BOH';
  status: 'scheduled' | 'confirmed' | 'no-show' | 'completed';
}

interface WFMIntegration {
  name: string;
  connected: boolean;
  logo: string;
  description: string;
  features: string[];
}

export default function AdminUsersPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<'ALL' | 'FOH' | 'BOH'>('ALL');
  
  const [staffMembers] = useState<StaffMember[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Server",
      department: "FOH",
      email: "sarah@restaurant.com",
      phone: "(555) 123-4567",
      status: "active",
      shift: "Morning",
      hourlyRate: 16.50,
      startDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Head Chef",
      department: "BOH",
      email: "mike@restaurant.com",
      phone: "(555) 234-5678",
      status: "active",
      shift: "Evening",
      hourlyRate: 28.00,
      startDate: "2023-08-20"
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "Host",
      department: "FOH",
      email: "emma@restaurant.com",
      phone: "(555) 345-6789",
      status: "active",
      shift: "Evening",
      hourlyRate: 15.00,
      startDate: "2024-03-10"
    },
    {
      id: 4,
      name: "James Wilson",
      role: "Line Cook",
      department: "BOH",
      email: "james@restaurant.com",
      phone: "(555) 456-7890",
      status: "on-break",
      shift: "Morning",
      hourlyRate: 18.50,
      startDate: "2024-02-05"
    },
    {
      id: 5,
      name: "Lisa Rodriguez",
      role: "Bartender",
      department: "FOH",
      email: "lisa@restaurant.com",
      phone: "(555) 567-8901",
      status: "active",
      shift: "Evening",
      hourlyRate: 17.25,
      startDate: "2024-01-28"
    }
  ]);

  const [weeklySchedule] = useState<Record<string, ShiftSlot[]>>({
    'Monday': [
      { id: '1', staffId: 1, staffName: 'Sarah Johnson', role: 'Server', startTime: '09:00', endTime: '17:00', department: 'FOH', status: 'confirmed' },
      { id: '2', staffId: 4, staffName: 'James Wilson', role: 'Line Cook', startTime: '08:00', endTime: '16:00', department: 'BOH', status: 'scheduled' },
    ],
    'Tuesday': [
      { id: '3', staffId: 2, staffName: 'Mike Chen', role: 'Head Chef', startTime: '15:00', endTime: '23:00', department: 'BOH', status: 'confirmed' },
      { id: '4', staffId: 3, staffName: 'Emma Davis', role: 'Host', startTime: '17:00', endTime: '01:00', department: 'FOH', status: 'confirmed' },
      { id: '5', staffId: 5, staffName: 'Lisa Rodriguez', role: 'Bartender', startTime: '18:00', endTime: '02:00', department: 'FOH', status: 'scheduled' },
    ],
    'Wednesday': [
      { id: '6', staffId: 1, staffName: 'Sarah Johnson', role: 'Server', startTime: '09:00', endTime: '17:00', department: 'FOH', status: 'confirmed' },
      { id: '7', staffId: 2, staffName: 'Mike Chen', role: 'Head Chef', startTime: '15:00', endTime: '23:00', department: 'BOH', status: 'confirmed' },
    ],
    'Thursday': [
      { id: '8', staffId: 3, staffName: 'Emma Davis', role: 'Host', startTime: '17:00', endTime: '01:00', department: 'FOH', status: 'scheduled' },
      { id: '9', staffId: 4, staffName: 'James Wilson', role: 'Line Cook', startTime: '08:00', endTime: '16:00', department: 'BOH', status: 'no-show' },
      { id: '10', staffId: 5, staffName: 'Lisa Rodriguez', role: 'Bartender', startTime: '18:00', endTime: '02:00', department: 'FOH', status: 'confirmed' },
    ],
    'Friday': [
      { id: '11', staffId: 1, staffName: 'Sarah Johnson', role: 'Server', startTime: '09:00', endTime: '17:00', department: 'FOH', status: 'completed' },
      { id: '12', staffId: 2, staffName: 'Mike Chen', role: 'Head Chef', startTime: '15:00', endTime: '23:00', department: 'BOH', status: 'completed' },
      { id: '13', staffId: 3, staffName: 'Emma Davis', role: 'Host', startTime: '17:00', endTime: '01:00', department: 'FOH', status: 'completed' },
      { id: '14', staffId: 5, staffName: 'Lisa Rodriguez', role: 'Bartender', startTime: '18:00', endTime: '02:00', department: 'FOH', status: 'completed' },
    ],
    'Saturday': [
      { id: '15', staffId: 1, staffName: 'Sarah Johnson', role: 'Server', startTime: '10:00', endTime: '18:00', department: 'FOH', status: 'scheduled' },
      { id: '16', staffId: 2, staffName: 'Mike Chen', role: 'Head Chef', startTime: '14:00', endTime: '22:00', department: 'BOH', status: 'scheduled' },
      { id: '17', staffId: 3, staffName: 'Emma Davis', role: 'Host', startTime: '16:00', endTime: '00:00', department: 'FOH', status: 'scheduled' },
      { id: '18', staffId: 5, staffName: 'Lisa Rodriguez', role: 'Bartender', startTime: '17:00', endTime: '01:00', department: 'FOH', status: 'scheduled' },
    ],
    'Sunday': [
      { id: '19', staffId: 1, staffName: 'Sarah Johnson', role: 'Server', startTime: '11:00', endTime: '19:00', department: 'FOH', status: 'scheduled' },
      { id: '20', staffId: 4, staffName: 'James Wilson', role: 'Line Cook', startTime: '10:00', endTime: '18:00', department: 'BOH', status: 'scheduled' },
    ]
  });

  const [wfmIntegrations] = useState<WFMIntegration[]>([
    {
      name: "Deputy",
      connected: true,
      logo: "🏢",
      description: "Complete workforce management with scheduling, timesheets, and payroll integration",
      features: ["Auto-scheduling", "Time tracking", "Payroll integration", "Mobile app", "Compliance reporting"]
    },
    {
      name: "Tanda",
      connected: false,
      logo: "📋",
      description: "Smart rostering and workforce optimization for hospitality businesses",
      features: ["Smart rostering", "Staff communication", "Award interpretation", "Budget forecasting", "Performance tracking"]
    },
    {
      name: "When I Work",
      connected: false,
      logo: "⏰",
      description: "Simple employee scheduling and time tracking solution",
      features: ["Easy scheduling", "Team messaging", "Time clock", "Availability management", "Labor cost tracking"]
    },
    {
      name: "Humanity",
      connected: false,
      logo: "👥",
      description: "Advanced workforce management with AI-powered scheduling",
      features: ["AI scheduling", "Demand forecasting", "Employee self-service", "Advanced reporting", "Multi-location support"]
    }
  ]);

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'no-show': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStaffStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on-break': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStaff = selectedDepartment === 'ALL' 
    ? staffMembers 
    : staffMembers.filter(staff => staff.department === selectedDepartment);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const getWeekRange = () => {
    const start = new Date(currentWeek);
    const end = new Date(currentWeek);
    end.setDate(end.getDate() + 6);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#654321' }}>
              Staffing Costs & Management
            </h1>
            <p className="text-sm" style={{ color: '#8b795e' }}>
              Track labor costs, budget analysis, and workforce expenses
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" style={{ borderColor: '#8b795e', color: '#654321' }}>
              <Download className="h-4 w-4 mr-2" />
              Export Schedule
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#8b795e] hover:bg-[#6d5d4f] text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent style={{ backgroundColor: '#fff0cc' }}>
                <DialogHeader>
                  <DialogTitle style={{ color: '#654321' }}>Add New Staff Member</DialogTitle>
                  <DialogDescription style={{ color: '#8b795e' }}>
                    Add a new team member to your restaurant staff
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label style={{ color: '#654321' }}>Full Name</Label>
                      <Input placeholder="Enter full name" />
                    </div>
                    <div>
                      <Label style={{ color: '#654321' }}>Email</Label>
                      <Input type="email" placeholder="email@restaurant.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label style={{ color: '#654321' }}>Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="server">Server</SelectItem>
                          <SelectItem value="host">Host</SelectItem>
                          <SelectItem value="bartender">Bartender</SelectItem>
                          <SelectItem value="chef">Chef</SelectItem>
                          <SelectItem value="cook">Line Cook</SelectItem>
                          <SelectItem value="dishwasher">Dishwasher</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label style={{ color: '#654321' }}>Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FOH">Front of House (FOH)</SelectItem>
                          <SelectItem value="BOH">Back of House (BOH)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label style={{ color: '#654321' }}>Phone</Label>
                      <Input placeholder="(555) 123-4567" />
                    </div>
                    <div>
                      <Label style={{ color: '#654321' }}>Hourly Rate</Label>
                      <Input type="number" placeholder="15.00" />
                    </div>
                  </div>
                  <Button className="w-full bg-[#8b795e] hover:bg-[#6d5d4f] text-white">
                    Add Staff Member
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="costs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="costs">Staffing Costs</TabsTrigger>
            <TabsTrigger value="staff">Staff Directory</TabsTrigger>
            <TabsTrigger value="integrations">WFM Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="costs" className="space-y-6">
            {/* Cost Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm" style={{ color: '#654321' }}>
                    Monthly Labor Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1" style={{ color: '#654321' }}>
                    $18,425
                  </div>
                  <p className="text-xs text-green-600">
                    -8.5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm" style={{ color: '#654321' }}>
                    Labor Cost %
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1" style={{ color: '#654321' }}>
                    28.3%
                  </div>
                  <p className="text-xs" style={{ color: '#8b795e' }}>
                    of total revenue
                  </p>
                </CardContent>
              </Card>

              <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm" style={{ color: '#654321' }}>
                    Budget Remaining
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1" style={{ color: '#654321' }}>
                    $3,250
                  </div>
                  <p className="text-xs" style={{ color: '#8b795e' }}>
                    15% of monthly budget
                  </p>
                </CardContent>
              </Card>

              <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm" style={{ color: '#654321' }}>
                    Avg. Hourly Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1" style={{ color: '#654321' }}>
                    $18.85
                  </div>
                  <p className="text-xs" style={{ color: '#8b795e' }}>
                    Across all positions
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Department Cost Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
                <CardHeader>
                  <CardTitle style={{ color: '#654321' }}>Department Cost Breakdown</CardTitle>
                  <CardDescription style={{ color: '#8b795e' }}>
                    Labor costs by FOH and BOH departments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#e8f5e8', border: '1px solid #c8e6c8' }}>
                      <div>
                        <div className="font-medium" style={{ color: '#654321' }}>Front of House (FOH)</div>
                        <div className="text-sm" style={{ color: '#8b795e' }}>Servers, Hosts, Bartenders</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold" style={{ color: '#654321' }}>$11,200</div>
                        <div className="text-xs" style={{ color: '#8b795e' }}>60.8% of total</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#e8f0ff', border: '1px solid #c8e0ff' }}>
                      <div>
                        <div className="font-medium" style={{ color: '#654321' }}>Back of House (BOH)</div>
                        <div className="text-sm" style={{ color: '#8b795e' }}>Chefs, Line Cooks, Prep</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold" style={{ color: '#654321' }}>$7,225</div>
                        <div className="text-xs" style={{ color: '#8b795e' }}>39.2% of total</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
                <CardHeader>
                  <CardTitle style={{ color: '#654321' }}>Cost Trends</CardTitle>
                  <CardDescription style={{ color: '#8b795e' }}>
                    Labor cost trends over the last 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { month: 'Jan', cost: 19250, change: '+5.2%' },
                      { month: 'Feb', cost: 18750, change: '-2.6%' },
                      { month: 'Mar', cost: 19850, change: '+5.9%' },
                      { month: 'Apr', cost: 18950, change: '-4.5%' },
                      { month: 'May', cost: 20150, change: '+6.3%' },
                      { month: 'Jun', cost: 18425, change: '-8.5%' }
                    ].map((month, index) => (
                      <div key={month.month} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 text-sm font-medium" style={{ color: '#654321' }}>
                            {month.month}
                          </div>
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#8b795e] h-2 rounded-full" 
                                style={{ width: `${(month.cost / 25000) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium" style={{ color: '#654321' }}>
                            ${month.cost.toLocaleString()}
                          </div>
                          <div className={`text-xs ${month.change.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                            {month.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget Analysis */}
            <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
              <CardHeader>
                <CardTitle style={{ color: '#654321' }}>Budget Analysis & Forecasting</CardTitle>
                <CardDescription style={{ color: '#8b795e' }}>
                  Monthly budget tracking and cost optimization insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold" style={{ color: '#654321' }}>Budget Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#8b795e' }}>Monthly Budget:</span>
                        <span className="font-medium" style={{ color: '#654321' }}>$21,675</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#8b795e' }}>Current Spend:</span>
                        <span className="font-medium" style={{ color: '#654321' }}>$18,425</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#8b795e' }}>Remaining:</span>
                        <span className="font-medium text-green-600">$3,250</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#8b795e] h-2 rounded-full" 
                          style={{ width: '85%' }}
                        ></div>
                      </div>
                      <p className="text-xs" style={{ color: '#8b795e' }}>85% of budget used</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold" style={{ color: '#654321' }}>Cost Optimization</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#654321' }}>Reduced overtime costs</p>
                          <p className="text-xs" style={{ color: '#8b795e' }}>Saved $850 this month</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#654321' }}>Optimized shift patterns</p>
                          <p className="text-xs" style={{ color: '#8b795e' }}>Better coverage efficiency</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#654321' }}>Cross-training impact</p>
                          <p className="text-xs" style={{ color: '#8b795e' }}>Reduced hiring needs</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold" style={{ color: '#654321' }}>Next Month Forecast</h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
                        <div className="text-lg font-bold mb-1" style={{ color: '#654321' }}>
                          $19,200
                        </div>
                        <p className="text-xs" style={{ color: '#8b795e' }}>
                          Projected labor cost
                        </p>
                      </div>
                      <div className="text-xs space-y-1" style={{ color: '#8b795e' }}>
                        <div>+ Holiday premium: $400</div>
                        <div>+ New hire training: $300</div>
                        <div>- Efficiency gains: -$125</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            {/* Staff Directory */}
            <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
              <CardHeader>
                <CardTitle style={{ color: '#654321' }}>Staff Directory</CardTitle>
                <CardDescription style={{ color: '#8b795e' }}>
                  Complete list of all restaurant staff members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStaff.map((staff) => (
                    <div 
                      key={staff.id} 
                      className="flex items-center justify-between p-4 rounded-lg border"
                      style={{ backgroundColor: '#f8f9fa', borderColor: '#e5cf97' }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#8b795e] flex items-center justify-center text-white font-semibold">
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold" style={{ color: '#654321' }}>
                            {staff.name}
                          </h3>
                          <p className="text-sm" style={{ color: '#8b795e' }}>
                            {staff.role} • {staff.department}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs flex items-center gap-1" style={{ color: '#8b795e' }}>
                              <Mail className="h-3 w-3" />
                              {staff.email}
                            </span>
                            <span className="text-xs flex items-center gap-1" style={{ color: '#8b795e' }}>
                              <Phone className="h-3 w-3" />
                              {staff.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-semibold" style={{ color: '#654321' }}>
                            ${staff.hourlyRate}/hr
                          </div>
                          <div className="text-xs" style={{ color: '#8b795e' }}>
                            {staff.shift} shift
                          </div>
                        </div>
                        <Badge className={getStaffStatusColor(staff.status)}>
                          {staff.status}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          style={{ borderColor: '#8b795e', color: '#654321' }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            {/* WFM Integrations */}
            <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
              <CardHeader>
                <CardTitle style={{ color: '#654321' }}>Workforce Management Integrations</CardTitle>
                <CardDescription style={{ color: '#8b795e' }}>
                  Connect with external WFM apps to sync schedules, timesheets, and payroll
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {wfmIntegrations.map((integration) => (
                  <div 
                    key={integration.name}
                    className="flex items-start justify-between p-4 rounded-lg border"
                    style={{ backgroundColor: '#f8f9fa', borderColor: '#e5cf97' }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">
                        {integration.logo}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold" style={{ color: '#654321' }}>
                            {integration.name}
                          </h3>
                          {integration.connected ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Connected
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Not Connected
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm mb-3" style={{ color: '#8b795e' }}>
                          {integration.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {integration.features.map((feature, idx) => (
                            <Badge 
                              key={idx} 
                              variant="outline" 
                              className="text-xs"
                              style={{ borderColor: '#8b795e', color: '#654321' }}
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {integration.connected ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            style={{ borderColor: '#8b795e', color: '#654321' }}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            style={{ borderColor: '#8b795e', color: '#654321' }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Sync Now
                          </Button>
                        </>
                      ) : (
                        <Button 
                          className="bg-[#8b795e] hover:bg-[#6d5d4f] text-white"
                          size="sm"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        style={{ borderColor: '#8b795e', color: '#654321' }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Integration Benefits */}
            <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
              <CardHeader>
                <CardTitle style={{ color: '#654321' }}>Integration Benefits</CardTitle>
                <CardDescription style={{ color: '#8b795e' }}>
                  Why connect your workforce management tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: '#654321' }}>
                          Automated Scheduling
                        </h4>
                        <p className="text-sm" style={{ color: '#8b795e' }}>
                          Sync schedules automatically between MIMI and your WFM system
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: '#654321' }}>
                          Real-time Updates
                        </h4>
                        <p className="text-sm" style={{ color: '#8b795e' }}>
                          Changes in one system automatically reflect in the other
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: '#654321' }}>
                          Staff Communication
                        </h4>
                        <p className="text-sm" style={{ color: '#8b795e' }}>
                          Unified messaging and notifications across all platforms
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: '#654321' }}>
                          Compliance Tracking
                        </h4>
                        <p className="text-sm" style={{ color: '#8b795e' }}>
                          Ensure labor law compliance with integrated reporting
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}