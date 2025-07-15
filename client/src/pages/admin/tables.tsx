import { useState } from 'react';
import StandardLayout from '@/components/StandardLayout';
import TableManagement from '@/components/TableManagement';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function TablesPage() {
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);

  return (
    <StandardLayout 
      title="Table Management" 
      subtitle="Manage tables, reservations, and customer seating"
    >
      <div className="flex items-center justify-between mb-6">
        <div></div>
        <Button onClick={() => setIsAddTableOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Table
        </Button>
      </div>
      <TableManagement isAddTableOpen={isAddTableOpen} onAddTableOpenChange={setIsAddTableOpen} />
    </StandardLayout>
  );
}