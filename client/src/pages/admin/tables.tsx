import { useState } from 'react';
import StandardLayout from '@/components/StandardLayout';
import TableManagement from '@/components/TableManagement';
import { Button } from '@/components/ui/button';
import { Plus, Grid3X3, List } from 'lucide-react';

export default function TablesPage() {
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const headerActions = (
    <div className="flex items-center gap-2">
      {/* View Toggle */}
      <div className="flex items-center border rounded-lg p-1 bg-background">
        <Button
          variant={viewMode === 'card' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('card')}
          className="h-8 px-3"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('list')}
          className="h-8 px-3"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Add Table Button */}
      <Button onClick={() => setIsAddTableOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Table
      </Button>
    </div>
  );

  return (
    <StandardLayout 
      title="Table Management" 
      subtitle="Manage tables, reservations, and customer seating"
      actions={headerActions}
    >
      <TableManagement 
        isAddTableOpen={isAddTableOpen} 
        onAddTableOpenChange={setIsAddTableOpen}
        viewMode={viewMode}
      />
    </StandardLayout>
  );
}