import React, { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Send metrics to analytics service
    const sendToAnalytics = (metric) => {
      // In production, send this to your analytics service
      
      // Example: Send to Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_action: metric.name,
          event_label: metric.id,
          value: Math.round(metric.value),
          custom_map: {
            'metric_id': metric.id,
            'metric_value': metric.value,
            'metric_delta': metric.delta,
            'metric_name': metric.name,
            'metric_rating': metric.rating
          }
        });
      }
    };

    // Track Core Web Vitals
    onCLS(sendToAnalytics);  // Cumulative Layout Shift
    onINP(sendToAnalytics);  // Interaction to Next Paint (replaces FID)
    onFCP(sendToAnalytics);  // First Contentful Paint
    onLCP(sendToAnalytics);  // Largest Contentful Paint
    onTTFB(sendToAnalytics); // Time to First Byte

    // Custom performance tracking
    const trackCustomMetrics = () => {
      if ('performance' in window) {
        // Track resource loading times
        const resources = performance.getEntriesByType('resource');
        const largeResources = resources.filter(resource => 
          (resource.transferSize || 0) > 100000 // > 100KB
        );

        // Track navigation timing
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          const metrics = {
            dns: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp: navigation.connectEnd - navigation.connectStart,
            request: navigation.responseStart - navigation.requestStart,
            response: navigation.responseEnd - navigation.responseStart,
            dom: navigation.domContentLoadedEventEnd - navigation.responseEnd,
            load: navigation.loadEventEnd - navigation.loadEventStart
          };
        }
      }
    };

    // Track metrics after page load
    if (document.readyState === 'complete') {
      trackCustomMetrics();
    } else {
      window.addEventListener('load', trackCustomMetrics);
    }

    // Clean up
    return () => {
      window.removeEventListener('load', trackCustomMetrics);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;