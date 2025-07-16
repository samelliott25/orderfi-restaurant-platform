import React from 'react';
import StandardLayout from '@/components/StandardLayout';
import GrokTextAnimationEnhancer from '@/components/GrokTextAnimationEnhancer';

export default function GrokTextEnhancerPage() {
  return (
    <StandardLayout 
      title="Grok Text Animation Enhancer" 
      subtitle="AI-powered text animation enhancement for OrderFi"
    >
      <div className="p-6">
        <GrokTextAnimationEnhancer />
      </div>
    </StandardLayout>
  );
}