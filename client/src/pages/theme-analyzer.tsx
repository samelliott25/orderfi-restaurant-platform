import React from 'react';
import ThemeAnalyzer from '@/components/ThemeAnalyzer';
import { StandardLayout } from '@/components/StandardLayout';

const ThemeAnalyzerPage: React.FC = () => {
  return (
    <StandardLayout 
      title="Theme Analysis"
      subtitle="Kleurvörm Color Palette Analysis & Application"
      showSidebar={true}
    >
      <ThemeAnalyzer />
    </StandardLayout>
  );
};

export default ThemeAnalyzerPage;