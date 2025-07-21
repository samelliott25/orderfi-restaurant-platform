import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Clock, 
  MessageCircle, 
  Plus,
  UserCheck,
  ChevronUp,
  ChevronDown,
  X,
  Phone,
  Timer
} from 'lucide-react';

interface WaitlistEntry {
  id: string;
  customerName: string;
  phoneNumber: string;
  partySize: number;
  joinedAt: string;
  estimatedWait: number; // minutes
  status: 'waiting' | 'notified' | 'seated' | 'cancelled';
  notes?: string;
  position: number;
}

interface WaitlistManagerProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const WaitlistManager: React.FC<WaitlistManagerProps> = ({
  isOpen = false,
  onOpenChange = () => {}
}) => {
  const [newEntry, setNewEntry] = useState({
    customerName: '',
    phoneNumber: '',
    partySize: 2,
    notes: ''
  });
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch waitlist
  const { data: waitlist = [], isLoading } = useQuery<WaitlistEntry[]>({
    queryKey: ['/api/waitlist'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Add to waitlist mutation
  const addToWaitlistMutation = useMutation({
    mutationFn: (entry: any) => apiRequest('/api/waitlist', {
      method: 'POST',
      body: entry
    }),
    onSuccess: () => {
      toast({
        title: "Added to Waitlist",
        description: "Customer has been added to the waitlist.",
      });
      setIsAddEntryOpen(false);
      setNewEntry({ customerName: '', phoneNumber: '', partySize: 2, notes: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add to waitlist.",
        variant: "destructive",
      });
    },
  });

  // Update waitlist status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ entryId, status }: { entryId: string; status: string }) => 
      apiRequest(`/api/waitlist/${entryId}/status`, {
        method: 'PATCH',
        body: { status }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist'] });
    },
  });

  // Send notification mutation
  const sendNotificationMutation = useMutation({
    mutationFn: (entryId: string) => 
      apiRequest(`/api/waitlist/${entryId}/notify`, {
        method: 'POST'
      }),
    onSuccess: () => {
      toast({
        title: "Notification Sent",
        description: "SMS notification has been sent to the customer.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist'] });
    },
  });

  // Remove from waitlist mutation
  const removeFromWaitlistMutation = useMutation({
    mutationFn: (entryId: string) => 
      apiRequest(`/api/waitlist/${entryId}`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      toast({
        title: "Removed from Waitlist",
        description: "Customer has been removed from the waitlist.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist'] });
    },
  });

  const getWaitTime = (joinedAt: string) => {
    const joined = new Date(joinedAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - joined.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return { label: 'Waiting', className: 'bg-blue-500 text-white', icon: Clock };
      case 'notified':
        return { label: 'Notified', className: 'bg-amber-500 text-white', icon: MessageCircle };
      case 'seated':
        return { label: 'Seated', className: 'bg-green-500 text-white', icon: UserCheck };
      case 'cancelled':
        return { label: 'Cancelled', className: 'bg-gray-500 text-white', icon: X };
      default:
        return { label: 'Unknown', className: 'bg-gray-500 text-white', icon: Clock };
    }
  };

  const activeWaitlist = waitlist.filter(entry => entry.status !== 'seated' && entry.status !== 'cancelled');
  const averageWaitTime = activeWaitlist.length > 0 
    ? Math.round(activeWaitlist.reduce((acc, entry) => acc + entry.estimatedWait, 0) / activeWaitlist.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Waitlist Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="liquid-glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{activeWaitlist.length}</div>
                <div className="text-sm text-muted-foreground">Waiting</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="liquid-glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Timer className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-2xl font-bold">{averageWaitTime}m</div>
                <div className="text-sm text-muted-foreground">Avg. Wait</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="liquid-glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {waitlist.filter(e => e.status === 'notified').length}
                </div>
                <div className="text-sm text-muted-foreground">Notified</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add to Waitlist */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Current Waitlist</h3>
        <Dialog open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
          <DialogTrigger asChild>
            <Button className="liquid-glass-nav-item">
              <Plus className="w-4 h-4 mr-2" />
              Add to Waitlist
            </Button>
          </DialogTrigger>
          <DialogContent className="liquid-glass-card">
            <DialogHeader>
              <DialogTitle>Add to Waitlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer-name">Customer Name</Label>
                <Input
                  id="customer-name"
                  value={newEntry.customerName}
                  onChange={(e) => setNewEntry({ ...newEntry, customerName: e.target.value })}
                  placeholder="Enter customer name"
                  className="liquid-glass-card"
                />
              </div>
              <div>
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  value={newEntry.phoneNumber}
                  onChange={(e) => setNewEntry({ ...newEntry, phoneNumber: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="liquid-glass-card"
                />
              </div>
              <div>
                <Label htmlFor="party-size">Party Size</Label>
                <Select 
                  value={newEntry.partySize.toString()} 
                  onValueChange={(value) => setNewEntry({ ...newEntry, partySize: parseInt(value) })}
                >
                  <SelectTrigger className="liquid-glass-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 person</SelectItem>
                    <SelectItem value="2">2 people</SelectItem>
                    <SelectItem value="3">3 people</SelectItem>
                    <SelectItem value="4">4 people</SelectItem>
                    <SelectItem value="5">5 people</SelectItem>
                    <SelectItem value="6">6 people</SelectItem>
                    <SelectItem value="7">7 people</SelectItem>
                    <SelectItem value="8">8 people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  placeholder="Special requests, allergies, etc."
                  className="liquid-glass-card"
                />
              </div>
              <Button 
                onClick={() => addToWaitlistMutation.mutate(newEntry)}
                disabled={!newEntry.customerName || !newEntry.phoneNumber || addToWaitlistMutation.isPending}
                className="w-full liquid-glass-nav-item"
              >
                Add to Waitlist
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Waitlist Entries */}
      <div className="space-y-3">
        {activeWaitlist.length === 0 ? (
          <Card className="liquid-glass-card">
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                No customers waiting
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                New waitlist entries will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          activeWaitlist.map((entry, index) => {
            const statusBadge = getStatusBadge(entry.status);
            const StatusIcon = statusBadge.icon;

            return (
              <Card key={entry.id} className="liquid-glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold">{entry.customerName}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{entry.partySize} people</span>
                          <Phone className="w-4 h-4 ml-2" />
                          <span>{entry.phoneNumber}</span>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {getWaitTime(entry.joinedAt)} waiting
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Est. {entry.estimatedWait}m total
                        </div>
                      </div>

                      <Badge className={statusBadge.className}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusBadge.label}
                      </Badge>

                      <div className="flex space-x-1">
                        {entry.status === 'waiting' && (
                          <Button
                            size="sm"
                            onClick={() => sendNotificationMutation.mutate(entry.id)}
                            disabled={sendNotificationMutation.isPending}
                            className="liquid-glass-nav-item"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {(entry.status === 'waiting' || entry.status === 'notified') && (
                          <Button
                            size="sm"
                            onClick={() => updateStatusMutation.mutate({ entryId: entry.id, status: 'seated' })}
                            disabled={updateStatusMutation.isPending}
                            className="liquid-glass-nav-item bg-green-600 hover:bg-green-700"
                          >
                            <UserCheck className="w-4 h-4" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromWaitlistMutation.mutate(entry.id)}
                          disabled={removeFromWaitlistMutation.isPending}
                          className="liquid-glass-nav-item text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WaitlistManager;