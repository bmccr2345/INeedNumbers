import { useState, useEffect } from 'react';

// Plan Preview Hook for testing Starter/Pro features without Stripe
export const usePlanPreview = (userPlan = 'FREE') => {
  const [previewPlan, setPreviewPlan] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Check if we're in production
  const isProduction = process.env.NODE_ENV === 'production';

  useEffect(() => {
    if (isProduction) return;

    // Read preview plan from cookie
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const cookieValue = getCookie('plan_preview');
    if (cookieValue && ['FREE', 'STARTER', 'PRO'].includes(cookieValue)) {
      setPreviewPlan(cookieValue);
      setIsPreviewMode(true);
    }
  }, [isProduction]);

  const setPreview = (plan) => {
    if (isProduction) return;

    if (plan && ['FREE', 'STARTER', 'PRO'].includes(plan)) {
      // Set cookie for 2 hours
      const expires = new Date();
      expires.setHours(expires.getHours() + 2);
      document.cookie = `plan_preview=${plan}; expires=${expires.toUTCString()}; path=/`;
      
      setPreviewPlan(plan);
      setIsPreviewMode(true);
    } else {
      // Clear preview
      document.cookie = 'plan_preview=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
      setPreviewPlan(null);
      setIsPreviewMode(false);
    }
  };

  const clearPreview = () => setPreview(null);

  // Get effective plan (preview overrides actual plan in non-prod)
  const effectivePlan = isProduction ? userPlan : (previewPlan || userPlan);

  return {
    effectivePlan,
    previewPlan,
    isPreviewMode,
    setPreview,
    clearPreview,
    isProduction
  };
};