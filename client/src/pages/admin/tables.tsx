import { useState } from 'react';
import StandardLayout from '@/components/StandardLayout';
import TableManagement from '@/components/TableManagement';
import FloorPlanView from '@/components/FloorPlanView';
import WaitlistManager from '@/components/WaitlistManager';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Grid3X3, List, Map, Users, ClipboardList } from 'lucide-react';

export default function TablesPage() {
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('tables');

  // Mock table data for FloorPlanView
  const mockTables = [
    { 
      id: '1', number: '1', capacity: 4, status: 'available', 
      x: 100, y: 150, width: 80, height: 80, rotation: 0, shape: 'rectangle' as const, section: 'main'
    },
    { 
      id: '2', number: '2', capacity: 2, status: 'occupied', 
      x: 200, y: 150, width: 60, height: 60, rotation: 0, shape: 'circle' as const, section: 'main',
      currentOrder: { id: '1', customerName: 'John Smith', startTime: new Date().toISOString(), items: 3, total: 45.50 }
    },
    { 
      id: '3', number: '3', capacity: 6, status: 'reserved', 
      x: 300, y: 200, width: 100, height: 80, rotation: 15, shape: 'rectangle' as const, section: 'main',
      reservations: [{ id: '1', customerName: 'Sarah Johnson', time: '7:00 PM', partySize: 6 }]
    },
    { 
      id: '4', number: '4', capacity: 4, status: 'cleaning', 
      x: 150, y: 300, width: 80, height: 80, rotation: 0, shape: 'square' as const, section: 'patio'
    },
  ];

  const handleTableUpdate = (tableId: string, updates: any) => {
    // In a real app, this would update the table in the backend
    console.log('Updating table:', tableId, updates);
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      {activeTab === 'tables' && (
        <>
          {/* View Toggle */}
          <div className="flex items-center liquid-glass-card p-1">
            <Button
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('card')}
              className="h-8 px-3 liquid-glass-nav-item"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 px-3 liquid-glass-nav-item"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Add Table Button */}
          <Button onClick={() => setIsAddTableOpen(true)} className="liquid-glass-nav-item">
            <Plus className="h-4 w-4 mr-2" />
            Add Table
          </Button>
        </>
      )}
    </div>
  );

  return (
    <StandardLayout 
      title="Restaurant Management" 
      subtitle="OpenTable-inspired table management, floorplan design, and waitlist operations"
      actions={headerActions}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 liquid-glass-card">
          <TabsTrigger value="tables" className="liquid-glass-nav-item">
            <ClipboardList className="h-4 w-4 mr-2" />
            Table Management
          </TabsTrigger>
          <TabsTrigger value="floorplan" className="liquid-glass-nav-item">
            <Map className="h-4 w-4 mr-2" />
            Floor Plan
          </TabsTrigger>
          <TabsTrigger value="waitlist" className="liquid-glass-nav-item">
            <Users className="h-4 w-4 mr-2" />
            Waitlist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-6">
          <TableManagement 
            isAddTableOpen={isAddTableOpen} 
            onAddTableOpenChange={setIsAddTableOpen}
            viewMode={viewMode}
          />
        </TabsContent>

        <TabsContent value="floorplan" className="space-y-6">
          <FloorPlanView
            tables={mockTables}
            onTableUpdate={handleTableUpdate}
            onTableSelect={setSelectedTable}
            selectedTable={selectedTable}
            viewMode="operations"
          />
        </TabsContent>

        <TabsContent value="waitlist" className="space-y-6">
          <WaitlistManager />
        </TabsContent>
      </Tabs>
    </StandardLayout>
  );
}