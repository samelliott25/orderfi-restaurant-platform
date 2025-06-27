import { useEffect } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  apiLatency: number;
}

export function usePerformance() {
  useEffect(() => {
    // Performance monitoring
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log('Page Load Time:', navEntry.loadEventEnd - navEntry.navigationStart);
        }
        
        if (entry.entryType === 'measure') {
          console.log(`${entry.name}: ${entry.duration}ms`);
        }
      }
    });

    observer.observe({ entryTypes: ['navigation', 'measure'] });

    return () => observer.disconnect();
  }, []);

  const measureApiCall = async <T>(
    apiCall: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const endTime = performance.now();
      
      performance.measure(`API: ${operationName}`, {
        start: startTime,
        end: endTime
      });
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      performance.measure(`API Error: ${operationName}`, {
        start: startTime,
        end: endTime
      });
      throw error;
    }
  };

  const measureRender = (componentName: string, fn: () => void) => {
    performance.mark(`${componentName}-start`);
    fn();
    performance.mark(`${componentName}-end`);
    performance.measure(`Render: ${componentName}`, `${componentName}-start`, `${componentName}-end`);
  };

  return { measureApiCall, measureRender };
}