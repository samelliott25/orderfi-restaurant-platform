import StandardLayout from '@/components/StandardLayout';
import TableManagement from '@/components/TableManagement';

export default function TablesPage() {
  return (
    <StandardLayout 
      title="Table Management" 
      subtitle="Manage tables, reservations, and customer seating"
    >
      <TableManagement />
    </StandardLayout>
  );
}