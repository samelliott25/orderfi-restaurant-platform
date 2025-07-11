import StandardLayout from '@/components/StandardLayout';
import KitchenDisplay from '@/components/KitchenDisplay';

export default function KitchenPage() {
  return (
    <StandardLayout 
      title="Kitchen Display System" 
      subtitle="Real-time order management and kitchen operations"
      showSidebar={false}
    >
      <KitchenDisplay />
    </StandardLayout>
  );
}