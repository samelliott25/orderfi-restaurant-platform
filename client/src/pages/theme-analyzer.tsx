import React from 'react';
import ThemeAnalyzer from '@/components/ThemeAnalyzer';
import KleurvormDemo from '@/components/KleurvormDemo';
import { StandardLayout } from '@/components/StandardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ThemeAnalyzerPage: React.FC = () => {
  return (
    <StandardLayout 
      title="Theme Analysis"
      subtitle="Kleurvörm Color Palette Analysis & Application"
      showSidebar={true}
    >
      <Tabs defaultValue="demo" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="demo">Kleurvörm Demo</TabsTrigger>
          <TabsTrigger value="analyzer">Theme Analyzer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="demo" className="space-y-6">
          <KleurvormDemo />
        </TabsContent>
        
        <TabsContent value="analyzer" className="space-y-6">
          <ThemeAnalyzer />
        </TabsContent>
      </Tabs>
    </StandardLayout>
  );
};

export default ThemeAnalyzerPage;