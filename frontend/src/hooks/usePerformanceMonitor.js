import { useEffect, useState } from 'react';

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fcpTime: null
  });

  useEffect(() => {
    // Track Largest Contentful Paint (LCP)
    const trackLCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      }
    };

    // Track First Input Delay (FID)
    const trackFID = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
          });
        });
        observer.observe({ entryTypes: ['first-input'] });
      }
    };

    // Track Cumulative Layout Shift (CLS)
    const trackCLS = () => {
      if ('PerformanceObserver' in window) {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        });
        observer.observe({ entryTypes: ['layout-shift'] });
      }
    };

    // Track Time to First Byte (TTFB)
    const trackTTFB = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0) {
          const ttfb = navigationEntries[0].responseStart - navigationEntries[0].requestStart;
          setMetrics(prev => ({ ...prev, ttfb }));
        }
      }
    };

    // Track First Contentful Paint (FCP)
    const trackFCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcpTime: entry.startTime }));
            }
          });
        });
        observer.observe({ entryTypes: ['paint'] });
      }
    };

    // Initialize tracking
    trackLCP();
    trackFID();
    trackCLS();
    trackTTFB();
    trackFCP();

    // Report metrics to analytics (example function)
    const reportMetrics = () => {
      if (typeof window !== 'undefined' && window.gtag) {
        Object.entries(metrics).forEach(([key, value]) => {
          if (value !== null) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: key,
              value: Math.round(value)
            });
          }
        });
      }
    };

    // Report after 5 seconds to allow metrics to be collected
    setTimeout(reportMetrics, 5000);

  }, []);

  return metrics;
};

// Hook for monitoring bundle size and resource loading
export const useResourceMonitor = () => {
  const [resourceTiming, setResourceTiming] = useState([]);

  useEffect(() => {
    if ('performance' in window) {
      const resources = performance.getEntriesByType('resource');
      const processedResources = resources.map(resource => ({
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize || 0,
        type: resource.initiatorType
      }));
      setResourceTiming(processedResources);
    }
  }, []);

  return resourceTiming;
};